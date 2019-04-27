import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import RightContent from './RightContent';
import $ from  'jquery'
var date = new Date();
date = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate()+"日";
export default class GlobalHeader extends PureComponent {

  //查询日期包括农历
  getDate = () => {
    $.ajax({
        type: "GET",
        url:  "http://" + location.host+"/service/getDateString",
        //url:  "http://localhost/service/getDateString",
        contentType: "application/json",
       // dataType: "JSON",
      //  async: false,
        data: "",
        success: function (data) {
          $("#date").html(data);
        }

    });
    return  date;
  }

  //查询当日天气
  getWeather = () => {
    $.ajax({
      type: "GET",
      url:  "https://www.tianqiapi.com/api/?version=v1&cityid=101180909",
     // contentType: "application/json",
    //  dataType: "JSON",
    //  async: false,
     // data: JSON.stringify({ "version": 'v1',"cityid":'101180909' }),
      success: function (data) {
        var weatherStr ="今日天气&nbsp;&nbsp;&nbsp;"+ data.city +":&nbsp;";
        weatherStr += data.data[0].wea+"&nbsp;&nbsp;&nbsp;最高温度：";
        weatherStr += data.data[0].tem1+"&nbsp;&nbsp;&nbsp;最低温度：";
        weatherStr += data.data[0].tem2+"&nbsp;&nbsp;&nbsp;空气质量：";
        weatherStr += data.data[0].air_level+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;明日天气：";
        weatherStr += data.data[1].wea+"&nbsp";
        $("#weather").html(weatherStr);
      },
      error:function (data) {
        console.error("获取天气信息失败！"+data)
      },
      

  });
  return  date;
  }


 componentDidMount(){
  this.getDate() ;
  this.getWeather();
 }
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };

  
  
   
  render() {
    const { collapsed, isMobile, logo } = this.props;
    return (
      <div className={styles.header}>
        {isMobile && (
          <Link to="/" className={styles.logo} key="logo">
            <img src={logo} alt="logo" width="32" />
          </Link>
        )}
        <span className={styles.trigger} onClick={this.toggle}>
          <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
        </span >
        &nbsp; <span id="date"style={{fontWeight:"bold"}}> {date}</span>
        <span id="weather" style={{marginLeft:"45%",color:"blue",fontWeight:"bold"}}>今日天气： </span>
        <RightContent {...this.props} />
      </div>
    );
  }
}
