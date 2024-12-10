const db = require('../utils');

exports.getAllPosts = async (req, res) => {
  try {
    const postsResult = await db.query('SELECT * FROM post');
    return res.status(200).json(postsResult.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error fetching data');
  }
};

exports.getAllPostsWithComments = async (req, res) => {
  try {
    const postsResult = await db.query(`
      SELECT
        p.*,
        au.first_name || ' ' || au.last_name AS username
      FROM post p
      JOIN app_user au ON p.app_user_id = au.id
      ORDER BY p.created_at DESC
    `);

    const posts = postsResult.rows;

    const commentsResult = await db.query(`
      SELECT
        c.id,
        c.content,
        c.app_user_id,
        c.created_at,
        c.modified_at,
        au.first_name || ' ' || au.last_name AS username,
        c.post_id
      FROM comment c
      JOIN app_user au ON c.app_user_id = au.id
    `);

    const comments = commentsResult.rows;

    const commentsByPostId = {};
    comments.forEach((comment) => {
      if (!commentsByPostId[comment.post_id]) {
        commentsByPostId[comment.post_id] = [];
      }
      commentsByPostId[comment.post_id].push(comment);
    });

    const response = posts.map((post) => ({
      ...post,
      comments: commentsByPostId[post.id] || [],
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch posts and comments' });
  }
};

exports.getPostById = async (req, res) => {
  const { postId } = req.params;

  try {
    const postResult = await db.query(
      `
      SELECT
        p.*,
        au.first_name || ' ' || au.last_name AS username
      FROM post p
      JOIN app_user au ON p.app_user_id = au.id
      WHERE p.id = $1
    `,
      [postId]
    );
    const post = postResult.rows[0];

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const commentsResult = await db.query(
      `
      SELECT
        c.*,
        au.first_name || ' ' || au.last_name AS username
      FROM comment c
      JOIN app_user au ON c.app_user_id = au.id
      WHERE c.post_id = $1
      ORDER BY c.created_at ASC
    `,
      [postId]
    );

    const comments = commentsResult.rows;

    const response = {
      ...post,
      comments,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch post and comments' });
  }
};

exports.getPostsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch posts created by user
    const postsResult = await db.query(
      `
      SELECT
        p.*,
        au.first_name,
        au.last_name
      FROM post p
      JOIN app_user au ON p.app_user_id = au.id
      WHERE au.id = $1
      `,
      [userId]
    );

    const posts = postsResult.rows;

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch posts by user' });
  }
};

exports.getPostWithComments = async (req, res) => {
  const { postId } = req.params;

  try {
    // Fetch the post
    const postResult = await db.query(
      `
      SELECT
        p.*,
        au.first_name || ' ' || au.last_name AS username
      FROM post p
      JOIN app_user au ON p.app_user_id = au.id
      WHERE p.id = $1
      `,
      [postId]
    );

    if (postResult.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const post = postResult.rows[0];

    // Fetch comments for the post
    const commentsResult = await db.query(
      `
      SELECT
        c.*,
        au.first_name || ' ' || au.last_name AS username
      FROM comment c
      JOIN app_user au ON c.app_user_id = au.id
      WHERE c.post_id = $1
      ORDER BY c.created_at ASC
      `,
      [postId]
    );

    const comments = commentsResult.rows;

    const response = {
      ...post,
      comments,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch post and comments' });
  }
};

/* Save if deletePost dont act safe */
// exports.deletePostWComments = async (req, res) => {
//   const { postId } = req.params;
//   console.log('postId', postId);

//   try {
//     await db.query('BEGIN');

//     const deleteCommentsResult = await db.query(
//       'DELETE FROM comment WHERE post_id = $1',
//       [postId]
//     );
//     if (deleteCommentsResult.rowCount === 0) {
//       throw new Error('No comments found for this post');
//     }

//     const deletePostResult = await db.query('DELETE FROM post WHERE id = $1', [
//       postId,
//     ]);
//     if (deletePostResult.rowCount === 0) {
//       throw new Error('Post not found');
//     }

//     await db.query('COMMIT');

//     res.status(204).send(`post and comments för id: ${postId} deleted`);
//   } catch (error) {
//     await db.query('ROLLBACK');
//     console.error(error);
//     res.status(500).json({ error: 'Failed to delete post' });
//   }
// };

exports.deletePost = async (req, res) => {
  const { postId } = req.params;
  console.log('postId', postId);

  try {
    const result = await db.query(`DELETE FROM post WHERE id = $1;`, [postId]);
    console.log('result', result);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(204).send(`post and comments för id: ${postId} deleted`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
};

exports.deleteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    // Delete the comment from the database
    const result = await db.query(
      `
      DELETE FROM comment
      WHERE id = $1;
    `,
      [commentId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};

exports.createPost = async (req, res) => {
  const { title, content, app_user_id } = req.body;

  try {
    const result = await db.query(
      `
      INSERT INTO post (title, content, app_user_id)
      VALUES ($1, $2, $3)
      RETURNING *;
    `,
      [title, content, app_user_id]
    );

    const newPost = result.rows[0];

    res.status(201).json(newPost.id);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

/* Works when user is logged in, can get username otherwise */
exports.createComment = async (req, res) => {
  const { content, app_user_id, post_id } = req.body;

  try {
    const result = await db.query(
      `
      INSERT INTO comment (content, app_user_id, post_id)
      VALUES ($1, $2, $3)
      RETURNING *,
        (SELECT first_name || ' ' || last_name FROM app_user WHERE id = $2) AS username;
    `,
      [content, app_user_id, post_id]
    );

    const newComment = result.rows[0];

    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};
