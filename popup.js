document.addEventListener('DOMContentLoaded', function() {
    var background = chrome.extension.getBackgroundPage();
    var requests = background.requests;


    if (background.recording())
        document.getElementById('Record').innerHTML = ' Stop Recording ';
    else 
        document.getElementById('Record').innerHTML = ' Start Recording ';

    //Requests are indexed by their requestid
    for (var requestid in requests) {
        if (requests.hasOwnProperty(requestid)) {
            addRow(requestid, requests[requestid]);
            //document.getElementById('RequestList').innerHTML += '<li data-requestid="' + requestid + '">' + requests[requestid].url + '</li>';
        }
    }

    //Once all items have been added to the page, bind onclicks to the requests
    for (var i = 1; i < document.getElementById('RequestTable').children.length; i++) {
        document.getElementById('RequestTable').children[i].addEventListener('click', function(e) {  
            var requestid = e.currentTarget.dataset.requestid;
            displayRequest(requests[requestid]);
        });
    }

    document.getElementById('Clear').addEventListener('click', function (e) {
        background.clearRequests();
        var table = document.getElementById('RequestTable')

        while (table.children[1]) {
            table.removeChild(table.children[1]);
        }
    });

    document.getElementById('Record').addEventListener('click', function (e) {
        background.toggleRecording();
        
        if (background.recording())
            document.getElementById('Record').innerHTML = ' Stop Recording ';
        else 
            document.getElementById('Record').innerHTML = ' Start Recording ';
    });
});

var addRow = function (id, request) {
    document.getElementById('RequestTable').innerHTML += '<tr data-requestid="' + id + '"><td>' + request.statusCode + '</td><td>' + request.method + '</td><td>' + request.url + '</td></tr>'
}

var displayRequest = function (request) {
    console.log(prettyPrint(request))

    function prettyPrint(obj, indent)
    {
        var result = "";
        if (indent == null) indent = "";

        for (var property in obj) {
            var value = obj[property];
            if (typeof value == 'string')
                value = "'" + value + "'";
            else if (typeof value == 'object') {
                if (value instanceof Array) {
                    value = "[ " + value + " ]";
                }
                else {
                    var od = prettyPrint(value, indent + "    ");
                    value = "\n" + indent + "{\n" + od + "\n" + indent + "}";
                }
            }
            result += indent + "'" + property + "' : " + value + ",\n";
        }
        return result.replace(/,\n$/, "");
    }
}