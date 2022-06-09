/* 
  包含n個reducer函數： 根據舊的state和指定的action返回一個新的state
*/
import { combineReducers } from 'redux'
import {
  AUTH_SUCCESS,
  ERROR_MSG,
  RECEIVE_USER,
  RESET_USER,
  RECEIVE_USER_LIST,
  RECEIVE_MSG_LIST,
  RECEIVE_MSG,
  HAVE_READ
} from './action-types'
import { getRedirectTo } from '../utils'

const initUser = {
  username: '',//用戶名
  type: '',//用戶類型 jobHunting/recruitment
  msg: '',//錯誤提示訊息
  redirectTo: ''//重定向
}
//產生user狀態的reducer
function user(preState = initUser, action) {
  // console.log('action', action);
  switch (action.type) {
    case AUTH_SUCCESS: // data是user
      const { type, header } = action.data
      return {/*  ...preState, */ ...action.data, redirectTo: getRedirectTo(type, header) }

    case ERROR_MSG: // data是msg
      return { ...preState, msg: action.data }

    case RECEIVE_USER: // data是user
      return action.data

    case RESET_USER: // data是msg
      return { ...initUser, msg: action.data }

    default:
      return preState
  }

}

const initUserList = []
//產生userlist狀態的reducer
function userList(preState = initUserList, action) {
  switch (action.type) {
    case RECEIVE_USER_LIST: //data為userList
      return action.data
    default:
      return preState
  }
}

const initChat = {
  users: {}, // 所有用戶信息的對象 屬性名: userid, 屬性值是: {username, header}
  chatMsgs: [], // 當前用戶所有相關msg的數組
  unReadCount: 0 // 總的未讀數量
}
//產生聊天狀態的reducer
function chat(preState = initChat, action) {
  switch (action.type) {
    case RECEIVE_MSG_LIST:// data: {users, chatMsgs}
      const { users, chatMsgs, userid:userid1 } = action.data  //😎  return時 要按照init的結構 『與下面解構重名』
      return {
        users,
        chatMsgs,
        unReadCount: chatMsgs.reduce((preTotal, msg) => preTotal+(!msg.read&&msg.to===userid1? 1:0) ,0)//😎 是未讀且傳給我的話就 +1
      }
    case RECEIVE_MSG:// data:{users, chatMsg}
      const { chatMsg, userid:userid2 } = action.data//😎  『與下面解構重名』
      return {
        users: preState.users,
        chatMsgs: [...preState.chatMsgs, chatMsg],//由於純函數, 只能產生一個新的 不能用push
        unReadCount: preState.unReadCount + (!chatMsg.read&&chatMsg.to===userid2? 1:0)//😎 是未讀且傳給我的話就 +1
      }
    case HAVE_READ:
      const { count, from, to } = action.data
      // preState.chatMsgs.forEach((msg) => {
      //   if(msg.from===from && msg.to===to && !msg.read){
      //     msg.read = true
      //   }
      // })
      return {
        users: preState.users,
        chatMsgs: preState.chatMsgs.map((msg) => {//由於純函數, 只能產生一個新的 不能用forEach直接改; 要用map產生新數據
          if ( msg.from===from && msg.to===to && !msg.read ) {// 需要更新 『!msg.read』👈『msg.read===false』
            return {...msg, read: true}// 不能直接改 要遍歷產生新的
          } else {// 不需更新
            return msg
          }
        }),
        unReadCount: preState.unReadCount - count
      }
    default:
      return preState;
  }
}

export default combineReducers({
  user,
  userList,
  chat
})
//向外暴露的狀態結構： { user:{}, userList:[], chat:{} }

