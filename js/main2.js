(function() {
	var getNode = function(s) {
		return document.querySelector(s);
	};

	// Get required nodes
	status = getNode('.chat-status span');
	textarea = getNode('.chat textarea');
	chatName = getNode('.chat-name');
	messages = getNode('.chat-messages');
	
	statusDefault = status.textContent;
	setStatus = function(s) {
		status.textContent = s;
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
					message.textContent = data[x].name+": "+data[x].message;

					messages.appendChild(message);
					messages.insertBefore(message, messages.firstChild);
				}
			}
		});

		// listen for status
		socket.on('status', function(data) {
			setStatus((typeof data === 'object') ?data.message: data);
			if(data.clear === true) {
				textarea.value = '';
			}
		});

		// listen for keydown
		textarea.addEventListener('keydown', function(event){
			var self = this;
			var name = chatName.value;
			if(event.which===13 && event.shiftKey===false) {
				socket.emit('input', {
					name: name,
					message: self.value
				});

				event.preventDefault();
			}
		}); 
	}
})();