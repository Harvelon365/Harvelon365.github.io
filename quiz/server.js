const WebSocket = require('ws');
const express = require('express');
const http = require('http');
const { Console } = require('console');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let unitySocket = null;
let players = new Map();

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        let data;
        
        try {
            data = JSON.parse(message);
        } catch (e) {
            console.error('Error parsing message:', e);
            return;
        }
        console.log('Received:', data);

        switch (data.type) {
            case 'registerUnity':
                unitySocket = ws;
                let newPlayerMap = new Map();

                players.forEach((socket, id) => {
                    console.log("checking player:", id);
                    if (socket.readyState === WebSocket.OPEN) {
                        // Handle if too many players are connected
                        newPlayerMap.set(id, socket);
                        broadcastToUnity({ type: 'playerConnect', playerId: id });
                    }
                });
                players.clear();
                players = newPlayerMap;
                console.log("Unity registered, current players:", players.size);

                broadcastToPlayers({ type: 'playerUsernameAllow' });
                break;

            case 'playerConnect':
                players.set(data.playerId, ws);
                if (!unitySocket || unitySocket.readyState != WebSocket.OPEN) {
                    ws.send(JSON.stringify({ type: 'playerWait' }));
                    return;
                }
                broadcastToUnity({ type: 'playerConnect', playerId: data.playerId });
                ws.send(JSON.stringify({ type: 'playerUsernameAllow' }));
                break;

            case 'playerLogin':
                broadcastToUnity({ type: 'playerLogin', playerId: data.playerId, username: data.username });
                break;

            case 'playerAnswer':
                broadcastToUnity({ type: 'playerAnswer', playerId: data.playerId, answer: data.answer });
                break;

            case 'playerTextQuestion':
                broadcastToPlayers({ type: 'playerTextQuestion' });
                break;

            default:
                console.log("Unknown message type:", data.type);
        }
    });
});

function broadcastToUnity(payload) {
    if (unitySocket && unitySocket.readyState === WebSocket.OPEN) {
        unitySocket.send(JSON.stringify(payload));
    }
}

function broadcastToPlayers(payload) {
    players.forEach(p => {
        p.send(JSON.stringify(payload));
    });
}

server.listen(3000, () => console.log('WebSocket server running on :3000'));
