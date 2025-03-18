(function(){

	const app = document.querySelector(".app") //Define el uso del chat
	const socket = io();

	let uname;

	//Solicita unirse al canal
	app.querySelector(".join-screen #join-user").addEventListener("click",function(){
		let username = app.querySelector(".join-screen #username").value;
		//Comprobacion del nombre de usuario
		if (!username.length){
			return ;
		}
		socket.emit("newuser", username);
		uname = username; //Define el nombre de usuario para el chat
		//Cambio de screen entre join y chat
		app.querySelector(".join-screen").classList.remove("active");
		app.querySelector(".chat-screen").classList.add("active");
	});

	//Espera al click en el boton input para enviar el mensaje 
	app.querySelector(".chat-screen #send-message").addEventListener("click", function(){
		let message = app.querySelector(".chat-screen #message-input").value;
		if (!message.length){
			return ;
		}
		//Envia el mensaje del usuario al compañero
		renderMessage("my",{
			username:uname, //Nombre de la propiedad:Valor asignado
			text:message	//Nombre de la propiedad:Valor asignado
		});
		//Envio del mensaje para el otro usuario
		socket.emit("chat",{
			username:uname, //Nombre de la propiedad:Valor asignado
			text:message	//Nombre de la propiedad:Valor asignado
		});
		message = app.querySelector(".chat-screen #message-input").value = ""; //Reinicia la barra de input
	});

	//Se sale del screen de chat con el boton exit
	app.querySelector(".chat-screen .exit-chat").addEventListener("click", function(){
		socket.emit("exituser", uname);
		window.location.href = window.location.href;
	});

	// Genera el mensaje de join al activar el button de unirse al chat
	socket.on("update",function(update){
		renderMessage("update", update)
	});

	//Recepcion del mensaje de la otra persona
	socket.on("chat",function(message){
		renderMessage("other", message)
	});

	//Renderizado de mensajes mediante sistema de flags
	function renderMessage(type,message){
		let messageContainer = app.querySelector(".chat-screen .messages");
		//Genera en el front el mensaje del usuario al compañero de chat
		if (type == "my"){
			let el = document.createElement("div");
			el.setAttribute("class", "message my-message");
			el.innerHTML = `
				<div>
					<div class="name">You</div>
					<div class="text">${message.text}</div>
				</div>
			`;
			messageContainer.appendChild(el)
			//Aqui seria añadir a la base de datos de enviados
		}
		//Genera en el front el mensaje del compañero de chat al usuario
		else if(type == "other"){
			let el = document.createElement("div");
			el.setAttribute("class", "message other-message");
			el.innerHTML = `
				<div>
					<div class="name">${message.username}</div>
					<div class="text">${message.text}</div>
				</div>
			`;
			messageContainer.appendChild(el);
			//Aqui seria añadir a la base de datos de recibidos
		}
		//Mensaje de persona se unio al chat
		else if(type == "update"){
			let el = document.createElement("div");
			el.setAttribute("class", "update");
			el.innerText = message;
			messageContainer.appendChild(el);
		}
		//Actualizacion para el scrolleo
		messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
	}
})();