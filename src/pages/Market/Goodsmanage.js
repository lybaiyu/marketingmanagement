import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
//import moment from 'moment';
import { connect } from 'dva';
import {Table,Form,Button,Pagination,Input,Row,Col,Select,Icon,Modal,Radio ,DatePicker,notification,message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Result from '@/components/Result';
import Moment from 'moment';
import router from 'umi/router';
//import 'moment/locale/zh-cn';
import axios from 'axios'
const confirm = Modal.confirm;
message.config({
  top: 300,
  duration: 2,
  maxCount: 1 ,
});

//moment.locale('zh-cn');
const FormItem = Form.Item;
const { TextArea } = Input;

 //表单弹窗
 const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
  // eslint-disable-next-line
  
  class extends React.Component {
    render() {
      const {
        visible, onCancel, onCreate, form,direction,operateType
      } = this.props;
      const { getFieldDecorator } = form;
      const options = direction.length >0 ? direction.map(d => <Option key={d.id}>{d.text}</Option>) :"";
      const formItemLayout = {
        labelCol: {
          xs: { span: 8 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 15 },
          sm: { span: 15 },
        },
      };
      var title = operateType =="add"? "新增商品":"编辑商品信息";
      return (
       
        <Modal
          visible={visible}
          title= {title}
          okText="保存"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form {...formItemLayout} style={{marginLeft:"-20%"}}>
            <Form.Item label="商品名称">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入商品名称!' }],
              })(
                <Input placeholder="请输入商品名称"/>
              )}
            </Form.Item>
            <Form.Item label="商品型号">
              {getFieldDecorator('model',{
                rules: [{ required: true, message: '请输入商品型号!' }],
              })(<Input placeholder="请输入商品型号"/>)}
            </Form.Item>
            <Form.Item label="商品类型">
              {getFieldDecorator('type', {
                 rules: [{ required: true, message: '请选择商品类型!' }]
              })(
                <Select
                  placeholder= "请选择商品类型"
                  style={{}}
                  defaultActiveFirstOption={false}
                  showArrow={true}
                  filterOption={false}
                  // value=
                    >
                  {options}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="商品品牌">
              {getFieldDecorator('brand',{
                rules: [{ required: true, message: '商品品牌!' }],
              })(<Input placeholder="请输入商品品牌" />)}
            </Form.Item>
            <Form.Item label="商品颜色">
              {getFieldDecorator('color',{
                rules: [],
              })(<Input placeholder="请输入商品颜色"/>)}
            </Form.Item>
            <Form.Item label="商品产地">
              {getFieldDecorator('origin',{
                rules: [{ }],
              })(<Input placeholder="请输入商品产地"/>)}
            </Form.Item>
            <Form.Item label="备注">
              {getFieldDecorator('remarks',{
               
              })(<Input.TextArea placeholder="备注信息" />)}
            </Form.Item>
            <Form.Item >
              {getFieldDecorator('goodId',{
               
              })(<Input type="hidden"/>)}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }
);
@connect(({ market,user }) => ({
  goodsList: market.goodsList,
  total: market.total,
   direction:market.direction,
   addGoodsResult:market.addGoodsResult,
  currentUser:user.currentUser,
}))
@Form.create()
class Goodsmanage extends PureComponent {
  state = {
    loading: false,
    formvisible:false,
    selectedRows:[],
    selectedRowKeys:[],
    operateType:"",
  };

  componentDidMount() {
    const { dispatch } = this.props;
   //获取当前用户（登录状态）
   dispatch({
    type: 'user/fetchCurrent',
    callback: () => {
     const {currentUser} = this.props;
     if(!currentUser.userName){
    //  route.push("/user/login");
    router.push("/user/login")
     }
    }
  });
    //查字典（账户类型）
    dispatch({
      type: 'market/queryDirections',
      payload: {
        dictTypeId: 2,
      },
      callback: () => {
        const {direction} = this.props;
        console.log(direction);
      }
    });
    dispatch({
      type: 'market/queryGoods',
      payload: {
        page: 1,
        rows: 10,
      },
      callback: () => {
        const { goodsList } = this.props;
      }
    });
   

  }

  //每页个数变化时回调
  onShowSizeChange = (current, size) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'market/queryGoods',
      payload: {
        page: current,
        rows: size,
      },
    });
  }
  //当前页变化时回调
  onChange = (page, pageSize) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'market/queryGoods',
      payload: {
        page: page,
        rows: pageSize,
      },
    });
  }
   
  //手动条件搜索
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
      const values = form.getFieldsValue();
      values.page = 1;
      values.rows= 10;
      dispatch({
        type: 'market/queryGoods',
        payload: values,
      });
  };

  //新增账户
  addAccount = e =>{
    this.setState({operateType:"add"});
    this.showModal();
  };
  //编辑选中项
  editSelectRow = e =>{
    const {selectedRows} = this.state;
    const {direction } = this.props;
    const form = this.formRef.props.form;
    if(selectedRows.length != 1){
      message.error('请选择一个账户进行修改操作！');
      return false;
    }
    this.setState({operateType:"edit"});
    this.showModal();
    var row = selectedRows[0];
    // var goodsType = row['type'];
    // direction.map((d) =>{
    //   if(goodsType == d.id){
    //    goodsType = d.text;
    //   }
    // } )
    // row['type'] = goodsType;
    form.setFieldsValue(row);
    //下拉框的值单独回显，否则不能选中，会直接显示的option的key
    var goodsType = row['type']+'';
    form.setFieldsValue({type:goodsType });
   
  }
  //删除选中项
  deleteSelectRow = e =>{
    const {selectedRows} = this.state;
    const {dispatch} = this.props;
    if(selectedRows.length < 1){
      message.error('请选择要删除的账户！');
      return false;
    }
    confirm({
      title: '确定要删除所选项吗?',
      content: '',
      onOk: () => {
        dispatch({
          type: 'market/deleteGoods',
          payload: selectedRows,
          callback:() => {
              const {addGoodsResult} = this.props;
              if(addGoodsResult == 0){
                notification["error"]({
                  placement:"bottomRight",
                  message: '提示信息',
                  description: '操作失败!',
                });
              }else{
                  notification["success"]({
                  placement:"bottomRight",
                  message: '提示信息',
                  description: '操作成功!',
                });
              }
              //刷新表格
              dispatch({
                type: 'market/queryGoods',
                payload: {
                  page: 1,
                  rows: 10,
                },
              });
    
          }
        });
      },
      onCancel() { },
    });
   

   
  }
  
  
  //导出表格数据到excel文件
  exportAccount = e => {
    const { dispatch, form } = this.props;
    const values = form.getFieldsValue();
    const name = values.name ? values.name : "";
    const model = values.model ? values.model : "";
    let dateTime = Moment().format('YYYYMMDDHHmmss');
    //  window.location.href = "http://localhost:8080/exportAccount?accountName="+accountName+"&userName="+userName
    axios({
      method: "get",
      url:  "http://"+ location.host+"/exportGoods?name="+name+"&model="+model,
    //  url: "http://localhost:8080/exportGoods?name="+name+"&model="+model,
      headers: {
        // "MSP-AppKey": localStorage.getItem('appKey'),
        // "MSP-AuthKey": localStorage.getItem('auth-key'),
      },
      responseType: 'blob'
    }).then(function (res) {
      const content = res.data
      console.log(res)
      const blob = new Blob([content])
      const fileName = '商品基础信息表'+dateTime+'.xlsx';
      if ('download' in document.createElement('a')) { // 非IE下载
        const elink = document.createElement('a')
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
      } else { // IE10+下载
        navigator.msSaveBlob(blob, fileName)
      }
    })

  }

  //表单弹窗相关
  showModal = () => {
    this.setState({ formvisible: true });
  }

  handleCancel = () => {
    this.setState({ formvisible: false });
    const form = this.formRef.props.form;
    form.resetFields();
  }

  
  //新增&保存账户信息
  handleCreate = () => {
   const {dispatch} = this.props;
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      var values = form.getFieldsValue();
      // var registrationTime = values.registrationTime;
      // registrationTime = registrationTime.format('YYYY-MM-DD HH:mm:ss');
      // values["registrationTime"] = registrationTime;
      const {operateType} = this.state;
      var url;
      if(operateType ==  "add"){
        var url = 'market/addGoods';
      }
      if(operateType ==  "edit"){
        var url = 'market/modifyGoods';
      }
      dispatch({
        type: url,
        payload: values,
        callback:() => {
            const {addAccountResult} = this.props;
            if(addAccountResult == "0"){
              notification["error"]({
                placement:"bottomRight",
                message: '提示信息',
                description: '操作失败!',
              });
            }else{
                notification["success"]({
                placement:"bottomRight",
                message: '提示信息',
                description: '操作成功!',
              });
            }
            //刷新表格
            dispatch({
              type: 'market/queryGoods',
              payload: {
                page: 1,
                rows: 10,
              },
            });
            //恢复被选中项
            this.setState({selectedRows:[],selectedRowKeys:[]});
        }
      });


      form.resetFields();
      this.setState({ formvisible: false });
    });
  }

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }

 

  rowClassName = (record, index) => {
    let className = 'light-row';
    if (index % 2 === 1) className = 'dark-row';
    return className;
  }

  render() {
    const { goodsList, total, form,direction } = this.props;
    const columns = [{
      title: '商品名称',
      dataIndex: 'name',
    }, {
      title: '所属类别',
      dataIndex: 'type', 
      render: (text, record, index) => {
        var goodsType = text;
        direction.map((d) =>{
          if(text == d.id){
           goodsType = d.text;
          }
        } )
        return goodsType;
      }
    },
    {
      title: '商品品牌',
      dataIndex: 'brand',
    },
    {
      title: '商品型号',
      dataIndex: 'model',
      
    }
      ,
    {
      title: '商品颜色',
      dataIndex: 'color',
    }
      ,
    {
      title: '商品产地',
      dataIndex: 'origin',
    }
       ,
    {
      title: '录入时间',
      dataIndex: 'updateTime',
    },
    {
      title: '备注',
      dataIndex: 'remarks',
    }
    ];
    
    const {operateType,selectedRowKeys} = this.state;
    return (
      <div>
        <Form onSubmit={this.handleSearch} layout="inline" style={{marginBottom:"1%",marginLeft:"1%"}}>
          <Row >
            <Col span={5}>
              <FormItem label="商品名称">
                {form.getFieldDecorator('name')(<Input placeholder="请输入账户名称" />)}
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem label="商品型号">
                {form.getFieldDecorator('model')(
                  <Input placeholder="请输入商品型号" />
                )}
              </FormItem>
            </Col>

            <Col span={2}>
                <div style={{marginLeft:"-50%"}}>
                  <Button type="primary" icon="search" onClick={this.handleSearch}>搜索</Button>
                </div>
            </Col>
            <Col span={12}>
                <div style={{float:"right",marginRight:0  }}>
                  <Button type="primary" icon="plus" onClick={this.addAccount}>新增</Button>
                  <Button type="primary" icon="edit" onClick={this.editSelectRow} style={{marginLeft:8}}>修改</Button>
                  <Button type="primary" icon="delete" onClick={this.deleteSelectRow} style={{marginLeft:8}}>删除</Button>
                  <Button type="primary" icon="printer" onClick={this.exportAccount} style={{marginLeft:8}}>导出</Button>
                </div>
            </Col>
          </Row>
        </Form>
        <Table 
        
          rowSelection={{
            onChange: (selectedRowKeys, selectedRows) => {
                       this.setState({selectedRows:selectedRows,selectedRowKeys:selectedRowKeys}) ;},
          selectedRowKeys:selectedRowKeys
        }} 
          columns={columns} dataSource={goodsList} rowKey="goodsId" bordered
          pagination={{
            showSizeChanger: true, defaultCurrent: 1, total: total, defaultPageSize: 10, hideOnSinglePage: false,
            onShowSizeChange: this.onShowSizeChange,
            onChange: this.onChange,
            rowClassName: this.rowClassName,
          }} />
        {/* 表单弹窗 */}
        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.formvisible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate} 
          direction = {direction}
          operateType = {operateType}
        />
      </div>
    );
  }
}

export default Goodsmanage;
