/* 
  包含n個action type名稱常量
*/

export const AUTH_SUCCESS = 'auth_success' //註冊/登入成功
export const ERROR_MSG = 'error_msg' //錯誤提示信息    請求前/請求後皆適用,所以沒取名為AUTH_FAILURE
export const RECEIVE_USER = 'receive_user' //接收用戶
export const RESET_USER = 'reset_user' //重置用戶
export const RECEIVE_USER_LIST = 'receive_user_list' //接收用戶列表
export const RECEIVE_MSG_LIST = 'receive_msg_list' //接收跟當前用戶的所有相關消息列表
export const RECEIVE_MSG = 'receive_msg' //接收一條消息
export const HAVE_READ = 'have_read' //已讀某個id的聊天訊息