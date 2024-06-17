import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const particleTexture = textureLoader.load('textures/particles/4.png')

/**
 * Particles
 */
// Geometry
// const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)
// const sphereMesh = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial())
// scene.add(sphereMesh)

// Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.3,
    sizeAttenuation: true,
    color: 0xff9bef9,
    map: particleTexture,
    transparent: true,
    alphaMap: particleTexture,
    //alphaTest: 0.001, //we use a small number instead of 0, that way the render wont show any edges
    //depthTest: false
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true
})
gui.addColor(particlesMaterial, 'color')

/**
 * Custom Geometry
 */
const customGeometry = new THREE.BufferGeometry()
const count = 9000

const colors = new Float32Array(count * 3)
const positions = new Float32Array(count * 3) //Multiply by 3 due that each positions is composed of 3 values (x,y,z)

for (let index = 0; index < count * 3; index++) {
    positions[index] = (Math.random() - 0.5) * 10
    colors[index] = Math.random()
}

customGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)) //This is used to inform the geometry that each position used 3 values
customGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

const customParticles = new THREE.Points(customGeometry, particlesMaterial)
scene.add(customParticles)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    customParticles.rotation.y = elapsedTime * 0.1

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()