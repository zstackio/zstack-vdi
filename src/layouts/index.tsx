import React, { useState } from 'react'
import { Redirect } from 'umi'
import MainLayout from './main'

interface IProps {
  children: React.ElementType
  location: Location
}

const RenderPage: React.FC<IProps> = ({ children, location }) => {
  if (location.pathname === '/') {
    return <Redirect to="/login" />
  }

  if (location.pathname.indexOf('/login') >= 0) {
    return <>{children}</>
  }

  return <MainLayout pathname={location.pathname}>{children}</MainLayout>
}

const BasicLayout: React.FC<IProps> = props => {

  return (
    <RenderPage {...props} />
  )
}

export default BasicLayout
