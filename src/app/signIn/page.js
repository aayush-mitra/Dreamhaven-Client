import '../globals.css'

export default function signIn() {
    return (<div className="auth-background">
        <div className="auth-container">
          <div className="auth-form">
            <h1>Login</h1>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input type="email" placeholder="Email" name="email" />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input type="password" placeholder="Password" name="password" />
            </div>
            <button>Login</button>
          </div>
          <div className="auth-right">
            <h1>Welcome to DreamHaven.</h1>
            <h4>Don't have an account?</h4>
            <button>Sign Up</button>
          </div>
        </div>
      </div>
      )
}