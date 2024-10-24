import CredentialsProvider from 'next-auth/providers/credentials'

export const options = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        const response = await fetch(`${process.env.FETCH_URL}/api/users/login`, {
          headers: {
            'Content-Type': 'application/json'
          },
          method: "POST",
          body: JSON.stringify({
            email: credentials.email, 
            password: credentials.password
          })
        })

        const res = await response.json()

        if (res.success) {
          
          return res.user // Return user object on success
        } else {
          return null // Return null to signify failed login
        }
      }
    })
  ],
  callbacks: {
    async jwt({token, user}) {
      if (user) {
        token.user = user
      }
      return token
    },
    async session({session, user, token}) {
      session.user = token.user
      return session
      
    }
  },
  pages: {
    signIn: '/signIn', // Custom sign-in page
  },
}
