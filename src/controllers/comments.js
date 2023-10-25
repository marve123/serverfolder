const db = require('../db')

exports.createComment = async (req, res) => {
    const {post_id, author, author_pic, content} = req.body;

    try {
        const newComment = await db.query(
            "INSERT INTO comments (post_id, author, author_pic, content) VALUES (?, ?, ?, ?) RETURNING *",
            [post_id, author, author_pic, content]
        );

        res.status(201).json({
            status: "success",
            message: "Comment Added",
            data: newComment.rows[0]
            
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            error: error.message
        })  
    }
}

exports.getCommentForPost = async (req, res) => {
    const { postId } = req.params;

    try {
        const allComments = await db.query(
            "SELECT * FROM comments WHERE post_id = ?",
            [postId]
        );

        res.status(201).json({
            status: "success",
            data: allComments.rows
            
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            error: error.message
        })  
    }
}