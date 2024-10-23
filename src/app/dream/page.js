import '../globals.css'

export default function Dream() {
    return (<>
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
        <div className="dream-editor">
          <div className="dream-editor-left">
            <div className="editor-bar">
              <div className="editor-nav-icons">
                <div className="nav-icon">
                  <i className="fa-solid fa-bars" />
                  <p>Dates</p>
                </div>
                <div className="nav-icon">
                  <i className="fa-solid fa-floppy-disk" />
                  <p>Save</p>
                </div>
                <div className="nav-icon">
                  <i className="fa-solid fa-share" />
                  <p>Share</p>
                </div>
                <div className="nav-icon">
                  <i className="fa-solid fa-book" />
                  <p>Story</p>
                </div>
              </div>
            </div>
            <div className="text-editor">
              <textarea
                placeholder="Describe your dream..."
                id=""
                defaultValue={""}
              />
            </div>
          </div>
          <div className="dream-editor-right">
            <div className="dream-quiz">
              <h2>What is your name?</h2>
              <div className="options">
                <div className="option">Aayush</div>
                <div className="option">Jazmin</div>
                <div className="option">Dave</div>
                <div className="option">Roel</div>
                <div className="option">Fernie</div>
                <div className="option">Damian</div>
              </div>
              <div className="next-question">
                Next Question <i className="fa-solid fa-arrow-right" />
              </div>
            </div>
            <div className="dream-insights">
              <h2>AI Insights</h2>
              <div className="next-question">Get Insights</div>
            </div>
          </div>
        </div>
      </>
      )
    }