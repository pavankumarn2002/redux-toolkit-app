import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, addNewPost, updatePost, deletePost } from '../features/posts/postsSlice';

const PostList = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const postStatus = useSelector((state) => state.posts.status);
  const error = useSelector((state) => state.posts.error);

  const [newPostTitle, setNewPostTitle] = useState('');
  const [editPost, setEditPost] = useState(null);

  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(fetchPosts());
    }
  }, [postStatus, dispatch]);

  const handleAddPost = () => {
    if (newPostTitle) {
      const newPost = { title: newPostTitle, body: 'New body' };
      dispatch(addNewPost(newPost));
      setNewPostTitle('');
    }
  };

  const handleUpdatePost = (post) => {
    setEditPost(post);
  };

  const handleDeletePost = (postId) => {
    dispatch(deletePost(postId));
  };

  const handleSaveEdit = () => {
    if (editPost) {
      dispatch(updatePost(editPost));
      setEditPost(null);
    }
  };

  let content;

  if (postStatus === 'loading') {
    content = <div>Loading...</div>;
  } else if (postStatus === 'succeeded') {
    content = posts.map((post) => (
      <div key={post.id}>
        {editPost && editPost.id === post.id ? (
          <>
            <input
              type="text"
              value={editPost.title}
              onChange={(e) => setEditPost({ ...editPost, title: e.target.value })}
            />
            <button onClick={handleSaveEdit}>Save</button>
          </>
        ) : (
          <>
            <h3>{post.title}</h3>
            <button onClick={() => handleUpdatePost(post)}>Edit</button>
            <button onClick={() => handleDeletePost(post.id)}>Delete</button>
          </>
        )}
      </div>
    ));
  } else if (postStatus === 'failed') {
    content = <div>{error}</div>;
  }

  return (
    <div>
      <h2>Posts</h2>
      <input
        type="text"
        value={newPostTitle}
        onChange={(e) => setNewPostTitle(e.target.value)}
        placeholder="New post title"
      />
      <button onClick={handleAddPost}>Add Post</button>
      <div>{content}</div>
    </div>
  );
};

export default PostList;
