import React from 'react'

export const Experience = () => {
    return (
        <group>
            <mesh position-x={-2}>
                <sphereGeometry args={[1, 25, 10]} />
                <meshBasicMaterial color={'orange'} wireframe={true} />
            </mesh>
            <mesh position-x={2}>
                <boxGeometry />
                <meshBasicMaterial color={'purple'} wireframe={true} />
            </mesh>
            <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={8} >
                <planeGeometry />
                <meshBasicMaterial color={'green'} />
            </mesh>
        </group>
    )
}
