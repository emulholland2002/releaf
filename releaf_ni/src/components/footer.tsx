import React from "react"
import { Facebook, Instagram, Twitter } from "lucide-react"
import Link from "next/link"

const Footer = () => {
  return (
    <footer className="footer-main">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-sections">
            <div className="footer-section">
              <h3 className="footer-section-title">Company</h3>
              <ul className="footer-links">
                <li>
                  <Link href="/about">About Us</Link>
                </li>
                <li>
                  <Link href="/careers">Careers</Link>
                </li>
                <li>
                  <Link href="/press">Press</Link>
                </li>
                <li>
                  <Link href="/blog">Blog</Link>
                </li>
              </ul>
            </div>
            <div className="footer-section">
              <h3 className="footer-section-title">Products</h3>
              <ul className="footer-links">
                <li>
                  <Link href="/products">Our Products</Link>
                </li>
                <li>
                  <Link href="/pricing">Pricing</Link>
                </li>
                <li>
                  <Link href="/features">Features</Link>
                </li>
                <li>
                  <Link href="/roadmap">Roadmap</Link>
                </li>
              </ul>
            </div>
            <div className="footer-section">
              <h3 className="footer-section-title">Resources</h3>
              <ul className="footer-links">
                <li>
                  <Link href="/docs">Documentation</Link>
                </li>
                <li>
                  <Link href="/support">Support</Link>
                </li>
                <li>
                  <Link href="/faq">FAQ</Link>
                </li>
                <li>
                  <Link href="/api">API</Link>
                </li>
              </ul>
            </div>
            <div className="footer-section">
              <h3 className="footer-section-title">Legal</h3>
              <ul className="footer-links">
                <li>
                  <Link href="/privacy">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms">Terms of Service</Link>
                </li>
                <li>
                  <Link href="/cookies">Cookie Policy</Link>
                </li>
                <li>
                  <Link href="/compliance">Compliance</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="newsletter-signup">
              <h3 className="newsletter-title">Subscribe to our newsletter</h3>
              <form className="newsletter-form">
                <input type="email" placeholder="Enter your email" className="newsletter-input" />
                <button type="submit" className="newsletter-button">
                  Subscribe
                </button>
              </form>
            </div>
            <div className="social-links">
              <Link href="https://twitter.com" className="social-link">
                <Twitter className="social-icon" />
              </Link>
              <Link href="https://facebook.com" className="social-link">
                <Facebook className="social-icon" />
              </Link>
              <Link href="https://instagram.com" className="social-link">
                <Instagram className="social-icon" />
              </Link>
            </div>
          </div>
          <p className="copyright">&copy; {new Date().getFullYear()} Releaf NI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer