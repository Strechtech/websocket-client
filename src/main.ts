import './style.css'
import { connectToServer } from './socket-client'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<div>
  
  <h2>Websocket Client</h2>
  <input id= "jwToken" type="text" placeholder="Json Web Token">
  <button id="btn-connect">Connect</button>

  <br/>

  <span id="server-status">OFFLINE </span>
  <ul id="clients-ul"></ul>
  <form id="message-form">
    <input type="text" id="message-input">
  </form>
<h3>Messages</h3>
 <ul id="messages-ul"></ul>

</div>

`
// connectToServer();
const jwtToken = document.querySelector<HTMLInputElement>('#jwToken')!;
const btnConnect = document.querySelector <HTMLButtonElement>('#btn-connect')!;

btnConnect.addEventListener('click', () => {
  if (jwtToken.value.trim().length <= 0) return alert('Token is required');
  connectToServer( jwtToken.value.trim() );
})

