// 库存管理页面
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


@connect(({ market, user }) => ({
    inventoryList: market.inventoryList,
    total: market.total,
    currentUser: user.currentUser,
}))
@Form.create()
class Inventorymanage extends PureComponent {
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
        dispatch({
            type: 'market/queryInventory',
            payload: {
                page: 1,
                rows: 10,
            },
            callback: () => {
                const { inventoryList } = this.props;
            }
        });


    }

    //每页个数变化时回调
    onShowSizeChange = (current, size) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'market/queryInventory',
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
            type: 'market/queryInventory',
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
        let purchaseDate = values.purchaseDate
        if(purchaseDate != "" && purchaseDate != null && purchaseDate != undefined){
            purchaseDate = purchaseDate.format('YYYY-MM-DD');
        }
        values['purchaseDate']  = purchaseDate;
        values.page = 1;
        values.rows = 10;
        dispatch({
            type: 'market/queryInventory',
            payload: values,
        });
    };



    //导出表格数据到excel文件
    exportAccount = e => {
        const { dispatch, form } = this.props;
        const values = form.getFieldsValue();
        const goodsName = values.goodsName ? values.goodsName : "";
        const model = values.model ? values.model : "";
        //当前时间格式化
        let dateTime = Moment().format('YYYYMMDDHHmmss');
        axios({
            method: "get",
            url: "http://" + location.host + "/exportInventory?model=" + model + "&goodsName="+goodsName,
           // url: "http://localhost:8080/exportInventory?model=" + model+"&goodsName="+goodsName,
            headers: {
                // "MSP-AppKey": localStorage.getItem('appKey'),
                // "MSP-AuthKey": localStorage.getItem('auth-key'),
            },
            responseType: 'blob'
        }).then(function (res) {
            const content = res.data
            console.log(res)
            const blob = new Blob([content])
            const fileName = '商品库存详情表' + dateTime + '.xlsx';
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


    rowClassName = (record, index) => {
        let className = 'light-row';
        if (index % 2 === 1) className = 'dark-row';
        return className;
    }

    render() {
        const { inventoryList, total, form } = this.props;
        const columns = [{
            title: '商品名称',
            dataIndex: 'goodsName',
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
            title: '库存数量',
            dataIndex: 'num',
        },
        {
            title: '更新时间',
            dataIndex: 'updateTime',
        },
        
        
        {
            title: '备注',
            dataIndex: 'remarks',
        }

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
                        <Col span={6} style={{ marginTop: "-2px" }}>
                            <FormItem label="商品型号">
                                {form.getFieldDecorator('model')(<Input placeholder="请输入商品型号" />)}
                            </FormItem>
                        </Col>
                        <Col span={2}>
                            <div style={{ marginLeft: "-10%",marginTop:3 }}>
                                <Button type="primary" icon="search" onClick={this.handleSearch}>搜索</Button>
                            </div>
                        </Col>

                        <Col span={10}>
                            <div style={{ float: "right", marginRight: 0 }}>
                                {/* <Button type="primary" icon="plus" onClick={this.addAccount}>新增</Button> */}
                                {/* <Button type="primary" icon="edit" onClick={this.editSelectRow} style={{ marginLeft: 8 }}>修改</Button> */}
                                {/* <Button type="primary" icon="delete" onClick={this.deleteSelectRow} style={{ marginLeft: 8 }}>删除</Button> */}
                                <Button type="primary" icon="printer" onClick={this.exportAccount} style={{ marginLeft: 8 }}>导出</Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
                <Table
                     rowSelection={{
                        onChange: (selectedRowKeys, selectedRows) => {
                            debugger;
                                   this.setState({selectedRows:selectedRows,selectedRowKeys:selectedRowKeys}) ;},
                      selectedRowKeys:selectedRowKeys
                    }} 
                    columns={columns} dataSource={inventoryList} rowKey="goodsId" bordered
                    pagination={{
                        showSizeChanger: true, defaultCurrent: 1, total: total, defaultPageSize: 10, hideOnSinglePage: false,
                        onShowSizeChange: this.onShowSizeChange,
                        onChange: this.onChange,
                        rowClassName: this.rowClassName,
                    }} />
            </div>
        );
    }
}

export default Inventorymanage;
