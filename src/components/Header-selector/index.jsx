/* 
  選擇用戶頭像的UI組件
*/

import React, { Component } from 'react'
import {
  List,
  Grid,
} from 'antd-mobile'
import PropTypes from 'prop-types'

export default class HeaderSelector extends Component {

  static propTypes = {
    setHeader: PropTypes.func.isRequired
  }

  constructor(props){
    super(props)
    this.headerList = []
    for (let i = 0; i < 20; i++) {
      this.headerList.push({
        text: '頭像'+(i+1),
        icon: require(`../../assets/images/頭像${i+1}.png`)
      })
    }
  }

  // state = { headerLogo: [] }

  // headerList = () => {
  //   const { headerLogo } = this.state
  //   const emptyarr = []

  //      for (let i = 0; i < 20; i++) {
  //       emptyarr.push({
  //         text: '頭像' + (i + 1),
  //         icon: require(`./images/頭像${i + 1}.png`)
  //       })
  //     }
    
  //   this.setState({ headerLogo:[...emptyarr]})
  //   return this.state.headerLogo
  // }

  // componentDidMount(){
  //   this.headerList()
  // }

  state = {
    icon: null //圖片對象, 默認是沒有值的
  }
  
  handleClick = ({text, icon}) => { //{text, icon} = el -> 是從antd的 Grid標籤上 解構出來的
    //更新當前組件狀態
    this.setState({icon})
    //調用函數更新父組件狀態
    this.props.setHeader(text)
  }

  render() {
    const {icon} = this.state
    const listHeader = !icon? '請選擇頭像': (
      <div>
        已選擇頭像: <img src={icon} alt='icon'/>
      </div>
    )
    return (
      <div>
        <List renderHeader={() => listHeader}>
          <Grid data={this.headerList}
                columnNum={5}
                onClick={this.handleClick} />
        </List>
      </div>
    )
  }
}
