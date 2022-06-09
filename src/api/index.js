/* 
  包含n個接口請求的函數模塊, 函數返回值為：promise
*/

import ajax from './ajax'

//註冊接口
export const reqRegister = (user) => ajax('/register', user, 'POST')
//登入接口
export const reqLogin = ({username, password}) => ajax('/login', {username, password},'POST')
//更新用戶接口
export const reqUpdateUser = (user) => ajax('/update', user, 'POST')
//獲取用戶信息
export const reqUser = () => ajax('/user')
//獲取用戶列表
export const reqUserList = (type) => ajax('/userlist', {type})

//獲取當前用戶的聊天消息列表
export const reqChatMsgList = () => ajax('/msglist')
//修改指定消息為已讀
export const reqReadMsg = (from) => ajax('/readmsg', {from}, 'POST')