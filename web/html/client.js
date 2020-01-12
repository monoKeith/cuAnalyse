console.log("Client script running!")
infoPane = document.getElementById("infoPane")

function pushInfo() {
    infoPane.innerHTML += "<div id=\"infoCard\">"

    infoPane.innerHTML += "</div>"
}

function clearInfo(){
    infoPane.innerHTML = ""
}

function updateInfoPane(){
        pushInfo()
}

//Button handlers!

function collectDataButton(){
    console.log("Collect Data Button!")

    updateInfoPane()
}

function importDataButton(){
    console.log("Import Data Button!")
}

function analyseDataButton(){
    console.log("Analyse Data Button!")
}

$(document).ready(function () {
        //webpage loaded!

    }
)