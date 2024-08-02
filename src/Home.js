import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth, firestore } from './firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  doc,
  arrayUnion,
  increment,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';

const Home = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');

  useEffect(() => {
    const q = query(collection(firestore, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribePosts = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribePosts();
    };
  }, []);

  const addPost = async () => {
    if (newPost.trim()) {
      await addDoc(collection(firestore, 'posts'), {
        text: newPost,
        createdAt: new Date(),
        user: user.displayName,
        userId: user.uid,
        likes: 0,
        likedBy: [],
        dislikedBy: [],
        comments: [],
      });
      setNewPost('');

      // Scroll to the top after posting
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const likePost = async (postId) => {
    const postRef = doc(firestore, 'posts', postId);
    const postSnapshot = await getDoc(postRef);
    const postData = postSnapshot.data();

    // Ensure dislikedBy and likedBy arrays are initialized
    if (!postData.likedBy) postData.likedBy = [];
    if (!postData.dislikedBy) postData.dislikedBy = [];

    // Check if the user has already liked the post
    if (!postData.likedBy.includes(user.uid)) {
      await updateDoc(postRef, {
        likes: increment(1),
        likedBy: arrayUnion(user.uid),
        dislikedBy: postData.dislikedBy.filter((id) => id !== user.uid), // Remove user from dislikedBy if they disliked before
      });
    }
  };

  const dislikePost = async (postId) => {
    const postRef = doc(firestore, 'posts', postId);
    const postSnapshot = await getDoc(postRef);
    const postData = postSnapshot.data();

    // Ensure dislikedBy and likedBy arrays are initialized
    if (!postData.dislikedBy) postData.dislikedBy = [];
    if (!postData.likedBy) postData.likedBy = [];

    // Check if the user has already disliked the post
    if (!postData.dislikedBy.includes(user.uid)) {
      const newLikes = Math.max(postData.likes - 1, 0); // Ensure likes do not go below 0

      await updateDoc(postRef, {
        likes: newLikes,
        dislikedBy: arrayUnion(user.uid),
        likedBy: postData.likedBy.filter((id) => id !== user.uid), // Remove user from likedBy if they liked before
      });
    }
  };

  const addComment = async (e, postId) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      const postRef = doc(firestore, 'posts', postId);
      const comment = {
        text: e.target.value,
        user: user.displayName,
        userId: user.uid,
        createdAt: new Date(),
        likedBy: [], // Array to track users who liked the comment
        dislikedBy: [], // Array to track users who disliked the comment
        likes: 0, // Like counter for the comment
      };
      await updateDoc(postRef, {
        comments: arrayUnion(comment),
      });
      e.target.value = '';
    }
  };

  const likeComment = async (postId, commentIndex) => {
    const postRef = doc(firestore, 'posts', postId);
    const postSnapshot = await getDoc(postRef);
    const postData = postSnapshot.data();

    const comment = postData.comments[commentIndex] || {}; // Safely retrieve the comment object

    // Ensure likedBy and dislikedBy are initialized
    if (!comment.likedBy) comment.likedBy = [];
    if (!comment.dislikedBy) comment.dislikedBy = [];

    // Check if the user has already liked the comment
    if (!comment.likedBy.includes(user.uid)) {
      comment.likedBy.push(user.uid);
      comment.dislikedBy = comment.dislikedBy.filter((id) => id !== user.uid); // Remove user from dislikedBy if they disliked before
      comment.likes += 1;
    }

    postData.comments[commentIndex] = comment;

    await updateDoc(postRef, {
      comments: postData.comments,
    });
  };

  const dislikeComment = async (postId, commentIndex) => {
    const postRef = doc(firestore, 'posts', postId);
    const postSnapshot = await getDoc(postRef);
    const postData = postSnapshot.data();

    const comment = postData.comments[commentIndex] || {}; // Safely retrieve the comment object

    // Ensure likedBy and dislikedBy are initialized
    if (!comment.likedBy) comment.likedBy = [];
    if (!comment.dislikedBy) comment.dislikedBy = [];

    // Check if the user has already disliked the comment
    if (!comment.dislikedBy.includes(user.uid)) {
      comment.dislikedBy.push(user.uid);
      comment.likedBy = comment.likedBy.filter((id) => id !== user.uid); // Remove user from likedBy if they liked before
      comment.likes = Math.max(comment.likes - 1, 0); // Ensure comment likes do not go below 0
    }

    postData.comments[commentIndex] = comment;

    await updateDoc(postRef, {
      comments: postData.comments,
    });
  };

  const deletePost = async (postId) => {
    try {
      const postRef = doc(firestore, 'posts', postId);
      await deleteDoc(postRef);
    } catch (error) {
      console.error('Error deleting post: ', error);
    }
  };

  return (
    <div>
      <header>
        <h1>Social Media App</h1>
        <button onClick={() => signOut(auth)}>Sign Out</button>
      </header>
      <div>
        <input
          type="text"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="What's on your mind?"
        />
        <button onClick={addPost}>Post</button>
      </div>
      <div className="posts-container">
        {posts.map((post) => (
          <div key={post.id} className="post">
            <h3>{post.user}</h3>
            <p>{post.text}</p>
            <button onClick={() => likePost(post.id)}>Like ({post.likes})</button>
            <button onClick={() => dislikePost(post.id)}>Dislike</button>
            {post.userId === user.uid && (
              <button onClick={() => deletePost(post.id)}>Delete Post</button>
            )}
            <div className="comments-container">
              {post.comments.map((comment, index) => (
                <div key={index} className="comment">
                  <p>
                    <strong>{comment.user}</strong>: {comment.text}
                  </p>
                  <button onClick={() => likeComment(post.id, index)}>Like Comment ({comment.likes})</button>
                  <button onClick={() => dislikeComment(post.id, index)}>Dislike Comment</button>
                </div>
              ))}
              <input
                type="text"
                placeholder="Add a comment"
                onKeyPress={(e) => addComment(e, post.id)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
