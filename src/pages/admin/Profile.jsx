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
    bio_about: "",
    experience_years: 0,
    projects_count: 0,
    about_visible: true,
    location: "",
    email: "",
    phone: "",
    profile_image_url: "",
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
    const updateProfile = { ...profile };
    // Ensure only desired keys are sent
    try {
      const { error } = await supabase
        .from("profile")
        .update(updateProfile)
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
        <h1>Profile/About Management</h1>
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={profile.name || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Tagline</label>
              <input
                type="text"
                name="tagline"
                value={profile.tagline || ""}
                onChange={handleChange}
              />
            </div>

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

            <div className="form-group">
              <label>Profile Image URL</label>
              <input
                type="url"
                name="profile_image_url"
                value={profile.profile_image_url || ""}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>

            {/* About fields */}
            <div className="form-group full-width">
              <label>About/Bio</label>
              <textarea
                name="bio_about"
                value={profile.bio_about || ""}
                onChange={handleChange}
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>Years Experience</label>
              <input
                type="number"
                name="experience_years"
                value={profile.experience_years || 0}
                onChange={handleChange}
                min={0}
              />
            </div>

            <div className="form-group">
              <label>Projects Count</label>
              <input
                type="number"
                name="projects_count"
                value={profile.projects_count || 0}
                onChange={handleChange}
                min={0}
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
                Show About Section on Main Website
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
