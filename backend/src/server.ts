const express = require('express');
const cors = require('cors');
const app = express();
const socket = require('socket.io');

app.use(cors());

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
    console.log('Server running on port ', PORT);
});

const io = socket(server, {
    cors: {
        origin: '*',
    },
});

io.on('connection', () => {
    console.log('Connection Received');
});
