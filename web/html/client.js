console.log("Client script running!")
infoPane = document.getElementById("infoPane")
collectButton = document.getElementById("collectButton")
collectionButtonReleased = true
systemLogArea = document.getElementById("systemLogArea")

function pushInfo(msg) {
    htmlContent =  "<div id=\"infoCard\">"
    htmlContent += '<img class=\"userIcon\" src=\"' + msg.image + '\">'
    htmlContent += "<h4>" + msg.time + "</h4>"
    htmlContent += "<p>" + msg.fulltext + "</p>"
    htmlContent += "</div>"
    // append content to html
    infoPane.innerHTML += htmlContent
}

function clearInfo(){
    infoPane.innerHTML = ""
}

function updateInfoPane(data){
    for (var key in data){
        //console.log(returnData[key])
        pushInfo(data[key])
    }
    infoPane.scrollTop = infoPane.scrollHeight
}

function updateSystemLog(data){
    let date = new Date()
    systemLogArea.value += "[" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "]  \t" + data + "\n"
    systemLogArea.scrollTop = systemLogArea.scrollHeight
}

function clearSystemLog(){
    systemLogArea.value = ""
}

//Button handlers!

function collectDataButton(){
    console.log("Collect Data Button!")
    // init request data obj
    let data = {
        'on': true
    }
    if(collectionButtonReleased){
        collectButton.style.background = '#fc9088'
        updateSystemLog("Collecting data....")
        collectButton.innerHTML = '<h5>STOP</h5>'
        collectionButtonReleased = false
    }else{
        collectButton.style.background = '#86db9d'
        updateSystemLog("Stop collecting data....")
        collectButton.innerHTML = '<h5>Collect Data</h5>'
        collectionButtonReleased = true
        data.on = false
    }
    let jsonString = JSON.stringify(data)
    socket.emit('tweetRequest', jsonString)
}

function importDataButton(){
    console.log("Import Data Button!")
    socket.emit('importRequest')
}

function analyseDataButton(){
    console.log("Analyse Data Button!")
    socket.emit('analyseRequest')
}

function clearDataButton(){
    console.log("Clear Data Button!")
    clearInfo()
    clearSystemLog()
}

let socket = io('http://' + window.document.location.host)
socket.on('tweetData', function (data) {
    console.log("Received tweetData from Socket!")
    //console.log("Data Type: " + typeof data)
    let returnData = JSON.parse(data)
    //console.log(returnData)
    updateInfoPane(returnData)

})
socket.on('analyseConfirm', function () {
    console.log("Received analyse confirmation from Socket!")
})

$(document).ready(function () {
    }
)
