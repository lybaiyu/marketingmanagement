import request from '@/utils/request';

export async function queryAccounts(params) {
    return request('/service/queryAccounts/',
    {
    method:"post",
    body: JSON.stringify(params),
    headers:{'Content-Type': 'application/json;charset=utf-8'}
    });
  }  