import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/admin/AdminLayout'
import toast from 'react-hot-toast'
import { FiMail, FiTrash2, FiStar } from 'react-icons/fi'
import { format } from 'date-fns'
import './Messages.css'

function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [selectedMessage, setSelectedMessage] = useState(null)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error) setMessages(data || [])
  }

  const markAsRead = async (id) => {
    await supabase
      .from('contact_messages')
      .update({ is_read: true })
      .eq('id', id)
    fetchMessages()
  }

  const toggleStar = async (message) => {
    await supabase
      .from('contact_messages')
      .update({ is_starred: !message.is_starred })
      .eq('id', message.id)
    fetchMessages()
  }

  const deleteMessage = async (id) => {
    if (!confirm('Delete this message?')) return
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id)
    
    if (!error) {
      toast.success('Message deleted')
      fetchMessages()
      setSelectedMessage(null)
    }
  }

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
                <button onClick={(e) => { e.stopPropagation(); toggleStar(msg); }} className="star-btn">
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
    </AdminLayout>
  )
}

export default AdminMessages
