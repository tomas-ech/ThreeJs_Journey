import * as THREE from "three";
import GUI from "lil-gui";

/**
 * Debug
 */
const gui = new GUI();

const parameters = {
  materialColor: "#00ccff",
};

gui.addColor(parameters, "materialColor").onFinishChange(() => {
  material.color.set(parameters.materialColor);
});


/**
 * Textures
*/
const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load("textures/gradients/3.jpg");
gradientTexture.magFilter = THREE.NearestFilter;

/**
 * Base
*/
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

//Materials
const material = new THREE.MeshNormalMaterial({
    color: parameters.materialColor,
    gradientMap: gradientTexture,
    wireframe: true
});
gui.add(material, "wireframe")

/**
 * Meshes
 */
const objectsDistance = 4;

const torus = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
const piramid = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 40), material);
const knotTorus = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
);

torus.position.y = -objectsDistance * 0;
torus.position.x = 2

piramid.position.y = -objectsDistance * 1;
piramid.position.x = -2

knotTorus.position.y = -objectsDistance * 2;
knotTorus.position.x = 2

const sectionMeshes = [torus, piramid, knotTorus];

scene.add(torus, piramid, knotTorus);

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight("#ffffff", 3);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

/**
 * Scroll
 */
let scrollY = window.scrollY

window.addEventListener('scroll', () => 
{
    scrollY = window.scrollY
})

/**
 * Mouse
 */
let cursorData = {}
cursorData.x = 0
cursorData.y = 0

window.addEventListener('mousemove', (event) => 
{
    cursorData.x = event.clientX / sizes.width - 0.5 
    cursorData.y = event.clientY / sizes.height - 0.5
})

/**
 * SizYs
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const cameraGroup = new THREE.Group()

const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
cameraGroup.add(camera)
scene.add(cameraGroup);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true, //Permite poner el fondo del canvas transparente
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.setClearAlpha(0); // Maneja la transparencia del canvas 0 - 1

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //Animate Meshes
  for (const mesh of sectionMeshes) {
    mesh.rotation.x = elapsedTime / 4
    mesh.rotation.y = elapsedTime / 4
  }

  //Animate Camera
  camera.position.y = - scrollY / sizes.height * objectsDistance

  //Parallax
  const parallaxX = cursorData.x
  const parallaxY = - cursorData.y
  
  cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 0.1
  cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 0.1

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
