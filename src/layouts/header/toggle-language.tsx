import React from 'react'
import { useIntl, setLocale } from 'umi'
import { Menu, Dropdown } from 'antd'
import classNames from 'classnames'

import { event, LANG_CHANGE_EVENT } from '@@/plugin-locale/locale'

import styles from './style.less'

const langConfigMap = {
  'zh-CN': '中文简体',
  'en-US': 'English'
}

const ToggleLanguage: React.FC<{
  type?: 'normal' | 'header'
  className?: string
}> = ({ type = 'normal', className }) => {
  const intl = useIntl()

  const language = intl.locale as keyof typeof langConfigMap

  const changeLocale = (locale: any) => {
    setLocale(locale as string, false)
    // 当只有主应用时，使用 setLocale 无法触发 __LocaleContainer 组件重新渲染
    event.emit(LANG_CHANGE_EVENT, locale)
    window.localStorage.setItem('umi_locale', locale as string)

    if (window.location.href.indexOf('distributed-storage') > -1) {
      window.localStorage.setItem('LOCALE', locale.substr(0, 2) as string)
      window.location.reload()
    }
  }

  const langMenu = (
    <Menu selectedKeys={[language]} onClick={({ key }) => changeLocale(key)}>
      {Object.entries(langConfigMap).map(([key, value]) => (
        <Menu.Item key={key}>
          <div className={styles.menuItem}>
            <span>{value}</span>
            {language === key ? <img src={require('../../assets/checkmark.png')} /> : null}
          </div>
        </Menu.Item>
      ))}
    </Menu>
  )

  return (
    <Dropdown
      overlay={langMenu}
      getPopupContainer={triggerNode => (triggerNode?.parentNode as any) || document.body}
    >
      <div className={classNames(type === 'header' ? styles.dropdownToggleLanguageHeader : styles.dropdownToggleLanguage, className)}>
        <img src={type === 'header'? require('../../assets/globe-1.png') : require('../../assets/globe-2.png')} /> 
        <span className={styles.text}>{langConfigMap?.[language]}</span>
        <img src={type === 'header'? require('../../assets/arrow-ios-down1.png'): require('../../assets/arrow-ios-down.png')} />
      </div>
    </Dropdown>
  )
}

export default ToggleLanguage
