import * as THREE from 'three'
import gsap from 'gsap'

// 1. Scene
const scene = new THREE.Scene()

// 2. Objects

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// 3. Camera
const sizes = {
    width: 800,
    height: 600
}
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// 4. Renderer
const canvas = document.querySelector('canvas.webgl')
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// -----------------  ANIMATION  -----------------------

//1. This way the speed of animation depends of pc performance
// const tick = () => {
//     mesh.rotation.y += 0.01
//     mesh.rotation.x += 0.01
//     renderer.render(scene, camera)
//     window.requestAnimationFrame(tick)
// }

//2. We can use the different between the previous time and the current one
//Time

let previousTime = Date.now()

// const tick = () => {
//     //current time
//     const currentTime = Date.now()
//     const deltaTime = currentTime - previousTime
//     previousTime = currentTime

//     mesh.rotation.y += 0.0001 * deltaTime
//     mesh.rotation.x += 0.001 * deltaTime

//     renderer.render(scene, camera)
//     window.requestAnimationFrame(tick)
// }

//3. We can adjust the speed using the time of the computer

// const clock = new THREE.Clock()

// const tick = () => {
    
//     const elapseTime = clock.getElapsedTime()

//     //mesh.rotation.y = elapseTime * Math.PI * 2 
//     mesh.position.y = Math.sin(elapseTime)
//     mesh.position.x = Math.cos(elapseTime)
//     camera.lookAt(mesh.position)

//     renderer.render(scene, camera)
//     window.requestAnimationFrame(tick)
// }

//4.  We can use a library (similar to LeanTween) to animate 
gsap.to(mesh.position, {duration: 1, delay: 1, x: 3})
gsap.to(mesh.position, {duration: 10, delay: 2, x: 0})

const tick = () => {
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()