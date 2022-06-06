//to reduce HTTP message noise, consider returning multipule objects/request per poll
const pollingEndPoint = "http://localhost/RestApp/request/{requestNumber}.json?ErewhonRestApp";//change to your the polling URL, must include a requestNumber parameter
const latestRequestEndPont = "http://localhost/RestApp/latestRequestNumber.json?ErewhonRestApp";//change to your api to return the last/latest request item number/ID
const showAPIErrors = false;
const polliingFrequency = 100;//in milliseconds e.g. 100 is 10 polls per second
var polling = false;
var requestNumber = -1;

function startPolling(){
	//before we can start to poll we need to get the lastest request number, so we know what request to pull
	getLatestRequestNumber();
}

function stopPolling(){
	polling = false;
}

function pollAPI(){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			//success call the local javascript method
			let request = null;

			try {
				/*expected JSON object: 
				{	"function_name":"nameOfFunction",
					"parameters":"paramValue1|paramValue2|paramValue3",
					"requestNumber":1	}
					
				parameters are not limited and you can return JSON objects in full as a parameter, but it mush not include | in the data
				requestNumber but auto increment server side, this means the polling will only pick up new requests
				*/
				request = JSON.parse(this.responseText);
			} catch (error) {
				if (showAPIErrors){
					console.log("failure poll " + pollingEndPoint);
					console.log(this.responseText);
				}
				return;
			}
			if (request == null) { return; }
			requestNumber = request.requestNumber;
			let paramArray = request.parameters.split('|');
			let paramObjectArray = Array.prototype.slice.call(paramArray, 0);
			window[request.function_name].apply(null, paramObjectArray);//generic method call, all data passed as parameters, JSON objects can be included and parsed when they arrive at the destination fuction
		}else{//error
			if (showAPIErrors){
				console.log("failure poll " + pollingEndPoint);
				console.log(this.responseText);
			}
		}
	};

	xhttp.open("GET", pollingEndPoint.replace("{requestNumber}", requestNumber), true);
	xhttp.setRequestHeader("Content-type", "application/text");
	xhttp.send();
	
	if (polling){
		setTimeout(function(){ pollAPI(); },polliingFrequency);
	}
}//pollAPI()

function getLatestRequestNumber(){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {

			requestNumber = parseInt(this.responseText);
			if (isNaN(this.responseText)){
				console.log("connection failure - check end point")
				console.log(this.responseText);
				return;
			}
			
			requestNumber = parseInt(this.responseText);
			
			console.log("connection success")
			console.log("starting request number " + requestNumber);
			console.log("polling frequency " + polliingFrequency);
			polling = true;
			setTimeout(function(){ pollAPI(); },polliingFrequency);
		}else{//error
			if (showAPIErrors){
							console.log("failure to get lastest request number " + latestRequestEndPont);
							console.log(this.responseText);
			}
		}
	};

	xhttp.open("GET", latestRequestEndPont, true);
	xhttp.setRequestHeader("Content-type", "application/text");
	xhttp.send();	
}//pollAPI()
