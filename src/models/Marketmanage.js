import {queryGoods,queryDirection ,addGoods,modifyGoods,deleteGoods,querySupplier,addSupplier,modifySupplier,deleteSupplier} from '@/services/marketmanage'

export default {
    namespace: 'market',
    state: {
      goodsList: [],
      total:0,
       direction:[],
       addGoodsResult:"",
       supplierList:[],
       updateSupplierResult:"",
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

    
    },
  };
