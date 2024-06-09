import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

// 1. Scene
const scene = new THREE.Scene()

// 2. Objects

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)


// 3. Camera

//Fit in the viewport
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//Handle Resize
window.addEventListener('resize', () => {
    //Changes size each time we resize the window
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix() //Call to update camera changes 

    //Update renderer
    renderer.setSize(sizes.width, sizes.height)
    //Set Pixel ratio, get the pixel ratio of the window or set it to 2 if it is greater
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

//Full screen
window.addEventListener('dblclick', () => {
    if (!document.fullscreenElement) {
        canvas.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
})

//Perspective Camera
const camera = new THREE.PerspectiveCamera(
    100,
    sizes.width / sizes.height,
    0.1,
    100)


camera.position.z = 3
scene.add(camera)


// 4. Renderer
const canvas = document.querySelector('canvas.webgl')
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Controls
const controls = new OrbitControls(camera, canvas)

controls.enableDamping = true

const tick = () => {
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()