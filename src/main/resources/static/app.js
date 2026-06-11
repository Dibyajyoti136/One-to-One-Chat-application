const loginPage = document.getElementById("loginPage");
const chatPage = document.getElementById("chatPage");

const joinBtn = document.getElementById("joinBtn");
const usernameInput = document.getElementById("username");
const contactList=document.getElementById("contactList");

const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const messages = document.getElementById("messages");

const contacts = document.querySelectorAll(".contact");
const chatUser = document.getElementById("chatUser");

/* LOGIN */
let StompClient=null;
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
	
	StompClient.send('/app/user.addUser',
		{},
		JSON.stringify({nickName:username,fullName:username,status:"ONLINE"})
	);
	//find and display connected users
	findAndDisplayConnectedusers().then();
	
}

async function findAndDisplayConnectedusers(){
	const username = usernameInput.value.trim();
		const connectedUserResponse =await fetch('/users');
		let connectedUsers= await connectedUserResponse.json();
		connectedUsers=connectedUsers.filter(user=>user.nickName !== username);
		
		connectedUsers.forEach(user=>{
		let li = document.createElement("li");
		li.className = "contact";
		li.dataset.user = user.nickName;

		
		li.innerHTML = `
		    <span class="dot online"></span>
		    ${user}
		`;

		contactList.appendChild(li);})
		
		/* CONTACT CHANGE */

		contactList.forEach(contact => {

		    contact.addEventListener("click", () => {

		        contactList.forEach(c =>
		            c.classList.remove("active")
		        );

		        contact.classList.add("active");

		        const user =
		            contact.dataset.user;

		        chatUser.textContent = user;

		        
			fetchAndDisplayUserchat().then();
		    });
			
			async function fetchAndDisplayUserchat(){
				const userChatResponse=await fetch('/messages/${nickname}/${contact}');
				const userChat=await userChatResponse.json();
				
				messages.innerHTML=` 
				`
				messages.innerHTML = `
						            <div class="message received">
						                Start chatting with ${user}
						            </div>`;
									
				userChat.forEach(chat=>{
					loadMessage(chat.senderId,chat.recepientId);
				})					
			}

		});
		
		
	
}


function loadMessage(a,b){
	const messageContainer=document.createElement("div");
	messageContainer.classList.add(
			        "message",
			        "sent"
			    );

				msg.textContent = text;

				messages.appendChild(msg);

				messageInput.value = "";

				messages.scrollTop =
				    messages.scrollHeight;
					
					event.preventDefault();
	const username = usernameInput.value.trim();
	if(a==username){
	messages.appendChild=(messageContainer);}
	else{
		messages.appendChild=(messageContainer)
	}
}



async function onMessageReceive(payload){
	await findAndDisplayConnectedusers();
	const message=JSON.parse(payload.body);
	loadMessage(message.senderId ,message.content)
	
}



/* SEND MESSAGE */

function sendMessage(event){

    const text =
        messageInput.value.trim();
		let chatMessage=null;
    if(text === ""){
        return;
    }
	
	if(text && StompClient){
		 chatMessage={
			senderId:nickName,
			recepientId:messageContent,
			content:text,
			timestamp:new Date()
			
		}
		
		StompClient.send("/app/chat",{},JSON.stringify(chatMessage))
	}
	loadMessage(chatMessage.senderId,chatMessage.recepientId);

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