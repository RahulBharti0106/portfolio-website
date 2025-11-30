import { useState } from 'react'
import { FiMail, FiMapPin, FiPhone, FiSend } from 'react-icons/fi'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import './Contact.css'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.from('contact_messages').insert([formData])

      if (error) throw error

      toast.success('Message sent successfully! ✅')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      toast.error('Failed to send message. Please try again. ❌')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="contact-section">
      <h2 className="section-title">Get In <span>Touch</span></h2>

      <div className="contact-content">
        <div className="contact-info">
          <h3>Let's talk about everything!</h3>
          <p>Don't like forms? Send me an email. 👋</p>

          <div className="contact-details">
            <div className="contact-item">
              <FiMail size={24} />
              <div>
                <h4>Email</h4>
                <p>rahul@example.com</p>
              </div>
            </div>

            <div className="contact-item">
              <FiMapPin size={24} />
              <div>
                <h4>Location</h4>
                <p>Haryana, India</p>
              </div>
            </div>


          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input type="text" name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <textarea name="message" placeholder="Your Message" rows="5" value={formData.message} onChange={handleChange} required></textarea>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <FiSend /> {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </section>
  )
}

export default Contact
