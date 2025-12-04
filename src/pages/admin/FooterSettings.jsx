import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiSave } from 'react-icons/fi';
import './FooterSettings.css';

function AdminFooterSettings() {
    const [footerSettings, setFooterSettings] = useState({
        brand_name: 'Portfolio',
        description: 'Building amazing digital experiences',
        show_product_column: true,
        product_column_title: 'Product',
        show_resources_column: true,
        resources_column_title: 'Resources',
        show_company_column: false,
        company_column_title: 'Company',
        copyright_text: 'All rights reserved.'
    });

    const [companyLinks, setCompanyLinks] = useState([]);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [editingLink, setEditingLink] = useState(null);
    const [linkForm, setLinkForm] = useState({
        label: '',
        url: '',
        is_visible: true
    });

    const [footerId, setFooterId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchFooterSettings();
        fetchCompanyLinks();
    }, []);

    const fetchFooterSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('footer_settings')
                .select('*')
                .eq('is_active', true)
                .maybeSingle();

            if (!error && data) {
                setFooterSettings(data);
                setFooterId(data.id);
            }
        } catch (err) {
            console.error('Footer fetch error:', err);
            toast.error('Failed to load footer settings');
        } finally {
            setLoading(false);
        }
    };

    const fetchCompanyLinks = async () => {
        try {
            const { data } = await supabase
                .from('footer_links')
                .select('*')
                .eq('column_name', 'company')
                .order('display_order');

            setCompanyLinks(data || []);
        } catch (err) {
            console.error('Company links fetch error:', err);
        }
    };

    const handleSettingsChange = (field, value) => {
        setFooterSettings(prev => ({ ...prev, [field]: value }));
    };

    const saveFooterSettings = async () => {
        setSaving(true);
        try {
            // First, deactivate all other footer settings
            await supabase.from('footer_settings').update({ is_active: false }).neq('id', footerId || 0);

            if (footerId) {
                const { error } = await supabase
                    .from('footer_settings')
                    .update({
                        brand_name: footerSettings.brand_name,
                        description: footerSettings.description,
                        show_product_column: footerSettings.show_product_column,
                        product_column_title: footerSettings.product_column_title,
                        show_resources_column: footerSettings.show_resources_column,
                        resources_column_title: footerSettings.resources_column_title,
                        show_company_column: footerSettings.show_company_column,
                        company_column_title: footerSettings.company_column_title,
                        copyright_text: footerSettings.copyright_text,
                        is_active: true,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', footerId);

                if (error) throw error;
            } else {
                const { data, error } = await supabase
                    .from('footer_settings')
                    .insert([{ ...footerSettings, is_active: true }])
                    .select()
                    .single();

                if (error) throw error;
                setFooterId(data.id);
            }

            toast.success('✅ Footer settings saved! Refresh the main website to see changes.');
            // Refresh the data to show updated state
            fetchFooterSettings();
        } catch (err) {
            console.error('Save error:', err);
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const openLinkModal = (link = null) => {
        if (link) {
            setEditingLink(link);
            setLinkForm({
                label: link.label,
                url: link.url,
                is_visible: link.is_visible
            });
        } else {
            setEditingLink(null);
            setLinkForm({
                label: '',
                url: '',
                is_visible: true
            });
        }
        setShowLinkModal(true);
    };

    const saveLinkHandler = async (e) => {
        e.preventDefault();

        try {
            if (editingLink) {
                const { error } = await supabase
                    .from('footer_links')
                    .update(linkForm)
                    .eq('id', editingLink.id);

                if (error) throw error;
                toast.success('Link updated!');
            } else {
                const { error } = await supabase
                    .from('footer_links')
                    .insert([{
                        ...linkForm,
                        column_name: 'company',
                        display_order: companyLinks.length + 1
                    }]);

                if (error) throw error;
                toast.success('Link added!');
            }

            setShowLinkModal(false);
            fetchCompanyLinks();
        } catch (err) {
            console.error('Link save error:', err);
            toast.error('Failed to save link');
        }
    };

    const deleteLink = async (id) => {
        if (!confirm('Delete this link?')) return;

        try {
            const { error } = await supabase
                .from('footer_links')
                .delete()
                .eq('id', id);

            if (error) throw error;
            toast.success('Link deleted');
            fetchCompanyLinks();
        } catch (err) {
            toast.error('Failed to delete link');
        }
    };

    const toggleLinkVisibility = async (link) => {
        try {
            const { error } = await supabase
                .from('footer_links')
                .update({ is_visible: !link.is_visible })
                .eq('id', link.id);

            if (error) throw error;
            toast.success(link.is_visible ? 'Link hidden' : 'Link visible');
            fetchCompanyLinks();
        } catch (err) {
            toast.error('Failed to update visibility');
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="admin-footer-settings">
                <div className="page-header">
                    <h1>Footer Settings</h1>
                    <button onClick={saveFooterSettings} className="btn btn-primary" disabled={saving}>
                        <FiSave /> {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>

                {/* Brand Section */}
                <div className="settings-section">
                    <h2>Brand Information</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Brand Name</label>
                            <input
                                type="text"
                                value={footerSettings.brand_name}
                                onChange={(e) => handleSettingsChange('brand_name', e.target.value)}
                                placeholder="Portfolio"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Description</label>
                            <textarea
                                value={footerSettings.description}
                                onChange={(e) => handleSettingsChange('description', e.target.value)}
                                placeholder="Building amazing digital experiences"
                                rows="3"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Copyright Text</label>
                            <input
                                type="text"
                                value={footerSettings.copyright_text}
                                onChange={(e) => handleSettingsChange('copyright_text', e.target.value)}
                                placeholder="All rights reserved."
                            />
                            <small>Year will be added automatically (e.g., © 2025 Portfolio. All rights reserved.)</small>
                        </div>
                    </div>
                </div>

                {/* Column Settings */}
                <div className="settings-section">
                    <h2>Footer Columns</h2>

                    {/* Product Column */}
                    <div className="column-setting">
                        <div className="column-header">
                            <label className="toggle-label">
                                <input
                                    type="checkbox"
                                    checked={footerSettings.show_product_column}
                                    onChange={(e) => handleSettingsChange('show_product_column', e.target.checked)}
                                />
                                <span>Show Product Column (Projects)</span>
                            </label>
                        </div>
                        {footerSettings.show_product_column && (
                            <div className="form-group">
                                <label>Column Title</label>
                                <input
                                    type="text"
                                    value={footerSettings.product_column_title}
                                    onChange={(e) => handleSettingsChange('product_column_title', e.target.value)}
                                    placeholder="Product"
                                />
                                <small>Shows published projects (max 5)</small>
                            </div>
                        )}
                    </div>

                    {/* Resources Column */}
                    <div className="column-setting">
                        <div className="column-header">
                            <label className="toggle-label">
                                <input
                                    type="checkbox"
                                    checked={footerSettings.show_resources_column}
                                    onChange={(e) => handleSettingsChange('show_resources_column', e.target.checked)}
                                />
                                <span>Show Resources Column (Skills)</span>
                            </label>
                        </div>
                        {footerSettings.show_resources_column && (
                            <div className="form-group">
                                <label>Column Title</label>
                                <input
                                    type="text"
                                    value={footerSettings.resources_column_title}
                                    onChange={(e) => handleSettingsChange('resources_column_title', e.target.value)}
                                    placeholder="Resources"
                                />
                                <small>Shows visible skills (max 6)</small>
                            </div>
                        )}
                    </div>

                    {/* Company Column */}
                    <div className="column-setting">
                        <div className="column-header">
                            <label className="toggle-label">
                                <input
                                    type="checkbox"
                                    checked={footerSettings.show_company_column}
                                    onChange={(e) => handleSettingsChange('show_company_column', e.target.checked)}
                                />
                                <span>Show Company Column (Custom Links)</span>
                            </label>
                        </div>
                        {footerSettings.show_company_column && (
                            <>
                                <div className="form-group">
                                    <label>Column Title</label>
                                    <input
                                        type="text"
                                        value={footerSettings.company_column_title}
                                        onChange={(e) => handleSettingsChange('company_column_title', e.target.value)}
                                        placeholder="Company"
                                    />
                                </div>

                                <div className="links-manager">
                                    <div className="links-header">
                                        <h3>Custom Links</h3>
                                        <button onClick={() => openLinkModal()} className="btn btn-sm btn-primary">
                                            <FiPlus /> Add Link
                                        </button>
                                    </div>

                                    <div className="links-list">
                                        {companyLinks.length === 0 ? (
                                            <p className="empty-state">No links added yet</p>
                                        ) : (
                                            companyLinks.map((link) => (
                                                <div key={link.id} className={`link-item ${!link.is_visible ? 'hidden' : ''}`}>
                                                    <div className="link-info">
                                                        <span className="link-label">{link.label}</span>
                                                        <span className="link-url">{link.url}</span>
                                                    </div>
                                                    <div className="link-actions">
                                                        <button onClick={() => toggleLinkVisibility(link)} className="btn-icon">
                                                            {link.is_visible ? <FiEye /> : <FiEyeOff />}
                                                        </button>
                                                        <button onClick={() => openLinkModal(link)} className="btn-icon">
                                                            <FiEdit2 />
                                                        </button>
                                                        <button onClick={() => deleteLink(link.id)} className="btn-icon danger">
                                                            <FiTrash2 />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Link Modal */}
                {showLinkModal && (
                    <div className="modal-overlay" onClick={() => setShowLinkModal(false)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <h2>{editingLink ? 'Edit Link' : 'Add New Link'}</h2>
                            <form onSubmit={saveLinkHandler}>
                                <div className="form-group">
                                    <label>Link Label</label>
                                    <input
                                        type="text"
                                        value={linkForm.label}
                                        onChange={(e) => setLinkForm({ ...linkForm, label: e.target.value })}
                                        placeholder="Certifications"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>URL</label>
                                    <input
                                        type="text"
                                        value={linkForm.url}
                                        onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                                        placeholder="#certifications or https://..."
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="toggle-label">
                                        <input
                                            type="checkbox"
                                            checked={linkForm.is_visible}
                                            onChange={(e) => setLinkForm({ ...linkForm, is_visible: e.target.checked })}
                                        />
                                        <span>Visible</span>
                                    </label>
                                </div>

                                <div className="modal-actions">
                                    <button type="button" onClick={() => setShowLinkModal(false)} className="btn btn-outline">
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {editingLink ? 'Update' : 'Add'} Link
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

export default AdminFooterSettings;