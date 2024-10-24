'use client'
import {options} from '../api/auth/[...nextauth]/options.js'
import {signOut, useSession} from 'next-auth/react'
import {redirect} from 'next/navigation'
import { signIn } from "next-auth/react"
import Link from 'next/link'



export default function Dashboard() {
    
    
    const {data: session, status} = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/signIn')
        }
        
        
    })
    
    if (status === 'loading') {
        return (<div>Loading</div>)
    }


    return (
        <>
            <header className="header-main">
        <div className="nav-wrapper">
            <div className="nav-left">
                <div className="nav-logo">
                    <h1 onClick={() => window.location.href='/'}>DreamHaven</h1>
                </div>
                <div className="nav-links-left">
                    <div className="nav-link">
                        <Link href="/about">
                            About
                        </Link>
                        
                    </div>
                    <div className="nav-link">
                        <Link href="/stories">
                            Stories
                        </Link>
                    </div>
                </div>
            </div>

            <div className="nav-right">
                <div className="nav-links-right">
                    <div className="nav-login">
                        <a onClick={() => signOut()}>
                            Logout
                        </a>
                    </div>
                    
                </div>
            </div>
            
        </div>
    </header>
    <div className='dashboard-main'>
        <h1>Hello <span>{session.user.name}!</span></h1>
        <button onClick={() => {
            window.location.href = `/dreams/${(new Date()).toISOString().split('T')[0]}`
        }}>Today's Dream</button>
        <div className='analytics-section'></div>
    </div>
        </>
    )
}

