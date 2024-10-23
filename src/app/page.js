import Image from "next/image";

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
            <a href="#">Analytics</a>
          </div>
          <div className="nav-link">
            <a href="#">Stories</a>
          </div>
        </div>
      </div>
      <div className="nav-right">
        <div className="nav-links-right">
          <div className="nav-login">
            <a href="login.html">Login</a>
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
