

const input = document.getElementById('nameInput');
const btn   = document.getElementById('joinBtn');
const err   = document.getElementById('errorMsg');
const card  = document.getElementById('card');

function tryJoin() {
  const name = input.value.trim();
  if (!name) {
    err.classList.add('show');
    card.classList.remove('shake');
    void card.offsetWidth;
    card.classList.add('shake');
    return;
  }
  // Store name and redirect
  sessionStorage.setItem('nc_name', name);
  sessionStorage.setItem('nc_id', 'user_' + Date.now() + '_' + Math.random().toString(36).slice(2,7));
  // Animate out
  card.style.transition = 'opacity 0.4s, transform 0.4s';
  card.style.opacity = '0';
  card.style.transform = 'scale(0.95) translateY(-20px)';
  setTimeout(() => { window.location.href = 'chat.html'; }, 400);
}

btn.addEventListener('click', tryJoin);
input.addEventListener('keydown', e => { if (e.key === 'Enter') tryJoin(); });
input.addEventListener('input', () => err.classList.remove('show'));


// ─── Bootstrap ───────────────────────────────────────────────
const myName = sessionStorage.getItem('nc_name');
const myId   = sessionStorage.getItem('nc_id');

if (!myName || !myId) { window.location.href = 'index.html'; }

// ─── State ───────────────────────────────────────────────────
let users        = {};   // { id: { id, name, color } }
let activeChatId = null;
let chatHistory  = {};   // { chatKey: [messages] }
let unread       = {};   // { userId: count }

const AV_COLORS = ['av-a','av-b','av-c','av-d','av-e'];
function colorForId(id) {
  let h = 0;
  for (let c of id) h = ((h << 5) - h) + c.charCodeAt(0);
  return AV_COLORS[Math.abs(h) % AV_COLORS.length];
}
function initials(name) { return name.trim().slice(0,2).toUpperCase(); }
function chatKey(id1, id2) { return [id1,id2].sort().join('::'); }
function timeStr() {
  const n = new Date();
  return n.getHours().toString().padStart(2,'0') + ':' + n.getMinutes().toString().padStart(2,'0');
}

// ─── BroadcastChannel ────────────────────────────────────────
const bc = new BroadcastChannel('neonchat_v1');

// Announce ourselves
function announce() {
  bc.postMessage({ type: 'JOIN', id: myId, name: myName });
}

// Heartbeat to keep presence alive
setInterval(announce, 3000);

// Request existing users to re-announce
bc.postMessage({ type: 'WHO_IS_ONLINE' });
announce();

bc.onmessage = (e) => {
  const msg = e.data;
  if (msg.id === myId) return; // ignore own messages

  switch (msg.type) {
    case 'JOIN':
      handleJoin(msg);
      // Reply so they know about me
      bc.postMessage({ type: 'JOIN', id: myId, name: myName });
      break;
    case 'WHO_IS_ONLINE':
      bc.postMessage({ type: 'JOIN', id: myId, name: myName });
      break;
    case 'LEAVE':
      handleLeave(msg);
      break;
    case 'MSG':
      handleMsg(msg);
      break;
    case 'PING':
      bc.postMessage({ type: 'PONG', id: myId, name: myName });
      break;
  }
};

// Detect tab close
window.addEventListener('beforeunload', () => {
  bc.postMessage({ type: 'LEAVE', id: myId, name: myName });
});

// Detect gone users via heartbeat timeout
const lastSeen = {};
const TIMEOUT = 8000;
setInterval(() => {
  const now = Date.now();
  for (const uid in lastSeen) {
    if (now - lastSeen[uid] > TIMEOUT && users[uid]) {
      handleLeave({ id: uid, name: users[uid].name });
    }
  }
}, 2000);

function handleJoin(msg) {
  lastSeen[msg.id] = Date.now();
  const isNew = !users[msg.id];
  users[msg.id] = { id: msg.id, name: msg.name, online: true, color: colorForId(msg.id) };
  renderContacts();
  if (isNew) {
    showNotif(`${msg.name} joined`, 'joined the network', 'var(--accent)');
    appendSystemMsg(msg.id, `${msg.name} joined the chat`, 'join');
  }
  if (activeChatId === msg.id) updateChatHeader();
}

function handleLeave(msg) {
  if (users[msg.id]) {
    users[msg.id].online = false;
    delete lastSeen[msg.id];
    renderContacts();
    appendSystemMsg(msg.id, `${msg.name} went offline`, 'leave');
    showNotif(`${msg.name} left`, 'disconnected from network', 'var(--offline)');
    if (activeChatId === msg.id) updateChatHeader();
  }
}

function handleMsg(msg) {
  lastSeen[msg.id] = Date.now();
  const key = chatKey(myId, msg.from);
  if (!chatHistory[key]) chatHistory[key] = [];
  chatHistory[key].push({ ...msg, side: 'theirs' });

  if (activeChatId === msg.from) {
    renderNewMessage({ ...msg, side: 'theirs' });
  } else {
    unread[msg.from] = (unread[msg.from] || 0) + 1;
    showNotif(users[msg.from]?.name || 'Someone', msg.text.slice(0,40), 'var(--accent2)');
    renderContacts();
  }
}

