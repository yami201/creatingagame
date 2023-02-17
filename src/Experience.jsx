
import Lights from './Lights.jsx'
import Level from './Level.jsx'
import { Physics } from '@react-three/rapier'
import Player from './Player.jsx'

import useGame from "./Store.js"
export default function Experience()
{
    const blocksCount = useGame((state)=>state.blocksCount)
    const blocksSeed = useGame((state)=>state.blocksSeed)

    return <>

        <color args={["grey"]} attach="background"/>
        <Lights />
        <Physics>
            <Level count={blocksCount} seed={blocksSeed}/>
            <Player/>
        </Physics>
        

    </>
}