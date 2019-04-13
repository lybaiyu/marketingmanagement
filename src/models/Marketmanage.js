import {queryGoods,queryDirection ,addGoods,modifyGoods,deleteGoods/*,exportGoods */} from '@/services/marketmanage'

export default {
    namespace: 'market',
    state: {
      goodsList: [],
      total:0,
       direction:[],
       addGoodsResult:"",
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

    //   //导出数据
    //   *exportAccounts({payload,callback}, { call, put }){
    //     const response = yield call(exportAccount,payload);
    //     // yield put({
    //     //   type: 'addAccountResult',
    //     //   payload: response,
    //     // });
    //     if(callback){
    //       callback();
    //     }
    //   },


 
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


    
    },
  };
