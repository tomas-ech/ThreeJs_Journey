import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import gsap from 'gsap'
import GUI from 'lil-gui'

// 1. Scene

const scene = new THREE.Scene()

// 2. Objects

// ----------------------- DEBUG UI  -----------------------------
//We can create an objecto to store debug data
const debugObject = {}
debugObject.color = '#3a6ea6'

//Base Geometries
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
// Set the color using the debug object
const material = new THREE.MeshBasicMaterial({ color: debugObject.color, wireframe: true })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

const gui = new GUI({title: 'Super Debug UI'})
//gui.close() //To initialize the panel closed
gui.hide() //To became the panel invisible

window.addEventListener('keydown', (event) => {
    if (event.key == 'h') {
        gui.show(gui._hidden) //Show the panel, parameter is the current state of hidden
    }
})


//Folders
const cubeTweaks = gui.addFolder('Awesome Cube')

//Add parameter into the debug ui
cubeTweaks.add(mesh.position, 'y', -1, 1, 0.1)

cubeTweaks
    .add(mesh.position, 'z')
    .min(-2)
    .max(2)
    .step(0.1)
    .name("z Position jeje")

//We can create objects to add variables into the debug ui
const myObject = {
    variableToAdd: 270896
}

cubeTweaks.add(myObject, 'variableToAdd') //Its considered as text if there is no min max etc

//Check box
cubeTweaks.add(mesh, 'visible') //It adds the property
cubeTweaks.add(material, 'wireframe')

//Color
// The color displayed into the debug ui is not the same three.js uses, we need to get the hex color from three.js
cubeTweaks
    .addColor(material, 'color')
    .onChange((value) => {
        console.log(value.getHexString()) //this is the right color
    })

cubeTweaks
    .addColor(debugObject, 'color')
    .onChange(() => {
        material.color.set(debugObject.color)
    })
    .name("Color using object")

//Buttons
//We CANT add functions like a property of an object
// const myFunction = () => {
//     console.log('Doing something')
// }
// gui.add(myFunction, '???')
//We CAN add it as a part of the debug object
debugObject.spin = () => {
    gsap.to(mesh.rotation, { duration: 5, y: mesh.rotation.y + Math.PI * 2 })
}
cubeTweaks.add(debugObject, 'spin')

//subdivisions
//The subdivisions of an objects only set one time, so we will need to destroy the current object and generate a new one
debugObject.subdivision = 2

cubeTweaks
    .add(debugObject, 'subdivision')
    .min(1)
    .max(20)
    .step(1)
    .onFinishChange(() => { //we set the subdivision only when the value stops changing
        mesh.geometry.dispose() //To prevent memory leak
        mesh.geometry = new THREE.BoxGeometry(
            1, 1, 1,
            debugObject.subdivision,
            debugObject.subdivision,
            debugObject.subdivision
        )

    })

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