import {queryGoods,queryDirection ,addGoods,modifyGoods,deleteGoods,querySupplier,addSupplier,modifySupplier,deleteSupplier,
  queryPurchase,addPurchase,deletePurchase,queryInventory,querySales,addSales,deleteSales
} from '@/services/marketmanage'

export default {
    namespace: 'market',
    state: {
      goodsList: [],
      total:0,
       direction:[],
       addGoodsResult:"",
       supplierList:[],
       updateSupplierResult:"",
       purchaseList:[],
       updatePurchaseResult:"",
       inventoryList:[],
       salesList:[],
       updateSalesResult:"",
    },
  
    effects: {
      *queryGoods({payload,callback}, { call, put }) {
        const response = yield call(queryGoods,payload);
        yield put({
          type: 'queryGoodsList',
          payload: response,
        });
        if(callback){
          callback();
        }
      },
        //修改商品信息
        *modifyGoods({payload,callback}, { call, put }) {
          const response = yield call(modifyGoods,payload);
         yield put({
           type: 'addGoodsResult',
           payload: response,
         });
         if(callback){
           callback();
         }
       },
      *queryDirections({payload,callback}, { call, put }){
        const response = yield call(queryDirection,payload);
        yield put({
          type: 'directionValue',
          payload: response,
        });
        if(callback){
          callback();
        }
      },

      //新增商品
       *addGoods({payload,callback}, { call, put }){
         const response = yield call(addGoods,payload);
         yield put({
           type: 'addGoodsResult',
           payload: response,
         });
         if(callback){
           callback();
         }
       },
        //删除商品
        *deleteGoods({payload,callback}, { call, put }){
          const response = yield call(deleteGoods,payload);
          yield put({
            type: 'addGoodsResult',
            payload: response,
          });
          if(callback){
            callback();
          }
        },
       //查询商户信息
       *querySupplier({payload,callback}, { call, put }) {
        const response = yield call(querySupplier,payload);
        yield put({
          type: 'querySupplierList',
          payload: response,
        });
        if(callback){
          callback();
        }
      },

      
      //新增商户
      *addSupplier({payload,callback}, { call, put }){
        const response = yield call(addSupplier,payload);
        yield put({
          type: 'updateSupplierResult',
          payload: response,
        });
        if(callback){
          callback();
        }
      },
      //修改商户信息
      *modifySupplier({payload,callback}, { call, put }) {
        const response = yield call(modifySupplier,payload);
       yield put({
         type: 'updateSupplierResult',
         payload: response,
       });
       if(callback){
         callback();
       }
     }, 
     //删除商户信息
     *deleteSupplier({payload,callback}, { call, put }){
      const response = yield call(deleteSupplier,payload);
      yield put({
        type: 'updateSupplierResult',
        payload: response,
      });
      if(callback){
        callback();
      }
    },

     //查询采购记录
     *queryPurchase({payload,callback}, { call, put }) {
      const response = yield call(queryPurchase,payload);
      yield put({
        type: 'queryPurchaseList',
        payload: response,
      });
      if(callback){
        callback();
      }
    },

   //新增采购记录
   *addPurchase({payload,callback}, { call, put }){
    const response = yield call(addPurchase,payload);
    yield put({
      type: 'updatePurchaseResult',
      payload: response,
    });
    if(callback){
      callback();
    }
  },
  //删除采购记录 
  *deletePurchase({payload,callback}, { call, put }){
    const response = yield call(deletePurchase,payload);
    yield put({
      type: 'updatePurchaseResult',
      payload: response,
    });
    if(callback){
      callback();
    }
  },
   //查询库存
   *queryInventory({payload,callback}, { call, put }) {
    const response = yield call(queryInventory,payload);
    yield put({
      type: 'queryInventoryList',
      payload: response,
    });
    if(callback){
      callback();
    }
  },
  //查询售出记录
  *querySales({payload,callback}, { call, put }) {
    const response = yield call(querySales,payload);
    yield put({
      type: 'querySalesList',
      payload: response,
    });
    if(callback){
      callback();
    }
  },
   
   //新增售出记录
   *addSales({payload,callback}, { call, put }){
    const response = yield call(addSales,payload);
    yield put({
      type: 'updateSalesResult',
      payload: response,
    });
    if(callback){
      callback();
    }
  },
  //删除售出记录 
  *deleteSales({payload,callback}, { call, put }){
    const response = yield call(deleteSales,payload);
    yield put({
      type: 'updateSalesResult',
      payload: response,
    });
    if(callback){
      callback();
    }
  },

 
    },
  
    reducers: {
      queryGoodsList(state, action) {
        return {
          ...state,
          goodsList: action.payload ? action.payload.rows :[] ,
          total:action.payload ? action.payload.total:0,
        };
      },
      directionValue(state, action) {
        return {
          ...state,
         
          direction: action.payload ? action.payload :[] ,
        };
      },
       addGoodsResult(state, action) {
         return {
           ...state,
           addGoodsResult: action.payload ? action.payload :"" ,
         };
       },
       querySupplierList(state, action) {
        return {
          ...state,
          supplierList: action.payload ? action.payload.rows :[] ,
          total:action.payload ? action.payload.total:0,
        };
      },
      updateSupplierResult(state, action) {
        return {
          ...state,
          updateSupplierResult: action.payload ? action.payload :"" ,
        };
      },
      //返回采购记录
      queryPurchaseList(state, action) {
        return {
          ...state,
          purchaseList: action.payload ? action.payload.rows :[] ,
          total:action.payload ? action.payload.total:0,
        };
      },
      //编辑采购记录的结果
      updatePurchaseResult(state, action) {
        return {
          ...state,
          updatePurchaseResult: action.payload ? action.payload :"" ,
        };
      },
      
     //返回库存列表
     queryInventoryList(state, action) {
      return {
        ...state,
        inventoryList: action.payload ? action.payload.rows :[] ,
        total:action.payload ? action.payload.total:0,
      };
    },

    //返回售出记录列表
    querySalesList(state, action) {
      return {
        ...state,
        salesList: action.payload ? action.payload.rows :[] ,
        total:action.payload ? action.payload.total:0,
      };
    },
    //返回更新销售记录结果 
    updateSalesResult(state, action) {
      return {
        ...state,
        updateSalesResult: action.payload ? action.payload :"" ,
      };
    },
    },
  };
