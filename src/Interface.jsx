import { useKeyboardControls } from "@react-three/drei";
import { addEffect } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import useGame from "./Store.js"
const Interface = () => {
    const timer = useRef()
    const { 
        forward,
        backward,
        leftward,
        rightward,
        jump
    } = useKeyboardControls(state=>state)
    const {restart,phase} = useGame(state=>state)


    useEffect(()=>{
        const unsubEffect = addEffect(()=> {
            const { phase, startTime, endTime } = useGame.getState()
            let elapsedTime = 0
            if(phase==="playing"){
                elapsedTime = Date.now() - startTime
            } else if(phase ==="ended"){
                elapsedTime = endTime - startTime
            }
            elapsedTime /=1000
            elapsedTime = elapsedTime.toFixed(2)

            if(timer.current){
                timer.current.textContent = elapsedTime
            }
        })

        return () => {
            unsubEffect()
        }
    },[])
    return (
        <div className="interface">
            <div className="time" ref={timer}>0.00</div>
            {phase==="ended" && <div className="restart" onClick={restart}>RESTART</div>}
            <div className="controls">
            <div className="raw">
                <div className={`key ${forward && `active`}`}></div>
            </div>
            <div className="raw">
                <div className={`key ${leftward && `active`}`}></div>
                <div className={`key ${backward && `active`}`}></div>
                <div className={`key ${rightward && `active`}`}></div>
            </div>
            <div className="raw">
                <div className={`key ${jump && `active`} large`}></div>
            </div>
        </div>
        </div>
    );
}
 
export default Interface;