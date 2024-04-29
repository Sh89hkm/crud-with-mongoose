const BlogPost = require('../models/blog-post');

async function getAllAuthors(req, res) {
    try {
        const blogPosts = await BlogPost.find();
        const authors = blogPosts.map(post => post.author);
        res.json(authors);
    } catch (error) {
        console.error(error);
        res.status(422).json({ message: "An unexpected error occurred" });
    }
}

async function updateAuthor(req, res) {
    const authorName = req.params.name;
    const updates = req.body;
    try {
        // Update author details in all related blog posts
        const updatedPosts = await BlogPost.updateMany({ 'author.name': authorName }, { 'author': updates });

        res.json(updatedPosts);
    } catch (error) {
        console.error(error);
        res.status(422).json({ message: "An unexpected error occurred" });
    }
}

module.exports = {
    getAllAuthors,
    updateAuthor
};