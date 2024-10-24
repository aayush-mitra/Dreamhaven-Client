import Image from "next/image";
import Link from 'next/link'
import {redirect} from "next/navigation";

export default function Home() {


  return (
    <>
  <header className="header-main">
    <div className="nav-wrapper">
      <div className="nav-left">
        <div className="nav-logo">
          <h1>DreamHaven</h1>
        </div>
        <div className="nav-links-left">
          <div className="nav-link">
            <Link href="/about">About</Link>
          </div>
          <div className="nav-link">
            <Link href="/stories">Stories</Link>
          </div>
        </div>
      </div>
      <div className="nav-right">
        <div className="nav-links-right">
          <div className="nav-login">
            <Link href="/signIn">Login</Link>
          </div>
        </div>
      </div>
    </div>
  </header>
  <div className="main-section-wrapper">
    <main className="main-section">
      <div className="main-section-hero">
        <div className="hero-header">
          <h1>Unlock the meaning behind your dreams.</h1>
        </div>
        <div className="hero-image">
          <img src="/logo.png" alt="" />
        </div>
      </div>
    </main>
  </div>
</>

  );
}
