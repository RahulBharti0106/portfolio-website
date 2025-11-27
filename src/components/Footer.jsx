import './Footer.css';
import SocialLinks from './SocialLinks'; // Ensure this file exists in same folder!

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Rahul Bharti. All rights reserved.</p>
        <SocialLinks className="footer-socials" />
      </div>
    </footer>
  );
}

export default Footer;
