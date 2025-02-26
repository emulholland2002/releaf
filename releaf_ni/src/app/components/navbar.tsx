import Link from "next/link"
import React from "react"
import styles from "./navbar.module.css"

const NavBar = () => {
  return (
    <nav className="navbar-main">
      <div className="navbar-container">
        <div className="navbar-content">
            <div className={styles['navbar-logo']}>
                <Link href="/">
                    <img src="../favicon.ico" alt="Logo" />
                </Link>
                <div className={styles['navbar-title']}>
                    <Link href="/">Releaf NI</Link>
                </div>
            </div>
          <div className="navbar-links-container">
            <div className="navbar-links">
              <NavLink href="/" text="Home" />
              <NavLink href="/about" text="About" />
              <NavLink href="/contact" text="Contact" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

const NavLink = ({ href, text }: { href: string; text: string }) => {
  return (
    <Link href={href} className="nav-link">
      <span className="nav-link-text">{text}</span>
    </Link>
  )
}

export default NavBar