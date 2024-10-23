'use client'
import {options} from './api/auth/[...nextauth]/options'
import {useSession} from 'next-auth/react'
import {redirect} from 'next/navigation'
import { signIn } from "next-auth/react"

// export default () => <button onClick={() => signIn(undefined, {callbackUrl: "/dashboard"})}>Sign in</button>

// redirect('/api/auth/signin?callbackUrl=/dashboard')

// const {data: session, status} = useSession({
//     required: true,
//     onUnauthenticated() {
//         redirect()
//     }

    // if (status === 'authenticated') {}
    // if (status = 'loading') {}
//     return ()
// })

