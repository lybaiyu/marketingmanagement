// 采购记录管理页面
import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
//import moment from 'moment';
import { connect } from 'dva';
import { Table, Form, Button, Pagination, Input, Row, Col, Select, Icon, Modal, Radio, DatePicker, notification, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Result from '@/components/Result';
import Moment from 'moment';
import router from 'umi/router';
//import 'moment/locale/zh-cn';
import axios from 'axios'
import $ from  'jquery'
import jsonp from 'fetch-jsonp';
import querystring from 'querystring';
const confirm = Modal.confirm;

message.config({
    top: 300,
    duration: 2,
    maxCount: 1,
});

//moment.locale('zh-cn');
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
let timeout;
let currentValue;


//查询尚有库存的商品
function fetch(value) {
 var allGoods = [];
    $.ajax({
        type: "POST",
        url:  "http://" + location.host+"/service/queryGoods",
        contentType: "application/json",
        dataType: "JSON",
        async: false,
        data: JSON.stringify({ "name": value,"isInventory":"1" }),
        success: function (data) {
            var list = data.rows;
            if (list.length > 0) {
                list.forEach((r) => {
                    allGoods.push({
                        value: r["goodId"],
                        text: r["name"],
                    });
                });

            }
         
        }

    });
    return  allGoods;
}



//表单弹窗
const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
    // eslint-disable-next-line

    class formPage extends React.Component {
        state = {
            data: [],
            value: undefined,
            data2: [],
            value2: undefined,
          }
          //搜索商品下拉框函数
          handleSearch = (value) => {
          let list =  fetch(value);
          if(list.length > 0){
            this.setState({ data:list }) ;
          }
         
          }
          handleChange = (value) => {
            this.setState({ value });
          }


        render() {
            const {
                visible, onCancel, onCreate, form, direction, operateType
            } = this.props;
            const options = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>);
            const options2 = this.state.data2.map(d => <Option key={d.value}>{d.text}</Option>);
            const { getFieldDecorator } = form;
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
            var title = operateType == "add" ? "新增销售记录" : "编辑采购记录信息";
            return (

                <Modal
                    visible={visible}
                    title={title}
                    okText="保存"
                    onCancel={onCancel}
                    onOk={onCreate}
                >
                    <Form {...formItemLayout} style={{ marginLeft: "-20%" }}>
                        <Form.Item label="商品名称">
                            {getFieldDecorator('goodsId', {
                                rules: [{ required: true, message: '商品名称不能为空!' }],
                            })(
                                <Select
                                    showSearch
                                    value={this.state.value}
                                    placeholder={"请搜索选择商品名称"}
                                    style={this.props.style}
                                    defaultActiveFirstOption={false}
                                    showArrow={true}
                                    filterOption={false}
                                    onSearch={this.handleSearch}
                                    onChange={this.handleChange}
                                    notFoundContent={null}
                                    >
                                  {options}
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item label="售出数量">
                            {getFieldDecorator('num', {
                                rules: [{required: true, message: '售出数量不能为空!' },{type:"number", message: '只能输入数字' , transform:(value)=> {return Number(value)}}]
                            })(
                                <Input placeholder="请输入售出数量"  value="1" type="number"/>
                            )}
                        </Form.Item>

                        <Form.Item label="商品售价">
                            {getFieldDecorator('goodsPrice', {
                                rules: [{required: true, message: '商品单价不能为空!' }],
                            })(<Input placeholder="请输入商品单价" />)}
                        </Form.Item>
                        <Form.Item label="单品利润">
                            {getFieldDecorator('profit', {
                                rules: [],
                            })(<Input placeholder="请输入单品利润" />)}
                        </Form.Item>

                        <Form.Item label="售出时间">
                            {getFieldDecorator('salesDate', {
                                rules: [{required: true, message: '售出时间不能为空!'}],
                            })(<DatePicker showTime  placeholder="请选择售出时间"  style={{width:"100%"}}/>  )}
                        </Form.Item>
                        <Form.Item label="顾客姓名">
                            {getFieldDecorator('customerName', {
                                rules: [],
                            })(<Input placeholder="请输入顾客姓名" />)}
                        </Form.Item>
                        <Form.Item label="备注">
                            {getFieldDecorator('remarks', {

                            })(<Input.TextArea placeholder="备注信息" />)}
                        </Form.Item>
                        <Form.Item >
                            {getFieldDecorator('salesId', {

                            })(<Input type="hidden" />)}
                        </Form.Item>
                    </Form>
                </Modal>
            );
        }
    }
    
);
@connect(({ market, user }) => ({
    salesList: market.salesList,
    total: market.total,
    updateSalesResult: market.updateSalesResult,
    currentUser: user.currentUser,
    goodsList: market.goodsList,
}))
@Form.create()
class Salesmanage extends PureComponent {
    state = {
        loading: false,
        formvisible: false,
        selectedRows: [],
        selectedRowKeys: [],
        operateType: "",
    };

    componentDidMount() {
        const { dispatch } = this.props;
        //获取当前用户（登录状态）
        dispatch({
            type: 'user/fetchCurrent',
            callback: () => {
                const { currentUser } = this.props;
                if (!currentUser.userName) {
                    //  route.push("/user/login");
                    router.push("/user/login")
                }
            }
        });
        // //查字典（账户类型）
        // dispatch({
        //     type: 'market/queryDirections',
        //     payload: {
        //         dictTypeId: 3,
        //     },
        //     callback: () => {
        //         const { direction } = this.props;
        //         console.log(direction);
        //     }
        // });
        dispatch({
            type: 'market/querySales',
            payload: {
                page: 1,
                rows: 10,
            },
            callback: () => {
                const { salesList } = this.props;
            }
        });


    }

    //每页个数变化时回调
    onShowSizeChange = (current, size) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'market/querySales',
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
            type: 'market/querySales',
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
        let salesDate = values.salesDate
        if(salesDate != "" && salesDate != null && salesDate != undefined){
            salesDate = salesDate.format('YYYY-MM-DD');
        }
        values['salesDate']  = salesDate;
        values.page = 1;
        values.rows = 10;
        dispatch({
            type: 'market/querySales',
            payload: values,
        });
    };

    //新增记录
    addAccount = e => {
        this.setState({ operateType: "add" });
        this.showModal();
    };

    //删除选中项
    deleteSelectRow = e => {
        const { selectedRows } = this.state;
        const { dispatch } = this.props;
        if (selectedRows.length < 1) {
            message.error('请选择要删除的项目！');
            return false;
        }
        if (selectedRows.length > 1) {
            message.error('采购记录只能逐条删除！');
            return false;
        }
        confirm({
            title: '确定要删除所选项吗?',
            content: '',
            onOk: () => {
                dispatch({
                    type: 'market/deleteSales',
                    payload: selectedRows,
                    callback: () => {
                        const { updateSalesResult } = this.props;
                        if (updateSalesResult == 0) {
                            notification["error"]({
                                placement: "bottomRight",
                                message: '提示信息',
                                description: '操作失败!',
                            });
                        } else {
                            notification["success"]({
                                placement: "bottomRight",
                                message: '提示信息',
                                description: '操作成功!',
                            });
                        }
                        //刷新表格
                        dispatch({
                            type: 'market/querySales',
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
        let salesDate = values.salesDate
        if(salesDate != "" && salesDate != null && salesDate != undefined){
            salesDate = salesDate.format('YYYY-MM-DD');
        }
        salesDate = salesDate ? salesDate :"";
        const goodsName = values.goodsName ? values.goodsName : "";
        let dateTime = Moment().format('YYYYMMDDHHmmss');
        axios({
            method: "get",
            url: "http://" + location.host + "/exportSales?salesDate=" + salesDate + "&goodsName="+goodsName,
            //url: "http://localhost:8080/exportSales?salesDate=" + salesDate+"&goodsName="+goodsName,
            headers: {
                // "MSP-AppKey": localStorage.getItem('appKey'),
                // "MSP-AuthKey": localStorage.getItem('auth-key'),
            },
            responseType: 'blob'
        }).then(function (res) {
            const content = res.data
            console.log(res)
            const blob = new Blob([content])
            const fileName = '商品销售记录明细表' + dateTime + '.xlsx';
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


    //新增&保存
    handleCreate = () => {
        const { dispatch } = this.props;
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            var values = form.getFieldsValue();
            const { operateType } = this.state;
              var salesDate = values.salesDate;
              salesDate = salesDate.format('YYYY-MM-DD HH:mm:ss');
              values["salesDate"] = salesDate;
            var url;
            if (operateType == "add") {
                var url = 'market/addSales';
            }
            // if (operateType == "edit") {
            //     var url = 'market/modifySupplier';
            // }
            dispatch({
                type: url,
                payload: values,
                callback: () => {
                    const { updateSalesResult } = this.props;
                    if (updateSalesResult == 0) {
                        notification["error"]({
                            placement: "bottomRight",
                            message: '提示信息',
                            description: '操作失败!',
                        });
                    }else if(updateSalesResult == -1){
                        notification["error"]({
                            placement: "bottomRight",
                            message: '提示信息',
                            description: '操作失败!商品库存不足！',
                        });
                    }
                    
                    else {
                        notification["success"]({
                            placement: "bottomRight",
                            message: '提示信息',
                            description: '操作成功!',
                        });
                    }
                    //刷新表格
                    dispatch({
                        type: 'market/querySales',
                        payload: {
                            page: 1,
                            rows: 10,
                        },
                    });
                    //恢复被选中项
                    this.setState({ selectedRows: [], selectedRowKeys: [] });
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
        const { salesList, total, form, direction } = this.props;
        const columns = [{
            title: '商品名称',
            dataIndex: 'goodsName',
        },
        {
            title: '商品型号',
            dataIndex: 'model',
        },
        {
            title: '售出数量',
            dataIndex: 'num',
        },
        {
            title: '商品售价',
            dataIndex: 'goodsPrice',
        },
        {
            title: '商品总价',
            dataIndex: 'totalPrice',
        }
            ,
        {
            title: '单品利润',
            dataIndex: 'profit',
        }
        ,
        {
            title: '售出时间',
            dataIndex: 'salesDate',
        }
            ,
        {
            title: '顾客姓名',
            dataIndex: 'customerName',
        }
          ,
        {
            title: '备注',
            dataIndex: 'remarks',
        },
        {
            title: '录入时间',
            dataIndex: 'updateTime',
        },

        ];

        const { operateType, selectedRowKeys } = this.state;
        return (
            <div>
                <Form onSubmit={this.handleSearch} layout="inline" style={{ marginBottom: "1%", marginLeft: "1%" }}>
                    <Row >
                        <Col span={6}>
                            <FormItem label="商品名称">
                                {form.getFieldDecorator('goodsName')(
                                    <Input placeholder="请输入商品名称" />
                                )}
                            </FormItem>
                        </Col>

                        <Col span={6}>
                            <FormItem label="售出日期">
                                {form.getFieldDecorator('salesDate')(
                                    <DatePicker  placeholder="请选择售出日期" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={2}>
                            <div style={{ marginLeft: "-90%",marginTop:3 }}>
                                <Button type="primary" icon="search" onClick={this.handleSearch}>搜索</Button>
                            </div>
                        </Col>

                        <Col span={10}>
                            <div style={{ float: "right", marginRight: 0 }}>
                                <Button type="primary" icon="plus" onClick={this.addAccount}>新增</Button>
                                {/* <Button type="primary" icon="edit" onClick={this.editSelectRow} style={{ marginLeft: 8 }}>修改</Button> */}
                                <Button type="primary" icon="delete" onClick={this.deleteSelectRow} style={{ marginLeft: 8 }}>删除</Button>
                                <Button type="primary" icon="printer" onClick={this.exportAccount} style={{ marginLeft: 8 }}>导出</Button>
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
                    columns={columns} dataSource={salesList} rowKey="goodsId" bordered
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
                    direction={direction}
                    operateType={operateType}
                />
            </div>
        );
    }
}

export default Salesmanage;
