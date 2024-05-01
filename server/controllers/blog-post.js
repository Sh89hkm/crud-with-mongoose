// Start coding here

const BlogPost = require('../models/blog-post');

async function getAllBlogPosts(req, res) {
    try {
        const posts = await BlogPost.find({});
        // console.log(posts)
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(422).json({ message: "An unexpected error occurred" });
    }
}

async function addBlogPost(req, res) {
    const { title, content, tags, likes, author } = req.body;
    if (!title || !content || !author) {
        return res.status(422).json({ message: "Unprocessable Entity" });
    }

    try {
        const newPost = await BlogPost.create({ title, content, tags, likes, author });
        res.status(201).json(newPost);
    } catch (error) {
        console.error(error);
        res.status(422).json({ message: "An unexpected error occurred" });
    }
}

async function getOneBlogPost(req, res) {
    const postId = req.params.id;
    try {
        const post = await BlogPost.findById(postId);
        if (!post) {
            return res.status(422).json({ message: "Blog post not found" });
        }
        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(422).json({ message: "An unexpected error occurred" });
    }
}

async function filterBlogPosts(req, res) {
    const { tag, author } = req.query;
    const filter = {};

    if (!tag && !author) {
        return res.status(400).json({ message: "Please provide at least one query parameter (tag or author)" });
    }

    if (tag) {
        filter.tags = tag;
    }
    if (author) {
        filter['author.name'] = author;
    }

    try {
        const posts = await BlogPost.find(filter);
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(422).json({ message: "An unexpected error occurred" });
    }
}

async function updateBlogPost(req, res) {
    const postId = req.params.id;
    const updates = req.body;
    try {
        const updatedPost = await BlogPost.findByIdAndUpdate(postId, updates, { new: true });
        if (!updatedPost) {
            return res.status(422).json({ message: "Blog post not found" });
        }
        res.json(updatedPost);
    } catch (error) {
        console.error(error);
        res.status(422).json({ message: "An unexpected error occurred" });
    }
}

async function removeBlogPost(req, res) {
    const postId = req.params.id;
    try {
        const deletedPost = await BlogPost.findByIdAndDelete(postId);
        if (!deletedPost) {
            return res.status(422).json({ message: "Blog post not found" });
        }
        // res.json({ message: "Blog post deleted successfully" });
        res.status(204).json();
    } catch (error) {
        console.error(error);
        res.status(422).json({ message: "An unexpected error occurred" });
    }
}

async function updateLikes(req, res) {
    const postId = req.params.id;
    try {
        const updatedPost = await BlogPost.findByIdAndUpdate(postId, { $inc: { likes: 1 } }, { new: true });
        if (!updatedPost) {
            return res.status(422).json({ message: "Blog post not found" });
        }
        res.json(updatedPost);
    } catch (error) {
        console.error(error);
        res.status(422).json({ message: "An unexpected error occurred" });
    }
}

module.exports = {
    getAllBlogPosts,
    addBlogPost,
    getOneBlogPost,
    filterBlogPosts,
    updateBlogPost,
    removeBlogPost,
    updateLikes
};
