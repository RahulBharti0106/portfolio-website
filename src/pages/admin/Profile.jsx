// src/pages/admin/Profile.jsx
import { useState, useEffect, useRef } from 'react'
import { api } from '../../lib/api'
import AdminLayout from '../../components/admin/AdminLayout'
import toast from 'react-hot-toast'
import './Profile.css'

function AdminProfile() {
  const [loading, setLoading] = useState(false)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [bannerUploading, setBannerUploading] = useState(false)
  const avatarInputRef = useRef()
  const bannerInputRef = useRef()

  const [profile, setProfile] = useState({
    name: '',
    tagline: '',
    short_bio: '',
    bio_about: '',
    about_visible: true,
    location: '',
    email: '',
    degree: '',
    status: '',
    avatar_url: '',
    banner_url: '',
  })

  useEffect(() => { fetchProfile() }, [])

  const fetchProfile = async () => {
    try {
      const data = await api.getProfile()
      if (data) setProfile(data)
    } catch (err) {
      console.error('Profile fetch error:', err)
      toast.error('Failed to load profile')
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setProfile(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  // ── Image upload helper ──
  // Converts the file to base64 and calls api.uploadImage (or saves URL directly)
  // Adjust this to your actual image handling (Cloudinary, direct URL, etc.)
  const handleImageUpload = async (e, field) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5 MB'); return }

    const setUploading = field === 'avatar_url' ? setAvatarUploading : setBannerUploading

    setUploading(true)
    try {
      // Option A: If you have Cloudinary or similar upload endpoint via api:
      // const url = await api.uploadImage(file, field)

      // Option B (temporary local preview — replace with real upload):
      const url = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (ev) => resolve(ev.target.result)
        reader.readAsDataURL(file)
      })

      setProfile(prev => ({ ...prev, [field]: url }))
      toast.success(`${field === 'avatar_url' ? 'Profile photo' : 'Banner'} updated — remember to save!`)
    } catch (err) {
      console.error('Upload error:', err)
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.updateProfile(profile)
      toast.success('Profile updated successfully!')
      fetchProfile()
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

          {/* ── Image Uploads ── */}
          <div className="image-upload-section">
            {/* Banner */}
            <div className="image-upload-block banner-upload-block">
              <div className="banner-preview">
                {profile.banner_url
                  ? <img src={profile.banner_url} alt="Banner preview" className="banner-preview-img" />
                  : <div className="banner-preview-empty">
                      <span className="upload-placeholder-icon">🖼️</span>
                      <span>No banner image</span>
                    </div>
                }
                <button
                  type="button"
                  className="img-upload-btn banner-upload-btn"
                  onClick={() => bannerInputRef.current?.click()}
                  disabled={bannerUploading}
                >
                  {bannerUploading ? 'Uploading...' : '📷 Change Banner'}
                </button>
                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => handleImageUpload(e, 'banner_url')}
                />
              </div>
              <p className="image-upload-hint">Recommended: 1400×400px. Max 5 MB.</p>
            </div>

            {/* Avatar */}
            <div className="image-upload-block avatar-upload-block">
              <div className="avatar-preview-wrap">
                {profile.avatar_url
                  ? <img src={profile.avatar_url} alt="Avatar preview" className="avatar-preview-img" />
                  : <div className="avatar-preview-empty">
                      {profile.name?.[0]?.toUpperCase() ?? '?'}
                    </div>
                }
              </div>
              <div className="avatar-upload-controls">
                <p className="image-upload-label">Profile Photo</p>
                <button
                  type="button"
                  className="img-upload-btn"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={avatarUploading}
                >
                  {avatarUploading ? 'Uploading...' : '📷 Change Photo'}
                </button>
                {profile.avatar_url && (
                  <button
                    type="button"
                    className="img-remove-btn"
                    onClick={() => setProfile(p => ({ ...p, avatar_url: '' }))}
                  >
                    Remove
                  </button>
                )}
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => handleImageUpload(e, 'avatar_url')}
                />
                <p className="image-upload-hint">Square image recommended. Max 5 MB.</p>
              </div>
            </div>
          </div>

          {/* ── Or paste URL directly ── */}
          <div className="form-grid" style={{ marginTop: '1.5rem' }}>
            <div className="form-group">
              <label>Avatar URL (or paste link)</label>
              <input
                type="url"
                name="avatar_url"
                value={profile.avatar_url || ''}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
            <div className="form-group">
              <label>Banner URL (or paste link)</label>
              <input
                type="url"
                name="banner_url"
                value={profile.banner_url || ''}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
          </div>

          {/* ── Profile Fields ── */}
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" value={profile.name || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Tagline</label>
              <input type="text" name="tagline" value={profile.tagline || ''} onChange={handleChange} />
            </div>

            <div className="form-group full-width">
              <label>Short Bio (Hero Section)</label>
              <textarea name="short_bio" value={profile.short_bio || ''} onChange={handleChange}
                rows="2" placeholder="Brief intro for hero section" />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={profile.email || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input type="text" name="location" value={profile.location || ''} onChange={handleChange}
                placeholder="e.g. San Francisco, CA" />
            </div>

            <div className="form-group">
              <label>Degree / Education Tag</label>
              <input type="text" name="degree" value={profile.degree || ''} onChange={handleChange}
                placeholder="e.g. B.Tech Computer Science" />
            </div>
            <div className="form-group">
              <label>Status Tag</label>
              <input type="text" name="status" value={profile.status || ''} onChange={handleChange}
                placeholder="e.g. Open to opportunities" />
            </div>

            <div className="form-group full-width">
              <label>About Me (About Section)</label>
              <textarea name="bio_about" value={profile.bio_about || ''} onChange={handleChange}
                rows="6" placeholder="Write a detailed description about yourself" />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input type="checkbox" name="about_visible"
                  checked={profile.about_visible ?? true} onChange={handleChange} />
                Show About Section on Website
              </label>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </AdminLayout>
  )
}

export default AdminProfile