import { useFrame } from "@react-three/fiber"
import { CuboidCollider, RigidBody } from "@react-three/rapier"
import { useRef, useState } from "react"
import { BoxGeometry, Euler, Quaternion } from "three"
import { Text } from "@react-three/drei"
const boxGeo = new BoxGeometry()

const Floor = ({color}) => {

    return (
            <mesh 
                geometry={boxGeo}
                position-y={-0.1} 
                scale={[4,0.2,4]}
                receiveShadow>
                <meshStandardMaterial 
                    color={color}
                    metalness={0}
                    roughness={0}
                />
            </mesh>
    )
}
const StartBlock = ({position = [0,0,0]}) => {

    return (
        <group position={position}>
            <Floor color="#111111"/>
        </group>
    )
}
const SpinnerBlock = ({position=[0,0,0]}) => {
    const spinner = useRef()
    const [ speed ] = useState((Math.random() + 0.2) * (Math.random()<0.5 ? -1 : 1))

    useFrame(({clock:{elapsedTime}})=>{
        const rotation = new Quaternion()
        rotation.setFromEuler(new Euler(0,elapsedTime*speed,0))
        spinner.current.setNextKinematicRotation(rotation)
    })
    return (
        <group position={position}>
            <Floor color="#222222"/>
            <RigidBody 
                ref={spinner}
                type="kinematicPosition" 
                restitution={0.2} 
                friction={0}
                position={[0,0.15,0]}>
                <mesh
                    geometry={boxGeo}
                    scale={[3.5,0.3,0.3]}
                    castShadow>
                        <meshStandardMaterial color="orangered"/>
                </mesh>
            </RigidBody>
        </group>
    )
}
const LimboBlock = ({position=[0,0,0]}) => {
    const barrier = useRef()
    const [ speed ] = useState(Math.random() * Math.PI * 2)

    useFrame(({clock:{elapsedTime}})=>{
        const offset = Math.sin(elapsedTime*speed) + 1.15
        barrier.current.setNextKinematicTranslation({
            x:position[0],
            y: position[1] + offset,
            z:position[2]})
    })
    return (
        <group position={position}>
            <Floor color="#222222"/>
            <RigidBody 
                ref={barrier}
                type="kinematicPosition" 
                restitution={0.2} 
                friction={0}
                position={[0,0.15,0]}>
                <mesh
                    geometry={boxGeo}
                    scale={[3.5,0.3,0.3]}
                    castShadow>
                        <meshStandardMaterial color="orangered"/>
                </mesh>
            </RigidBody>
        </group>
    )
}
const AxeBlock = ({position=[0,0,0]}) => {
    const barrier = useRef()
    const [ speed ] = useState(Math.random() * Math.PI * 2)

    useFrame(({clock:{elapsedTime}})=>{
        const offset = Math.sin(elapsedTime+speed)
        barrier.current.setNextKinematicTranslation({
            x:position[0] + offset,
            y: position[1] + 0.75,
            z:position[2]})
    })
    return (
        <group position={position}>
            <Floor color="#222222"/>
            <RigidBody 
                ref={barrier}
                type="kinematicPosition" 
                restitution={0.2} 
                friction={0}
                position={[0,0.15,0]}>
                <mesh
                    geometry={boxGeo}
                    scale={[1.5,1.5,0.3]}
                    castShadow>
                        <meshStandardMaterial color="orangered"/>
                </mesh>
            </RigidBody>
        </group>
    )
}
const EndBlock = ({position = [0,0,0]}) => {
    const reward = useRef()

    useFrame(({clock:{elapsedTime}})=>{
        const rotation = new Quaternion()
        rotation.setFromEuler(new Euler(0,elapsedTime,0))
        reward.current.setNextKinematicRotation(rotation)
    })
    return (
        <group position={position}>
            <Floor color="#111111"/>
            <RigidBody 
                ref={reward}
                type="kinematicPosition" 
                colliders="hull"
                restitution={0.2}
                friction={0}>
                <mesh position={[0,1,0]} scale={0.8} castShadow>
                    <tetrahedronGeometry/>
                    <meshStandardMaterial color="yellow"/>
                </mesh>
            </RigidBody>
            <Text
                font="/bebas-neue-v9-latin-regular.woff"
                position={[0,1.75,2]}>
                FINISH
            </Text>
        </group>
    )
}
const Bounds = ({length}) => {

    return (
        <>
            <RigidBody 
                type="fixed"
                restitution={0.2}
                friction={0}>
                <mesh
                    geometry={boxGeo}
                    scale={[0.3,1.5,length*4]}
                    position={[2.15,0.75,-(length*2)+2]}
                    castShadow>
                        <meshStandardMaterial color="slateGrey"/>
                </mesh>
                <mesh
                    geometry={boxGeo}
                    scale={[0.3,1.5,length*4]}
                    position={[-2.15,0.75,-(length*2)+2]}
                    receiveShadow>
                        <meshStandardMaterial color="slateGrey"/>
                </mesh>
                <mesh
                    geometry={boxGeo}
                    scale={[4,1.5,0.3]}
                    position={[0,0.75,-length*4+1.85]}
                    receiveShadow>
                        <meshStandardMaterial color="slateGrey"/>
                </mesh>
                <CuboidCollider 
                    args={[2,0.1,2*length]} 
                    position={[0,-0.1,-(length * 2) + 2]}/>
            </RigidBody>
        </>
    )
}
const Level = ({count = 5,types = [SpinnerBlock,LimboBlock,AxeBlock],seed}) => {
    return (
        <>
            <StartBlock/>
            {
                [...new Array(count)].map((_,index)=> {
                    const Block = types[Math.floor(Math.random()*types.length)]
                    return <Block key={index} position={[0,0,-4 * (index+1)]}/>
                })
            }
            <EndBlock position={[0,0,-4*(count+1)]}/>
            <Bounds length={count+2}/>
        </>
    )
}
export default Level;