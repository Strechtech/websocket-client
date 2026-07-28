import { Manager, Socket } from 'socket.io-client'

let socket: Socket;
export const connectToServer = (token: string) => {
    // const manager = new Manager('http://localhost:3000/socket.io/socket.io.js',
       const manager = new Manager('https://craft-shoppify.onrender.com/socket.io/socket.io.js',
      {
        extraHeaders: {
          hola: 'mundo',
          authorization: token
        }
      }
    );
    socket?.removeAllListeners();

    socket = manager.socket('/');

    addListeners(socket);
}
const addListeners = (socket: Socket) => {
    const serverStatusLabel = document.querySelector('#server-status'); 
    const clientsUl = document.querySelector('#clients-ul');
    const messageForm = document.querySelector<HTMLFormElement>('#message-form');
    const messageInput = document.querySelector<HTMLInputElement>('#message-input');
    const messagesUl = document.querySelector<HTMLUListElement>('#messages-ul');

    socket.on('connect', () => {
        // console.log('Connected to server');
        serverStatusLabel!.innerHTML = 'CONNECTED';
    });
    socket.on('disconnect', () => {
        // console.log('Disconnected from server');
        serverStatusLabel!.innerHTML = 'DISCONNECTED';
    });
    socket.on('clients-updated', (clients: string[]) => {
      let clientsHtml = '';
      clients.forEach(clientId => {
        clientsHtml += `
          <li>${clientId}</li>
        `
      });
      clientsUl!.innerHTML = clientsHtml;
      });

      messageForm!.addEventListener('submit', (event) => {
        event.preventDefault();
        if (messageInput!.value.trim().length <= 0) return ;
        socket.emit('message-from-client', {
            id: 'yo?',
            message: messageInput!.value
        });
        messageInput!.value = '';
      });

      socket.on('message-from-server', (payload: {fullName: string, message: string}) => {
        const newMessage = `
          <li>
            <strong>${payload.fullName}</strong>
            <span>${payload.message}</span>
          </li>
        `;
        const li = document.createElement('li');
        li.innerHTML = newMessage;
        messagesUl!.append(li);
    });
}