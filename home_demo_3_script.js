//initialise toggling
	toggleVisibility("idClient");
	//toggleVisibility("passClient");
	//toggleVisibility("loadingImage");

//GLOBAL VARIABLES
	var myBroker = "broker.mqttdashboard.com";
	var myPort = 8000;
	var myClientId = "Degisth_Home_Demo_3";
	//var myClientPass;
	var myTopic0 = "arduino/degisth/homedemo3";
	var myTopic1 = "arduino_degisth_home_demo_temperature1";
	var myTopic2 = "arduino_degisth_home_demo_temperature2";
	var myTopic3 = "arduino_degisth_home_demo_temperature3";
	var myTopic4 = "arduino_degisth_home_demo_temperature4";
	var myTopic5 = "arduino_degisth_home_demo_humidity1";
	var myTopic6 = "arduino_degisth_home_demo_humidity2";
	var myTopic7 = "arduino_degisth_home_demo_humidity3";
	var myTopic8 = "arduino_degisth_home_demo_humidity4";
	var myMessageToSend;
	// Will receive the client instance ***
	var client;
	//Temperature variable
	var tempValue1 = 0;
	var tempValue2 = 0;
	var tempValue3 = 0;
	var tempValue4 = 0;
	var humValue1 = 0;
	var humValue2 = 0;
	var humValue3 = 0;
	var humValue4 = 0;
	
// STARTING POINT
function start(){
	var action = document.getElementById('connect_button').innerHTML;
	myClientId = document.getElementById('idClient').value;
	//myClientPass = document.getElementById('passClient').value;
	if(action == "Connect"){
		connection();
	}
	else if(action == "Retry to connect"){
		connection();
	}else{
		disconnection();
	}
}

// called when connect button hit
function connection(){
			
			//Update div 'info'
			//document.getElementById('state').innerHTML = "Trying to connect to " + myBroker;
                        document.getElementById('state').innerHTML = "Trying to connect ... ";
			document.getElementById('info').style.backgroundColor = "rgba(200,155,28,0.5)";
			
			toggleVisibility("idClient");
			//toggleVisibility("loadingImage");
			
			
			// Create a client instance ***
			client = new Paho.MQTT.Client(myBroker, myPort, myClientId);
			
			// Set parameters
			client.cleanSession = true;
	
			// set callback handlers
			client.onConnectionLost = onConnectionLost;
			client.onMessageArrived = onMessageArrived;

			// connect the client
			client.connect({onFailure:notConnect,onSuccess:onConnect});
}

// called when disconnect button hit
function disconnection(){
	var confirmed = confirm("Are you sure for disconnection?");
	
	if(confirmed){
		client.disconnect();
		//Change Display 'STATE'
			document.getElementById('state').innerHTML = "DISCONNECTED";
			document.getElementById('info').style.backgroundColor = "rgba(255,38,38,0.5)";
						
		//Change connect button text
		document.getElementById('connect_button').innerHTML = "Connect";
		
		toggleVisibility("idClient");
		//toggleVisibility("passClient");
		
			console.log("Disconnected");
	}
}

// called when the client connects
function onConnect() {
		// Once a connection has been made, make a subscription and send a message.
		console.log("onConnect");
		  
		//Change Display 'STATE'
		//document.getElementById('state').innerHTML = "Connected to: " + myBroker + ";   Port: " + myPort + ";   Client ID: " + myClientId;
                document.getElementById('state').innerHTML = "Connected";
		document.getElementById('info').style.backgroundColor = "rgba(100,155,28,0.5)";
		
		//toggleVisibility("loadingImage");
		
		//Change connect button text
		document.getElementById('connect_button').innerHTML = "Disconnect";
		
		
		//alert("Home-Demo\n\nSuccessfully Connected to:\n " + myBroker);
		
		//call subscribe function
			subscribe_topic(myTopic0);
			subscribe_topic(myTopic1);
			subscribe_topic(myTopic2);
			subscribe_topic(myTopic3);
			subscribe_topic(myTopic4);
			subscribe_topic(myTopic5);
			subscribe_topic(myTopic6);
			subscribe_topic(myTopic7);
			subscribe_topic(myTopic8);
}

// called when the client fail to connect
function notConnect() {
		console.log("notConnect");
		  
		//Change Display 'STATE'
		document.getElementById('state').innerHTML = "FAILED :    Error connection";
		document.getElementById('info').style.backgroundColor = "rgba(255,38,38,0.5)";
		
		toggleVisibility('idClient');
		//toggleVisibility('passClient');
		//toggleVisibility("loadingImage");
		
		document.getElementById('connect_button').innerHTML = "Retry to connect";
		
		alert('FAILED\n\n Error connection');
}

// called when connection lost
function onConnectionLost(responseObject) {
		if (responseObject.errorCode !== 0) {
			console.log("onConnectionLost:"+responseObject.errorMessage);
			alert("Connection Lost :  "+responseObject.errorMessage);
			
			toggleVisibility('idClient');
			//toggleVisibility('passClient');
			
			//Change Display 'STATE'
			document.getElementById('state').innerHTML = "DISCONNECTED";
			document.getElementById('info').style.backgroundColor = "rgba(255,38,38,0.3)";
			
			document.getElementById('connect_button').innerHTML = "Connect";
		}
}

