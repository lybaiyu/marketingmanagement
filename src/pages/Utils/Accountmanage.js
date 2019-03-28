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
      var title = operateType =="add"? "新增账户":"编辑账户";
      return (
       
        <Modal
          visible={visible}
          title= {title}
          okText="保存"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form {...formItemLayout} style={{marginLeft:"-20%"}}>
            <Form.Item label="账户名">
              {getFieldDecorator('accountName', {
                rules: [{ required: true, message: '请输入账户名称!' }],
              })(
                <Input/>
              )}
            </Form.Item>
            <Form.Item label="用户名">
              {getFieldDecorator('userName',{
                rules: [{ required: true, message: '请输入用户名!' }],
              })(<Input/>)}
            </Form.Item>
            <Form.Item label="账户类型">
              {getFieldDecorator('accountType', {
                 rules: [{ required: true, message: '请选择账户类型!' }]
              })(
                <Select
                  placeholder= "请选择账户类型"
                  style={{}}
                  defaultActiveFirstOption={false}
                  showArrow={true}
                  filterOption={false}
                    >
                  {options}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="账户密码">
              {getFieldDecorator('passWord',{
                rules: [{ required: true, message: '请输入账户密码!' }],
              })(<Input.Password placeholder="请输入账户密码" />)}
            </Form.Item>
            <Form.Item label="注册邮箱">
              {getFieldDecorator('email',{
                rules: [{ type: 'email', message: '请输入正确的邮箱地址!'}],
              })(<Input/>)}
            </Form.Item>
            <Form.Item label="手机号">
              {getFieldDecorator('phoneNum',{
                rules: [{ }],
              })(<Input/>)}
            </Form.Item>
            <Form.Item label="网站地址">
              {getFieldDecorator('url',{
                rules: [{ type: 'url', message: '请输入正确的网址!'}],
              })(<Input/>)}
            </Form.Item>
            <Form.Item label="注册时间" >
          {getFieldDecorator('registrationTime', {rules: [{ type: 'object', message: '请选择正确的注册时间!' }]})
            (<DatePicker placeholder = "请选择注册时间" showTime format="YYYY-MM-DD HH:mm:ss" style={{width:"100%"}}/>
          )}
        </Form.Item>
        <Form.Item label="备注">
              {getFieldDecorator('remarks',{
               
              })(<Input.TextArea />)}
            </Form.Item>
            <Form.Item >
              {getFieldDecorator('accountId',{
               
              })(<Input type="hidden"/>)}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }
);
@connect(({ account,user }) => ({
  accountList: account.accountList,
  total: account.total,
  direction:account.direction,
  addAccountResult:account.account,
  currentUser:user.currentUser,
}))
@Form.create()
class Accountmanage extends PureComponent {
  state = {
    loading: false,
    formvisible:false,
    selectedRows:[],
    operateType:"",
  };

  componentDidMount() {
    const { dispatch } = this.props;
  debugger;
   //获取当前用户（登录状态）
   dispatch({
    type: 'user/fetchCurrent',
    callback: () => {
      debugger;
     const {currentUser} = this.props;
     if(!currentUser.userName){
    //  route.push("/user/login");
    router.push("/user/login")
     }
    }
  });

    dispatch({
      type: 'account/queryAccount',
      payload: {
        page: 1,
        rows: 10,
      },
      callback: () => {
        const { accountList } = this.props;
        console.log(accountList);
        console.log(account);
      }
    });
    //查字典（账户类型）
    dispatch({
      type: 'account/queryDirections',
      payload: {
        dictTypeId: 1,
      },
      callback: () => {
        const {direction} = this.props;
        console.log(direction);
      }
    });

  }

  //每页个数变化时回调
  onShowSizeChange = (current, size) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'account/queryAccount',
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
      type: 'account/queryAccount',
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
        type: 'account/queryAccount',
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
    const form = this.formRef.props.form;
    if(selectedRows.length != 1){
      message.error('请选择一个账户进行修改操作！');
      return false;
    }
    this.setState({operateType:"edit"});
    this.showModal();
    var row = selectedRows[0];
    var moment = Moment(row.registrationTime,'YYYY-MM-DD HH:mm:ss');
    row["registrationTime"] = moment;
    form.setFieldsValue(row);
   
  }
  //删除选中项
  deleteSelectRow = e =>{
    const {selectedRows} = this.state;
    const {dispatch} = this.props;
    if(selectedRows.length < 1){
      message.error('请选择要删除的账户！');
      return false;
    }
    dispatch({
      type: 'account/deleteAccounts',
      payload: selectedRows,
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
            type: 'account/queryAccount',
            payload: {
              page: 1,
              rows: 10,
            },
          });

      }
    });
  }

  //导出表格数据到excel文件
  exportAccount = e => {
    const { dispatch, form } = this.props;
    const values = form.getFieldsValue();
    const accountName = values.accountName ? values.accountName : "";
    const userName = values.userName ? values.userName : "";
    window.location.href = "/service/exportAccount?accountName="+accountName+"&userName="+userName
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
      var registrationTime = values.registrationTime;
      registrationTime = registrationTime.format('YYYY-MM-DD HH:mm:ss');
      values["registrationTime"] = registrationTime;
      const {operateType} = this.state;
      var url;
      if(operateType ==  "add"){
        var url = 'account/addAccount';
      }
      if(operateType ==  "edit"){
        var url = 'account/modifyAccount';
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
              type: 'account/queryAccount',
              payload: {
                page: 1,
                rows: 10,
              },
            });

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
    const columns = [{
      title: '账号名称',
      dataIndex: 'accountName',
    }, {
      title: '用户名',
      dataIndex: 'userName',
    },
    {
      title: '账户类型',
      dataIndex: 'accountType',
    },
    {
      title: '用户密码',
      dataIndex: 'passWord',
      width: 30,
    }
      ,
    {
      title: '注册邮箱',
      dataIndex: 'email',
    }
      ,
    {
      title: '注册手机号',
      dataIndex: 'phoneNum',
    }
      ,
    {
      title: '网站地址',
      dataIndex: 'url',
    }
      ,
    {
      title: '注册时间',
      dataIndex: 'registrationTime',
    }
      ,
    {
      title: '账号修改时间',
      dataIndex: 'modificationTime',
    },
    {
      title: '备注',
      dataIndex: 'remarks',
    }
    ];
    const { accountList, total, form,direction } = this.props;
    const {operateType} = this.state;
    return (
      <div>
        <Form onSubmit={this.handleSearch} layout="inline" style={{marginBottom:"1%",marginLeft:"1%"}}>
          <Row >
            <Col span={5}>
              <FormItem label="账户名称">
                {form.getFieldDecorator('accountName')(<Input placeholder="请输入账户名称" />)}
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem label="用户名">
                {form.getFieldDecorator('userName')(
                  <Input placeholder="请输入用户名" />
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
          rowSelection={{onChange: (selectedRowKeys, selectedRows) => {this.setState({selectedRows:selectedRows}) ;}}} 
          columns={columns} dataSource={accountList} rowKey="accountId" bordered
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

export default Accountmanage;
