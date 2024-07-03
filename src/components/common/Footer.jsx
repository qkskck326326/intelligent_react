import React from 'react';
import styles from '../../styles/common/Footer.module.css';

const Footer = () => {
  return (
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <h4>Company</h4>
              <ul className={styles.linkList}>
                <li><a href="/about">About Us</a></li>
                <li><a href="/team">Team</a></li>
                <li><a href="/careers">Careers</a></li>
                <li><a href="/privacy">Privacy Policy</a></li>
                <li><a href="/terms">Terms of Service</a></li>
              </ul>
            </div>
            <div className={styles.column}>
              <h4>Support</h4>
              <ul className={styles.linkList}>
                <li><a href="/faq">FAQ</a></li>
                <li><a href="/contact">Contact Us</a></li>
                <li><a href="/help-center">Help Center</a></li>
                <li><a href="/forums">Forums</a></li>
              </ul>
            </div>
            <div className={styles.column}>
              <h4>Newsletter</h4>
              <p>Sign up to stay updated with our latest news and offers.</p>
              <form className={styles.newsletterForm}>
                <input type="email" placeholder="Your email" className={styles.emailInput} />
                <button type="submit" className={styles.submitButton}>Subscribe</button>
              </form>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.copyright}>
              <p>&copy; 2024 IntelligentClass. All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </footer>
  );
};

export default Footer;
