import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { bufferAttribute } from 'three/examples/jsm/nodes/accessors/BufferAttributeNode.js'

// 1. Scene

const scene = new THREE.Scene()

// 2. Objects

//Base Geometries
const geometry = new THREE.SphereGeometry(1, 32, 32)
const material = new THREE.MeshBasicMaterial({ color: 0x999999 , wireframe: true })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

//Create own geometry
const myGeometry = new THREE.BufferGeometry()


// const positionArray = new Float32Array(9)   // Array with vertices position

// //First vertice
// positionArray[0] = 0
// positionArray[1] = 0
// positionArray[2] = 0

// //Second vertice
// positionArray[3] = 0
// positionArray[4] = 1
// positionArray[5] = 0

// //Third vertice
// positionArray[6] = 1
// positionArray[7] = 0
// positionArray[8] = 0

//In array form
const positionArray = new Float32Array([
    0, 0, 0,
    0, 1, 0,
    1, 0, 0
])

// Pass the array into a buffer attribute
const positionsAtribute = new THREE.BufferAttribute(positionArray, 3) //Parameters array with vertices, amount of values that made a vertice

// Set the empty geometry attributes
myGeometry.setAttribute('position', positionsAtribute)

const myOwnMesh = new THREE.Mesh(myGeometry,
    new THREE.MeshBasicMaterial({ color: 0xff0065 , wireframe: false }
))

myOwnMesh.position.x = 1
scene.add(myOwnMesh)


// 3. Camera

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


window.addEventListener('resize', () => {
    
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix() 

    //Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


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

camera.position.z = 5
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