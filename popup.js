document.addEventListener('DOMContentLoaded', function() {
    var requests = chrome.extension.getBackgroundPage().requests;

    for (var property in requests) {
        if (requests.hasOwnProperty(property)) {
            document.getElementById('RequestList').innerHTML += '<li data-requestid="' + requests[property].requestId + '">' + requests[property].url + '</li>';
        }
    }

    for (var i = 0; i < document.getElementById('RequestList').children.length; i++) {
        document.getElementById('RequestList').children[i].addEventListener('click', function(e) {  
            var requestId = e.currentTarget.dataset.requestid;
            displayRequest(requests[requestId]);
        });
    }

    document.getElementById('Clear').addEventListener('click', function (e) {
        chrome.extension.getBackgroundPage().clearRequests();
        document.getElementById('RequestList').innerHTML = '';
    });

    document.getElementById('Record').addEventListener('click', function (e) {
        var background = chrome.extension.getBackgroundPage();

        background.toggleRecording();
        
        if (background.recording())
            document.getElementById('Record').innerHTML = ' Stop Recording ';
        else 
            document.getElementById('Record').innerHTML = ' Start Recording ';
    });
});

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
