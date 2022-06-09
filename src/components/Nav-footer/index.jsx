import React, { Component } from 'react'
import { TabBar } from 'antd-mobile'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

const Item = TabBar.Item


class NavFooter extends Component {

  static propTypes = {
    navList: PropTypes.array.isRequired,
    unReadCount: PropTypes.number.isRequired
  }

  render() {
    let { navList, unReadCount } = this.props
    // console.log("navList",navList);
    navList = navList.filter(nav => !nav.hide)
    const currentPath = this.props.location.pathname   //原本需路由組件才有此用法
    //想在非路由組件使用 路由api  ---> 使用 withRouter() 從 'react-router-dom'
    console.log('unReadCount', unReadCount);
    return (
      <TabBar>
        {
          navList.map((nav) => (
            <Item key={nav.path}
                  badge={ nav.path==='/message' ? unReadCount : 0 }
                  title={nav.text}
                  icon={{ uri: require(`./images/${nav.icon}.png`) }}
                  selectedIcon={{ uri: require(`./images/${nav.icon}-selected.png`) }}
                  selected={currentPath === nav.path}
                  onPress={() => this.props.history.replace(nav.path)} />
          ))
        }
      </TabBar>
    )
  }
}

//向外暴露 withRouter()包裝產生的組件
//內部會向組件中傳入一些路由組件特有的屬性: history / location / math 
export default withRouter(NavFooter)