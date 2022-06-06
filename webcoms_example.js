
startPolling();

function receivedMessage( user, message ){//just add a new function for whatever you want to do
    var li = document.createElement("li");
    document.getElementById("messagesList").appendChild(li);
    li.textContent = `${user} says ${message}`;
};

document.getElementById("sendButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
	if (!user){ alert("have have user name!"); return;};
    var message = document.getElementById("messageInput").value;
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
						//alert(this.responseText);
					}else{//error
						//console.log(this.responseText);
					}
	};
	let api = "http://localhost/RestApp/sendMessage/" + user + "/" + message + ".json?ErewhonRestApp"
	xhttp.open("GET", api , true);
	xhttp.setRequestHeader("Content-type", "application/text");
	xhttp.send();
});