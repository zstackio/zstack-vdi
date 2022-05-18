export function downloadFile (name: string, contents: BlobPart, mimeType?: string) {
  mimeType = mimeType || 'text/plain'
  var blob = new window.Blob([contents], {
    type: mimeType
  })

  let dlink = document.createElement('a')
  dlink.download = name
  dlink.href = window.URL.createObjectURL(blob)
  document.body.appendChild(dlink)
  dlink.onclick = function (e) {
    // revokeObjectURL needs a delay to work properly
    let that = this
    setTimeout(function () {
      window.URL.revokeObjectURL(that?.href)
    }, 1500)
  }

  dlink.click()
  document.body.removeChild(dlink)
  dlink.remove()
}


export function createSpiceVV (hostIp: string, port: number) {
  let vvFile = `[virt-viewer]
type=spice
host=${hostIp}
port=${port}
delete-this-file=1
fullscreen=1
title=zstack-vdi
toggle-fullscreen=shift+f11
release-cursor=shift+f12
secure-attention=ctrl+alt+end
enable-smartcard=1
enable-usb-autoshare=1
usb-filter=-1,-1,-1,-1,0`
  return vvFile
}

export function createVNCVV (hostIp: string, port: number) {
  let vvFile = `[virt-viewer]
type=vnc
host=${hostIp}
port=${port}
delete-this-file=1
fullscreen=1
title=win10:%d
toggle-fullscreen=shift+f11
release-cursor=shift+f12
secure-attention=ctrl+alt+end`
  return vvFile
}

export function createRdp (vmIp: string, usbRedirect: boolean) {
  let vvFile = `screen mode id:i:2
use multimon:i:0
desktopwidth:i:1024
desktopheight:i:768
session bpp:i:32
winposstr:s:0,3,0,0,800,600
compression:i:0
keyboardhook:i:2
audiocapturemode:i:1
videoplaybackmode:i:1
connection type:i:6
networkautodetect:i:0
displayconnectionbar:i:0
disable wallpaper:i:0
allow font smoothing:i:1
allow desktop composition:i:1
disable full window drag:i:1
disable menu anims:i:1
disable themes:i:0
disable cursor setting:i:0
bitmapcachepersistenable:i:1
full address:s:${vmIp}
server port:i:3389
audiomode:i:0
redirectprinters:i:0
redirectcomports:i:0
redirectsmartcards:i:0
redirectclipboard:i:1
redirectposdevices:i:0
redirectdirectx:i:1
autoreconnection enabled:i:1
enablecredsspsupport:i:0
authentication level:i:2
prompt for credentials:i:0
negotiate security layer:i:1
remoteapplicationmode:i:0
alternate shell:s:
shell working directory:s:
gatewayhostname:s:
gatewayusagemethod:i:4
gatewaycredentialssource:i:4
gatewayprofileusagemethod:i:0
promptcredentialonce:i:0
use redirection server name:i:0
rdgiskdcproxy:i:0
kdcproxyname:s:
drivestoredirect:s:${usbRedirect ? 'DynamicDrives' : ''}
devicestoredirect:s:${usbRedirect ? '*' : ''}
usbdevicestoredirect:s:${usbRedirect ? '*' : ''}
username:s:
password:s:`
  return vvFile
}

