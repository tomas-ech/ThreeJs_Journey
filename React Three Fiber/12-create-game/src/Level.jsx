import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import React, { useRef } from 'react'
import { BoxGeometry, Euler, MeshStandardMaterial, Quaternion } from 'three'

const boxGeometry = new BoxGeometry(1, 1, 1)

const floorMaterial = new MeshStandardMaterial({ color: 'limegreen' })
const floorMaterial2 = new MeshStandardMaterial({ color: 'greenyellow' })
const obstacleMaerial = new MeshStandardMaterial({ color: 'orangered' })
const wallMaterial = new MeshStandardMaterial({ color: 'slategrey' })



function BlockStart({ position = [0, 0, 0] }) {
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

function BlockSpinner({ position = [0, 0, 0] }) {
    const spinner = useRef()

    useFrame((state) => {
        const time = state.clock.getElapsedTime()

        const rotation = new Quaternion()
        rotation.setFromEuler(new Euler(0, time, 0))
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

export const Level = () => {

    return (
        <>
            <BlockStart position={[0, 0, 4]} />
            <BlockSpinner position={[0, 0, 0]} />
        </>
    )
}
