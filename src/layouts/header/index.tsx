import React, { useMemo } from 'react'
import { history, useModel } from 'umi'
import { useMount, useUnmount, useUpdateEffect } from 'ahooks'

import Logo from './logo'


import User from './user'

import style from './style.less'
import ToggleLanguage from './toggle-language'

interface IProps {}

const useRedirectMainList = () => {

  const needRedirectPath = ['create', 'detail']
  // 处理 /create 前的路径无效导致白屏问题
  const needSecondBackPath = [
    '/cloud-monitoring/zwatch-alarm/resource/create',
    '/cloud-monitoring/zwatch-alarm/event/create',
    '/cloud-monitoring/zwatch-alarm/third-party/create'
  ]

}

const Header: React.FC<IProps> = () => {


  // 当前区域或项目发生变化时,如果处于详情页或者创建页,切换页面
  useRedirectMainList()

  return (
    <div className={style.container}>
      <Logo />

      <div className={style.right}>
        <ToggleLanguage type='header'/>
        <User />
      </div>
    </div>
  )
}

export default Header
