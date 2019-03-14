import {queryAccounts} from '@/services/accountmanage'

export default {
    namespace: 'account',
    state: {
      accountList: [],
      total:0,
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
 
    },
  
    reducers: {
      queryAccountList(state, action) {
        return {
          ...state,
          accountList: action.payload ? action.payload.rows :[] ,
          total:action.payload ? action.payload.total:0,
        };
      },
    
    },
  };