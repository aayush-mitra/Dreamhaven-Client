'use client'
import {options} from '../api/auth/[...nextauth]/options.js'
import {signOut, useSession} from 'next-auth/react'
import {redirect} from 'next/navigation'
import { signIn } from "next-auth/react"
import Link from 'next/link'
import {useState, useEffect} from 'react'

import PieChart from '../components/PieChart.js'
import LineChart from '../components/LineChart.js'
import QualityLineChart from '../components/QualityLineChart.js'


export default function Dashboard() {
    
    const [loading, setLoading] = useState(true)
    const [frequency, setFrequency] = useState({})
    const [dreamData, setDreamData] = useState({})
    const [insight, setInsight] = useState('')
    
    const {data: session, status} = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/signIn')
        }
        
        
    })

    useEffect(() => {
        if (session?.user) {
        async function f() {
            const response = await fetch(`${process.env.NEXT_PUBLIC_FETCH_URL}/api/users/all_dreams?userId=${session.user._id}`)
            const res = await response.json();
            console.log(res)
            if (res.success) {
                setDreamData(res.dreams)
                let frequencies = {
                    lucidityFrequencies: {},
                    moodFrequencies: {},
                    vividnessFrequencies: {},
                    charactersFrequencies: {},
                    locationFrequencies: {},
                    themesFrequencies: {},
                    repetitionFrequencies: {}
                }
                res.dreams.forEach(dream => {
                    const lucidity = dream.lucidity || "No recollection"; // Handle empty/undefined lucidity
                    if (frequencies.lucidityFrequencies[lucidity]) {
                        frequencies.lucidityFrequencies[lucidity]++;
                    } else {
                        frequencies.lucidityFrequencies[lucidity] = 1;
                    }

                    const mood = dream.mood || "No recollection"; // Handle empty/undefined mood
                    if (frequencies.moodFrequencies[mood]) {
                        frequencies.moodFrequencies[mood]++;
                    } else {
                        frequencies.moodFrequencies[mood] = 1;
                    }

                    const vividness = dream.vividness || "No recollection"; // Handle empty/undefined vividness
                    if (frequencies.vividnessFrequencies[vividness]) {
                        frequencies.vividnessFrequencies[vividness]++;
                    } else {
                        frequencies.vividnessFrequencies[vividness] = 1;
                    }

                    const characters = dream.characters || "No recollection"; // Handle empty/undefined characters
                    if (frequencies.charactersFrequencies[characters]) {
                        frequencies.charactersFrequencies[characters]++;
                    } else {
                        frequencies.charactersFrequencies[characters] = 1;
                    }

                    const location = dream.location || "No recollection"; // Handle empty/undefined location
                    if (frequencies.locationFrequencies[location]) {
                        frequencies.locationFrequencies[location]++;
                    } else {
                        frequencies.locationFrequencies[location] = 1;
                    }

                    const themes = dream.themes || "No recollection"; // Handle empty/undefined themes
                    if (frequencies.themesFrequencies[themes]) {
                        frequencies.themesFrequencies[themes]++;
                    } else {
                        frequencies.themesFrequencies[themes] = 1;
                    }

                    const repetition = dream.repetition || "No recollection"; // Handle empty/undefined repetition
                    if (frequencies.repetitionFrequencies[repetition]) {
                        frequencies.repetitionFrequencies[repetition]++;
                    } else {
                        frequencies.repetitionFrequencies[repetition] = 1;
                    }
                });
                // console.log(frequencies)
                const response2 = await fetch(`${process.env.NEXT_PUBLIC_PYTHON}/overall`, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: "POST",
                    body: JSON.stringify({
                        dreams: res.dreams
                    })
                })

                const res2 = await response2.json()
                setInsight(res2.insight)

                setFrequency(frequencies)
                setLoading(false)
            } else {
                
            }
            
        }
        f();
        } else {
            setLoading(false)
        }
    }, [session?.user])

    
    
    if (status === 'loading' || loading) {
        return (<div className='loader'></div>)
    }

    console.log(session.user)

    
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
        {
            !frequency ? null : (<>
<h1>Hello <span>{session?.user?.name}!</span></h1>
        <button onClick={() => {
            window.location.href = `/dreams/${(new Date()).toISOString().split('T')[0]}`
        }}>Today's Dream</button>
        <div className="analytics-section" style={{'flexDirection': 'column'}}>
            <h1>AI Insight</h1>
            <p style={{'padding': '10px 50px', 'fontWeight': 'lighter', 'textAlign': 'center'}}>{insight}</p>
        </div>
        <div className='analytics-section'>
        {dreamData.length > 0 ? <QualityLineChart w={800} h={320} data={dreamData} /> : null}
        </div>
        <div className='analytics-section'>
        {dreamData.length > 0 ? <LineChart w={800} h={320} data={dreamData} /> : null}
        </div>
        <div className='analytics-section'>
            
            <PieChart w={300} h={300} caption={'Themes'} data={frequency.themesFrequencies} />
            <PieChart w={300} h={300} caption={'Recurrence'} data={frequency.repetitionFrequencies} />

        </div>
        <div className='analytics-section'>
            <PieChart w={300} h={300} caption={'Lucidity'} data={frequency.lucidityFrequencies} />
            <PieChart w={300} h={300} caption={'Mood'} data={frequency.moodFrequencies} />
            <PieChart w={300} h={300} caption={'Vividness'} data={frequency.vividnessFrequencies} />
        </div>
        <div className='analytics-section'>
            <PieChart w={300} h={300} caption={'Characters'} data={frequency.charactersFrequencies} />
            <PieChart w={300} h={300} caption={'Location'} data={frequency.locationFrequencies} />
            
        </div></>
            )
        }
        
    </div>
        </>
    )
}

