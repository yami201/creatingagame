import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody, useRapier } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import useGame from "./Store.js"
const Player = () => {
    const [subKeys,getKeys] = useKeyboardControls()
    const body = useRef()
    const { rapier, world }= useRapier()
    const rapierWorld = world.raw()
    const [smoothcameraPos]= useState(()=> new Vector3(10,10,10))
    const [smoothcameraTarget]= useState(()=> new Vector3())
    const { start, restart, end, blocksCount } = useGame(state => state)
    const jump = () => {
        const origin = body.current.translation()
        origin.y -=0.31
        const direction = new Vector3(0,-1,0)
        const ray = new rapier.Ray(origin,direction)
        const hit = rapierWorld.castRay(ray,10,true)
        if(hit.toi <0.15){
            body.current.applyImpulse(new Vector3(0,0.5,0))
        }
    }
    const reset = () => {
        body.current.setTranslation(new Vector3(0,1,0))
        body.current.setLinvel(new Vector3())
        body.current.setAngvel(new Vector3())
    }
    useEffect(()=>{
        const unsubReset = useGame.subscribe(
            (state)=>state.phase,
            (value)=>{
                if(value === 'ready'){
                    reset()
                }
            }
        )
        const unsubJump = subKeys(
            (state)=>state.jump,
            (value)=>{
                if(value) {
                    jump()
                }
            }
        )
        const unsubAny = subKeys(() => {
            start()
        })
        return () => {
            unsubJump()
            unsubAny()
            unsubReset()
        }
    })
    useFrame(({camera},delta)=>{
        const {forward,backward,rightward,leftward} = getKeys()
        const impluse = { 
            x: 0,
            y: 0,
            z: 0
        }
        const torque = {
            x: 0,
            y: 0,
            z: 0
        }
        const impluseStrength = 0.6 * delta
        const torqueStrength = 0.2 * delta

        if(forward){
            impluse.z -= impluseStrength
            torque.x -= torqueStrength
        }
        if(backward){
            impluse.z += impluseStrength
            torque.x += torqueStrength
        }
        if(rightward){
            impluse.x += impluseStrength
            torque.z -= torqueStrength
        }
        if(leftward){
            impluse.x -= impluseStrength
            torque.z += torqueStrength
        }
        body.current.applyImpulse(impluse)
        body.current.applyTorqueImpulse(torque)


        const bodyPos = body.current.translation()
        const cameraPos = new Vector3()
        cameraPos.copy(bodyPos)
        cameraPos.z += 2.25
        cameraPos.y += 0.65


        const cameraTarget = new Vector3()
        cameraTarget.copy(bodyPos)
        cameraTarget.y += 0.25
        smoothcameraPos.lerp(cameraPos,5*delta)
        smoothcameraTarget.lerp(cameraTarget,5*delta)

        camera.position.copy(smoothcameraPos)
        camera.lookAt(smoothcameraTarget)


        if(bodyPos.z < -(blocksCount*4 + 2)){
            end()
        }
        if(bodyPos.y < -2){
            restart()
        }
    })
    return ( 
        <RigidBody
            ref={body} 
            colliders="ball" 
            restitution={0.2} 
            linearDamping={0.5}
            angularDamping={0.5}
            friction={1}
            position={[0,1,0]}>
            <mesh castShadow>
                <icosahedronGeometry args={[0.3,1]}/>
                <meshStandardMaterial 
                    color="#1574b3" flatShading/>
            </mesh>
        </RigidBody>
     );
}
 
export default Player;