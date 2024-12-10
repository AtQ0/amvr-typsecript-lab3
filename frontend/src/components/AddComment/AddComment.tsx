import { FC, useState } from 'react';
import { Comment, CommentData } from '../../types/post';
import styles from './AddComment.module.css';

interface Props {
  postId: string;
  onCommentCreated: (newComment: Comment) => void;
}

const AddComment: FC<Props> = ({ postId, onCommentCreated }) => {
  const [content, setContent] = useState('');
  const [appUserId, setAppUserId] = useState('');
  const [showForm, setShowForm] = useState(false); // Initially hide the form

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    const newComment: CommentData = {
      content,
      app_user_id: appUserId,
      post_id: postId,
    };
    console.log(newComment);

    try {
      const response = await fetch('/api/posts/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newComment),
      });

      if (response.ok) {
        const createdComment: Comment = await response.json();
        console.log(createdComment);
        onCommentCreated(createdComment);
        setContent('');
        setAppUserId('');
        setShowForm(false); // Hide the form after commenting
      } else {
        const errorData = await response.json();
        console.error('Error creating comment:', errorData);
      }
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.linkButton}
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'X' : 'Add Comment'}
      </button>
      <form
        onSubmit={handleSubmit}
        className={[
          styles.commentContainer,
          showForm ? '' : styles.isHidden,
        ].join(' ')}
      >
        <div>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="appUserId">App User ID:</label>
          <input
            type="text"
            id="appUserId"
            value={appUserId}
            onChange={(e) => setAppUserId(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.button}>
          Create Comment
        </button>
      </form>
    </div>
  );
};

export default AddComment;
