//RECORDING VARIABLES

var record = false;

var requests = {};

var toggleRecording = function () {
    record = !record;
} 

var clearRequests = function () {
    requests = [];
}

var recording = function () {
    return record;
}

//NETWORK HANDLERS

chrome.webRequest.onBeforeRequest.addListener( function(request) {
    if (!/chrome-extension/.test(request.url)) {
        if (record) {
            requests[request.requestId] = request;
        }
    }
}, {urls: ["<all_urls>"]}, ["requestBody"]);

chrome.webRequest.onSendHeaders.addListener( function(request) {
    if (!/chrome-extension/.test(request.url)) {
        if (record) {
            addToRequest(request);
        }
    }
}, {urls: ["<all_urls>"]}, ["requestHeaders"]);

chrome.webRequest.onCompleted.addListener( function(request) {
    if (!/chrome-extension/.test(request.url)) {
        if (record) {
            addToRequest(request);
        }
    }
}, {urls: ["<all_urls>"]}, ["responseHeaders"]);

//NETWORK FUNCTIONS

var addToRequest = function (request) {
    var storedRequest = requests[request.requestId];

    for (var property in request) {
        if (request.hasOwnProperty(property)) {
            if (!storedRequest.hasOwnProperty(property)) {
                storedRequest[property] = request[property];
            }
        }
    }

    requests[request.requestId] = storedRequest;
}