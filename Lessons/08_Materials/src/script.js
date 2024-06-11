import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//textures
const textureLoader = new THREE.TextureLoader()

const doorColor = textureLoader.load('textures/door/color.jpg')
const alphaTexture = textureLoader.load('textures/door/alpha.jpg')
const matCapTexture = textureLoader.load('textures/matcaps/3.png')
doorColor.colorSpace = THREE.SRGBColorSpace
matCapTexture.colorSpace = THREE.SRGBColorSpace



const torus = new THREE.TorusGeometry(1, 0.2)
const plane = new THREE.PlaneGeometry(1, 1, 2, 2)
const sphere = new THREE.SphereGeometry(1,20,20)

//const material = new THREE.MeshBasicMaterial()
//material.map = doorColor
// material.color= new THREE.Color('red')
//material.transparent = true
//material.opacity = 0.1

/*Alpha Material*/ 
//material.alphaMap = alphaTexture
// const material = new THREE.MeshNormalMaterial()
// material.side = THREE.DoubleSide
// material.flatShading = true
// material.wireframe = true

/*MatCap Texture*/
const material = new THREE.MeshMatcapMaterial()
material.matcap = matCapTexture

const torusMesh = new THREE.Mesh(torus, material)
torusMesh.position.x = 2

const planeMesh = new THREE.Mesh(plane, material)

const sphereMesh = new THREE.Mesh(sphere, material)
sphereMesh.position.x = -2

scene.add(torusMesh, planeMesh, sphereMesh)


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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 8
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

    sphereMesh.rotation.y = 0.2 * elapsedTime
    torusMesh.rotation.x = 0.4 * elapsedTime
    planeMesh.rotation.z = 0.1 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()