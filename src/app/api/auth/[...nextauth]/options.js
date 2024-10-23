import {NextAuthOptions} from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const options = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "Email"
                },
                password: {
                    label: "Password:",
                    type: 'password',
                    placeholder: "Password"
                }
            },
            async authorize(credentials) {
                // return user
                // return null
            }
        })
    ],
    pages: {}
}
