const express = require('express');
const {
  getAllPosts,
  getAllPostsWithComments,
  getPostById,
  getPostsByUser,
  deletePost,
  deleteComment,
  createPost,
  createComment,
} = require('../repositories/postController');
const routes = express.Router();

routes.get('/', getAllPosts);
routes.get('/posts-w-comments', getAllPostsWithComments);
routes.get('/:postId', getPostById);
routes.get('/user/:userId', getPostsByUser);
routes.delete('/:postId', deletePost);
routes.delete('/comment/:commentId', deleteComment);
routes.post('/', createPost);
routes.post('/comment', createComment);

module.exports = routes;
