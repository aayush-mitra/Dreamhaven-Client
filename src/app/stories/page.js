'use client'
import {options} from '../api/auth/[...nextauth]/options.js'
import {signOut, useSession} from 'next-auth/react'
import {redirect} from 'next/navigation'
import { signIn } from "next-auth/react"
import Link from 'next/link'
import {useState, useEffect} from 'react'



export default function Stories() {
    
    const [loading, setLoading] = useState(true)
    const [stories, setStories] = useState([])

    const [storyModal, setStoryModal] = useState(false)
    const [storyIndex, setStoryIndex] = useState(-1)
    
    useEffect(() => {
        async function f() {
            const response = await fetch(`${process.env.NEXT_PUBLIC_FETCH_URL}/api/stories/all`)
            const res = await response.json();
            setStories(res.stories)
            setLoading(false)
        }
        f()
    }, [])

    const openStoryModal = (index) => {
        setStoryModal(true)
        setStoryIndex(index)
    }

    const closeStoryModal = () => {
        setStoryModal(false)
        setStoryIndex(-1)
    }
    
    if (loading) {
        return (<div className='loader'></div>)
    }

    
    return (
        <>
            <header className="header-main">
        <div className="nav-wrapper">
            <div className="nav-left">
                <div className="nav-logo">
                    <h1 onClick={() => window.location.href='/dashboard'}>DreamHaven</h1>
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
    <div className='stories-wrapper'>
        <div className="stories-container">
            {
                stories.map((story, i) => (
                    <div onClick={() => openStoryModal(i)} key={i} className='story-card'>
                        <h3>{story.title}</h3>
                        <h4>{story.user.name}</h4>
                        <p>{story.dream.dateString}</p>
                    </div>
                ))
                
            }
            
        </div>
    </div>
    {
        storyModal ? (<div className="story-page-modal-wrapper">
            <div onClick={closeStoryModal} className="close-modal-wrapper"><i className="fa-solid fa-x"></i></div>
            <h1>{stories[storyIndex].title}</h1>
            
            <h3 className='story-page-modal-title'>{stories[storyIndex].user.name} | {stories[storyIndex].dream.dateString}</h3>
            <p className='story-page-modal-content'>
                {stories[storyIndex].content}
            </p>
            
            <h3 className='story-page-modal-second'>
                The Dream:
            </h3>
    
            <p className='story-page-modal-dream'>
                {stories[storyIndex].dream.description}
            </p>
    
        </div>) : null
    }
    
        </>
    )
}

