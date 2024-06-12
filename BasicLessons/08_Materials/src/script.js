import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { RGBELoader } from 'three/examples/jsm/Addons.js'

/**
 * Base
 */

const gui = new GUI({title: "Materials Panel"})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//textures
const textureLoader = new THREE.TextureLoader()

const alphaTexture = textureLoader.load('textures/door/alpha.jpg')
const gradientTexture = textureLoader.load('textures/gradients/5.jpg')

const doorColor = textureLoader.load('textures/door/color.jpg')
const aoTexture = textureLoader.load('textures/door/ambientOcclusion.jpg')
const heightTexture = textureLoader.load('textures/door/height.jpg')
const metalnessTexture = textureLoader.load('textures/door/metalness.jpg')
const roughnessTexture = textureLoader.load('textures/door/roughness.jpg')
const normalTexture = textureLoader.load('textures/door/normal.jpg')

const matCapTexture = textureLoader.load('textures/matcaps/8.png')

doorColor.colorSpace = THREE.SRGBColorSpace
matCapTexture.colorSpace = THREE.SRGBColorSpace



const torus = new THREE.TorusGeometry(0.3, 0.2, 64, 128)
const plane = new THREE.PlaneGeometry(1, 1, 100, 100)
const sphere = new THREE.SphereGeometry(0.5, 64, 64)

//const material = new THREE.MeshBasicMaterial()
//material.map = doorColor
// material.color= new THREE.Color('red')
//material.transparent = true
//material.opacity = 0.1

/*Alpha Material*/ 
//material.alphaMap = alphaTexture
// const material = new THREE.MeshNormalMaterial()
//material.side = THREE.DoubleSide
// material.flatShading = true
// material.wireframe = true

/*MatCap Texture*/
// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matCapTexture

//Lamber Material  (need real lights)
//const material = new THREE.MeshLambertMaterial()

//Phong Material  (need real lights) (less performant than lamber)
// const material = new THREE.MeshPhongMaterial(0xffffff, 1) //Similar to lamber but the light division is less visible
// material.shininess = 100
// material.specular = new THREE.Color(0xefc3d2)

//Toon material (need real lights)
// const material = new THREE.MeshToonMaterial()
// gradientTexture.minFilter = THREE.NearestFilter
// gradientTexture.magFilter = THREE.NearestFilter
// gradientTexture.generateMipmaps = false
// material.gradientMap = gradientTexture

//Standard material  (no necessary need lights) (use physics)
const material = new THREE.MeshStandardMaterial()

material.map = doorColor //load the "albedo" 
material.metalness = 1
material.roughness = 1

material.aoMap = aoTexture //ambient occlusion map -> add shadows
material.aoMapIntensity = 1

material.displacementMap = heightTexture; //height map -> relief
material.displacementScale = 0.1

material.metalnessMap = metalnessTexture

material.roughnessMap = roughnessTexture

material.normalMap = normalTexture
material.normalScale.set(2,2)

material.transparent = true
material.alphaMap = alphaTexture


gui
.add(material, 'metalness')
.min(0)
.max(1)
.step(0.001)

gui
.add(material, 'roughness')
.min(0)
.max(1)
.step(0.001)

//----- Lights -----

// const ambientLight = new THREE.AmbientLight(0xffffff, 1)

// const pointLight = new THREE.PointLight(0xffffff, 30)
// pointLight.position.z = 1
// pointLight.position.x = 2
// pointLight.position.y = 3

// scene.add(ambientLight)
// scene.add(pointLight)

// ----- Environment map  (doesnt need lights)
const rgbeLoader = new RGBELoader
rgbeLoader.load('textures/environmentMap/2k.hdr', (environmentMap) => {
    
    environmentMap.mapping = THREE.EquirectangularReflectionMapping

    scene.background = environmentMap  //Send the image to the background
    scene.environment = environmentMap  // Made that objects reflects the image
})



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
    //planeMesh.rotation.z = 0.1 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()