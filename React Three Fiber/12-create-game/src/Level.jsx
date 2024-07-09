import { Float, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import React, { useMemo, useRef, useState } from 'react'
import { BoxGeometry, Euler, MeshStandardMaterial, Quaternion } from 'three'

const boxGeometry = new BoxGeometry(1, 1, 1)

const floorMaterial = new MeshStandardMaterial({ color: 'limegreen' })
const floorMaterial2 = new MeshStandardMaterial({ color: 'greenyellow' })
const obstacleMaerial = new MeshStandardMaterial({ color: 'orangered' })
const wallMaterial = new MeshStandardMaterial({ color: 'slategrey' })



export function BlockStart({ position = [0, 0, 0] }) {
    return <group position={position}>
        <mesh
            geometry={boxGeometry}
            material={floorMaterial}
            position={[0, -0.1, 0]}
            scale={[4, 0.2, 4]}
            receiveShadow
        />
    </group>
}

export function BlockSpinner({ position = [0, 0, 0] }) {
    const spinner = useRef()
    const [speed] = useState(() => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1))

    useFrame((state) => {
        const time = state.clock.getElapsedTime()

        const rotation = new Quaternion()
        rotation.setFromEuler(new Euler(0, time * speed, 0))
        spinner.current.setRotation(rotation)
    })

    return <group position={position}>
        <mesh
            geometry={boxGeometry} material={floorMaterial2}
            position={[0, -0.1, 0]} scale={[4, 0.2, 4]}
            receiveShadow
        />
        <RigidBody ref={spinner} type='kinematicPosition' restitution={0.2} friction={0} position={[0, 0.3, 0]}>
            <mesh
                geometry={boxGeometry} material={obstacleMaerial}
                scale={[3.5, 0.3, 0.3]}
                receiveShadow castShadow
            />
        </RigidBody>
    </group>
}

export function BlockLimbo({ position = [0, 0, 0] }) {
    const spinner = useRef()
    const [tiemOffSet] = useState(() => Math.random() * Math.PI * 2)

    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        const yMove = Math.sin(time + tiemOffSet) + 1.15

        spinner.current.setNextKinematicTranslation({ x: 0, y: yMove, z: position[2] })
    })

    return <group position={position}>
        <mesh
            geometry={boxGeometry} material={floorMaterial2}
            position={[0, -0.1, 0]} scale={[4, 0.2, 4]}
            receiveShadow
        />
        <RigidBody ref={spinner} type='kinematicPosition' restitution={0.2} friction={0} position={[0, 0.3, 0]}>
            <mesh
                geometry={boxGeometry} material={obstacleMaerial}
                scale={[3.5, 0.3, 0.3]}
                receiveShadow castShadow
            />
        </RigidBody>
    </group>
}

export function BlockAxe({ position = [0, 0, 0] }) {
    const spinner = useRef()
    const [tiemOffSet] = useState(() => Math.random() * Math.PI * 2)

    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        const xMove = Math.cos(time + tiemOffSet)

        spinner.current.setNextKinematicTranslation({ x: xMove, y: position[1] + 1, z: position[2] })
    })

    return <group position={position}>
        <mesh
            geometry={boxGeometry} material={floorMaterial2}
            position={[0, -0.1, 0]} scale={[4, 0.2, 4]}
            receiveShadow
        />
        <RigidBody ref={spinner} type='kinematicPosition' restitution={0.2} friction={0} position={[0, 0.3, 0]}>
            <mesh
                geometry={boxGeometry} material={obstacleMaerial}
                scale={[1.5, 1.5, 0.2]}
                receiveShadow castShadow
            />
        </RigidBody>
    </group>
}

export function BlockEnd({ position = [0, 0, 0] }) {

    const hamburger = useGLTF('/hamburger.glb')

    hamburger.scene.children.forEach((mesh) => { mesh.castShadow = true })

    return <group position={position}>
        <mesh
            geometry={boxGeometry}
            material={floorMaterial}
            position={[0, -0.1, 0]}
            scale={[4, 0.2, 4]}
            receiveShadow
        />
        <RigidBody type='fixed' colliders='hull' position={[0, 0.25, 0]} restitution={0.2} friction={0} >
            <Float speed={5}>
                <primitive object={hamburger.scene} scale={0.2} />
            </Float>
        </RigidBody>
    </group>
}

function Bounds({ length = 1, position = [0, 0, 0], scale = [0.3, 1.5, 4 * length] }) {

    return <>
        <mesh
            position={position}
            geometry={boxGeometry}
            material={wallMaterial}
            scale={scale}
            castShadow
        />

    </>

}

export const Level = ({ count = 5, types = [BlockSpinner, BlockAxe, BlockLimbo] }) => {

    const blocks = useMemo(() => {
        const blocks = []

        for (let index = 0; index < count; index++) {
            const type = types[Math.floor(Math.random() * types.length)]
            blocks.push(type)
        }

        return blocks
    }, [count, types])

    const length = count + 2

    return (
        <>
            <BlockStart position={[0, 0, 0]} />

            {
                blocks.map((Block, index) => <Block key={index} position={[0, 0, -(index + 1) * 4]} />)
            }

            <BlockEnd position={[0, 0, -(count + 1) * 4]} />

            <Bounds length={length} position={[2.15, 0.75, -length * 2 + 2]} />
            <Bounds length={length} position={[-2.15, 0.75, -length * 2 + 2]} />
        </>
    )
}
