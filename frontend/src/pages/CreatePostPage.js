// pages/CreatePostPage.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CreatePostPage = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  // Convert image file to Base64 string
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setImage(file);
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    if (!user) {
      setError("You must be logged in to create a post");
      setLoading(false);
      return;
    }

    if (!title.trim()) {
      setError("Please enter a title");
      setLoading(false);
      return;
    }

    if (!body.trim()) {
      setError("Please enter content");
      setLoading(false);
      return;
    }

    try {
      // Get existing posts from localStorage
      const existingPosts = JSON.parse(localStorage.getItem('posts') || '[]');
      
      // Convert image to Base64 if exists
      let imageBase64 = null;
      if (image) {
        imageBase64 = await convertToBase64(image);
      }
      
      const newPost = {
        id: Date.now(),
        title: title,
        body: body,
        author: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        status: 'published',
        createdAt: new Date().toISOString(),
        image: imageBase64 // Store as Base64 (persists after refresh)
      };
      
      // Save to localStorage
      const updatedPosts = [newPost, ...existingPosts];
      localStorage.setItem('posts', JSON.stringify(updatedPosts));
      
      setSuccess(true);
      setTitle('');
      setBody('');
      setImage(null);
      setImagePreview(null);
      
      // Reset file input
      const fileInput = document.getElementById('image');
      if (fileInput) fileInput.value = '';
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (err) {
      setError('Failed to publish post: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-card">
        <h1 className="contact-title">Create New Post</h1>
        <p style={{color: 'var(--muted)', textAlign: 'center', marginBottom: '30px'}}>
          Share something with your community 👟
        </p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            ✓ Post published successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="title">Post Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter post title"
              required
              className="form-input"
            />
          </div>

           {/* Image upload for ALL users */}
          <div className="form-group">
            <label htmlFor="image">Upload Cover Image (Optional)</label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="form-input"
              style={{padding: '10px'}}
            />
            {imagePreview && (
              <div style={{marginTop: '10px'}}>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{maxWidth: '100%', maxHeight: '200px', borderRadius: '8px'}}
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="body">Post Content</label>
            <textarea
              id="body"
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Write your post here..."
              rows={8}
              required
              className="form-input"
              style={{resize: 'vertical'}}
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary auth-btn"
            disabled={loading}
          >
            {loading ? "Publishing..." : "Publish Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;