import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const imageSource = '/textures/door/color.jpg'

/*
LOADING TEXTURE 1 WAY
*/
// const image = new Image()
// //To use the image we need to convert it to texture
// const texture = new THREE.Texture(image)
// //we need to specify the encoded type
// texture.colorSpace = THREE.SRGBColorSpace

// image.onload = () => {
//     console.log("Image Loaded");

//     //then the texture goes into the material (see below)

//     //to update texture the next time is used
//     texture.needsUpdate = true
// }
// image.src = imageSource

// /*
// LOADING TEXTURE 2 WAY
// */
// const textureLoader = new THREE.TextureLoader()
// const texture = textureLoader.load(imageSource)
// texture.colorSpace = THREE.SRGBColorSpace

/*
LOADING MANAGERS
*/
//loading managers give us events like onStart, onProgress, onError, onLoaded, etc
const loadingManager = new THREE.LoadingManager()

loadingManager.onStart = () => {
    console.log("Starting loading image");
}

loadingManager.onLoad = () => {
    console.log("Loaded");
}

const textureLoader = new THREE.TextureLoader(loadingManager)

const texture = textureLoader.load(imageSource)
texture.colorSpace = THREE.SRGBColorSpace

const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusionTexture.jpg')
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')



/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ map: texture })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

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
camera.position.z = 1
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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()