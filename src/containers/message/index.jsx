/* 
  消息界面路由組件
*/
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { List, Badge } from 'antd-mobile'
import QueueAnim from 'rc-queue-anim'

const Item = List.Item
const Brief = Item.Brief

class Message extends Component {

  /* 
    對chatMsgs 按照 chat_id 進行分組, 並得到每個組的lastMsg組成的數組
      1. 找出每個聊天的lastMsg, 並用一個對象容器來保存 {chat_id: lastMsg}
      2. 得到所有lastMsg的數組
      3. 對數組進行排序(按照 create_time 降序)
   */
  getLastMsgs = (chatMsgs, userid) => {// " chatMsgs " ---> 即是 當前使用者 跟所有人的聊天列表
    // 1. 找出每個聊天的lastMsg, 並用一個對象容器來保存 {chat_id, lastMsg}
    const lastMsgObjs = {} // ---> 與每個人的最後聊天 id對象 列表
    chatMsgs.forEach(msg => { // ---> msg為每一條的聊天

      //😎 對msg進行個體的統計
      if (msg.to===userid && !msg.read) {// 判斷達成 是對方發來給使用者的 以及 消息未讀的
        msg.unReadCount = 1
      } else {
        msg.unReadCount = 0
      }

      const chatId = msg.chat_id//得到msg的聊天標示id // ---> 獲取單一聊天的chat_id
      let lastMsg = lastMsgObjs[chatId]//獲取以保存的 當前組件的lastMsg ---> 消息列表{chatId1: A_B}
      //(下面判斷與每個聊天只存儲一次並且為最新的聊天)
      if (!lastMsg) {//沒有     ---> 第一條 A_B 的聊天就被保存進去
        lastMsgObjs[chatId] = msg//當前msg就是所在組的lastMsg
      } else {//有           // ---> 若非第一條 A_B 聊天

            //😎 累加unReadCount = 已統計的未讀 + 當前msg的未讀
            const unReadCount = lastMsg.unReadCount + msg.unReadCount
        //如果msg比last晚, 就將msg保存為lastMsg
        if (msg.create_time > lastMsg.create_time) { // ---> 則與原本的比較誰較新 將新的 A_B 聊天記錄保存進去
          lastMsgObjs[chatId] = msg // ---> 保存進去 有覆寫 蓋過去 的感覺
        }
            //😎 將unReadCount保存在最新的lastMsg上
            lastMsgObjs[chatId].unReadCount = unReadCount
      }
    });
    // 2. 得到所有lastMsg的數組[], 因原本是對象{}
    const lastMsgs = Object.values(lastMsgObjs)

    // 3. 對數組進行排序(按照 create_time 降序)
    lastMsgs.sort((m1, m2) => {//   若結果<0, 將m1放在前面,    若結果為0, 不變,    若結果>0, m2在前
      return m2.create_time - m1.create_time
    })

    return lastMsgs
  }

  render() {

    const { user } = this.props
    const { users, chatMsgs } = this.props.chat

    //對chatMsgs 按照 chat_id 進行分組
    const lastMsgs = this.getLastMsgs(chatMsgs, user._id)

    return (
      <List style={{ marginTop: '50px', marginBottom: '50px' }}>
        <QueueAnim type='scale'>

        {
          // lastMsgs.map(msg => (
          //   <Item key={msg._id}
          //         extra={<Badge text={0} />}
          //         thumb={msg.header? require(`../../assets/images/${msg.header}.png`) : null}
          //         arrow='horizontal'>
          //     {msg.content}
          //     <Brief>{users[msg.to===user._id?msg.from:msg.to].username}</Brief>//亦即當前最新消息若等於發送者那即是發送者名稱,若否則反
          //   </Item>
          // ))
          lastMsgs.map((msg) => {//用大括弧的話, 在return 前就能寫js表達式

            const targetUserId = msg.to === user._id ? msg.from : msg.to//獲取對方的id ---> 當前信息是否是自己傳 是則拿from id : 否則拿to id 
            const targetUser = users[targetUserId]//得到目標用戶的信息 ---> 拿對方的 id去取得資訊 ⬇️ 下方欲取頭像資訊

            // const targetUser = msg.to === user._id ? users[msg.from] : users[msg.to]

            return (
              <Item key={msg._id}
                extra={<Badge text={msg.unReadCount} />}
                thumb={targetUser.header ? require(`../../assets/images/${targetUser.header}.png`) : null}
                arrow='horizontal'
                onClick={() => this.props.history.push(`/chat/${targetUserId}`)}>
                {msg.content}
                <Brief>{targetUser.username}</Brief>{/* 亦即當前最新消息若等於發送者那即是發送者名稱,若否則反 */}
              </Item>
            )
          })
        }
        </QueueAnim>
      </List>
    )
  }
}
export default connect(
  state => ({ user: state.user, chat: state.chat }),
  {}
)(Message)