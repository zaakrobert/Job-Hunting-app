import React, { Component } from 'react'
import {
  NavBar,
  WingBlank,
  List,
  InputItem,
  WhiteSpace,
  Radio,
  Button
} from 'antd-mobile'

import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { register } from '../../redux/actions'

import Logo from '../../components/Logo'

const ListItem = List.Item

//註冊路由組件
class Register extends Component {

  state = {
    username:'', //帳號
    password:'', //密碼
    password2:'', //驗證碼
    type:'jobHunting' //用戶類型
  }
  //點擊註冊調用
  register = () => {
    // console.log(this.state);
    this.props.register(this.state)//此register方法是從下面connect傳進來的
  }
  //處理輸入數據的改變： 更新對應的狀態
  handleChange = (name, val) => {
    this.setState({
      [name]:val //加中括號就能變成變量
    })
  }
  toLogin = () => {
    this.props.history.replace('/login')
  }

  render() {
    // console.log('HERE:',this.state);
    const { type }= this.state
    const { msg, redirectTo } = this.props.user

    //如果redirectTo有值,就需要重定向到指定的路由, 判斷有值則直接重定向, 不會往下執行
    if (redirectTo) {
      return <Redirect to={redirectTo}/>
    }

    return (
      <div>
        <NavBar>Weneedu</NavBar>
        <Logo />
        <WingBlank>
          <List>
            {msg? <div className='error-msg'>{msg}</div> : null}
            <WhiteSpace />
            <InputItem onChange={val => {this.handleChange('username', val)}} placeholder='請輸入帳號'>帳&emsp;&emsp;號：</InputItem>
            <WhiteSpace />
            <InputItem onChange={val => {this.handleChange('password', val)}} placeholder='請輸入密碼' type='password'>密&emsp;&emsp;碼：</InputItem>
            <WhiteSpace />
            <InputItem onChange={val => {this.handleChange('password2', val)}} placeholder='請再次輸入密碼' type='password'>密碼確認：</InputItem>
            <WhiteSpace />
            <ListItem>
              <span>用戶類型：</span>
              &emsp;
              <Radio checked={type==='jobHunting'} onChange={() => this.handleChange('type', 'jobHunting')}>求職</Radio>
              &emsp;
              <Radio checked={type==='recruitment'} onChange={() => this.handleChange('type', 'recruitment')}>招聘</Radio>
            </ListItem>
            <WhiteSpace />
            <Button type='primary' onClick={this.register}>註&emsp;&emsp;冊</Button>
            <WhiteSpace />
            <Button onClick={this.toLogin}>已有帳戶</Button>
          </List>
        </WingBlank>
      </div>
    )
  }
}

export default connect(
  state => ({user: state.user}),//後台傳過來的 狀態
  {register}//action傳過來的 操作狀態的方法 使用縮寫{register:register}
)(Register)