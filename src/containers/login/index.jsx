import React, { Component } from 'react'
import {
  NavBar,
  WingBlank,
  List,
  InputItem,
  WhiteSpace,
  Button
} from 'antd-mobile'
import Logo from '../../components/Logo'

import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { login } from '../../redux/actions'

//註冊路由組件
class Login extends Component {

  state = {
    username: '', //帳號
    password: '', //密碼
  }

  login = () => {
    // console.log(this.state);
    this.props.login(this.state)
  }
  //處理輸入數據的改變： 更新對應的狀態
  handleChange = (name, val) => {
    this.setState({
      [name]: val //加中括號就能變成變量
    })
    // console.log(this.state);
  }
  toRegister = () => {
    this.props.history.replace('/register')
  }

  render() {

    const { msg, redirectTo } = this.props.user
    //如果redirectTo有值,就需要重定向到指定的路由, 判斷有值則直接重定向, 不會往下執行
    if (redirectTo) {
      return <Redirect to={redirectTo} />
    }

    return (
      <div>
        <NavBar>Weneedu</NavBar>
        <Logo />
        <WingBlank>
          <List>
            {msg ? <div className='error-msg'>{msg}</div> : null}
            <WhiteSpace />
            <InputItem onChange={val => { this.handleChange('username', val) }} placeholder='請輸入帳號'>帳&emsp;號：</InputItem>
            <WhiteSpace />
            <InputItem onChange={val => { this.handleChange('password', val) }} placeholder='請輸入密碼' type='password'>密&emsp;碼：</InputItem>
            <WhiteSpace />
            <Button type='primary' onClick={this.login}>登&emsp;&emsp;入</Button>
            <WhiteSpace />
            <Button onClick={this.toRegister}>註冊帳戶</Button>
          </List>
        </WingBlank>
      </div>
    )
  }
}

export default connect(
  state => ({ user: state.user }),
  { login }
)(Login)