/* 
  包含n個工具函數的模塊
*/

/* 
用戶主界面路由
  jobHunting: /jobhunting
  recruitment: /recruitment
用戶信息完善介面路由
  JobHuntingInfo: /jobhuntinginfo
  RecruitmentInfo: /recruitmentinfo
  
判斷是否已經完善信息? user.header是否有值
判斷用戶類型: user.type
*/
/* 
返回對應的路由路徑
*/
export function getRedirectTo(type, header){
  let path
  if (type === 'recruitment') {
    path = '/recruitment'
  } else {
    path = '/jobhunting'
  }
  if (!header) { //沒有值則返回信息完善介面的path
    path += 'info'
  }
  return path
}