//Subscribe to Topic
function subscribe_topic(topic){
		//myTopic = document.getElementById('myTopic').value;
		client.subscribe(topic);
		var innerEl = document.getElementById('state').innerHTML;
		//document.getElementById('state').innerHTML = innerEl + ";   Subscribed to: " + topic;
}

// Called when switch buttons hit
function send_message(object){
		var actualState = document.getElementById(object).innerHTML;
		
		if(object == "kitchenlamp"){
			if(actualState == "Switch ON"){
				myMessageToSend = "1on" ;
			}
			if(actualState == "Switch OFF"){
				myMessageToSend = "1off" ;
			}
		}else if(object == "bedroomlamp"){
			if(actualState == "Switch ON"){
				myMessageToSend = "2on" ;
			}
			if(actualState == "Switch OFF"){
				myMessageToSend = "2off" ;
			}
		}else if(object == "livingroomlamp"){
			if(actualState == "Switch ON"){
				myMessageToSend = "3on" ;
			}
			if(actualState == "Switch OFF"){
				myMessageToSend = "3off" ;
			}
		}else if(object == "bathroomlamp"){
			if(actualState == "Switch ON"){
				myMessageToSend = "4on" ;
			}
			if(actualState == "Switch OFF"){
				myMessageToSend = "4off" ;
			}
		}
		  
		message = new Paho.MQTT.Message(myMessageToSend);
		message.destinationName = myTopic0;
		message.qos = 1;
		message.retained = false;
		client.send(message); 
}

// When a message arrive
function onMessageArrived(message) {
	beep();
		console.log("onMessageArrived:" + message.payloadString);
		
		//Topic Condition
		if(message.destinationName =="arduino_degisth_home_demo_temperature1"){
			tempValue1 = parseInt(message.payloadString);
		}
		else if(message.destinationName =="arduino_degisth_home_demo_temperature2"){
			tempValue2 = parseInt(message.payloadString);
		}
		else if(message.destinationName =="arduino_degisth_home_demo_temperature3"){
			tempValue3 = parseInt(message.payloadString);
		}
		else if(message.destinationName =="arduino_degisth_home_demo_temperature4"){
			tempValue4 = parseInt(message.payloadString);
		}
		else if(message.destinationName =="arduino_degisth_home_demo_humidity1"){
			humValue1 = parseInt(message.payloadString);
		}
		else if(message.destinationName =="arduino_degisth_home_demo_humidity2"){
			humValue2 = parseInt(message.payloadString);
		}
		else if(message.destinationName =="arduino_degisth_home_demo_humidity3"){
			humValue3 = parseInt(message.payloadString);
		}
		else if(message.destinationName =="arduino_degisth_home_demo_humidity4"){
			humValue4 = parseInt(message.payloadString);
		}
		else{
			//Message Condition
			if(message.payloadString == "1on"){
				switchLightOn('kitchen','kitchenlamp');			
			}
			if(message.payloadString == "1off"){
				switchLightOff('kitchen','kitchenlamp');			
			}
			if(message.payloadString == "2on"){
				switchLightOn('bedroom','bedroomlamp');			
			}
			if(message.payloadString == "2off"){
				switchLightOff('bedroom','bedroomlamp');			
			}
			if(message.payloadString == "3on"){
				switchLightOn('livingroom','livingroomlamp');			
			}
			if(message.payloadString == "3off"){
				switchLightOff('livingroom','livingroomlamp');			
			}
			if(message.payloadString == "4on"){
				switchLightOn('bathroom','bathroomlamp');			
			}
			if(message.payloadString == "4off"){
				switchLightOff('bathroom','bathroomlamp');			
			}
		}
	displayTemperatures();
	displayHumidity();
}

//SWITCHING LIGHTS
function switchLightOn(room, object){
			document.getElementById(object).innerHTML = "Switch OFF";
			document.getElementById(room).style.color = "#222";
			document.getElementById(room).style.background = "rgba(255,255,100,0.3)";
			//alert(object +" is ON");
		
}
function switchLightOff(room, object){
			document.getElementById(object).innerHTML = "Switch ON";
			document.getElementById(room).style.color = "#fff";
			document.getElementById(room).style.background = "rgba(0,0,0,0.7)";
			//alert(object +" is OFF");
}

// BEEP SOUND
function beep(){
    var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");  
    snd.play();
}

//Toggle the visibility of an element
function toggleVisibility(id){
	var e = document.getElementById(id);
	if(e.style.display == 'block')
		e.style.display = 'none';
	else
		e.style.display = 'inline-block';
}

//DISPLAY TEMPERATURE
function displayTemperatures(){
	document.getElementById('temp1').innerHTML = tempValue1 + ' °C';
	document.getElementById('temp2').innerHTML = tempValue2 + ' °C';
	document.getElementById('temp3').innerHTML = tempValue3 + ' °C';
	document.getElementById('temp4').innerHTML = tempValue4 + ' °C';
}
//DISPLAY HUMIDITY
function displayHumidity(){
	document.getElementById('hum1').innerHTML = humValue1 + ' %';
	document.getElementById('hum2').innerHTML = humValue2 + ' %';
	document.getElementById('hum3').innerHTML = humValue3 + ' %';
	document.getElementById('hum4').innerHTML = humValue4 + ' %';
}