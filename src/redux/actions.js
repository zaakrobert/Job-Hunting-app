/* 
  包含n個action creator
  異步action
  同步action
*/
import io from 'socket.io-client'
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
import {
  reqRegister,
  reqLogin,
  reqUpdateUser,
  reqUser,
  reqUserList,
  reqChatMsgList,
  reqReadMsg
} from '../api'

/* 
單例對象
1. 創建對象之前: 判斷對象是否已經存在, 若不存在時才去創建
2. 創建對象之後: 保存對象 -> 要保存在哪？ 1. 函數的外部(全局)  2. 保存在某一對象內
*/
function initIO(dispatch, userid) {                                             // initIO 需被調多次

// 1. 創建對象之前: 判斷對象是否已經存在, 若不存在時才去創建
  if (!io.socket) {//將socket保存在io內
    //連接服務器, 得到服務器的連接對象
    io.socket = io('ws://localhost:4000')//2. 創建對象之後: 保存對象 //若沒另外寫initIO就會每次調用sendMsg action每次都const socket=io('ws://localhost:4000')
    //綁定監聽, 接收服務器發送的消息
    io.socket.on('receiveMsg', function (chatMsg) {
      console.log('客戶端接收服務器發送的消息', chatMsg);
      // 只有當chatMsg是與當前用戶相關的消息, 才去分發同步action保存消息
      if (userid===chatMsg.from || userid===chatMsg.to) {//收到消息 和 發送消息 的人都更新訊息
        dispatch(receiveMsg(chatMsg, userid))
      }  
    })
  }

  /* //連接服務器, 得到服務器的連接對象
  const socket = io('ws://localhost:4000')                      // 但須保證socket對象只創建一個
  //綁定監聽, 接收服務器發送的消息
  socket.on('receiveMsg', function (data) {
    console.log('客戶端接收服務器發送的消息', data);
  }) */
}

// 異步獲取消息列表數據 ---> 在成功 註冊、登入、獲取用戶 之後
async function getMsgList(dispatch, userid) {//  <--------------------------這裡 這裡 這裡
  initIO(dispatch, userid)//放這邊的話就是用戶成功登入就去初始化
  const response = await reqChatMsgList()
  const result = response.data
  if (result.code===0) {
    const { users, chatMsgs } = result.data
    //分發同步action
    dispatch(receiveMsgList( { users, chatMsgs, userid } ))//這裡會缺 dispatch() 因此要當參數傳入 上面
  }
}

//發送消息的異步action
export const sendMsg = ({ from, to, content }) => {
  return dispatch => {
    console.log('客戶端向服務器發送消息', { from, to, content });
    // initIO()//----------------------------------------->>>>> 這樣即便調用多次也不會重複創建多個socket  //最後改寫到getMsgList內
    //發消息
    io.socket.emit('sendMsg', { from, to, content })
  }
}

//讀取訊息的異步action (未讀 -> 已讀)
export const readMsg = (targetId, myId) => {
  return async dispatch => {
    const response = await reqReadMsg(targetId)
    const result = response.data
    if (result.code===0) {
      const count = result.data
      const from = targetId
      const to = myId
      dispatch(haveRead({count, from, to}))
    }
  }
}



//授權成功的同步action
const authSuccess = (user) => ({ type: AUTH_SUCCESS, data: user })
//錯誤提示信息的同步action
const errorMsg = (msg) => ({ type: ERROR_MSG, data: msg })
//接收用戶的同步action
const receiveUser = (user) => ({ type: RECEIVE_USER, data: user })
//重置用戶的同步action
export const resetUser = (msg) => ({ type: RESET_USER, data: msg })
//接受用戶列表的同步action
const receiveUserList = (userList) => ({ type: RECEIVE_USER_LIST, data: userList })
//接收消息列表的同步action
const receiveMsgList = ({ users, chatMsgs, userid }) => ({ type: RECEIVE_MSG_LIST, data: { users, chatMsgs, userid } })
//接收一個消息的同步action
const receiveMsg = (chatMsg, userid) => ({type: RECEIVE_MSG, data: { chatMsg, userid }})
//讀取與某id聊天訊息的同步action
const haveRead = ({count, from, to}) => ({type: HAVE_READ, data: {count, from, to}})


//註冊異步action       + getMsgList()
export const register = (user) => {

  const { username, password, password2, type } = user

  //表單的前台檢查, 如果不通過, 分發一個errorMsg的同步action
  if (!username) {
    return errorMsg('帳號不能為空！')
  } else if (password !== password2) {//在此判斷為同步action部分
    return errorMsg('兩次密碼需一致！')
  }
  //表單數據合法, 返回一個發ajax請求的異步action函數
  return async dispatch => {
    //發送註冊的異步ajax請求
    const response = await reqRegister({ username, password, type }) //返回的為promise對象; 原本直接傳reqRegister(user) 會包含到password2,由20行解構

    /* const promise = reqRegister(user)
    promise.then(response => {
      const result = response.data // {code: 0/1, data: user, msg: ''}
    }) */

    const result = response.data
    // console.log('result', result);
    if (result.code === 0) {//success
      getMsgList(dispatch, result.data._id)
      //分發授權成功的同步action
      dispatch(authSuccess(result.data))
    } else {//failure
      //分發錯誤提示信息的同步action
      dispatch(errorMsg(result.msg))
    }
  }
}

//登入異步action       + getMsgList()
export const login = (user) => {

  const { username, password } = user

  //表單的前台檢查, 如果不通過, 分發一個errorMsg的同步action
  if (!username) {
    return errorMsg('帳號不能為空！')
  } else if (!password) {
    return errorMsg('密碼不能為空！')
  }
  //表單數據合法, 返回一個發ajax請求的異步action函數
  return async dispatch => {
    //發送註冊的異步ajax請求
    const response = await reqLogin({ username, password }) //返回的為promise對象

    /* const promise = reqRegister(user)
    promise.then(response => {
      const result = response.data // {code: 0/1, data: user, msg: ''}
    }) */

    const result = response.data//result -> {code:?, data:?}

    if (result.code === 0) {//success
      getMsgList(dispatch, result.data._id)
      //分發授權成功的同步action
      // console.log(result.data);
      dispatch(authSuccess(result.data))//result.data -> {header, info, post, type, username, _id}
    } else {//failure
      //分發錯誤提示信息的同步action
      dispatch(errorMsg(result.msg))
    }
  }
}

//更新用戶異步action
export const updateUser = (user) => {
  return async dispatch => {
    const response = await reqUpdateUser(user)
    const result = response.data
    if (result.code === 0) { //更新成功: data
      dispatch(receiveUser(result.data))
    } else { //更新失敗: msg
      dispatch(resetUser(result.msg))
    }
  }
}

//獲取用戶異步action       + getMsgList()
export const getUser = () => {
  return async dispatch => {
    //執行異步ajax請求
    const response = await reqUser()
    const result = response.data
    if (result.code === 0) { //成功
      getMsgList(dispatch, result.data._id)
      dispatch(receiveUser(result.data))
    } else { //失敗
      dispatch(resetUser(result.msg))
    }
  }
}

//獲取用戶列表的異步action
export const getUserList = (type) => {
  return async dispatch => {
    //執行異步ajax請求
    const response = await reqUserList(type)
    const result = response.data
    //得到結果後, 分發一個同步action
    if (result.code === 0) {
      dispatch(receiveUserList(result.data))
    }
  }
}