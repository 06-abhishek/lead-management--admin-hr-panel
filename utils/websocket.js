const WebSocket = require("ws");

let clients = [];

const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    clients.push(ws);

    ws.on("close", () => {
      clients = clients.filter((client) => client !== ws);
    });
  });
};

// Function to send real-time updates
const broadcastUpdate = (data) => {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

module.exports = { setupWebSocket, broadcastUpdate };
