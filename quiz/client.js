const ws = new WebSocket("wss://harveytucker.com/ws/");
let playerId = localStorage.getItem("playerId");
if (!playerId) {
    playerId = crypto.randomUUID();
    localStorage.setItem("playerId", playerId);
}

ws.onopen = () => {
    console.log("Connected to server");
    ws.send(JSON.stringify({type: "playerConnect", playerId: playerId}));
};

ws.onmessage = (event) => {
    let data;

    try {
        data = JSON.parse(event.data);
    } catch (e) {
        console.error('Error parsing message:', e);
        return;
    }

    switch (data.type) {
        case 'playerWait':
            document.getElementById("waiting").style.display = "block";
            break;

        case 'playerUsernameAllow':
            document.getElementById("enterUsername").style.display = "block";
            document.getElementById("waiting").style.display = "none";
            break;

        case 'playerTextQuestion':
            document.getElementById('textQuestion').style.display = "block";
    }
};

ws.onerror = (err) => {
    console.error("WebSocket error:", err);
};

document.getElementById("submitUsername").addEventListener("click", () => {
    const username = document.getElementById("username").value.trim();
    if (!username) {
        alert("Please enter a username.");
        return;
    }

    const payload = { type: "playerLogin", playerId: playerId, username: username };
    ws.send(JSON.stringify(payload));
    document.getElementById("enterUsername").style.display = "none";
});

document.getElementById("submitTextAnswer").addEventListener("click", () => {
    const answer = document.getElementById("textAnswer").value.trim();
    if (!answer) {
        alert("Please enter an answer.");
        return;
    }

    const payload = { type: "playerAnswer", playerId: playerId, answer: answer };
    ws.send(JSON.stringify(payload));
    document.getElementById("textQuestion").style.display = "none";
});