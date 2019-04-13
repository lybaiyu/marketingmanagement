import request from '@/utils/request';

export async function queryGoods(params) {
    return request('/service/queryGoods/',
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
  //商品信息
   export async function addGoods(params) {
     return request('/service/addGoods/',
     {
     method:"post",
     body: JSON.stringify(params),
     headers:{'Content-Type': 'application/json;charset=utf-8'}
     });
   }
   //修改账户
   export async function modifyGoods(params) {
     return request('/service/modifyGoods/',
     {
     method:"post",
     body: JSON.stringify(params),
     headers:{'Content-Type': 'application/json;charset=utf-8'}
     });
   }
  //删除账户
     export async function deleteGoods(params) {
       return request('/service/deleteGoods/',
       {
       method:"post",
       body: JSON.stringify(params),
       headers:{'Content-Type': 'application/json;charset=utf-8'}
       });
     }
//   //导出数据
//   export async function exportAccount(params) {
//     return request('/service/exportAccount/',
//     {
//     responseType: 'blob', // 表明返回服务器返回的数据类型,
//     method:"post",
//     body: JSON.stringify(params),
//     headers:{'Content-Type': 'application/json;charset=utf-8'}
//     });
//   }

