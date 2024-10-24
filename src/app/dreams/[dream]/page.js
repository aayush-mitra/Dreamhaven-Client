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

import {questions} from '../../utils/questions'

let textbased = ['startTime', 'endTime', 'dreamLength', 'quality']
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
  const [optionsSelection, setOptionsSelection] = useState(-1)

  const [innerTab, setInnerTab] = useState(0)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [fadeState, setFadeState] = useState(false)

  const [loadingInsights, setLoadingInsights] = useState(false)
  const [showInsights, setShowInsights] = useState(false)
  const [insightContent, setInsightContent] = useState('')

  const [storyTitle, setStoryTitle] = useState('')
  const [storyContent, setStoryContent] = useState(' ')
  const [showStoryModal, setShowStoryModal] = useState(false)
  const [storyLoading, setStoryLoading] = useState(true)

  const [shareButtonDisabled, setShareButtonDisabled] = useState(false)
  

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
          setShareButtonDisabled(true);
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

  const editStoryContent = (e) => {
    setStoryContent(e.target.value)

  }

  const editStoryTitle = (e) => {
    setStoryTitle(e.target.value)
  }

  const openStory = () => {
    setShowStoryModal(true)
    async function f() {

      const response = await fetch(`${process.env.NEXT_PUBLIC_FETCH_URL}/api/stories?dreamId=${dream._id}`)
      
      const res = await response.json();
      console.log(res)
      if (res.success) {
        setStoryContent(res.story.content)
        setStoryTitle(res.story.title)
        setStoryLoading(false)
      } else {
        const response2 = await fetch(`${process.env.NEXT_PUBLIC_PYTHON}/story`, {
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify({
            dream
          })
        })
        
        let res2 = await response2.json();
        // console.log(res2)
        setStoryContent(res2.story)
        setStoryLoading(false)
      }
    }
    f()
  }

  const regenerate = () => {
    setStoryLoading(true)
    async function f() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_PYTHON}/story`, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          dream
        })
      })
      
      let res = await response.json();
      setStoryContent(res.story)
      setStoryLoading(false)
    }

    f()
  }

  const closeStory = () => {
    setShowStoryModal(false)
  }

  const shareStory = () => {
    setStoryLoading(true)
    async function f() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_FETCH_URL}/api/stories/create-story`, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          userId: session.user._id,
          dreamId: dream._id,
          title: storyTitle,
          content: storyContent
        })
      })

      const res = await response.json();

      if (res.success) {
        setShowStoryModal(false)
        setStoryLoading(false)
      } else {
        setStoryLoading(false)
        console.log(res, dream._id)
      }
    }
    f();
  }
  const onSave = () => {
    setText(prevState => prevState + ' ')
    setDream(prevState => {
      return {description: text, ...prevState}
      
    })
  }

  const changeQuestion = () => {
    async function f() {
      

      const response = await fetch(`${process.env.NEXT_PUBLIC_FETCH_URL}/api/dreams/questions`, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
          dreamId: dream._id,
          payload: dream
        })
      })

      const res = await response.json();

      if (res.success) {
        setFadeState(true)
        setTimeout(() => {
          let thing = questionIndex === 10 ? 0 : questionIndex + 1
          setQuestionIndex(prevState => {
            
            return (prevState === 10 ? 0 : prevState + 1)
          })
          if (dream[questions[thing].name] === 'N/A' || dream[questions[thing].name] === '') {
            console.log(questions[thing].name)
            setOptionsSelection(-1)
          } else {
            console.log(questions[thing])
            if (questions[thing].options) {
              console.log(questions[thing].options.indexOf(dream[questions[thing].name]))
              setOptionsSelection(questions[thing].options.indexOf(dream[questions[thing].name]))
            }
          }
          
          setFadeState(false)
        }, 250)
        return () => clearTimeout()
      } else {
        setOptionsSelection(-1)
      }
    }
    f()
  }

  const setDreamOption = (name, value) => {
    setDream(prevState => {
      return {...prevState, [name]: value}
    })
  }
    
  
  const getInsights = () => {
    setLoadingInsights(true)
    setShowInsights(false)
    async function f() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_PYTHON}/dreaminsights`, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          dream
        })
      })

      const res = await response.json();

      setInsightContent(res.analysis)
      setLoadingInsights(false)
      setShowInsights(true)
    }
    f();
  }
  const onDreamChange = (e, name) => {
    setDream(prevState => {
      return {...prevState, [name]: e.target.value}
    })
    console.log(dream)
  }

  return (<>
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
              <div onClick={openStory} className="nav-icon">
                <i className="fa-solid fa-book" />
                <p>Story</p>
              </div>
              <div onClick={(e) => onSave(e)} className={`nav-icon ${saving ? 'saving' : ''}`}>
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

          <div style={{display: `${innerTab === 0 ? 'flex' : 'none'}`}} className={`dream-quiz ${fadeState ? 'FADE-OUT' : 'FADE-IN'}`}>
            {!dream ? null : (<>
            <h2>{questions[questionIndex].question}</h2>
            {(questions[questionIndex].name === 'startTime' || questions[questionIndex].name === 'endTime') ? 
            (
              <div className="options text-in">
                <input 
                  value={dream[questions[questionIndex].name] ? dream[questions[questionIndex].name] : ''}
                  type={'text'}
                  placeholder={'Ex: 10PM'}
                  autoFocus
                  onChange={(e) => onDreamChange(e, questions[questionIndex].name)}
                />
                
              </div>
            )  : null
          }
          {
            (questions[questionIndex].name === 'dreamLength' || questions[questionIndex].name === 'quality') ? 
            (
              <div className="options text-in">
                <input 
                  value={dream[questions[questionIndex].name] ? dream[questions[questionIndex].name] : ''}
                  type={'text'}
                  autofocus
                  onChange={(e) => onDreamChange(e, questions[questionIndex].name)}
                />
                
              </div>
            )  : null
          }
          {
            (!textbased.includes(questions[questionIndex].name)) ?
            (
              <div className="options">
                            {questions[questionIndex].options.map((option, i) => {
                              return <div className={`option ${optionsSelection === i ? 'green-bg' : ''}`}
                               onClick={() =>{
                                setOptionsSelection(prevState => {
                                  if (prevState === i) {
                                    return -1 
                                  } else {
                                    return i
                                  }
                                })
                                 setDreamOption(questions[questionIndex].name, option)

                                 }} key={i}>
                                {option}
                                </div>
                            })}
                          </div>
                          ): null
          }
          
          </>)}
            <div onClick={changeQuestion} className="next-question">
              Next Question <i className="fa-solid fa-arrow-right" />
            </div>
          </div>
          <div style={{display: `${innerTab === 1 ? 'flex' : 'none'}`}} className="dream-insights">
            {
              (showInsights === false && loadingInsights === false) ? (<>
                <h2>AI Insights</h2>
                <div onClick={getInsights} className="next-question">Get Insights</div>
                </>) : (
                loadingInsights) ? <div class="loader"></div> : (<>
                <h2>AI Insights</h2>
                <div onClick={getInsights} className="next-question">Regenerate</div>
                <div className="insight-content">{insightContent}</div>
                </>)
            }
            
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

      {
        showStoryModal ? (
          <div className="story-modal-container">
            <div className="story-modal">
              <div className='close' onClick={closeStory}><i className="fa-solid fa-x"></i></div>
              {!storyLoading ? (<>
                <h2>Generated Story</h2>
                <button onClick={regenerate} className='regenerate next-question'><i className="fas fa-repeat"></i></button>
                <input value={storyTitle ? storyTitle : ''} placeholder={'Give it a title...'} onChange={editStoryTitle} className='story-title' />
                <textarea 
                  value={storyContent ? storyContent : ''}
                  placeholder={'Your story...'}
                  onChange={editStoryContent}
                  className="story-content"
                />
                <button onClick={shareStory} className='story-submit' >Share</button>
                </>) : <div className='loader'></div>}
              
            </div>
          </div>
        ) : null
      }
      
    </>
    )
  }