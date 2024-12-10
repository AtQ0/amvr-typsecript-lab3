import { FC, useState } from 'react';
import { PostData } from '../../types/post';
import styles from './CreatePost.module.css';

interface Props {
  onPostCreated: (newPost: string) => void;
}

const CreatePost: FC<Props> = ({ onPostCreated }) => {
  const [showForm, setShowForm] = useState(false);
  const [formState, setFormState] = useState({
    title: '',
    app_user_id: '',
    content: '',
  });
  const resetForm = () => {
    setFormState({
      title: '',
      app_user_id: '',
      content: '',
    });
    setShowForm(false);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    const newPost: PostData = formState;
    console.log('body', newPost);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });

      if (response.ok) {
        console.log('Post created successfully!');
        const newPost: string = await response.json();
        console.log('newpost', newPost);
        onPostCreated(newPost);
        resetForm();
      } else {
        const errorData = await response.json();
        throw new Error(
          `Error creating post: ${errorData.message || 'Unknown error'}`
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.postContainer}>
        <button
          type="button"
          className={styles.button}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Close' : 'Add New Post'}
        </button>

        <form
          className={[styles.submitForm, !showForm && styles.isHidden].join(
            ' '
          )}
          onSubmit={handleSubmit}
        >
          <div>
            <h3>Title</h3>
            <input
              type="text"
              id="title"
              value={formState.title}
              onChange={(e) =>
                setFormState({ ...formState, title: e.target.value })
              }
              required
            />
          </div>
          <div>
            <h3>Content</h3>
            <textarea
              id="content"
              value={formState.content}
              onChange={(e) =>
                setFormState({ ...formState, content: e.target.value })
              }
              required
            />
          </div>
          <div>
            <h3>User ID</h3>
            <input
              type="text"
              id="appUserId"
              value={formState.app_user_id}
              onChange={(e) =>
                setFormState({ ...formState, app_user_id: e.target.value })
              }
              required
            />
          </div>
          <button type="submit" className={styles.button}>
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
