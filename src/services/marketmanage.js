import request from '@/utils/request';
//查询商品信息
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
  //增加商品
   export async function addGoods(params) {
     return request('/service/addGoods/',
     {
     method:"post",
     body: JSON.stringify(params),
     headers:{'Content-Type': 'application/json;charset=utf-8'}
     });
   }
   //修改商品信息
   export async function modifyGoods(params) {
     return request('/service/modifyGoods/',
     {
     method:"post",
     body: JSON.stringify(params),
     headers:{'Content-Type': 'application/json;charset=utf-8'}
     });
   }
  //删除商品
     export async function deleteGoods(params) {
       return request('/service/deleteGoods/',
       {
       method:"post",
       body: JSON.stringify(params),
       headers:{'Content-Type': 'application/json;charset=utf-8'}
       });
     }

    //查询商户信息   
    export async function querySupplier(params) {
      return request('/service/querySupplier/',
      {
      method:"post",
      body: JSON.stringify(params),
      headers:{'Content-Type': 'application/json;charset=utf-8'}
      });
    }

    export async function addSupplier(params) {
      return request('/service/addSupplier/',
      {
      method:"post",
      body: JSON.stringify(params),
      headers:{'Content-Type': 'application/json;charset=utf-8'}
      });
    }

     //修改商户信息
   export async function modifySupplier(params) {
    return request('/service/modifySupplier/',
    {
    method:"post",
    body: JSON.stringify(params),
    headers:{'Content-Type': 'application/json;charset=utf-8'}
    });
  }
 //删除商户
    export async function deleteSupplier(params) {
      return request('/service/deleteSupplier/',
      {
      method:"post",
      body: JSON.stringify(params),
      headers:{'Content-Type': 'application/json;charset=utf-8'}
      });
    }

