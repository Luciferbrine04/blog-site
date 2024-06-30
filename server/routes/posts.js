const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

module.exports = (io) => {
    // Get all posts
    router.get('/', async (req, res) => {
        try {
            const posts = await Post.find();
            res.json(posts);
        } catch (err) {
            res.json({ message: err });
        }
    });

    // Get a specific post
    router.get('/:postId', async (req, res) => {
        try {
            const post = await Post.findById(req.params.postId);
            res.json(post);
        } catch (err) {
            res.json({ message: err });
        }
    });

    // Create a post
    router.post('/', async (req, res) => {
        const post = new Post({
            title: req.body.title,
            content: req.body.content
        });

        try {
            const savedPost = await post.save();
            io.emit('postCreated', savedPost); // Emit event
            res.json(savedPost);
        } catch (err) {
            res.json({ message: err });
        }
    });

    // Delete a post
    router.delete('/:postId', async (req, res) => {
        try {
            const removedPost = await Post.findByIdAndRemove(req.params.postId);
            io.emit('postDeleted', removedPost._id); // Emit event
            res.json(removedPost);
        } catch (err) {
            res.json({ message: err });
        }
    });

    // Update a post
    router.patch('/:postId', async (req, res) => {
        try {
            const updatedPost = await Post.updateOne(
                { _id: req.params.postId },
                { $set: { title: req.body.title, content: req.body.content } }
            );
            res.json(updatedPost);
        } catch (err) {
            res.json({ message: err });
        }
    });

    return router;
};
