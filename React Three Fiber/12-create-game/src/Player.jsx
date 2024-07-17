import { useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { RigidBody, useRapier } from '@react-three/rapier'
import React, { useEffect, useRef, useState } from 'react'
import { Vector3 } from 'three'

export const Player = () => {

    const [subscribeKeys, getKeys] = useKeyboardControls()
    const [smoothCamPos] = useState(() => new Vector3())
    const [smoothCamTar] = useState(() => new Vector3())

    const body = useRef()
    const { rapier, world } = useRapier()

    const jump = () => {
        const origin = body.current.translation()
        origin.y -= 0.31

        const direction = { x: 0, y: -1, z: 0 }
        const ray = new rapier.Ray(origin, direction)
        const hit = world.castRay(ray, 10, true)

        if (hit.timeOfImpact < 0.15) {
            body.current.applyImpulse({ x: 0, y: 0.5, z: 0 })
        }
    }

    useEffect(() => {
        const unsubscribeJump = subscribeKeys(
            (state) => state.jump,
            (value) => {
                if (value) {
                    jump()
                }
            }
        )

        return () => {
            unsubscribeJump()
        }
    }, [])

    useFrame((state, delta) => {

        const { forward, backward, leftward, rightward } = getKeys()

        const impulse = { x: 0, y: 0, z: 0 }
        const torque = { x: 0, y: 0, z: 0 }

        const impulseStrength = delta * 0.4
        const torqueStrength = delta * 0.2

        if (forward) {
            impulse.z -= impulseStrength
            torque.x -= torqueStrength
        }

        if (rightward) {
            impulse.x += impulseStrength
            torque.z -= torqueStrength
        }

        if (backward) {
            impulse.z += impulseStrength
            torque.x += torqueStrength
        }

        if (leftward) {
            impulse.x -= impulseStrength
            torque.z += torqueStrength
        }

        body.current.applyImpulse(impulse)
        body.current.applyTorqueImpulse(torque)

        /**
         * Camera
         */

        const bodyPosition = body.current.translation()

        const cameraPosition = new Vector3()
        cameraPosition.copy(bodyPosition)
        cameraPosition.z += 4
        cameraPosition.y += 1.5

        const cameraTarget = new Vector3()
        cameraTarget.copy(bodyPosition)
        cameraTarget.y += 0.25

        smoothCamPos.lerp(cameraPosition, 5 * delta)
        smoothCamTar.lerp(cameraTarget, 5 * delta)

        state.camera.position.copy(smoothCamPos)
        state.camera.lookAt(smoothCamTar)
    })


    return (
        <>
            <RigidBody
                ref={body}
                colliders="ball"
                restitution={0.2}
                friction={1}
                position={[0, 1, 0]}
                canSleep={false}
                linearDamping={0.5}
                angularDamping={0.5}
            >
                <mesh castShadow>
                    <icosahedronGeometry args={[0.3, 1]} />
                    <meshStandardMaterial flatShading color="mediumpurple" />
                </mesh>
            </RigidBody>
        </>
    )
}
