/* 
  個人資料路由組件
*/

import React from 'react'
import { Result, List, WhiteSpace, Button, Modal } from 'antd-mobile'
import { connect } from 'react-redux'
import Cookies from 'js-cookie'
import { resetUser } from '../../redux/actions'

const Item = List.Item
const Brief = Item.Brief

class Personal extends React.Component {

  logout = () => {
    Modal.alert('登出', '確定登出嗎？', [
      { text: '取消' },
      {
        text: '登出',
        onPress: () => {
          //清除cookie的userid
          Cookies.remove('userid')
          //清除redux管理的user
          this.props.resetUser()
        }
      }
    ])
  }

  render() {
    const { username, info, header, company, post, salary } = this.props.user
    return (
      <div style={{marginTop:'30px', marginBottom:'50px'}}>
        <Result img={<img src={require(`../../assets/images/${header}.png`)} style={{ width: 50 }}
          alt="header" />} title={username} message={company} />
        <List renderHeader={() => '相關信息'}>
          <Item multipleLine>
            <Brief>職位: {post}</Brief>
            <Brief>簡介: {info}</Brief>
            {salary ? <Brief>薪資: {salary}</Brief> : null}
          </Item>
        </List>
        <WhiteSpace />
        <List>
          <Button type='warning' onClick={this.logout}>退出登录</Button>
        </List>
      </div>)
  }
}

export default connect(
  state => ({ user: state.user }),
  {resetUser}
)(Personal)