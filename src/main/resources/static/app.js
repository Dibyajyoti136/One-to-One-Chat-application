const loginPage = document.getElementById("loginPage");
const chatPage = document.getElementById("chatPage");

const joinBtn = document.getElementById("joinBtn");
const usernameInput = document.getElementById("username");

const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const messages = document.getElementById("messages");

const contacts = document.querySelectorAll(".contact");
const chatUser = document.getElementById("chatUser");

/* LOGIN */
const StompClient=null;
joinBtn.addEventListener("click", () => {

    const username = usernameInput.value.trim();

    if(username === ""){
        alert("Enter your name");
        return;
    }

    loginPage.style.display = "none";
    chatPage.style.display = "flex";
	
	const socket=new SockJS("/Ws");
	StompClient=Stomp.over(socket);
	
	StompClient.connect({},onConnected,onError);
	
});


function onConnected(){
	const username = usernameInput.value.trim();
	StompClient.subscribe(`/user/${username}/queue/message`,onMessageReceive);
	StompClient.subscribe('/user/public',onMessageReceive)
	
	StompClient.send('app/user.addUser',
		{},
		JSON.stringify({nickName:username,fullName:username,status:"ONLINE"})
	);
	//find and display connected users
	findAndDisplayConnectedusers().then();
	
}


async function onMessageReceive(){
	const username = usernameInput.value.trim();
	const connectedUserResponse =await fetch('/users');
	let connectedUsers= await connectedUserResponse.json();
	connectedUsers=connectedUsers.filter(user=>user.nickName !== username);
	
	
	/* CONTACT CHANGE */

	contacts.forEach(contact => {

	    contact.addEventListener("click", () => {

	        contacts.forEach(c =>
	            c.classList.remove("active")
	        );

	        contact.classList.add("active");

	        const user =
	            contact.dataset.user;

	        chatUser.textContent = user;

	        messages.innerHTML = `
	            <div class="message received">
	                Start chatting with ${user}
	            </div>
	        `;
	    });

	});
}



/* SEND MESSAGE */

function sendMessage(){

    const text =
        messageInput.value.trim();

    if(text === ""){
        return;
    }

    const msg =
        document.createElement("div");

    msg.classList.add(
        "message",
        "sent"
    );

    msg.textContent = text;

    messages.appendChild(msg);

    messageInput.value = "";

    messages.scrollTop =
        messages.scrollHeight;
}

sendBtn.addEventListener(
    "click",
    sendMessage
);

messageInput.addEventListener(
    "keydown",
    (e)=>{
        if(e.key === "Enter"){
            sendMessage();
        }
    }
);