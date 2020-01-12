console.log("Client script running!")
infoPane = document.getElementById("infoPane")

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
}

//Button handlers!

function collectDataButton(){
    console.log("Collect Data Button!")
    socket.emit('tweetRequest')
}

function importDataButton(){
    console.log("Import Data Button!")
}

function analyseDataButton(){
    console.log("Analyse Data Button!")
    socket.emit('analyseRequest')
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

