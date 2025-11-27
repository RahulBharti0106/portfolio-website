import './Footer.css';
// Make sure this path is correct!
import SocialLinks from './SocialLinks';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Rahul Bharti. All rights reserved.</p>

        {/* Use the component here */}
        <SocialLinks className="footer-socials" />
      </div>
    </footer>
  );
}

export default Footer;
