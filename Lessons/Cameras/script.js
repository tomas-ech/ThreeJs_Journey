import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

// 1. Scene
const scene = new THREE.Scene()

// 2. Objects

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)



// -----------------------   CAMERAS   ------------------------



//Camera Types:

//Array Camera, Stereo Camera, CubeCamera, Orthographic and Perspective camera

const sizes = {
    width: 800,
    height: 600
}

//Perspective Camera
const camera = new THREE.PerspectiveCamera(
    100,  // vertical FOV  (prefered between 45 - 75)
    sizes.width / sizes.height, // Aspect Ratio
    0.1, // Near  very small number -> z-figthing issue
    100) // Far

//Orthographic Camera
// const aspecRatio = sizes.width / sizes.height

// const camera = new THREE.OrthographicCamera(
//     -1 * aspecRatio,     // how far we see to the left
//     1 * aspecRatio,      // right
//     1 * aspecRatio,      // top
//     -1 * aspecRatio,     // bottom
//     0.1,    // near 
//     100)    // far



// -----------------   CUSTOM CONTROLS   ----------------------

camera.position.z = 3
scene.add(camera)


// 4. Renderer
const canvas = document.querySelector('canvas.webgl')
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Orbit Controls despues de agregar la camera y crear el canvas
const controls = new OrbitControls(camera, canvas)

controls.target.y = 2   // target -> a donde mira la camara
//controls.update()       // Carga los ultimos cambios hechos a los controles
controls.enableDamping = true

const tick = () => {
    controls.update()  //Se llama en el ciclo por que el damping se calcula cada frame
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}



//Manually Added Controls

//Cursor

// const cursor = {
//     xAxis: 0,
//     yAxis: 0
// }

//Manually getting the cursor data
// window.addEventListener('mousemove', (event) => {

//     cursor.xAxis = event.clientX / sizes.width - 0.5
//     cursor.yAxis = -(event.clientY / sizes.height - 0.5)

//     console.log(cursor.xAxis, cursor.yAxis)
// })

// const tick = () => {

//     //Update Camera Position (sin and cos to move in a circle)
//     camera.position.x = Math.sin(cursor.xAxis * Math.PI * 2) * 2 
//     camera.position.z = Math.cos(cursor.xAxis * Math.PI * 2) * 2
//     camera.position.y = cursor.yAxis * 3 // Last number is for amplitud
//     camera.lookAt(mesh.position)

//     renderer.render(scene, camera)
//     window.requestAnimationFrame(tick)
// }


tick()