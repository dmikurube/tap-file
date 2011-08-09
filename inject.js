var current_taps_count = 0;  // The number of taps in current pattern
var current_taps_time = new Array();  // For keeping timing of current tap pattern 
var record_taps = false;  // True when taps are in a single textfield
var last_tapped_element = null;  // Last tapped element
 
var timer = null;  // For measuring period after the last tap.

// Capture tap timing
window.addEventListener("mousedown", function(event) {
	console.log("mouse target: " + event.target.id);

	// Check if same TEXT elements is being clicked. If not, reset tap recording.
	if(last_tapped_element == event.target && last_tapped_element.type == "text"){
	    console.log("same object");
	    record_taps = true;

	    // Set timer to check if tap pattern is finished. 
	    if(timer != null) window.clearTimeout(timer);  // Remove existing timer
	    timer = window.setTimeout("processPattern()",2000);  // Set 2sec timeout
	}else{
	    console.log("diff object");
	    record_taps = false;
	    last_tapped_element = event.target;
	    current_taps_count = 0;
	}

	// Recording the tap time
	var now = new Date();
	current_taps_time[current_taps_count] = now.getTime();
	current_taps_count++;
    }, false);

// Restart tap record when key pressed
window.addEventListener("keyup", function(event) {
	if(timer != null) window.clearTimeout(timer);  // Remove timer
	current_taps_count = 0;
	record_taps = false;
    }, false);


// This function called when tap input is finished.
function processPattern(){
    if(timer != null) window.clearTimeout(timer);  // Remove timer
    console.log("pattern ended");
    
    if(record_taps){
	var tap_intervals = new Array();
	var i;
	for(i=0; i<current_taps_count-1; i++){
	    tap_intervals[i] = (current_taps_time[i+1]-current_taps_time[i]);
	}
	console.log("tap length: " + tap_intervals.length);

	//Send the current tap pattern to background page 
	chrome.extension.sendRequest({pattern: tap_intervals,value: last_tapped_element.value}, function(response) {
		//Do stuff on successful response
	    });
	
    }

    // Reset tap recording
    current_taps_count = 0;
    record_taps = false;       
}


// For inserting a phrase corresponding to the tap pattern
chrome.extension.onRequest.addListener(onRequest);
function onRequest(request, sender, sendResponse) {
    console.log("pattern value:" + request.pattern_value);

    if(last_tapped_element != null){
        if(request.pattern_value != null){
	    last_tapped_element.value += request.pattern_value;
	}
	last_tapped_element.focus();
    }
    // if (request. == "hello")
    // 	sendResponse({farewell: "goodbye"});
    // else
    // 	sendResponse({}); // snub them.
}
