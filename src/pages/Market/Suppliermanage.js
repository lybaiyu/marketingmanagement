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
message.config({
    top: 300,
    duration: 2,
    maxCount: 1,
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
                visible, onCancel, onCreate, form, direction, operateType
            } = this.props;
            const { getFieldDecorator } = form;
            const options = direction.length > 0 ? direction.map(d => <Option key={d.id}>{d.text}</Option>) : "";
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
            var title = operateType == "add" ? "新增商户" : "编辑商户信息";
            return (

                <Modal
                    visible={visible}
                    title={title}
                    okText="保存"
                    onCancel={onCancel}
                    onOk={onCreate}
                >
                    <Form {...formItemLayout} style={{ marginLeft: "-20%" }}>
                        <Form.Item label="商户名称">
                            {getFieldDecorator('supplierName', {
                                rules: [{ required: true, message: '商户名称不能为空!' }],
                            })(
                                <Input placeholder="请输入商户名称" />
                            )}
                        </Form.Item>
                       
                        <Form.Item label="商户类别">
                            {getFieldDecorator('type', {
                                rules: [{ required: true, message: '商户类别不能为空!' }]
                            })(
                                <Select
                                    placeholder="请选择商户类别"
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

                        <Form.Item label="联系人">
                            {getFieldDecorator('contactName', {
                                rules: [],
                            })(<Input placeholder="请输入联系人姓名" />)}
                        </Form.Item>
                        <Form.Item label="联系电话1">
                            {getFieldDecorator('phone1', {
                                rules: [],
                            })(<Input placeholder="请输入联系电话" />)}
                        </Form.Item>
                        <Form.Item label="联系电话2">
                            {getFieldDecorator('phone2', {
                                rules: [{}],
                            })(<Input placeholder="请输入联系电话" />)}
                        </Form.Item>
                        <Form.Item label="微信">
                            {getFieldDecorator('wechat', {
                                rules: [{}],
                            })(<Input placeholder="请输入微信号" />)}
                        </Form.Item>
                        <Form.Item label="QQ">
                            {getFieldDecorator('qq', {
                                rules: [{}],
                            })(<Input placeholder="请输入QQ号" />)}
                        </Form.Item>
                        <Form.Item label="邮箱">
                            {getFieldDecorator('email', {
                                rules: [{}],
                            })(<Input placeholder="请输入邮箱地址" />)}
                        </Form.Item>
                        <Form.Item label="店铺地址">
                            {getFieldDecorator('address', {
                                rules: [{}],
                            })(<Input placeholder="请输入店铺地址" />)}
                        </Form.Item>
                        <Form.Item label="备注">
                            {getFieldDecorator('remarks', {

                            })(<Input.TextArea placeholder="备注信息" />)}
                        </Form.Item>
                        <Form.Item >
                            {getFieldDecorator('supplierId', {

                            })(<Input type="hidden" />)}
                        </Form.Item>
                    </Form>
                </Modal>
            );
        }
    }
);
@connect(({ market, user }) => ({
    supplierList: market.supplierList,
    total: market.total,
    direction: market.direction,
    updateSupplierResult:market.updateSupplierResult,
    currentUser: user.currentUser,
}))
@Form.create()
class Suppliermanage extends PureComponent {
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
        //查字典（账户类型）
        dispatch({
            type: 'market/queryDirections',
            payload: {
                dictTypeId: 3,
            },
            callback: () => {
                const { direction } = this.props;
                console.log(direction);
            }
        });
        dispatch({
            type: 'market/querySupplier',
            payload: {
                page: 1,
                rows: 10,
            },
            callback: () => {
                const { supplierList } = this.props;
            }
        });


    }

    //每页个数变化时回调
    onShowSizeChange = (current, size) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'market/querySupplier',
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
            type: 'market/querySupplier',
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
        values.rows = 10;
        dispatch({
            type: 'market/querySupplier',
            payload: values,
        });
    };

    //新增账户
    addAccount = e => {
        this.setState({ operateType: "add" });
        this.showModal();
    };
    //编辑选中项
    editSelectRow = e => {
        const { selectedRows } = this.state;
        const { direction } = this.props;
        const form = this.formRef.props.form;
        if (selectedRows.length != 1) {
            message.error('请选择一条记录进行修改操作！');
            return false;
        }
        this.setState({ operateType: "edit" });
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
        var goodsType = row['type'] + '';
        form.setFieldsValue({ type: goodsType });

    }
    //删除选中项
    deleteSelectRow = e => {
        const { selectedRows } = this.state;
        const { dispatch } = this.props;
        if (selectedRows.length < 1) {
            message.error('请选择要删除的项目！');
            return false;
        }
        dispatch({
            type: 'market/deleteSupplier',
            payload: selectedRows,
            callback: () => {
                const { updateSupplierResult } = this.props;
                if (updateSupplierResult == 0) {
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
                    type: 'market/querySupplier',
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
        const supplierName = values.supplierName ? values.supplierName : "";
        let dateTime = Moment().format('YYYYMMDDHHmmss');
        axios({
            method: "get",
         //   url: "http://" + location.host + "/exportSupplier?name=" + name + "&model=" + model,
             url: "http://localhost:8080/exportSupplier?supplierName="+supplierName,
            headers: {
                // "MSP-AppKey": localStorage.getItem('appKey'),
                // "MSP-AuthKey": localStorage.getItem('auth-key'),
            },
            responseType: 'blob'
        }).then(function (res) {
            const content = res.data
            console.log(res)
            const blob = new Blob([content])
            const fileName = '供货商信息表' + dateTime + '.xlsx';
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
        const { dispatch } = this.props;
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            var values = form.getFieldsValue();
            const { operateType } = this.state;
            var url;
            if (operateType == "add") {
                var url = 'market/addSupplier';
            }
            if (operateType == "edit") {
                var url = 'market/modifySupplier';
            }
            dispatch({
                type: url,
                payload: values,
                callback: () => {
                    const { addAccountResult } = this.props;
                    if (addAccountResult == "0") {
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
                        type: 'market/querySupplier',
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
        const { supplierList, total, form, direction } = this.props;
        const columns = [{
            title: '商户名称',
            dataIndex: 'supplierName',
        },
        {
            title: '商户类别',
            dataIndex: 'type',
            render: (text, record, index) => {
                var goodsType = text;
                direction.map((d) => {
                    if (text == d.id) {
                        goodsType = d.text;
                    }
                })
                return goodsType;
            }
        },
        {
            title: '联系人',
            dataIndex: 'contactName',
        },
        {
            title: '联系电话1',
            dataIndex: 'phone1',

        }
            ,
        {
            title: '联系电话2',
            dataIndex: 'phone2',
        }
            ,
        {
            title: '微信号',
            dataIndex: 'wechat',
        }
            ,
        {
            title: '地址',
            dataIndex: 'address',
        },
        {
            title: '备注',
            dataIndex: 'remarks',
        },
        {
            title: 'QQ',
            dataIndex: 'qq',
        },
        {
            title: '邮箱',
            dataIndex: 'email',
        },

        ];

        const { operateType, selectedRowKeys } = this.state;
        return (
            <div>
                <Form onSubmit={this.handleSearch} layout="inline" style={{ marginBottom: "1%", marginLeft: "1%" }}>
                    <Row >
                        <Col span={5} style={{marginTop:"-2px"}}>
                            <FormItem label="供货商名称">
                                {form.getFieldDecorator('supplierName')(<Input placeholder="请输入供货商名称" />)}
                            </FormItem>
                        </Col>
                        <Col span={2}>
                            <div style={{ marginLeft: "-50%" }}>
                                <Button type="primary" icon="search" onClick={this.handleSearch}>搜索</Button>
                            </div>
                        </Col>
                        <Col span={5}>
                            {/* <FormItem label="商品型号">
                                {form.getFieldDecorator('model')(
                                    <Input placeholder="请输入商品型号" />
                                )}
                            </FormItem> */}
                        </Col>

                        
                        <Col span={12}>
                            <div style={{ float: "right", marginRight: 0 }}>
                                <Button type="primary" icon="plus" onClick={this.addAccount}>新增</Button>
                                <Button type="primary" icon="edit" onClick={this.editSelectRow} style={{ marginLeft: 8 }}>修改</Button>
                                <Button type="primary" icon="delete" onClick={this.deleteSelectRow} style={{ marginLeft: 8 }}>删除</Button>
                                <Button type="primary" icon="printer" onClick={this.exportAccount} style={{ marginLeft: 8 }}>导出</Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
                <Table
                    rowSelection={{
                        onChange: (selectedRowKeys, selectedRows) => {
                            this.setState({ selectedRows: selectedRows, selectedRowKeys: selectedRowKeys });
                        },
                        selectedRowKeys: selectedRowKeys
                    }}
                    columns={columns} dataSource={supplierList} rowKey="goodsId" bordered
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

export default Suppliermanage;
