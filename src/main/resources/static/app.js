const loginPage =
document.getElementById("loginPage");

const chatPage =
document.getElementById("chatPage");

const joinBtn =
document.getElementById("joinBtn");

let username = "";

joinBtn.addEventListener("click", () => {

    username =
    document
    .getElementById("username")
    .value
    .trim();

    if(username === ""){
        alert("Please enter your name");
        return;
    }

    loginPage.hidden = true;

    chatPage.hidden = false;

    console.log(username + " joined");
});


const sendBtn =
document.getElementById("sendBtn");

const messageInput =
document.getElementById("messageInput");

const messages =
document.getElementById("messages");

sendBtn.addEventListener("click", sendMessage);

messageInput.addEventListener("keypress", (e)=>{

    if(e.key === "Enter"){
        sendMessage();
    }

});

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