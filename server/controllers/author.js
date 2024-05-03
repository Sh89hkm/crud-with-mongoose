const BlogPost = require('../models/blog-post');

async function getAllAuthors(_, res) {
    try {
        const authors = await BlogPost.distinct("author");
        const uniqueAuthors = Object.values(authors)
                                    // .filter(author => author.name !== undefined) // Filter out objects where name is undefined
                                    // .filter((author, index, self) => index === self.findIndex(a => a.name === author.name));
        // console.log("authors", uniqueAuthors)
        res.json(uniqueAuthors);
        // find all the post where author gender is Female and don't return or show the author id for them
        // const distinctAuthors = await BlogPost.find({ 'author.gender': 'Female' }, {'author._id': 0});
        // console.log(distinctAuthors);
        // solution 1
        // find unique author names remove repeated names
        // const uniqueNames = await BlogPost.find({ 'author.gender': 'Female' }, {'author._id': 0}).distinct('author.name');
        // solution 2 
        // Create a set of unique author names remove repeated names
        // const uniqueNames = [...new Set(distinctAuthors.map(post => post.author.name))];
        // console.log(uniqueNames);
        // Create an array of unique author objects
        // const uniqueAuthors = uniqueNames.map(name => {
        // Find the first author object with the matching name
        // const author = distinctAuthors.find(post => post.author.name === name).author;
        // return author;
        // });
        // console.log(uniqueAuthors);
        // res.json(uniqueAuthors);
    } catch (err) {
        res.status(422).json({ message: err.message });
    }
}

async function updateAuthor(req, res) {
    const authorName = req.params.name;
    const updateSet = {};
    /* Request body might give us values like this:
    {
        age: 28,
        areasOfExpertise: ["design", "ux/ui", "art"]
    }
    */
    Object.keys(req.body).forEach(key => {
        updateSet[`author.${key}`] = req.body[key]
    });
    /* The above logic changes to:
    {
        "author.age": 28,
        "author.areasOfExpertise": ["design", "ux/ui", "art"]
    }
    Since MongoDB query requires nested keys for author object
    */
    try {
        // Update author details in all related blog posts
        // const authorBeforeUpdate = await BlogPost.find({ 'author.name': authorName });
        // console.log("authorBeforeUpdate", authorBeforeUpdate)
        const updatedAuthor = await BlogPost.updateMany({ 'author.name': authorName }, { $set: updateSet });
        // console.log("updatedAuthorOperation", updatedAuthor)
        // const authorAfterUpdate = await BlogPost.find({ 'author.name': authorName });
        // console.log("authorAfterUpdate", authorAfterUpdate)
        res.json({updated: updatedAuthor});
    } catch (err) {
        res.status(422).json({ message: err.message });
    }
}

module.exports = {
    getAllAuthors,
    updateAuthor
};