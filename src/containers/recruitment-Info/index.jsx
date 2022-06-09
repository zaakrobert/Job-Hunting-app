/* 
  老闆信息完善的路由容器組件
*/

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import {
  NavBar,
  InputItem,
  TextareaItem,
  Button
} from 'antd-mobile'
import HeaderSelector from '../../components/Header-selector'

import { updateUser } from '../../redux/actions'

class RecruitmentInfo extends Component {

  state = {
    header: '',
    post: '',
    info: '',
    company: '',
    salary: ''
  }

  //更新header狀態
  setHeader = (header) => {
    this.setState({
      header
    })
  }
  
  handleChange = (name , value) => {
    this.setState({
      [name]: value //加中括號就能變成變量
    })
  }

  save =() => {
    this.props.updateUser(this.state)
  }

  render() {
    //如果信息已經完善, 自動重定向到對應主界面
    const { header, type } = this.props.user
    if(header){ //說明信息已經完善 ＊＊＊需再修改 令每一個值都有輸入才進行保存, 而非只有header
      const path = type==='jobhunting' ? '/jobhunting' : '/recruitment'
      return <Redirect to={path} />
    }
    return (
      <div>
        <NavBar>老闆信息完善</NavBar>
        <HeaderSelector setHeader={this.setHeader}/>
        <InputItem placeholder='請輸入招聘職位' onChange={v=>this.handleChange('post', v)}>招聘職位：</InputItem>
        <InputItem placeholder='請輸入公司名稱' onChange={v=>this.handleChange('company', v)}>公司名稱：</InputItem>
        <InputItem placeholder='請輸入職位薪資' onChange={v=>this.handleChange('salary', v)}>職位薪資：</InputItem>
        <TextareaItem title='職位要求：'
                      rows={3} onChange={v=>this.handleChange('info', v)}/>
        <Button type='primary' onClick={this.save}>保&emsp;&emsp;存</Button>
      </div>
    )
  }
}

export default connect(
  state => ({user: state.user}),
  {updateUser}
)(RecruitmentInfo)