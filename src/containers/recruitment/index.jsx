/* 
  招聘者主界面路由組件
*/
import React, { Component } from 'react'
import { connect } from 'react-redux'
import UserList from '../../components/User-list'
import { getUserList } from '../../redux/actions'

class Recruitment extends Component {

  componentDidMount(){
    //獲取userList
    this.props.getUserList('jobHunting')
  }

  render() {
    return (
      <UserList userList={this.props.userList} />
    )
  }
}
export default connect(
  state => ({userList: state.userList}),
  {getUserList}
)(Recruitment)