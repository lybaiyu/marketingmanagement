import request from '@/utils/request';

export async function queryAccounts(params) {
    return request('/service/queryAccounts/',
    {
    method:"post",
    body: JSON.stringify(params),
    headers:{'Content-Type': 'application/json;charset=utf-8'}
    });
  } 
  
  export async function queryDirection(params) {
    return request('/service/queryDirection/',
    {
    method:"post",
    body: JSON.stringify(params),
    headers:{'Content-Type': 'application/json;charset=utf-8'}
    });
  } 
  //新增账户
  export async function addAccount(params) {
    return request('/service/addAccount/',
    {
    method:"post",
    body: JSON.stringify(params),
    headers:{'Content-Type': 'application/json;charset=utf-8'}
    });
  }

  //修改账户
  export async function modifyAccount(params) {
    return request('/service/modifyAccount/',
    {
    method:"post",
    body: JSON.stringify(params),
    headers:{'Content-Type': 'application/json;charset=utf-8'}
    });
  }
  //删除账户
  export async function deleteAccount(params) {
    return request('/service/deleteAccount/',
    {
    method:"post",
    body: JSON.stringify(params),
    headers:{'Content-Type': 'application/json;charset=utf-8'}
    });
  }
  //导出数据
  export async function exportAccount(params) {
    return request('/service/exportAccount/',
    {
    responseType: 'blob', // 表明返回服务器返回的数据类型,
    method:"post",
    body: JSON.stringify(params),
    headers:{'Content-Type': 'application/json;charset=utf-8'}
    });
  }

