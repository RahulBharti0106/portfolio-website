import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/admin/AdminLayout'
import toast from 'react-hot-toast'
import { FiSave, FiUpload } from 'react-icons/fi'
import './Profile.css'

function AdminProfile() {
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState({
    name: '',
    tagline: '',
    short_bio: '',
    bio: '',
    location: '',
    email: '',
    phone: '',
    profile_image_url: '',
    resume_url: ''
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profile')
        .select('*')
        .single()
      
      if (error) throw error
      if (data) setProfile(data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('profile')
        .update(profile)
        .eq('id', profile.id)

      if (error) throw error
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Error updating profile')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="admin-profile">
        <h1>Profile Management</h1>
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Tagline</label>
              <input
                type="text"
                name="tagline"
                value={profile.tagline}
                onChange={handleChange}
                placeholder="e.g., Full-Stack Developer"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={profile.phone || ''}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={profile.location}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Profile Image URL</label>
              <input
                type="url"
                name="profile_image_url"
                value={profile.profile_image_url || ''}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>

            <div className="form-group full-width">
              <label>Short Bio (for hero section)</label>
              <textarea
                name="short_bio"
                value={profile.short_bio}
                onChange={handleChange}
                rows="2"
              />
            </div>

            <div className="form-group full-width">
              <label>Full Bio (for about section)</label>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                rows="5"
              />
            </div>

            <div className="form-group">
              <label>Resume URL</label>
              <input
                type="url"
                name="resume_url"
                value={profile.resume_url || ''}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            <FiSave /> {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </AdminLayout>
  )
}

export default AdminProfile
