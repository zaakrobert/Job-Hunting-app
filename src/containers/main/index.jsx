import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import Cookies from 'js-cookie' //可以操作前端cookie的對象 set()/get()/remove()
import { NavBar } from 'antd-mobile'

import RecruitmentInfo from '../recruitment-Info'
import JobHuntingInfo from '../jobHunting-Info'
import Recruitment from '../recruitment'
import JobHunting from '../jobHunting'
import Message from '../message'
import Personal from '../personal'
import NotFound from '../../components/Not-found'
import NavFooter from '../../components/Nav-footer'
import Chat from '../chat'

import { getRedirectTo } from '../../utils'
import { getUser } from '../../redux/actions'

//主界面路由組件
class Main extends Component {

  //給組件對象添加屬性   // navlist -> 給組件對象添加屬性, static navlist -> 給組件類添加屬性
  navList = [//包含所有導航組件的相關信息數據
    {
      path: '/recruitment', // 路由路徑
      component: Recruitment,
      title: '求職者列表',
      icon: 'jobhunting',
      text: '招聘',
    }, {
      path: '/jobhunting', // 路由路徑
      component: JobHunting,
      title: '招聘公司列表',
      icon: 'recruitment',
      text: '求職',
    },
    {
      path: '/message', // 路由路徑
      component: Message,
      title: '消息列表',
      icon: 'message',
      text: '消息',
    }, {
      path: '/personal', // 路由路徑
      component: Personal,
      title: '個人資料',
      icon: 'personal',
      text: '個人',
    }
  ]

  componentDidMount() {
    //如果 cookie 中有 userid, 但瀏覽器重開(redux管理user中沒有_id) 則發請求獲取對應的 user
    const userid = Cookies.get('userid')
    const { _id } = this.props.user
    if (userid && !_id) {
      //發送異步請求, 獲取user
      // console.log('發送ajax請求 獲取user');
      this.props.getUser()
    }
  }

  render() {
    // console.log('this.props', this.props);
    //讀取cookie中的userid
    const userid = Cookies.get('userid')
    //如果沒有, 自動重定向到登入頁面
    if (!userid) {
      return <Redirect to='/login' />// --------> 若沒有cookie就去登入頁面
    }
    //如果有, 讀取 redux 中的 user 狀態
    const { user, unReadCount } = this.props
    //如果user沒有_id, 返回null(不做任何顯示)
    // debugger
    if (!user._id) {//                 --------> 若cookie裡沒有userid值就不做任何事,接著再由componentDidMount去後端拿資料
      return null
    } else {//                         --------> 若cookie裡有userid, 則往下判斷
      //如果user有 _id, 顯示對應的介面
      //如果請求根路徑'/', 根據user的type和header來計算出一個重定向的路由路徑, 並自動重定向
      let path = this.props.location.pathname
      if (path === '/') {//                --------> 判斷是否是 招聘者/求職者
        path = getRedirectTo(user.type, user.header)
        return <Redirect to={path} />
      }
    }

    const { navList } = this
    const path = this.props.location.pathname
    const currentNav = navList.find(nav => nav.path === path) //得到當前的nav, 可能沒有

    if (currentNav) {
      //決定哪個路由用戶需要隱藏
      if (user.type==='recruitment') {
        //隱藏數組第二個
        navList[1].hide = true
      } else {
        //隱藏數組第一個
        navList[0].hide = true
      }
      // navList = navList.filter(nav => !nav.hide)//從Navfooter改寫到這邊會出錯,出現找不到頁面
    }

    return (
      <div>
        {currentNav ? <NavBar className='sticky-header'>{currentNav.title}</NavBar> : null}
        <Switch>
          {
            navList.map(nav => <Route key={nav.path} path={nav.path} component={nav.component} />)
          }
          <Route path='/recruitmentinfo' component={RecruitmentInfo} />
          <Route path='/jobhuntinginfo' component={JobHuntingInfo} />
          <Route path='/chat/:userid' component={Chat} />
          <Route component={NotFound} />
        </Switch>
        {currentNav ? <NavFooter navList={navList} unReadCount={unReadCount} /> : null}
      </div>
    )
  }
}

export default connect(
  state => ({ user: state.user, unReadCount: state.chat.unReadCount }),
  { getUser }
)(Main)

/* 
1. 實現自動登入:
  1). 如果 cookie 中有 userid, 但瀏覽器重開(redux管理user中沒有_id) 則發請求獲取對應的 user
  2). 如果 cookie 中沒有 userid, 自動進入 login 介面
2. 如果已經登入, 又直接請求根路徑'/'
  1). 根據 user 的 type 和 header 來計算出一個重定向的路徑, 並自動重定向
*/