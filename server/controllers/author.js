const BlogPost = require('../models/blog-post');

async function getAllAuthors(req, res) {
    try {
        // find all the post where author gender is Female and don't return or show the author id for them
        const distinctAuthors = await BlogPost.find({ 'author.gender': 'Female' }, {'author._id': 0});
        // console.log(distinctAuthors);
        // solution 1
        // find unique author names remove repeated names
        const uniqueNames = await BlogPost.find({ 'author.gender': 'Female' }, {'author._id': 0}).distinct('author.name');
        // solution 2 
        // Create a set of unique author names remove repeated names
        // const uniqueNames = [...new Set(distinctAuthors.map(post => post.author.name))];
        // console.log(uniqueNames);
        // Create an array of unique author objects
        const uniqueAuthors = uniqueNames.map(name => {
        // Find the first author object with the matching name
        const author = distinctAuthors.find(post => post.author.name === name).author;
        return author;
        });
        // console.log(uniqueAuthors);
        res.json(uniqueAuthors);
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