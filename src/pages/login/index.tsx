import React, { useState, useMemo } from 'react'
import hash from 'hash.js'
import { Form, Button, Input, Alert } from 'antd'
import { useHistory, useIntl } from 'umi'
import * as _ from 'lodash'
import ToggleLanguage from '@/layouts/header/toggle-language'
import axios from "axios";
import style from './style.less'


interface IProps {
  location: Location
}

const { Item } = Form

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 24 }
}

const Login: (props: IProps) => JSX.Element = ({ location }) => {
  const intl = useIntl()
  const history = useHistory()
  const [form] = Form.useForm()

  const ErrorMessageMap = useMemo(
    () => ({
      cannotConnectToServer: intl.formatMessage({
        id: 'login.cannotConnectToServer',
        defaultMessage: '无法连接服务器，请联系管理员'
      }),
      maxSession: intl.formatMessage({
        id: 'login.maxSession',
        defaultMessage: '超出最大登录会话数'
      }),
      denyAccessError: intl.formatMessage({
        id: 'login.denyAccessError',
        defaultMessage: '当前IP已被限制访问登录'
      }),
      loginError: intl.formatMessage({
        id: 'login.loginError',
        defaultMessage: '用户名或密码错误，请重新输入'
      })
    }),
    [intl]
  )

  const handleErrorMessage = (e: any) => {
    // 应该先从localstorage里读一下当前语言设置,或者后端提供统一错误信息
    const lang = window.navigator.language.substr(0, 2)
    try {
      const reError = e?.response?.data?.error
      const errorMessages = reError?.messages
      const details = reError?.details || ''
      const { code } = reError
      if (code === 'ID.1000' || code === 'SYS.1006') {
        setAlertMessage(ErrorMessageMap.loginError)
      } else if (code === 'LOGIN_CONTROL.1004') {
        setAlertMessage(ErrorMessageMap.denyAccessError)
      } else if (code === 'ID.1006') {
        setAlertMessage(ErrorMessageMap.maxSession)
      } else if (e.networkError) {
        setAlertMessage(ErrorMessageMap.cannotConnectToServer)
      } else {
        setAlertMessage(
          (lang === 'zh' ? errorMessages?.message_cn : errorMessages?.message_en) || details
        )
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
    }
  }




  const [loginLoading, setLoginLoading] = useState(false)

  const loginSuccess = (res: any) => {
    setLoginLoading(false)
    localStorage.sessionId = res?.inventory?.uuid
    history.push('/vm')
  }

  const [alertMessage, setAlertMessage] = useState<string>()


  const submit = async () => {
    setLoginLoading(true)

    try {
      await form.validateFields()
      const values = form.getFieldsValue()
      const { username, password } = values

      localStorage.username = username

      const hashPassword = hash.sha512().update(password).digest('hex')

      const response = await axios
        .request({ baseURL: '/zstack/v1', url: '/accounts/login', method: 'PUT', data: {
          "logInByAccount": {
              "password": hashPassword,
              "accountName": username
          }
        }})

      loginSuccess(response?.data)
    } catch (e) {
      console.error(e)
      handleErrorMessage(e)
      setLoginLoading(false)
    }
  }


  const [timeStamp, setTimeStamp] = useState<number>(Date.now())


  return (
    <div className={style.outContainer}>
      <div className={style.container}>
        <ToggleLanguage className={style.header} />
        <div className={style.loginContainer}>
          <div className={style.companyInfo}>
            <div className={style.logoContainer}>
              <div className={style.imageBox}>
                <img alt="logo" src={require(`../../assets/logo.svg`)} />
              </div>
              <span className={style.logoTitle}>{
                intl.formatMessage({
                  id: 'loginTitle',
                  defaultMessage: '欢迎使用 ZStack VDI 管理平台'
                })
              }</span>
            </div>
            <div className={style.cube} />
            <div className={style.dot} />
          </div>
          <div className={style.login}>
            <Form
              {...layout}
              form={form}
              size="large"
              layout="vertical"
              initialValues={{
                remember: true
              }}
              onFinish={() => submit()}
              data-testid="form"
            >
              <div className={style.welcomeTitle}>
                {intl.formatMessage({ id: 'welcome.login', defaultMessage: '欢迎登录' })}
              </div>
     
              <Item
                name="username"
                validateFirst
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'login.field.usename.required',
                      defaultMessage: '请输入用户名'
                    })
                  }
                ]}
              >
                <Input
                  autoFocus
                  data-testid="username"
                  prefix={<img src={require('../../assets/person-fill.png')} />}
                />
              </Item>

              <Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'login.field.password.required',
                      defaultMessage: '请输入密码'
                    })
                  }
                ]}
              >
                <Input.Password
                  className={style.password}
                  data-testid="password"
                  prefix={<img src={require('../../assets/lock-fill.png')} />}
                />
              </Item>
              {alertMessage && (
                <Item>
                  <Alert type="error" message={alertMessage} />
                </Item>
              )}
              <Item>
                <Button
                  id="login"
                  size="large"
                  type="primary"
                  htmlType="submit"
                  disabled={loginLoading}
                  className={style.loginBtn}
                >
                  {intl.formatMessage({ id: 'login', defaultMessage: '登录' })}
                </Button>
              </Item>
            </Form>
          </div>
        </div>
        <div className={style.footer}>
          {intl.formatMessage({
            id: 'login.footer.browser.recommend',
            defaultMessage: '为了获取更好的产品体验，请使用Chrome 49，Firefox 52 及以上版本的浏览器'
          })}
        </div>
      </div>
    </div>
  )
}

export default Login
