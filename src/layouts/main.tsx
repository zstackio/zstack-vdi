import React from 'react'
import { Layout } from 'antd'
import cls from 'classnames'

import Header from './header'

import style from './style.less'


interface IProps {
  pathname: string
  children: React.ElementType
}

const MainLayout: React.FC<IProps> = ({ pathname, children }) => {
  console.log(pathname)
  
  return (
    <Layout className={style.mainLayout}>
      <Header />
      <div className={cls(style.mainContainer, 'ROOT_CONTAINER')}><>{children}</></div>
    </Layout>
  )
}

export default MainLayout
