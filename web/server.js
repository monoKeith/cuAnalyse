/*
COMP 2406 Collision Demo
(c) Louis D. Nel 2018
Use browser to view pages at http://localhost:3000/collisions.html
*/

//Server Code
const app = require('http').createServer(handler);
const io = require('socket.io')(app); //wrap server app in socket io capability
const fs = require("fs"); //need to read static files
const { exec } = require("child_process");
const url = require("url"); //to parse url strings

const ROOT_DIR = "html" //dir to serve static files from

const PORT = process.env.PORT || 3000;
var enableRealTimeUpdate = false
var enableCheckLog = false
var jsonLength = 0
var logLength = 0

app.listen(PORT);//

const MIME_TYPES = {
    css: "text/css",
    gif: "image/gif",
    htm: "text/html",
    html: "text/html",
    ico: "image/x-icon",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    js: "text/javascript", //should really be application/javascript
    json: "application/json",
    png: "image/png",
    svg: "image/svg+xml",
    txt: "text/plain"
}

function get_mime(filename) {
    //Get MIME type based on extension of requested file name
    //e.g. index.html --> text/html
    for (let ext in MIME_TYPES) {
        if (filename.indexOf(ext, filename.length - ext.length) !== -1) {
            return MIME_TYPES[ext]
        }
    }
    return MIME_TYPES["txt"]
}


function handler(request, response) {
    let urlObj = url.parse(request.url, true, false)
    console.log("\n============================")
    console.log("PATHNAME: " + urlObj.pathname)
    console.log("REQUEST: " + ROOT_DIR + urlObj.pathname)
    console.log("METHOD: " + request.method)

    let receivedData = ""
    let dataObj = null
    let returnObj = null

    //attached event handlers to collect the message data
    request.on("data", function(chunk) {
        receivedData += chunk
    })

    //event handler for the end of the message
    request.on("end", function() {
        //Handle the client POST requests
        //console.log('received data: ', receivedData)

        //If it is a POST request then we will check the data.
        if (request.method === "POST") {
            //Do this for all POST messages
            //echo back the data to the client FOR NOW
            dataObj = JSON.parse(receivedData)
            console.log("received data object: ", dataObj)
            console.log("type: ", typeof dataObj)
            console.log("USER REQUEST: " + dataObj.text)
            returnObj = {}
            returnObj.text = dataObj.text
            response.writeHead(200, {
                "Content-Type": MIME_TYPES["json"]
            })
            response.end(JSON.stringify(returnObj))
        }
        else if (request.method === "GET") {
            //handle GET requests as static file requests
            var filePath = ROOT_DIR + urlObj.pathname
            if (urlObj.pathname === "/") filePath = ROOT_DIR + "/index.html"

            fs.readFile(filePath, function(err, data) {
                if (err) {
                    //report error to console
                    console.log("ERROR: " + JSON.stringify(err))
                    //respond with not found 404 to client
                    response.writeHead(404)
                    response.end(JSON.stringify(err))
                    return
                }
                response.writeHead(200, {
                    "Content-Type": get_mime(filePath)
                })
                response.end(data)
            })
        }
    })
}

function importData(){
    // read test json file!
    let rawdata = fs.readFileSync('Rogers147.json');
    let dataObj = JSON.parse(rawdata)
    // send data to client
    pushTweetData(dataObj)
}

function pushTweetData(dataObj){
    // send data to client
    let jsonString = JSON.stringify(dataObj)
    io.emit('tweetData', jsonString) //broadcast to everyone including sender
}

function realTimeUpdate(){
    if(! enableRealTimeUpdate){
        console.log("Real Time Update OFF!")
        return
    }
    setTimeout(() =>{
        realTimeUpdate()
    }, 500)
    console.log("Real Time Update!")
    try{
        let rawdata = fs.readFileSync('test.json')
        let dataObj = JSON.parse(rawdata)
        //console.log(dataObj)
        if(dataObj.length > jsonLength){
            let newTweets = []
            for(let i = jsonLength; i < dataObj.length; i++){
                //console.log("NEW Tweet: " + dataObj[i])
                newTweets.push(dataObj[i])
            }
            //console.log(newTweets)
            jsonLength = dataObj.length
            //emit update to client
            pushTweetData(newTweets)
        }
    }catch{
        console.log("json file not ready yet")
    }
}

function turnOnRealTimeUpdate(searchKey){
    enableRealTimeUpdate = true
    //schedule update
    setTimeout(() =>{
        realTimeUpdate()
    }, 500)

    //execute bash script to call python data collector
    exec("bash ./startCollector.bash " + searchKey.replace(/\s/g, '#'), (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}

function turnOffRealTimeUpdate(){
    console.log("Received collecter OFF msg")
    enableRealTimeUpdate = false

    //killall streaming.py
    exec("bash ./endCollector.bash", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}

function checkLog() {
    //console.log("check log")
    //schedule update
    setTimeout(() => {
        checkLog()
    }, 1000)

    let rawdata = fs.readFileSync('out.txt', 'utf8')
    if(rawdata != ""){
        if(rawdata.length > logLength){
            console.log(rawdata)
            analysisReport(rawdata)
            logLength = rawdata.length
        }
    }
}

function runAnalysis(){
    analysisReport('Started')
    setTimeout(() => {
        checkLog()
    }, 500)
    //start analszer
    exec("bash ./analyze.bash", (error, stdout, stderr) => {
        if (error) {
            analysisReport(`error: ${error.message}`)
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            analysisReport(`stdout: ${stderr}`)
            console.log(`stderr: ${stderr}`);
            return;
        }
        analysisReport(`stdout: ${stdout}`)
        console.log(`stdout: ${stdout}`);
    });
}

function analysisReport(report){
    let msg = {
        'report': report
    }
    let jsonString = JSON.stringify(msg)
    io.emit('analyseConfirm', jsonString)
}

io.on('connection', function(socket){
    socket.on('tweetRequest', function(data){
        console.log('RECEIVED tweet request')
        dataObj = JSON.parse(data)
        let enableRealTimeUpdate;
        if (dataObj.on) {
            turnOnRealTimeUpdate(dataObj.key)
        } else {
            //turn off data collection
            turnOffRealTimeUpdate()
        }
    });
    socket.on('importRequest', function(){
        console.log('RECEIVED analyse request')
        importData()
    });
    socket.on('analyseRequest', function(data){
        console.log('RECEIVED analyse request')
        runAnalysis()
    });
})

console.log("Server Running at PORT 3000  CNTL-C to quit")
console.log("To Test")
console.log("http://localhost:3000/index.html")

