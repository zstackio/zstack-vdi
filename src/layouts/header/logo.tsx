import React from 'react'
import { useIntl } from 'umi'

import style from './style.less'

interface IProps {}

const Summary: React.FC<IProps> = () => {
  const intl = useIntl()

  return (
    <div className={style.left}>
      <div className={style.imageBox}>
        <img
          className={style.logo}
          alt="logo"
          src={require('../../assets/logo-bar.png')}
        />
      </div>
      <span style={{ fontSize: 14 }}>{intl.formatMessage({ id: 'bannerTitle', defaultMessage: 'ZStack VDI 管理平台' })}</span>
    </div>
  )
}

export default Summary
