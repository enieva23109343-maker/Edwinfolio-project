// pages/ContactPage.js
import { useState } from 'react';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
    // Clear error when user starts typing
    if (errors[e.target.id]) {
      setErrors({
        ...errors,
        [e.target.id]: ''
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters.";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSuccess(false);
    } else {
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setErrors({});
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <div className="login-container">
      <div className="glass-card">
        <h1 className="login-title">Contact Me</h1>
        
        {success && (
          <div className="success-message">
            ✓ Message sent successfully!
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              className="form-input"
            />
            {errors.name && <div className="error-message" style={{marginTop: '5px', marginBottom: '0'}}>{errors.name}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className="form-input"
            />
            {errors.email && <div className="error-message" style={{marginTop: '5px', marginBottom: '0'}}>{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea 
              id="message" 
              rows="4"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message"
              className="form-input"
              style={{resize: 'vertical'}}
            ></textarea>
            {errors.message && <div className="error-message" style={{marginTop: '5px', marginBottom: '0'}}>{errors.message}</div>}
          </div>
          
          <button 
            type="submit" 
            className="btn-primary auth-btn"
          >
            Send Message
          </button>
        </form>

        <div style={{marginTop: '40px'}}>
          <h2 className="login-title" style={{fontSize: '1.5rem', marginBottom: '20px'}}>Find Me</h2>
          
          <div className="map-container" style={{marginBottom: '15px'}}>
            <iframe
              src="https://www.google.com/maps?q=Sydney+Opera+House,+NSW,+Australia&z=15&output=embed"
              loading="lazy"
              title="Google Map of Sydney"
              referrerPolicy="no-referrer-when-downgrade"
              style={{width: '100%', height: '300px', borderRadius: '12px'}}
            >
            </iframe>
          </div>
          
          <p className="register-link" style={{marginTop: '10px', marginBottom: '30px'}}>
            📍 Sydney, Australia
          </p>

          <h2 className="login-title" style={{fontSize: '1.5rem', marginBottom: '20px'}}>Helpful Resources</h2>
          
          <div style={{overflowX: 'auto'}}>
            <table className="admin-table" style={{width: '100%'}}>
              <thead>
                <tr>
                  <th>Resource</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><a href="https://developer.mozilla.org/" target="_blank" rel="noopener noreferrer" className="link">MDN Web Docs</a></td>
                  <td>Official web documentation</td>
                </tr>
                <tr>
                  <td><a href="https://www.w3schools.com/" target="_blank" rel="noopener noreferrer" className="link">W3Schools</a></td>
                  <td>Beginner-friendly tutorials</td>
                </tr>
                <tr>
                  <td><a href="https://www.geeksforgeeks.org/" target="_blank" rel="noopener noreferrer" className="link">GeeksforGeeks</a></td>
                  <td>Programming references</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;