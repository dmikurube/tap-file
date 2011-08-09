var tap_count = 0;
var tap_history = new Array();
var extension_enabled = false;
var tap_start_time;
var focused_element = null;

// Listern for keyboard shortcut Ctrl + c and disable or enable tap capturing.
// When tap capture ends, send the tap pattern to background.html.
window.addEventListener("keydown", function(event) {
	// Bind to both command (for Mac) and control (for Win/Linux)
	var modifier = event.ctrlKey || event.metaKey;
	if (modifier && event.keyCode == 67) {
	    extension_enabled = !extension_enabled;

	    if(extension_enabled){
		focused_element = document.activeElement;
	    }else{
		var tap_intervals = new Array();
		var i;
		for(i=0; i<tap_count-1; i++){
		    tap_intervals[i] = (tap_history[i+1]-tap_history[i]);
		}
		tap_count = 0;

		console.log("tap length: " + tap_intervals.length);
	    }
	    
	    //Send message to background page to show (or hide) icon
	    chrome.extension.sendRequest({enabled: extension_enabled, pattern: tap_intervals}, function(response) {
		    //Do stuff on successful response
		});
	    
	}
}, false);
 
// Capture tap timing
window.addEventListener("mousedown", function(event) {
	if(extension_enabled){
	    var timer = new Date();
	    tap_history[tap_count] = timer.getTime();
	    tap_count++;
	}
}, false);

chrome.extension.onRequest.addListener(onRequest);

function onRequest(request, sender, sendResponse) {
    console.log(sender.tab ?
		"from a content script:" + sender.tab.url :
		"from the extension");

    if(focused_element != null){
        if(request.pattern_value != null){
	    focused_element.value += request.pattern_value;
	}
	focused_element.focus();
    }
    // if (request. == "hello")
    // 	sendResponse({farewell: "goodbye"});
    // else
    // 	sendResponse({}); // snub them.
}
