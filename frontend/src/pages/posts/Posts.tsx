import { FC, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AddComment from '../../components/AddComment/AddComment';
import CreatePost from '../../components/CreatePost/CreatePost';
import { Comment, Post } from '../../types/post';
import styles from './Posts.module.css';

const Posts: FC = () => {
  const [fetchedPosts, setFetchedPosts] = useState<Post[]>([]);

  const timeSince = useMemo(() => {
    return (timestamp: string) => {
      const then = new Date(timestamp);
      const now = new Date();
      const seconds = Math.round((now.getTime() - then.getTime()) / 1000);

      const intervals = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'day', seconds: 86400 },
        { label: 'h', seconds: 3600 },
        { label: 'm', seconds: 60 },
      ];

      for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count >= 1) {
          return `${count} ${interval.label}`;
        }
      }

      return 'Just now';
    };
  }, []);

  const fetchPostsAndComments = async () => {
    try {
      const response = await fetch('/api/posts/posts-w-comments');
      const data = await response.json();
      console.log('Posts:', data);
      setFetchedPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchPostById = async (postId: string) => {
    console.log('postid', postId);
    try {
      const response = await fetch(`/api/posts/${postId}`);
      const data = await response.json();
      console.log('Posts:', data);
      return data;
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  };

  useEffect(() => {
    fetchPostsAndComments();
  }, []);

  const handlePostCreated = async (newPost: string) => {
    console.log('newpost in posts', newPost);
    const nextPost = await fetchPostById(newPost);

    setFetchedPosts([nextPost, ...fetchedPosts]);
  };

  const handleCommentCreated = async (newComment: Comment) => {
    try {
      setFetchedPosts((prevPosts) => {
        const postIndex = prevPosts.findIndex(
          (post) => post.id === newComment.post_id
        );
        if (postIndex === -1) {
          return prevPosts;
        }

        const updatedPosts = [...prevPosts];
        const postToUpdate = { ...updatedPosts[postIndex] };
        postToUpdate.comments = [...postToUpdate.comments, newComment];
        updatedPosts[postIndex] = postToUpdate;
        return updatedPosts;
      });
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <CreatePost onPostCreated={handlePostCreated} />
      </div>
      {fetchedPosts.map((post) => (
        <div key={post.id} className={styles.postContainer}>
          <div className={styles.post}>
            <div className={styles.postContent}>
              <Link
                className={styles.userLink}
                to={`/users/${post.app_user_id}/profile`}
              >
                <span>{post.username}</span>
              </Link>
              <h2 className={styles.postTitle}>{post.title}</h2>
              <p className={styles.postText}>{post.content}</p>
            </div>
            <div className={styles.timeCreated}>
              <span>{timeSince(post.created_at)}</span>
            </div>
          </div>
          {post.comments.map((comment) => (
            <div key={comment.id} className={styles.commentContainer}>
              <div className={styles.comment}>
                <Link
                  className={styles.userLink}
                  to={`/users/${comment.app_user_id}/profile`}
                >
                  <span>{comment.username}</span>
                </Link>

                <p className={styles.commentText}>{comment.content}</p>
              </div>
              <div className={styles.timeCreated}>
                <span>{timeSince(comment.created_at)}</span>
              </div>
            </div>
          ))}
          <AddComment
            onCommentCreated={handleCommentCreated}
            postId={post.id}
          />
        </div>
      ))}
    </div>
  );
};

export default Posts;
