require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Import Routes
const postsRoute = require('./routes/posts');
app.use('/posts', postsRoute);

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the blog API');
});

// Connect to DB
mongoose.connect("mongodb+srv://luciferbrine04:KIS04han@lucy.hdza0s9.mongodb.net/blog", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Failed to connect to MongoDB Atlas', err));

// Start the server
app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