// ─── UI: Contacts ─────────────────────────────────────────────
function renderContacts() {
  const list = document.getElementById('contactsList');
  const none = document.getElementById('noContacts');
  const count = document.getElementById('onlineCount');

  const all = Object.values(users);
  const online = all.filter(u => u.online).length;
  count.textContent = online + ' online';

  if (all.length === 0) { none.style.display = 'block'; return; }
  none.style.display = 'none';

  // Re-render only changed items to avoid flicker
  list.innerHTML = '';
  all.sort((a,b) => (b.online ? 1 : 0) - (a.online ? 1 : 0))
    .forEach(u => {
      const item = document.createElement('div');
      item.className = 'contact-item' + (activeChatId === u.id ? ' active' : '');
      item.dataset.id = u.id;
      item.innerHTML = `
        <div class="avatar ${u.color}" style="position:relative;">
          ${initials(u.name)}
          <span style="position:absolute;bottom:-3px;right:-3px;width:10px;height:10px;border-radius:50%;
            background:${u.online ? 'var(--online)' : 'var(--muted)'};
            box-shadow:${u.online ? '0 0 6px var(--online)' : 'none'};
            border:2px solid var(--surface);"></span>
        </div>
        <div style="flex:1;min-width:0;">
          <div class="c-name">${escHtml(u.name)}</div>
          <div class="c-status-text">${u.online ? '● online' : '○ offline'}</div>
        </div>
        <div class="unread-badge ${(unread[u.id] || 0) > 0 ? 'show' : ''}">${unread[u.id] || ''}</div>
      `;
      item.addEventListener('click', () => openChat(u.id));
      list.appendChild(item);
    });
}

// ─── UI: Chat ─────────────────────────────────────────────────
function openChat(uid) {
  activeChatId = uid;
  unread[uid] = 0;
  renderContacts();

  document.getElementById('welcomeScreen').style.display = 'none';
  document.getElementById('chatScreen').style.display = 'flex';
  document.getElementById('chatScreen').style.flexDirection = 'column';

  updateChatHeader();

  // Load history
  const key = chatKey(myId, uid);
  const msgs = chatHistory[key] || [];
  const container = document.getElementById('messages');
  container.innerHTML = '';
  msgs.forEach(m => renderNewMessage(m, false));
  scrollToBottom();
  document.getElementById('msgInput').focus();
}

function updateChatHeader() {
  const u = users[activeChatId];
  if (!u) return;
  const av = document.getElementById('chatAvatar');
  av.className = `avatar ${u.color}`;
  av.innerHTML = initials(u.name);
  document.getElementById('chatName').textContent = u.name;
  const st = document.getElementById('chatStatus');
  st.textContent = u.online ? '● Online' : '○ Offline';
  st.className = 'ch-status ' + (u.online ? 'online' : 'offline');
}

function renderNewMessage(msg, animate=true) {
  const container = document.getElementById('messages');
  const div = document.createElement('div');
  div.className = 'msg ' + msg.side;
  if (!animate) div.style.animation = 'none';
  div.innerHTML = `
    <div class="msg-bubble">${escHtml(msg.text)}</div>
    <div class="msg-meta">${msg.side === 'mine' ? 'You' : escHtml(msg.senderName || '')} · ${msg.time || timeStr()}</div>
  `;
  container.appendChild(div);
  if (animate) scrollToBottom();
}

function appendSystemMsg(targetId, text, cls) {
  // Only show in active chat
  if (activeChatId !== targetId) return;
  const container = document.getElementById('messages');
  const div = document.createElement('div');
  div.className = 'sys-msg ' + cls;
  div.textContent = text;
  container.appendChild(div);
  scrollToBottom();
}

function scrollToBottom() {
  const c = document.getElementById('messages');
  c.scrollTop = c.scrollHeight;
}

// ─── Send ─────────────────────────────────────────────────────
function sendMessage() {
  const input = document.getElementById('msgInput');
  const text = input.value.trim();
  if (!text || !activeChatId) return;
  input.value = '';

  const time = timeStr();
  const msgObj = { type: 'MSG', id: myId, from: myId, to: activeChatId, text, time, senderName: myName };
  bc.postMessage(msgObj);

  const key = chatKey(myId, activeChatId);
  if (!chatHistory[key]) chatHistory[key] = [];
  const local = { ...msgObj, side: 'mine' };
  chatHistory[key].push(local);
  renderNewMessage(local);
}

document.getElementById('sendBtn').addEventListener('click', sendMessage);
document.getElementById('msgInput').addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });

// ─── Notifications ────────────────────────────────────────────
let notifTimeout;
function showNotif(title, body, color) {
  const old = document.querySelector('.notif');
  if (old) old.remove();

  const n = document.createElement('div');
  n.className = 'notif';
  n.innerHTML = `<div class="notif-title" style="color:${color}">${escHtml(title)}</div><div style="color:var(--muted);font-size:.78rem">${escHtml(body)}</div>`;
  document.body.appendChild(n);

  clearTimeout(notifTimeout);
  notifTimeout = setTimeout(() => {
    n.classList.add('hide');
    setTimeout(() => n.remove(), 350);
  }, 3000);
}

// ─── My Profile ───────────────────────────────────────────────
const myColor = colorForId(myId);
const myAv = document.getElementById('myAvatar');
myAv.className = `avatar ${myColor}`;
myAv.innerHTML = initials(myName);
document.getElementById('myName').textContent = myName;

// ─── Util ─────────────────────────────────────────────────────
function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}



