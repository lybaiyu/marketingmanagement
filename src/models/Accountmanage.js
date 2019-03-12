import {queryAccounts} from '@/services/accountmanage'

export default {
    namespace: 'account',
    state: {
      accountList: [],
    },
  
    effects: {
      *queryAccount({payload,callback}, { call, put }) {
        const response = yield call(queryAccounts,JSON.stringify(payload));
        debugger;
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
        debugger;
        return {
          ...state,
          accountList: action.payload.rows,
        };
      },
    
    },
  };