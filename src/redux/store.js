/* 
  redux最核心的管理對象模塊 
*/
import { createStore, applyMiddleware } from "redux";
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import reducers from "./reducers";

//向外暴露store對象
export default createStore( reducers, composeWithDevTools( applyMiddleware(thunk) ) )