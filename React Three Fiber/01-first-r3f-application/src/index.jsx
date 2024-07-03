import { MeshBasicMaterial } from 'three'
import './index.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import { Experience } from './Experience'

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
    <div className='fixed top-0 left-0 w-full h-full overflow-hidden bg-black'>
        <Canvas>
            <Experience />
        </Canvas>
    </div>
)