const electron = require('electron')
const url = require('url')
const path = require('path')

const { app, BrowserWindow } = electron

app.on('ready', () => {
  const mainWindow = new BrowserWindow({ 
    // frame: false,
    icon: __dirname + '/Bluetooth.ico',
    // fullscreen: true
    autoHideMenuBar: true,

    width: 1000, 
    height: 440
  })

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
})