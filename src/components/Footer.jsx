import { FiGithub, FiLinkedin, FiMail, FiHeart } from 'react-icons/fi'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>Rahul Bharti</h3>
          <p>Building the future, one project at a time.</p>
        </div>

        <div className="footer-social">
          <a href="https://github.com"><FiGithub size={20} /></a>
          <a href="https://linkedin.com"><FiLinkedin size={20} /></a>
          <a href="mailto:rahul@example.com"><FiMail size={20} /></a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Rahul Bharti. Made with <FiHeart className="heart" /> and React</p>
      </div>
    </footer>
  )
}

export default Footer