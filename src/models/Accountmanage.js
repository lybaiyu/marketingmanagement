import {queryAccounts,queryDirection,addAccount} from '@/services/accountmanage'

export default {
    namespace: 'account',
    state: {
      accountList: [],
      total:0,
      direction:[],
      addAccountResult:"",
    },
  
    effects: {
      *queryAccount({payload,callback}, { call, put }) {
        const response = yield call(queryAccounts,payload);
        yield put({
          type: 'queryAccountList',
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

      //新增账户
      *addAccount({payload,callback}, { call, put }){
        const response = yield call(addAccount,payload);
        yield put({
          type: 'addAccountResult',
          payload: response,
        });
        if(callback){
          callback();
        }
      },


 
    },
  
    reducers: {
      queryAccountList(state, action) {
        return {
          ...state,
          accountList: action.payload ? action.payload.rows :[] ,
          total:action.payload ? action.payload.total:0,
        };
      },
      directionValue(state, action) {
        return {
          ...state,
          direction: action.payload ? action.payload :[] ,
        };
      },
      addAccountResult(state, action) {
        return {
          ...state,
          addAccountResult: action.payload ? action.payload :"" ,
        };
      },


    
    },
  };