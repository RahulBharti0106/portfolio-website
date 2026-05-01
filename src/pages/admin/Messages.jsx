// src/pages/admin/Messages.jsx
import { useState, useEffect } from 'react'
import { api } from '../../lib/api'
import AdminLayout from '../../components/admin/AdminLayout'
import toast from 'react-hot-toast'
import { FiTrash2, FiStar } from 'react-icons/fi'
import { format } from 'date-fns'
import ConfirmModal from '../../components/admin/ConfirmModal';
import './Messages.css'

function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, messageId: null });

  useEffect(() => { fetchMessages() }, [])

  const fetchMessages = async () => {
    try {
      const data = await api.getMessages()
      setMessages(data || [])
    } catch (err) {
      toast.error('Failed to load messages')
    }
  }

  const markAsRead = async (id) => {
    try {
      await api.updateMessage({ id, is_read: true })
      fetchMessages()
    } catch (err) {
      console.error('Mark as read error:', err)
    }
  }

  const toggleStar = async (message) => {
    try {
      await api.updateMessage({ id: message.id, is_starred: !message.is_starred })
      fetchMessages()
    } catch (err) {
      toast.error('Failed to update message')
    }
  }
const deleteMessage = async (id) => {
  setConfirmModal({ isOpen: true, messageId: id });
};

const confirmDelete = async () => {
  try {
    await api.deleteMessage(confirmModal.messageId);
    toast.success('Message deleted');
    fetchMessages();
    setSelectedMessage(null);
  } catch (err) {
    toast.error('Failed to delete message');
  } finally {
    setConfirmModal({ isOpen: false, messageId: null });
  }
};

  const openMessage = (message) => {
    setSelectedMessage(message)
    if (!message.is_read) markAsRead(message.id)
  }

  return (
    <AdminLayout>
      <div className="admin-messages">
        <h1>Messages</h1>
        <div className="messages-container">
          <div className="messages-list">
            {messages.length === 0 && (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No messages yet
              </div>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message-item ${!msg.is_read ? 'unread' : ''} ${selectedMessage?.id === msg.id ? 'active' : ''}`}
                onClick={() => openMessage(msg)}
              >
                <div className="message-header">
                  <strong>{msg.name}</strong>
                  <span className="message-time">{format(new Date(msg.created_at), 'MMM dd')}</span>
                </div>
                <div className="message-subject">{msg.subject || 'No subject'}</div>
                <div className="message-preview">{msg.message.substring(0, 50)}...</div>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleStar(msg) }}
                  className="star-btn"
                >
                  <FiStar fill={msg.is_starred ? 'gold' : 'none'} color={msg.is_starred ? 'gold' : 'currentColor'} />
                </button>
              </div>
            ))}
          </div>

          {selectedMessage && (
            <div className="message-detail">
              <div className="message-actions">
                <button onClick={() => deleteMessage(selectedMessage.id)} className="btn btn-outline">
                  <FiTrash2 /> Delete
                </button>
              </div>
              <h2>{selectedMessage.subject || 'No subject'}</h2>
              <div className="message-meta">
                <p><strong>From:</strong> {selectedMessage.name} ({selectedMessage.email})</p>
                <p><strong>Date:</strong> {format(new Date(selectedMessage.created_at), 'PPpp')}</p>
              </div>
              <div className="message-body">
                {selectedMessage.message}
              </div>
            </div>
          )}
        </div>
      </div>
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Delete Message"
        message="Are you sure you want to delete this message? This cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmModal({ isOpen: false, messageId: null })}
      />
    </AdminLayout>
  )
}

export default AdminMessages