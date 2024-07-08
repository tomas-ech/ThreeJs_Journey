import { Float, Html, MeshReflectorMaterial, OrbitControls, PivotControls, Text, TransformControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";


export default function Experience() {

    const cube = useRef()
    const sphere = useRef()
    const letters = useRef()

    // useFrame((state, delta) => {
    //     letters.current.rotation.y += delta * 2
    // })

    return <>

        <OrbitControls makeDefault />

        <directionalLight position={[1, 2, 3]} intensity={4.5} />
        <ambientLight intensity={1.5} />

        {/* <PivotControls
            anchor={[0, 0, 0]}
            depthTest={false}
            lineWidth={1}
        > */}
        <mesh ref={sphere} position-x={- 2}>
            <sphereGeometry args={[1, 20, 20]} />
            <meshStandardMaterial color="orange" />
            <Html
                position={[-1, 1, 0]}
                wrapperClass="label"
                center
                occlude={[sphere, cube]}
            >
                That's a sphere  :V
            </Html>
        </mesh>
        {/* </PivotControls> */}

        {/* <TransformControls object={cube} /> */}
        <mesh ref={cube} position-x={2} scale={1.5}>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" />
        </mesh>

        <mesh position-y={- 1} rotation-x={- Math.PI * 0.5} scale={10}>
            <planeGeometry />
            {/* <meshStandardMaterial color="greenyellow" /> */}
            <MeshReflectorMaterial
                resolution={512}
                blur={[1000, 1000]}
                mixBlur={1}
                mirror={0.8}
                color="deepskyblue"
            />
        </mesh>

        <Float speed={5} floatIntensity={2}>
            <Text
                ref={letters}
                font="./bangers-v20-latin-regular.woff"
                fontSize={1}
                color={'salmon'}
                position-y={2}
                maxWidth={2}
                textAlign="center"
            >
                Hola Papushis
                <meshNormalMaterial />
            </Text>
        </Float>

    </>
}