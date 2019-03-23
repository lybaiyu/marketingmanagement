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