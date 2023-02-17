import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware"

export default create(subscribeWithSelector(
    (set) => (
        {
            blocksCount : 5,
            blocksSeed:0,
            phase:'ready',
            startTime:0,
            endTime:0,
            start:() => {
                set(({phase}) =>
                    {
                        if(phase==="ready"){
                            return { phase : "playing",startTime:Date.now() }
                        }
                        return {}
                    }
                )
            },
            restart:() => {
                set(({phase}) =>
                    {
                        if(phase==="playing" || phase==="ended"){
                            return { phase : 'ready',blocksSeed:Math.random() }
                        }
                        return {}
                    }
                )
            },
            end:() => {
                set( ({phase}) =>
                    {
                        if(phase==="playing"){
                            return { phase : 'ended',endTime:Date.now() }
                        }
                        return {}
                    }
                )
            },
        }
)))