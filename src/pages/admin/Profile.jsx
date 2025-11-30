import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import AdminLayout from "../../components/admin/AdminLayout";
import toast from "react-hot-toast";
import "./Profile.css";

function AdminProfile() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    tagline: "",
    short_bio: "",
    bio_about: "",
    about_visible: true,
    location: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  const fetchProfile = async () => {
    const { data, error } = await supabase.from("profile").select("*").single();
    if (!error && data) setProfile(data);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from("profile")
        .update(profile)
        .eq("id", profile.id);
      if (error) throw error;
      toast.success("Profile updated successfully!");
      fetchProfile();
    } catch (error) {
      toast.error("Error updating profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-profile">
        <h1>Profile Management</h1>
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-grid">
            {/* Hero Section Fields */}
            <div className="form-group">
              <label>Full Name (Hero Section)</label>
              <input
                type="text"
                name="name"
                value={profile.name || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Tagline (Hero Section)</label>
              <input
                type="text"
                name="tagline"
                value={profile.tagline || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full-width">
              <label>Short Bio (Hero Section)</label>
              <textarea
                name="short_bio"
                value={profile.short_bio || ""}
                onChange={handleChange}
                rows="2"
                placeholder="Brief intro for hero section"
              />
            </div>

            {/* Contact Info */}
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={profile.email || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={profile.phone || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={profile.location || ""}
                onChange={handleChange}
              />
            </div>


            {/* About Section Fields */}
            <div className="form-group full-width">
              <label>About Me (About Section Description)</label>
              <textarea
                name="bio_about"
                value={profile.bio_about || ""}
                onChange={handleChange}
                rows="6"
                placeholder="Write a detailed description about yourself for the About section"
              />
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="about_visible"
                  checked={
                    typeof profile.about_visible === "undefined"
                      ? true
                      : profile.about_visible
                  }
                  onChange={handleChange}
                />{" "}
                Show About Section on Website
              </label>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}

export default AdminProfile;