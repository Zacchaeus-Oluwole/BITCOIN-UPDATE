const electron = require('electron');
const path = require('path');
const url = require('url');
const BrowserWindow = electron.remote.BrowserWindow;
const axios = require('axios')
const ipc = electron.ipcRenderer

const notifyBtn = document.getElementById('notifyBtn')
var price = document.querySelector('h1')
var targetPrice = document.getElementById('targetPrice')

var targetPriceVal
const notification = {
    title: 'BTC Alert',
    body: 'BTC just beat your target price',
    icon: path.join(__dirname, '../assets/images/icon.png')
}

function getBTC(){
    axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=USD')
    .then(res => {
        const crytos = res.data.BTC.USD
        price.innerHTML = '$'+crytos.toLocaleString('en')

        if (targetPrice.innerHTML != '' && targetPriceVal < res.data.BTC.USD){
            const myNotification = new window.Notification(notification.title, notification)
        }
    })
}
getBTC()
setInterval(getBTC, 10000);

notifyBtn.addEventListener('click', createAddWindow)

function createAddWindow(){
    const modalPath = path.join('file://', __dirname, 'add.html')
    let addWindow = new BrowserWindow({
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        width:400,
        height:200,
        webPreferences:{
            nodeIntegration: true
        }
    })
    addWindow.on('close', function(){addWindow= null})
    addWindow.loadURL(modalPath)
    addWindow.show()
}

ipc.on('targetPriceVal', function( event, arg){
    targetPriceVal = Number(arg)
    targetPrice.innerHTML = '$'+targetPriceVal.toLocaleString('en')
})





