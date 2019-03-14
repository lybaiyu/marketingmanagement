import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import moment from 'moment';
import { connect } from 'dva';
import {
  Table,
  Form,
  Button,
  Pagination,
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Result from '@/components/Result';


const FormItem = Form.Item;


@connect(({ account }) => ({
  accountList: account.accountList,
  total: account.total,
}))
@Form.create()
class Accountmanage extends PureComponent {
  state = {
    loading: false,
    // list:Accountmanage.accountList,
  };



  componentDidMount() {

    const { dispatch } = this.props;
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

    const {accountList, total} = this.props;
    return (
      <div>
        <Table rowSelection={{}} columns={columns} dataSource={accountList} rowKey = "accountId" bordered
          pagination={{ showSizeChanger: true, defaultCurrent: 1, total:total ,defaultPageSize:10 ,hideOnSinglePage:false,
            onShowSizeChange :this.onShowSizeChange,
            onChange:this.onChange,
            rowClassName:this.rowClassName,
          }} />

      </div>
    );
  }
}

export default Accountmanage;
