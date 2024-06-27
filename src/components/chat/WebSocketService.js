// import SockJS from 'sockjs-client';
// import { Client } from '@stomp/stompjs';
//
// // Create a SockJS connection
// const socket = new SockJS('http://localhost:8080/ws');
//
// // Create a Stomp client over the SockJS connection
// const stompClient = new Client({
//     webSocketFactory: () => socket,
//     debug: (str) => {
//         console.log('STOMP: ' + str);
//     },
//     onConnect: () => {
//         console.log('웹소켓 연결');
//     },
//     onStompError: (frame) => {
//         console.error('STOMP 에러: ' + frame);
//     },
//     onDisconnect: (frame) => {
//         console.log('웹소켓 해제: ' + frame);
//     },
//     onWebSocketError: (frame) => {
//         console.error('웹소켓 에러: ' + frame);
//     },
// });
//
// // Activate the client
// stompClient.activate();
//
// export { stompClient };

// src/services/WebSocketService.js
// src/services/WebSocketService.js
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

class WebSocketService {
    constructor() {
        this.client = new Client();
        this.subscribers = [];
        this.connected = false;
    }

    connect() {
        this.client.webSocketFactory = () => new SockJS('http://localhost:8080/ws');

        this.client.onConnect = (frame) => {
            console.log('Connected: ' + frame);
            this.connected = true;
            this.subscribers.forEach(subscriber => {
                this.client.subscribe(subscriber.topic, subscriber.callback);
            });
        };

        this.client.onStompError = (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        };

        this.client.onWebSocketClose = () => {
            console.log('WebSocket closed');
            this.connected = false;
        };

        this.client.activate();
    }

    subscribe(topic, callback) {
        if (this.connected) {
            this.client.subscribe(topic, callback);
        } else {
            this.subscribers.push({ topic, callback });
        }
    }

    disconnect() {
        if (this.client.active) {
            this.client.deactivate();
        }
        this.connected = false;
        console.log("Disconnected");
    }
}

const webSocketService = new WebSocketService();
export default webSocketService;

