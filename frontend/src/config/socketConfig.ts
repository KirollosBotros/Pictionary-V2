import openSocket from 'socket.io-client';
import { Socket } from 'socket.io-client';

let socket = null;

if (typeof window !== 'undefined') {
    if (window.location.hostname === 'playpictionary.me') {
        socket = openSocket("https://pictionary-v2-backend.herokuapp.com/");
    } else {
        socket = openSocket("http://localhost:3001");
    }
}

export default socket as Socket;