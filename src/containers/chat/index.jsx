import React, { Component } from 'react'
import { connect } from 'react-redux'
import { sendMsg, readMsg } from '../../redux/actions'
import QueueAnim from 'rc-queue-anim'
import { NavBar, List, InputItem, Grid, Icon } from 'antd-mobile'
const { Item } = List

class Chat extends Component {

  state = {
    content: '',
    emojiShow: false // 是否顯示表情列表
  }

  //在第一次render()之前回調
  constructor(props) {
    super(props)
    //初始化表情列表數據
    const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘',
     '😗', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😶‍🌫️',
      '😏', '😒', '🙄', '😬', '😮‍💨', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶',
       '🥴', '😵', '😵‍💫', '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐', '😕', '😟', '🙁', '😮', '😯', '😲', '😳', '🥺', '😦',
        '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬']
    this.emojis = emojis.map(emoji => ({ text: emoji }))
  }
  toggleEmoji = () => {
    const emojiShow = !this.state.emojiShow
    this.setState({ emojiShow })
    if (emojiShow) {
      //異步手動派發resize事件, 解決表情列表顯示的bug
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'))
      }, 0)
    }
  }

  componentDidMount() {
    window.scrollTo(0, document.body.scrollHeight)
  }
  componentDidUpdate() {
    window.scrollTo(0, document.body.scrollHeight)
  }
  componentWillUnmount(){
    //發請求更新 訊息的未讀狀態
    const targetId = this.props.match.params.userid
    const myId = this.props.user._id
    this.props.readMsg(targetId, myId)
  }

  handleSend = () => {
    //收集數據
    const from = this.props.user._id//從Redux中取自己的信息
    const to = this.props.match.params.userid// userid 是從main的路由指定 path='/chat/:userid'來的
    const content = this.state.content.trim()// trim() 去掉字串中的空格
    //發送請求(發消息)
    if (content) { //先判斷有值;   這邊要使用異步請求
      this.props.sendMsg({ from, to, content })//傳三個數據 因此sendMsg()要寫對象
    }
    //發完消息後要清除數據
    this.setState({
      content: '',//還要去下方的input清空輸入匡
      emojiShow: false
    })
  }

  render() {
    const { user } = this.props
    const { users, chatMsgs } = this.props.chat

    //計算當前聊天的chatId
    const myId = user._id
    if (!users[myId]) { //如果還沒獲取數據, 則不做任何顯示
      return null
    }
    const targetId = this.props.match.params.userid
    const chatId = [myId, targetId].sort().join('_')
    //對chatMsgs進行過濾
    const currentMsg = chatMsgs.filter(msg => msg.chat_id === chatId)

    //得到目標用戶的header圖片對象
    const targetHeader = users[targetId].header
    const targetIcon = targetHeader ? require(`../../assets/images/${targetHeader}.png`) : null

    return (
      <div id='chat-page'>
        <NavBar icon={<Icon type='left' />}
                onLeftClick={() => this.props.history.goBack()}
                className='sticky-header'>
          {users[targetId].username}
        </NavBar>
        <List style={{ marginTop: '50px', marginBottom: '50px' }}>
          <QueueAnim type='left' delay={10}>
          {
            currentMsg.map(msg => {
              if (myId === msg.to) {// 對方發給我的
                return (
                  <Item key={msg._id} thumb={targetIcon}>
                    {msg.content}
                  </Item>
                )
              } else {//我發給對方的
                return (
                  <Item key={msg._id} className='chat-me' extra={user.username}>
                    {msg.content}
                  </Item>
                )
              }
            })
          }
          </QueueAnim>
        </List>
        <div className='am-tab-bar'>
          <InputItem placeholder="請輸入 . . ."
            value={this.state.content}//handleSend()只有清空狀態中的content, 必須靠value 才能清空
            onChange={v => this.setState({ content: v })}
            onFocus={() => this.setState({ emojiShow: false })}
            extra={
              <span>
                <span onClick={this.toggleEmoji} style={{ marginRight: '6px' }} role='img' aria-label='Emojis'>😀</span>
                <span onClick={this.handleSend}>傳送</span>
              </span>
            } />
          {this.state.emojiShow ? (
            <Grid data={this.emojis}
              columnNum={8}
              carouselMaxRow={4}
              isCarousel={true}
              className='emojiResize'
              onClick={(item) => {
                this.setState({ content: this.state.content + item.text })
              }} />
          ) : null}
        </div>
      </div>
    )
  }
}
export default connect(
  state => ({ user: state.user, chat: state.chat }),
  { sendMsg,
    readMsg }
)(Chat)