import * as THREE from 'three'

// 1. Scene
const scene = new THREE.Scene()

// 2. Objects
const group = new THREE.Group()
group.scale.y = 1
group.rotation.y = 0.1
scene.add(group)

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xFFFF00 })
)
cube1.position.x = -1.5
group.add(cube1)

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x0000FF })
)
cube2.position.x = 0
group.add(cube2)

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0303 })
)
cube3.position.x = 1.5
group.add(cube3)

// const geometry = new THREE.BoxGeometry(1, 1, 1)
// const material = new THREE.MeshBasicMaterial({color: 0xff0000})
// const mesh = new THREE.Mesh(geometry, material)
// mesh.position.set(0.7, -0.6, 1) //parameters: x, y, z
//mesh.scale.set(2, 0.25, 0.5)
//mesh.rotation.set(Math.PI * 0.25, Math.PI * 0.25, 0)
//scene.add(mesh)

// 3. Camera
const sizes = {
    width: 800,
    height: 600
}
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
//camera.lookAt(mesh.position)
scene.add(camera)

// 4. Renderer
const canvas = document.querySelector('canvas.webgl')
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

//Axes Helper
const axesHelper = new THREE.AxesHelper(2) //parameter: size of the line
scene.add(axesHelper)

// initialize
renderer.render(scene, camera)