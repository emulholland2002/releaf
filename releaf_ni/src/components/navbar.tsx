'use client'
 
import { usePathname } from 'next/navigation'
import Link from "next/link"
import React from "react"

const NavBar = () => {
    const pathname = usePathname();

    return (
        <nav className="navbar-main">
        <div className="navbar-container">
            <div className="navbar-content">
                <div className="navbar-brand">
                    <div className='navbar-logo'>
                        <Link href="/">
                            <img src="../favicon.ico" alt="Logo" />
                        </Link>
                    </div>
                    <div className="navbar-title">
                        <Link href="/">
                            <h1>Releaf NI</h1>
                        </Link>
                    </div>
                </div>
            <div className="navbar-links-container">
                <div className="navbar-links">
                <NavLink href="/" text="Home" isActive={pathname === "/"} />
                <NavLink href="/donate" text="Donate" isActive={pathname === "/donate"} />
                <NavLink href="/projects_news" text="Projects" isActive={pathname === "/projects_news"} />
                <NavLink href="/grants" text="Grants" isActive={pathname === "/grants"} />
                <NavLink href="/map" text="Map" isActive={pathname === "/map"} />
                <NavLink href="/learn" text="Learn" isActive={pathname === "/learn"} />
                <NavLink href="/sign_in" text="Sign In" isActive={pathname === "/sign_in"} />
                </div>
            </div>
            </div>
        </div>
        </nav>
    )
}

const NavLink = ({ href, text, isActive }: { href: string; text: string; isActive: boolean}) => {
    return (
    <Link href={href} className={'nav-link'}>
      <span className="nav-link-text">{text}</span>
    </Link>
  )
}

export default NavBar