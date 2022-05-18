import React from 'react'
import Logo from './logo'
import ToggleLanguage from './toggle-language'
import User from './user'

import style from './style.less'


interface IProps {}


const Header: React.FC<IProps> = () => {

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
