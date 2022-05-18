import React, { useRef, useState, useMemo } from 'react'
import { useIntl, history } from 'umi'
import { useBoolean } from 'ahooks'
import { Divider, Dropdown, Menu, Badge } from 'antd'
import axios from "axios";

import style from './style.less'

const { Item } = Menu

interface IProps {}

const useRoleAvatar = () => {
  return require('../../assets/admin2.png')
}

const User: React.FC<IProps> = () => {
  const intl = useIntl()
  const ref = useRef<HTMLDivElement>(null)
  const avatar = useRoleAvatar()

  const [timeDiffOver1min, { toggle }] = useBoolean(false)
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false)


  const _logOut = async () => {
    axios.request({ baseURL: '/zstack/v1', url: `/accounts/sessions/${localStorage.getItem('sessionId')}`, method: 'DELETE'})
    localStorage.removeItem('username')
    history.push('/login')
  }

  const menus = useMemo(
    () => (
      <Menu onClick={() => setDropdownVisible(false)}>
        <Item className={style.account}>
          <img alt="admin" src={avatar} />
          <span className={style.username}>{localStorage.username }</span>
        </Item>

        <Divider className={style.divider} />
        <Item
          onClick={() => _logOut()}
        >
          <img src={require('../../assets/log-out.png')} style={{marginRight: 4}}/>
          {intl.formatMessage({ id: 'logout', defaultMessage: '退出' })}
        </Item>
      </Menu>
    ),
    [
      _logOut,
      avatar,
      intl
    ]
  )

  return (
    <div className={style.user} ref={ref}>
      <Dropdown
        visible={dropdownVisible}
        onVisibleChange={visible => {
          setDropdownVisible(visible)
        }}
        overlay={menus}
        getPopupContainer={() => ref.current as HTMLDivElement}
        trigger={['click']}
        overlayClassName={style.dropdown}
      >
        <div className={`${style.avatar} ${dropdownVisible ? style.hover : ''}`}>
          <Badge dot={timeDiffOver1min} className={style.dot}>
            <img alt="admin" src={avatar} style={{ cursor: 'pointer' }} />
          </Badge>
          <span className={style.username}>{localStorage.username}</span>
        </div>
      </Dropdown>
    </div>
  )
}

export default User
