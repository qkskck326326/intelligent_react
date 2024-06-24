import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

// Create a SockJS connection
const socket = new SockJS('http://localhost:8080/ws');

// Create a Stomp client over the SockJS connection
const stompClient = new Client({
    webSocketFactory: () => socket,
    debug: (str) => {
        console.log('STOMP: ' + str);
    },
    onConnect: () => {
        console.log('웹소켓 연결');
    },
    onStompError: (frame) => {
        console.error('STOMP 에러: ' + frame);
    },
    onDisconnect: (frame) => {
        console.log('웹소켓 해제: ' + frame);
    },
    onWebSocketError: (frame) => {
        console.error('웹소켓 에러: ' + frame);
    },
});

// Activate the client
stompClient.activate();

export { stompClient };