import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>Rahul Bharti</h3>
          <p>Building beautiful web experiences</p>
        </div>
        <div className="footer-text">
          <p>&copy; {new Date().getFullYear()} Rahul Bharti. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;