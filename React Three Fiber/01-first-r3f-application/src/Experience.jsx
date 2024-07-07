import { extend, useFrame, useThree } from '@react-three/fiber'
import React from 'react'
import { useRef } from 'react'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { CustomObject } from './CustomObject'

extend({ OrbitControls })

export const Experience = () => {

    const cubeRef = useRef()
    const group = useRef()

    const { camera, gl } = useThree()

    useFrame((state, delta) => {
        cubeRef.current.rotation.y += delta / 4
        //group.current.rotation.y += delta / 2
    })



    return (
        <>
            <orbitControls args={[camera, gl.domElement]} />

            <ambientLight intensity={2} />
            <directionalLight position={[1, 2, 3]} intensity={1.5} />

            <CustomObject />
            <group ref={group}>
                <mesh position-x={-2}>
                    <sphereGeometry args={[1, 25, 10]} />
                    <meshStandardMaterial color={'orange'} />
                </mesh>
                <mesh ref={cubeRef} position-x={2}>
                    <boxGeometry />
                    <meshStandardMaterial color={'purple'} />
                </mesh>
            </group>
            <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={8} >
                <planeGeometry />
                <meshStandardMaterial color={'green'} />
            </mesh>
        </>
    )
}
