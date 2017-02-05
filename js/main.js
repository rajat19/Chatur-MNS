$(document).ready(function() {
	var getNode = function(s) {
		return document.querySelector(s);
	};

	// Get required nodes
	status = $('.chat-status');
	textarea = $('.chat textarea');
	chatName = $('.chat-name');
	messages = $('.chat-messages');
	
	statusDefault = status.innerText;
	setStatus = function(s) {
		status.innerText = s;
		if(s !== statusDefault) {
			var delay = setTimeout(function() {
				setStatus(statusDefault);
				clearInterval(delay);
			}, 3000);
		}
	};
	
	try {
		var socket = io.connect("http://127.0.0.1:8080");
	}
	catch(e) {
		// Set status to warn user
	}

	if(socket !== undefined) {

		// listen for output
		socket.on('output', function(data) {
			if(data.length) {
				// loop through results
				for(var x=0; x<data.length; x=x+1) {
					var message = document.createElement('div');
					message.setAttribute('class', 'chat-message');
					message.innerText = data[x].name+": "+data[x].message;

					messages.appendChild(message);
					messages.insertBefore(message, messages.firstChild);
				}
			}
		});

		// listen for status
		socket.on('status', function(data) {
			setStatus((typeof data === 'object') ?data.message: data);
			if(data.clear === true) {
				textarea.val() = '';
			}
		});

		// listen for keydown
		textarea.on('keydown', function(event){
			var self = this;
			var name = chatName.val();
			if(event.which===13 && event.shiftKey===false) {
				socket.emit('input', {
					name: name,
					message: self.val()
				});

				event.preventDefault();
			}
		}); 
	}
});