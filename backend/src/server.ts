const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
    console.log('Server running on port ', PORT);
});
