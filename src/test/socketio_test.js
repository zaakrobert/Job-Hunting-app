import io from 'socket.io-client'

//連接服務器, 得到服務器的連接對象
const socket = io('ws://localhost:4000')
//綁定監聽, 接收服務器發送的消息
socket.on('receiveMsg', function (data) {
  console.log('客戶端接收服務器發送的消息', data);
})

//發送消息
socket.emit('sendMsg', {name: 'abc'})
console.log('客戶端向服務器發消息', {name: 'abc'});





// import io from 'socket.io-client'
// // 连接服务器, 得到代表连接的 socket 对象
// const socket = io('ws://localhost:4000')
// // 绑定'receiveMessage'的监听, 来接收服务器发送的消息
// socket.on('receiveMsg', function (data) {
//   console.log('浏览器端接收到消息:', data)
// })
// // 向服务器发送消息
// socket.emit('sendMsg', { name: 'Tom', date: Date.now() })
// console.log('浏览器端向服务器发送消息:', { name: 'TOM', date: Date.now() })