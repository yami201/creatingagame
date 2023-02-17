import { createContext, useState } from "react";


export const GameContext = createContext({
    phase:'ready',
    blocksCount:1,
    blocksSeed:0,
    startTime:0,
    endTime:0,
    start:()=>null,
    restart:()=>null,
    end:()=>null
})

export const GameProvider = ({children})=>{
    const [phase,setPhase] = useState('ready')
    const [blocksCount,setBlocksCount] = useState(1)
    const [blocksSeed,setBlocksSeed] = useState(0)
    const [startTime,setStartTime] = useState(0)
    const [endTime,setEndTime] = useState(0)
    const start = () => {
        if(phase === 'ready'){
            setPhase('playing')
            setStartTime(Date.now())
        }
    }
    const restart = () => {
        if(phase==='playing' || phase==='ended'){
            setPhase('ready')
            setBlocksSeed(Math.random())
        }
    }
    const end = () => {
        if(phase==='playing'){
            setPhase('ended')
            setEndTime(Date.now())
        }
    }


    const value = {phase,blocksCount,blocksSeed,startTime,endTime,start,restart,end}
    return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}