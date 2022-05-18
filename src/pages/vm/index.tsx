
import React, { useState, useMemo } from 'react';
import { Button, Alert, Divider, message} from 'antd'
import { useIntl } from 'umi';
import SVG from 'react-inlinesvg';
import useAxios from '@/utils/useAxios';
import axios from "axios";
import * as _ from 'lodash';
import styles from './style.less';
import { createRdp, createSpiceVV, downloadFile } from '@/utils/connectFile';


const VMPage: React.FC = () => {
  const intl = useIntl()
  const [otherCount, setOtherCount] = useState(0)

  // 查询虚拟机
  const { response, refresh } = useAxios({
    url: 'vm-instances?q=type=UserVm&q=hypervisorType=KVM&sort=-createDate',
    method: 'GET',
    headers: {
      Authorization: `OAuth ${localStorage.sessionId}`
    }
  })

  const vmList = useMemo(() => {
    const list = _.get(response, 'inventories', [])
    const connectableList = _.filter(list, vm => vm.state === 'Running' || vm.state === 'Stopped')

    setOtherCount(list.length - connectableList.length)

    return connectableList
  }, [response])


  const getDefaultIp = (vm: any) => {
    const defaultL3NetworkUuid = vm?.defaultL3NetworkUuid
    const vmNics = vm?.vmNics || []
    const defaultNic = _.find(vmNics, { l3NetworkUuid: defaultL3NetworkUuid })

    return defaultNic?.ip || _.get(vmNics, ['0', 'ip'], '')
  }

  const start = async (vminstanceUuid: string, name: string) => {
    message.info(`${intl.formatMessage({
      id: 'start',
      defaultMessage: '启动'
    })}: ${name}`)

    await axios.request({
      baseURL: '/zstack/v1',
      url: `/vm-instances/${vminstanceUuid}/actions`,
      method: 'PUT',
      headers: { Authorization: `OAuth ${localStorage.sessionId}`},
      data: {
        startVmInstance: {}
      }
    })

    setTimeout(() => refresh(), 1000)
  }

  const stop = async (vminstanceUuid: string, name: string) => {
    message.info(`${intl.formatMessage({
      id: 'stop',
      defaultMessage: '停止'
    })}: ${name}`)

    await axios.request({
      baseURL: '/zstack/v1',
      url: `/vm-instances/${vminstanceUuid}/actions`,
      method: 'PUT', headers: { Authorization: `OAuth ${localStorage.sessionId}`},
      data: {
        stopVmInstance: {
          type: 'grace' // 优雅关机
        }
      }
    })

    setTimeout(() => refresh(), 1000)
  }

  const connect = async (vm: any, name: string) => {
    message.info(`${intl.formatMessage({
      id: 'connect',
      defaultMessage: '连接'
    })}: ${name}`)

    const vminstanceUuid: string = vm?.uuid
    const vmIp: string = _.get(vm, ['vmNics', '0', 'ip'], '')

    // 获取控制台地址
    const consoleResult = await axios.request({
      baseURL: '/zstack/v1',
      url: `/vm-instances/${vminstanceUuid}/console-addresses`,
      method: 'GET',
      headers: {
        Authorization: `OAuth ${localStorage.sessionId}`,
        'Content-Type': 'application/json',
        charset: 'UTF-8'
      }
    })

    // 获取USB重定向
    const usbRedirectResult = await axios.request({
      baseURL: '/zstack/v1',
      url: `/vm-instances/${vminstanceUuid}/usbredirect`,
      method: 'GET',
      headers: {
        Authorization: `OAuth ${localStorage.sessionId}`,
        'Content-Type': 'application/json',
        charset: 'UTF-8'
      }
    })

    // 获取RDP
    const rdpResult = await axios.request({
      baseURL: '/zstack/v1',
      url: `/vm-instances/${vminstanceUuid}/rdp`,
      method: 'GET',
      headers: {
        Authorization: `OAuth ${localStorage.sessionId}`,
        'Content-Type': 'application/json',
        charset: 'UTF-8'
      }
    })

    const usbRedirectEnable: boolean = _.get(usbRedirectResult, ['data', 'enable'], false)
    const rdpEnable: boolean = _.get(rdpResult, ['data', 'enable'], false)
    const protocol: string = _.get(consoleResult, ['data', 'protocol'], '')
    const hostIp: string = _.get(consoleResult, ['data', 'hostIp'], '')
    const port: number = _.get(consoleResult, ['data', 'port'])

    let vvFile = ''
    let fileType = ''
    if (rdpEnable) {
      vvFile = createRdp(vmIp, usbRedirectEnable)
    } else if (protocol === 'spice') {
      fileType = 'spice'
      vvFile = createSpiceVV(hostIp, port)
    } else {
      message.error(intl.formatMessage({
        id: 'console.connect.alert',
        defaultMessage: '当前控制台连接模式: VNC, 无法连接该云主机'
      }))
      return
    }

    if (fileType === 'rdp') {
      //  Rdp Type
      downloadFile('console.rdp', vvFile)
    } else if (fileType === 'spice') {
      //  Spice Type
      downloadFile('console.vv', vvFile)
    }
    
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.desktopContainer}>
        <div className={styles.title}>
          <span className={styles.text}>{
            intl.formatMessage({
              id: 'vm.title',
              defaultMessage: '云桌面终端'
            })
          }</span>
          <Button className={styles.button} icon={<img src={require('../../assets/refresh.png')} />} onClick={() => {
            refresh()
            message.info(intl.formatMessage({
              id: 'refresh',
              defaultMessage: '刷新'
            }))
          }}>
            <span className={styles.buttonText}>{
            intl.formatMessage({
              id: 'refresh',
              defaultMessage: '刷新'
            })
          }</span>
          </Button>
        </div>

        <div className={styles.description}>{
          intl.formatMessage({
            id: 'vdi.description',
            defaultMessage: '这是一段简介，这是一段简介，这是一段简介，这是一段简介，这是一段简介，这是一段简介，这是一段简介'
          })
        }
        </div>

        <Divider />

        {
          otherCount > 0 && 
          <Alert className={styles.alert} message={intl.formatMessage({
            id: 'vm.Alert',
            defaultMessage: '检测到存在已暂停/未知/停止/故障状态的主机，VDI 仅获取和展示运行中与停止状态的主机，如需连接其他状态主机，请至 ZStack Cloud 调整主机状态。（文本待定）'
          })} type="info" showIcon closable/>
        }

        { vmList?.length > 0 &&
        <div className={styles.vmList}>
          {
            vmList?.map(vm => 
              <div className={styles.vmCard}>
                <div className={styles.vmImage}>
                  <img src={require('../../assets/computer.png')}/>
                </div>
                <div className={styles.vmName}>{vm?.name}</div>
                <div className={styles.vmState}>
                  {<SVG src={vm?.state === 'Running' ? require('../../assets/state-running.svg') : require('../../assets/state-stop.svg')}/>}
                  {vm?.state === 'Running' ? intl.formatMessage({
                    id: 'state.Running',
                    defaultMessage: '运行中'
                  }) : intl.formatMessage({
                    id: 'state.Stopped',
                    defaultMessage: '已停止'
                  })}
                  <div className={styles.ipdivider} />
                  {getDefaultIp(vm)}
                </div>
                <div className={styles.divider}/>
                <div className={styles.action}>
                  <Button className={styles.actionButton} disabled={vm?.state !== 'Stopped'} onClick={() => start(vm?.uuid, vm?.name)}>
                    <SVG src={require('../../assets/start.svg')}/>
                    {intl.formatMessage({
                      id: 'start',
                      defaultMessage: '启动'
                    })}
                  </Button>
                  <Button className={styles.actionButton} disabled={vm?.state !== 'Running'} onClick={() => stop(vm?.uuid, vm?.name)}>
                    <SVG src={require('../../assets/stop.svg')}/>
                    {intl.formatMessage({
                    id: 'stop',
                    defaultMessage: '停止'
                  })}</Button>
                  <Button className={styles.actionButton} disabled={vm?.state !== 'Running'} onClick={() => connect(vm, vm?.name)}>
                    <SVG src={require('../../assets/connect.svg')}/>
                      {intl.formatMessage({
                      id: 'connect',
                      defaultMessage: '连接'
                    })}
                  </Button>
                  </div>
              </div>
            )
          }
        </div>
        }

        {(!vmList || vmList?.length <= 0) && <div className={styles.noData}>
          <img src={require('../../assets/nodata.png')} />
          <span className={styles.text}>{intl.formatMessage({
            id: 'noData',
            defaultMessage: '暂无数据'
          })}</span>
        </div> }
      </div>
    </div>
  );
}

export default VMPage
