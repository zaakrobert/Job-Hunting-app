/* 
  顯示指定用戶列表的UI組件
*/
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom' //若非路由組件需要使用路由功能 this.props.history 就須引入 並在最下方默認暴露
import QueueAnim from 'rc-queue-anim'
import { WingBlank, /* WhiteSpace, */ Card } from 'antd-mobile'
const { Header, Body } = Card

class UserList extends Component {
  static propTypes = {
    userList: PropTypes.array.isRequired
  }
  render() {
    const { userList } = this.props
    return (
      <WingBlank style={{marginTop:'56px', marginBottom:'60px'}}>
        <QueueAnim  type='scale' delay={10}>
        {
          userList.map((user) => (
            <div key={user._id}>
              {user.header ?
                <Card style={{marginTop:'9px'}} onClick={() => {this.props.history.push(`/chat/${user._id}`)}}>
                  <Header thumb={require(`../../assets/images/${user.header}.png`)}
                    extra={user.username} />
                  <Body>
                    <div>職位: {user.post}</div>
                    {user.company ? <div>公司: {user.company}</div> : null}
                    {user.salary ? <div>薪資: {user.salary}</div> : null}
                    <div>描述: {user.info}</div>
                  </Body>
                </Card> : null
              }
            </div>
          )
          )
        }
        </QueueAnim>
      </WingBlank>
    )
  }
}

export default withRouter(UserList)