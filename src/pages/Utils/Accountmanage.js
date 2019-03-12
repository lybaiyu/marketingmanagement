import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import moment from 'moment';
import {connect} from 'dva';
import {
 Table,
 Form,
 Button,
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Result from '@/components/Result';


const FormItem = Form.Item;


@connect(({ account }) => ({
  accountList:account.accountList
}))
@Form.create()
class Accountmanage extends PureComponent {
  state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
   // list:Accountmanage.accountList,
  };
 
  start = () => {
    this.setState({ loading: true });
    // ajax request after empty completing
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      });
    }, 1000);
  }
 
  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }

  componentDidMount() {
   
    const { dispatch} = this.props;
    dispatch({
      type: 'account/queryAccount',
      payload: {
        page: "5",
        rows:"1",
      },
      callback:() => {
        const { account,accountList} = this.props;
    debugger;
        console.log(accountList);
        console.log(account);
      }
    });
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
      width:30,
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
    
    const data =[{"passWord":"L1xkZ+fm0d0dMJSanqcECA==","registrationTime":"2010-09-01 23:13:38","accountId":4,"accountName":"QQ号1","modificationTime":"2018-09-19 23:13:58","accountType":2,"phoneNum":"15937122851","userName":"1562696478","email":"1562696478@qq.com","remarks":"主号"},{"passWord":"FTQmTDEEi3mY6ajIdhjKU=","registrationTime":"2010-09-01 23:15:57","accountId":5,"accountName":"QQ号2","modificationTime":"2018-09-19 23:16:08","accountType":2,"userName":"1037760193","email":"1037760193@qq.com"},{"passWord":"sdS5mDyS9YNDvq3QTpCiEg==","accountId":6,"accountName":"百度账户","modificationTime":"2018-09-19 23:30:03","accountType":4,"phoneNum":"15937122851","userName":"byzhwa","url":"http://www.baidu.com","remarks":"包括百度网盘等"},{"passWord":"LmoP2sWxs6l0XWvwa0e7jg==","registrationTime":"2018-09-21 12:22:03","accountId":7,"accountName":"黑加账号","modificationTime":"2018-09-21 00:22:19","accountType":5,"phoneNum":"15937122851","userName":"松风竹影","remarks":"黑加手环APP账户"},{"passWord":"13nLl/AIWVdhUIHIuzITyw==","registrationTime":"2018-03-01 00:25:19","accountId":8,"accountName":"vultr账户","modificationTime":"2018-09-21 00:28:46","accountType":9,"userName":"1562696478@qq.com","email":"1562696478@qq.com","url":"https://my.vultr.com/subs/","remarks":"vultr云服务器"},{"passWord":"I9KXtP41TPK79HrQCHmRNQ==","registrationTime":"2018-03-01 00:36:36","accountId":9,"accountName":"paypal账户","modificationTime":"2018-09-21 00:37:07","accountType":6,"phoneNum":"15937122851","userName":"1562696478@qq.com","email":"1562696478@qq.com","url":"https://www.paypal.com/myaccount/home","remarks":"paypal外币结算"},{"passWord":"K6wpV37ZY2eFr2DpiKUkSA==","accountId":10,"accountName":"Vultr云服务器账户","modificationTime":"2018-09-21 00:39:55","accountType":5,"userName":"root","url":"66.42.99.10","remarks":"ssh端口14109，"},{"passWord":"0R8m5CYKGKvf6qkcmmiOGg==","registrationTime":"2018-04-03 00:46:20","accountId":11,"accountName":"Apple ID","modificationTime":"2018-09-21 00:46:31","accountType":5,"phoneNum":"15937122851","userName":"1562696478@qq.com","email":"1562696478@qq.com","url":"https://www.apple.com/cn/"},{"passWord":"O2WEU7s4wgs2nwTIMbcrEQ==","accountId":12,"accountName":"Roome账户","modificationTime":"2018-09-21 00:48:34","accountType":5,"phoneNum":"15937122851","userName":"1562696478@qq.com","email":"1562696478@qq.com","remarks":"室友小易智能闹钟"},{"passWord":"I9KXtP41TPK79HrQCHmRNQ==","accountId":13,"accountName":"Adobe账户","modificationTime":"2018-09-21 00:51:00","accountType":4,"userName":"1562696478@qq.com","email":"1562696478@qq.com","url":"https://www.adobe.com/cn/"},{"passWord":"a+dc0r4mnNpzyOyUuOkHZg==","registrationTime":"2018-07-01 00:52:25","accountId":14,"accountName":"斐讯N1 Ubuntu账户","modificationTime":"2018-09-21 00:52:45","accountType":5,"userName":"root","remarks":"斐讯N1 root账户"},{"passWord":"Ya/fFAxLRLoj4r1Ii/YuJA==","accountId":15,"accountName":"斐讯N1 ubuntu账户2","modificationTime":"2018-09-21 00:53:39","accountType":5,"userName":"bai"},{"passWord":"00UY7aHCOOOrCb8JrJRaAQ==","registrationTime":"2018-08-01 00:55:17","accountId":16,"accountName":"中行征信中心","modificationTime":"2018-09-21 00:55:44","accountType":3,"phoneNum":"15937122851","userName":"lybaiyu","email":"1562696478@qq.com","url":"http://www.pbccrc.org.cn/","remarks":"中国人们银行征信中心"},{"passWord":"O2WEU7s4wgs2nwTIMbcrEQ==","registrationTime":"2018-08-21 00:59:38","accountId":17,"accountName":"交通安全综合服务管理平台","modificationTime":"2018-09-21 01:00:10","accountType":11,"phoneNum":"15937122851","userName":"410324199006081919","url":"http://ha.122.gov.cn/","remarks":"驾照/审车等服务"},{"passWord":"PgOlzZiB1HM5YZ6+hZdjVlNVAoqsBEHxDsiqSz0YpDQ=","registrationTime":"2010-09-01 01:03:36","accountId":18,"accountName":"淘宝&支付宝","modificationTime":"2018-09-21 01:04:37","accountType":6,"phoneNum":"15937122851","userName":"byzhwa","url":"https://www.taobao.com/"},{"passWord":"sdS5mDyS9YNDvq3QTpCiEg==","accountId":19,"accountName":"bilibili视频网","modificationTime":"2018-09-21 01:06:47","accountType":10,"phoneNum":"15937122851","userName":"jadewhite1","url":"https://www.bilibili.com/","remarks":"B站"},{"passWord":"O2WEU7s4wgs2nwTIMbcrEQ==","accountId":20,"accountName":"GitHub","modificationTime":"2018-09-21 01:09:13","accountType":9,"userName":"lybaiyu","email":"1562696478@qq.com","url":"https://github.com/"},{"passWord":"O2WEU7s4wgs2nwTIMbcrEQ==","accountId":21,"accountName":"洛阳社保","modificationTime":"2018-09-21 01:11:16","accountType":11,"phoneNum":"15937122851","userName":"15937122851","url":"http://gr.ly12333.com/index.html","remarks":"洛阳社保查询"},{"passWord":"O2WEU7s4wgs2nwTIMbcrEQ==","accountId":22,"accountName":"慕课网","modificationTime":"2018-09-21 01:12:36","accountType":9,"userName":"1562696478@qq.com","email":"1562696478@qq.com","url":"https://www.imooc.com/"},{"passWord":"Z5hVQdorzAJQTjRPPnOD9Q==","registrationTime":"2017-11-20 15:15:25","accountId":23,"accountName":"软通IPSA","modificationTime":"2019-02-19 21:22:11","accountType":9,"phoneNum":"15670311079","userName":"yubaig","email":"yubaig@isoftstone.com","url":"http://ipsapro.isoftstone.com/Portal"},{"passWord":"sdS5mDyS9YNDvq3QTpCiEg==","accountId":24,"accountName":"京东","modificationTime":"2018-09-21 01:18:27","accountType":6,"phoneNum":"15937122851","userName":"luoyangby","email":"1562696478@qq.com","url":"https://www.jd.com/"},{"passWord":"O2WEU7s4wgs2nwTIMbcrEQ==","accountId":25,"accountName":"微软账户","modificationTime":"2018-09-21 01:20:08","accountType":4,"userName":"lylcbaiyu@163.com","email":"lylcbaiyu@163.com","url":"https://account.microsoft.com/profile/"},{"passWord":"O2WEU7s4wgs2nwTIMbcrEQ==","accountId":26,"accountName":"微软账户2","modificationTime":"2018-09-21 01:21:02","accountType":4,"userName":"1562696478@qq.com","email":"1562696478@qq.com","url":"https://account.microsoft.com/profile/"},{"passWord":"O2WEU7s4wgs2nwTIMbcrEQ==","accountId":27,"accountName":"一加账户","modificationTime":"2018-09-21 01:22:33","accountType":5,"phoneNum":"15937122851","userName":"書劍飄零","url":"https://account.oneplus.com/cn"},{"passWord":"O2WEU7s4wgs2nwTIMbcrEQ==","accountId":28,"accountName":"花生壳","modificationTime":"2018-09-21 01:24:42","accountType":5,"phoneNum":"15937122851","userName":"byzhwa","email":"1562696478@qq.com","url":"https://www.oray.com/"},{"passWord":"O2WEU7s4wgs2nwTIMbcrEQ==","accountId":29,"accountName":"恩山无线论坛","modificationTime":"2018-09-21 01:27:01","accountType":1,"userName":"byzhwa","email":"1562696478@qq.com","url":"http://www.right.com.cn/forum/forum.php"},{"passWord":"O2WEU7s4wgs2nwTIMbcrEQ==","accountId":30,"accountName":"什么值得买","modificationTime":"2018-09-21 01:28:49","accountType":1,"phoneNum":"15937122851","userName":"byzhwa","email":"1562696478@qq.com","url":"https://www.smzdm.com/"},{"passWord":"O2WEU7s4wgs2nwTIMbcrEQ==","accountId":31,"accountName":"苏宁易购","modificationTime":"2018-09-21 01:30:41","accountType":6,"phoneNum":"15937122851","userName":"15937122851","email":"lylcbaiyu@foxmail.com","url":"https://www.suning.com/"},{"passWord":"O2WEU7s4wgs2nwTIMbcrEQ==","accountId":32,"accountName":"华为商城","modificationTime":"2018-09-21 01:32:20","accountType":6,"phoneNum":"15937122851","userName":"baiyu8@huawei.com","email":"baiyu8@huawei.com","url":"https://hwid1.vmall.com/CAS/portal/login.html"},{"passWord":"L1xkZ+fm0d0dMJSanqcECA==","accountId":33,"accountName":"新浪微博","modificationTime":"2018-09-21 01:33:57","accountType":2,"phoneNum":"15937122851","userName":"15937122851","url":"https://weibo.com/"},{"passWord":"sdS5mDyS9YNDvq3QTpCiEg==","accountId":34,"accountName":"小米账户","modificationTime":"2018-09-21 01:36:01","accountType":4,"phoneNum":"15937122851","userName":"松风竹影","email":"1562696478@qq.com","url":"https://www.mi.com/"},{"passWord":"O2WEU7s4wgs2nwTIMbcrEQ==","accountId":35,"accountName":"迅雷","modificationTime":"2018-09-21 01:38:25","accountType":10,"phoneNum":"15937122851","userName":"byzhwa","url":"https://vip.xunlei.com/"},{"passWord":"sdS5mDyS9YNDvq3QTpCiEg==","accountId":36,"accountName":"优酷","modificationTime":"2018-09-21 01:40:16","accountType":10,"phoneNum":"15937122851","userName":"jade-white","email":"1562696478@qq.com","url":"http://www.youku.com/"},{"passWord":"I9KXtP41TPK79HrQCHmRNQ==","accountId":37,"accountName":"Steam账户","modificationTime":"2018-09-26 12:31:29","accountType":8,"userName":"lybaiyu","email":"1562696478@qq.com","url":"https://store.steampowered.com/"},{"passWord":"I9KXtP41TPK79HrQCHmRNQ==","accountId":38,"accountName":"EA Origin平台","modificationTime":"2018-09-26 12:32:54","accountType":8,"userName":"lybaiyu","email":"1562696478@qq.com","url":"https://www.origin.com/irl/zh-tw/my-home"},{"passWord":"Z5hVQdorzAJQTjRPPnOD9Q==","registrationTime":"2017-11-20 15:02:35","accountId":39,"accountName":"软通IPSA","modificationTime":"2019-03-03 23:34:45","accountType":9,"phoneNum":"15670311079","userName":"yubaig","email":"yubaig@isoftstone.com","url":"http://ipsapro.isoftstone.com/Portal"}];
    const { loading, selectedRowKeys } = this.state;
    const  rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    
    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            onClick={this.start}
            disabled={!hasSelected}
            loading={loading}
          >
            Reload
          </Button>
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
          </span>
        </div>
        <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
      </div>
    );
  }
}

export default Accountmanage;
