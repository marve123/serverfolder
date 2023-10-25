const db = require('../db')

exports.createSponPost = async (req, res) => {
    const {title, body, written_by, post_image} = req.body;

    try {
        const newSponPost = await db.query(
            "INSERT INTO sponsored_posts (title, body, written_by, post_image) VALUES (?, ?, ?, ?) RETURNING *",
            [title, body, written_by, post_image]
        );

        res.status(201).json({
            status: "success",
            data: newSponPost.rows[0]
            
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            error: error.message
        })  
    }
}

exports.getAllPosts = async (req, res) => {
    try {
        const allPosts = await db.query(
            "SELECT * FROM sponsored_posts"
        );

        res.status(200).json({
            status: "success",
            results: allPosts.rows.length,
            data: allPosts.rows
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            error: error.message
        })  
    }
}

exports.getPostById = async (req, res) => {
    try {
      const { postId } = req.params; // Assuming the URL parameter is named "postId"
  
      const post = await db.query(
        "SELECT * FROM sponsored_posts WHERE post_id = ?",
        [postId]
      );
  
      if (post.rows.length === 0) {
        // Handle the case where the post with the specified ID is not found
        return res.status(404).json({
          status: "error",
          message: "Post not found",
        });
      }
  
      res.status(200).json({
        status: "success",
        data: post.rows[0],
      });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  };
  