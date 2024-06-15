import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Timer } from 'three/addons/misc/Timer.js'
import GUI from 'lil-gui'
import { clamp } from 'three/src/math/MathUtils.js'
import { Sky } from 'three/examples/jsm/Addons.js'

//Textures
const textureLoader = new THREE.TextureLoader()

const albedoDoor = textureLoader.load('door/color.jpg')
albedoDoor.colorSpace = THREE.SRGBColorSpace
const alphaDoor = textureLoader.load('door/alpha.jpg')

//Floor Textures
const albedoFloor = textureLoader.load('forest/color.jpg')
albedoFloor.colorSpace = THREE.SRGBColorSpace
const alphaFloor = textureLoader.load('floor/alpha.jpg')
const roughnessFloor = textureLoader.load('forest/roughness.jpg')
const normalFloor = textureLoader.load('forest/normal.jpg')
const heightFloor = textureLoader.load('forest/height.jpg')
const aoFloor = textureLoader.load('forest/ambientOcclusion.jpg')

//Walls Textures
const albedoWall = textureLoader.load('walls/color.jpg')
albedoWall.colorSpace = THREE.SRGBColorSpace
const normalWall = textureLoader.load('walls/normal.jpg')
const heightWall = textureLoader.load('walls/height.jpg')

//Roof Textures
const albedoRoof = textureLoader.load('roof/color.jpg')
albedoRoof.colorSpace = THREE.SRGBColorSpace
const normalRoof = textureLoader.load('roof/normal.jpg')
const aoRoof = textureLoader.load('roof/aomap.jpg')

//Bush Textures
const albedoBush = textureLoader.load('bush/color.jpg')
albedoBush.colorSpace = THREE.SRGBColorSpace

//Globe Textures
const globeMatcap = textureLoader.load('mapcaps/F77777_FBE1E1_FAB2B2_FBC4C4.jpg')


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
 * Floor
 */

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 100, 100),
    new THREE.MeshStandardMaterial({
        map: albedoFloor,
        alphaMap: alphaFloor,
        transparent: true,
        normalMap: normalFloor
    })
)
floor.rotation.x = -Math.PI / 2
floor.material.roughnessMap = roughnessFloor
floor.material.displacementMap = heightFloor
floor.material.displacementScale = 0.3
floor.material.displacementBias = -0.2
floor.material.aoMap = aoFloor
floor.material.aoMapIntensity = 1
albedoFloor.repeat.set(4, 4)
albedoFloor.wrapS = THREE.RepeatWrapping
albedoFloor.wrapT = THREE.RepeatWrapping
scene.add(floor)


/**
 * House
 */
const house = new THREE.Group()
house.position.y = -0.2
scene.add(house)

const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: albedoWall,
        normalMap: normalWall,
        displacementMap: heightWall,
        displacementScale: 0.3,
        displacementBias: -0.2
    })
)
walls.position.y += 1.25
albedoWall.repeat.set(3, 2)
albedoWall.wrapS = THREE.RepeatWrapping
albedoWall.wrapT = THREE.RepeatWrapping
house.add(walls)

const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1.5, 4),
    new THREE.MeshStandardMaterial({
        map: albedoRoof,
        normalMap: normalRoof,
        aoMap: aoRoof,
        roughnessMap: aoRoof,
        metalnessMap: aoRoof
    })
)
albedoRoof.repeat.set(3, 1)
normalRoof.repeat.set(3, 1)
aoRoof.repeat.set(3, 1)

albedoRoof.wrapS = THREE.RepeatWrapping
normalRoof.wrapS = THREE.RepeatWrapping

roof.position.y += 2.5 /*wall height*/ + 0.75 /*half roof*/
roof.rotation.y = Math.PI / 4
house.add(roof)

const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial()
)
door.position.set(0, 1, 2 + 0.01)
door.material.map = albedoDoor
door.material.transparent = true
door.material.alphaMap = alphaDoor
house.add(door)

const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
    color: '#ccffcc',
    map: albedoBush
})
albedoBush.repeat.set(2, 1)
albedoBush.wrapS = THREE.RepeatWrapping

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(1.2, 0.2, 2.2)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.7, 0.1, 2.1)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(- 1, 0.1, 2.2)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(- 1.2, 0.05, 2.6)

house.add(bush1, bush2, bush3, bush4)
/*
Globe
*/
const globeGeometry = new THREE.SphereGeometry(1, 10, 10)
const globeMaterial = new THREE.PointsMaterial({
    size: 0.02,
    sizeAttenuation: true
})


const globes = new THREE.Group()
scene.add(globes)


for (let i = 0; i < 30; i++) {

    const angle = Math.random() * Math.PI * 2
    const radius = 3.5 + Math.random() * 8
    const xValue = Math.sin(angle) * radius
    const zValue = Math.cos(angle) * radius
    const yValue = clamp(Math.random() * 10, 1, 10)

    const scale = clamp(Math.random() * 0.4, 0.15, 0.4)

    //mesh
    const singleGlobe = new THREE.Points(globeGeometry, globeMaterial)
    singleGlobe.position.set(xValue, yValue, zValue)
    singleGlobe.rotation.x = Math.random() - 0.3
    singleGlobe.scale.set(scale, scale, scale)
    globes.add(singleGlobe)
}

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#86cdff', 0.5)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#86cdff', 1)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)

// Point light  ->  Door Light
const doorLight = new THREE.PointLight('#ff7d46', 5)
doorLight.position.set(0, 2.2, 2.5)
scene.add(doorLight)

/**
* Spirits
*/
const spirit1 = new THREE.PointLight('#ffb8ce', 6)
gui.add(spirit1, 'intensity').min(0).max(100).step(1).name('Spirit1 Intensity')
scene.add(spirit1)

const spiritGuide = new THREE.PointLightHelper(spirit1, 1, 100)
scene.add(spiritGuide)

/**
* Sky
*/
const sky = new Sky()

sky.material.uniforms['turbidity'].value = 10
sky.material.uniforms['rayleigh'].value = 1
sky.material.uniforms['mieCoefficient'].value = 0.1
sky.material.uniforms['mieDirectionalG'].value = 0.95
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95)

sky.scale.set(100, 100, 100)

scene.add(sky)

/**
* Fog
*/
scene.fog = new THREE.FogExp2('#04343f', 0.05)
gui.add(scene.fog, 'density').min(0).max(0.2).step(0.01).name('Fog Density')

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
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
camera.position.x = 0
camera.position.y = 6
camera.position.z = 15
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
const timer = new Timer()

const tick = () => {
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()

    //Spirits
    const spirit1Angle = elapsedTime
    const spiritRadius = 5
    spirit1.position.x = Math.cos(spirit1Angle) * spiritRadius
    spirit1.position.z = Math.sin(spirit1Angle) * spiritRadius
    spirit1.position.y = 1 + Math.sin(spirit1Angle) * Math.sin(spirit1Angle * 2.34) * Math.sin(spirit1Angle * 3.45)


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()