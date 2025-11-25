import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import AdminLayout from "../../components/admin/AdminLayout";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff } from "react-icons/fi";

function AdminSocial() {
  const [links, setLinks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [formData, setFormData] = useState({
    platform: "",
    url: "",
    icon: "FiLink",
    visible: true,
  });

  useEffect(() => {
    fetchLinks();
    // eslint-disable-next-line
  }, []);

  const fetchLinks = async () => {
    const { data } = await supabase
      .from("social_links")
      .select("*")
      .order("id");
    setLinks(data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLink) {
        await supabase
          .from("social_links")
          .update(formData)
          .eq("id", editingLink.id);
        toast.success("Link updated!");
      } else {
        await supabase
          .from("social_links")
          .insert([formData]);
        toast.success("Link added!");
      }
      setShowModal(false);
      resetForm();
      fetchLinks();
    } catch (error) {
      toast.error("Error saving link");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this link?")) return;
    await supabase.from("social_links").delete().eq("id", id);
    toast.success("Link deleted");
    fetchLinks();
  };

  const toggleVisibility = async (link) => {
    await supabase
      .from("social_links")
      .update({ visible: !link.visible })
      .eq("id", link.id);
    fetchLinks();
  };

  const resetForm = () => {
    setFormData({
      platform: "",
      url: "",
      icon: "FiLink",
      visible: true,
    });
    setEditingLink(null);
  };

  return (
    <AdminLayout>
      <div style={{ padding: "0", maxWidth: "800px" }}>
        <div className="page-header">
          <h1>Social Links</h1>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary"
          >
            <FiPlus /> Add Link
          </button>
        </div>

        <div style={{ display: "grid", gap: "1rem" }}>
          {links.map((link) => (
            <div
              key={link.id}
              className="card"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                opacity: link.visible ? 1 : 0.5,
              }}
            >
              <div>
                <h3>{link.platform}</h3>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}
                >
                  {link.url}
                </a>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => toggleVisibility(link)}
                  className="btn-icon"
                >
                  {link.visible ? <FiEye /> : <FiEyeOff />}
                </button>
                <button
                  onClick={() => {
                    setEditingLink(link);
                    setFormData(link);
                    setShowModal(true);
                  }}
                  className="btn-icon"
                >
                  <FiEdit2 />
                </button>
                <button
                  onClick={() => handleDelete(link.id)}
                  className="btn-icon danger"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div
            className="modal-overlay"
            onClick={() => {
              setShowModal(false);
              resetForm();
            }}
          >
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>{editingLink ? "Edit Link" : "Add Social Link"}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Platform Name</label>
                  <input
                    type="text"
                    value={formData.platform}
                    onChange={(e) =>
                      setFormData({ ...formData, platform: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>URL</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Icon Name (react-icons/fi)</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData({ ...formData, icon: e.target.value })
                    }
                    placeholder="FiGithub"
                  />
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.visible}
                      onChange={(e) =>
                        setFormData({ ...formData, visible: e.target.checked })
                      }
                    />
                    Visible (show in About & Footer)
                  </label>
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminSocial;
