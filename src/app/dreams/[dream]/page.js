'use client'
import '../../globals.css'
import {options} from '../../api/auth/[...nextauth]/options.js'
import {signOut, useSession} from 'next-auth/react'
import {redirect} from 'next/navigation'
import { signIn } from "next-auth/react"
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'

import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

export default function Dream({params}) {
  const {data: session, status, update} = useSession({
    required: true,
    onUnauthenticated() {
        redirect('/signIn')
    }
    
    
  })

  const router = useRouter();
  const dateString = params.dream;
  const [loading, setLoading] = useState(false)
  const [dream, setDream] = useState({})
  const [text, setText] = useState('')
  const [saving, setSaving] = useState(false)
  const [datePicked, setDatePicked] = useState(dayjs(dateString))
  const [showDatePickedModal, setShowDatePickedModal] = useState(false)

  const [innerTab, setInnerTab] = useState(0)
  

  useEffect(() => {
    async function thing() {
      if (status!== 'loading') {
        const response = await fetch(`${process.env.NEXT_PUBLIC_FETCH_URL}/api/dreams/get?userId=${session.user._id}&dateString=${dateString}`, {
          headers: {
            'Content-Type': 'application/json'
          },
          method: "GET",
          
        })
    
        const res1 = await response.json()
        if (res1.success === false) {
          const response2 = await fetch(`${process.env.NEXT_PUBLIC_FETCH_URL}/api/dreams/create`, {
            headers: {
              'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
              userId: session.user._id,
              dateString
            })
            
          })

          const res2 = await response2.json()

          if (res2.success) {
            setDream(res2.dream);
            setText(res2.dream.description)
            await update({
              user: {
                ...session.user,
                dates: res2.user.dates
              }
            })
            console.log(session.user)
            
          }
        } else {
          setDream(res1.dream);
          setText(res1.dream.description)
          

        }
      }
      
    }
    thing()
    
  }, [status])

  const dateChange = (e) => {
    window.location.href = `/dreams/${e.$d.toISOString().split('T')[0]}`
  }

  useEffect(() => {
    if (status === 'authenticated') {
      setSaving(true)
      const timeoutId = setTimeout( () => {
        console.log("saving text: ", text)
        async function f() {
          const response = await fetch(`${process.env.NEXT_PUBLIC_FETCH_URL}/api/dreams/edit-content`, {
            headers: {
              'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
              dreamId: dream._id,
              description: text
            })
          })
          
  
          const res = await response.json()
  
          if (res.success) {
            setSaving(false)
          } else {

          }
        }
        f()
      }, 2000)
      
      return () => clearTimeout(timeoutId)
    }
    
    
  }, [text])
  
  
  if (status === 'loading' || loading) {
    return (<div>Loading</div>)
}

  const onChange = (e) => {
    setText(e.target.value)
    setDream(prevState => {
      return {description: e.target.value, ...prevState}
      
    })
  }

  return (<>
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
      <div className="dream-editor">
        <div className="dream-editor-left">
          <div className="editor-bar">
            <div className="editor-nav-icons">
              <div className="nav-icon" onClick={() => {
                  setShowDatePickedModal(prevState => !prevState)
                  
                }}>
                <i  style={showDatePickedModal ? {color: 'white'} : {}} className="fa-solid fa-bars" />
                <p style={showDatePickedModal ? {color: 'white'} : {}}>Dates</p>
              </div>
              
              <div className="nav-icon">
                <i className="fa-solid fa-share" />
                <p>Share</p>
              </div>
              <div className="nav-icon">
                <i className="fa-solid fa-book" />
                <p>Story</p>
              </div>
              <div onClick={(e) => onChange(e)} className={`nav-icon ${saving ? 'saving' : ''}`}>
                <i className="fa-solid fa-floppy-disk" />
                <p>{saving ? 'Saving' : 'Save'}</p>
              </div>
            </div>
            
          </div>
          <div className="text-editor">
            <textarea
              placeholder="Describe your dream..."
              id=""
              value={text}
              onChange={onChange}
            />
          </div>
        </div>
        <div className="dream-editor-right">
          <div className='dream-tabs'>
            <div style={{cursor: 'pointer'}} onClick={() => {
                setInnerTab(prevState => Math.abs(prevState - 1))
              }}>
              <div  className={`inner-tab ${innerTab === 0 ? 'selected' : ''}`}>Questions</div>
            </div>
            <div style={{cursor: 'pointer'}} onClick={() => {
                setInnerTab(prevState => Math.abs(prevState - 1))
              }}><div className={`inner-tab ${innerTab === 1 ? 'selected' : ''}`}>Insights</div></div>
          </div>
          <div style={{display: `${innerTab === 0 ? 'flex' : 'none'}`}} className="dream-quiz">
            <h2>What is your name?</h2>
            <div className="options">
              <div className="option">Aayush</div>
              <div className="option">Jazmin</div>
              <div className="option">Dave</div>
              <div className="option">Roel</div>
              <div className="option">Fernie</div>
              <div className="option">Damian</div>
            </div>
            <div  className="next-question">
              Next Question <i className="fa-solid fa-arrow-right" />
            </div>
          </div>
          <div style={{display: `${innerTab === 1 ? 'flex' : 'none'}`}} className="dream-insights">
            <h2>AI Insights</h2>
            <div className="next-question">Get Insights</div>
          </div>
        </div>
      </div>
      
      {
        showDatePickedModal ? (
<div className='date-picker-modal'>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <StaticDatePicker sx={{
    '.MuiDayCalendar-root': {
      color: 'white',
      borderRadius: '2px',
      borderWidth: '1px',
      borderColor: '#06bd5b',
      border: '1px solid',
      backgroundColor: '#06bd5b',
    },
    backgroundColor: 'black',
    color: 'white',
    '.MuiPickerActions-root button:nth-of-type(1)': {
        display: 'none', // Hides the Cancel button
      },
  }} value={datePicked} componentsProps={{
    actionBar: {
      actions: ['accept'],  // Only show the "OK" button
    },
  }}onAccept={dateChange}/>
      </LocalizationProvider>
      </div>
        ) : null
      }
      
    </>
    )
  }