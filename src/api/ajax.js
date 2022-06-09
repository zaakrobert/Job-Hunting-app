/* 
  能發送ajax請求的函數模塊,函數的返回值是promise對象
*/

import axios from "axios"

export default function ajax( url, data = {}, type = 'GET' ) {// data 及 type 加上 默認值
// console.log(data);
  if (type === 'GET') { //發送GET請求
    // 拼請求參數串
    //{username: John, password: 123}
    //paramString: username=John&password=123
    let paramString = ''
    Object.keys(data).forEach(key => {
      paramString += key + '=' + data[key] + '&'
    })
    if(paramString){
      paramString = paramString.substring(0, paramString.length-1)
    }
    // 使用axios發get請求
    return axios.get( url + '?' + paramString )
  } else { //發送POST請求

    // 使用axios發post請求
    return axios.post( url, data )

  }
}