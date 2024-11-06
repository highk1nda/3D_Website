import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Basic setup
// init the scene
const scene = new THREE.Scene();

// init the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// init the renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(0);
camera.position.setX(0);

renderer.render(scene, camera);


// Torus
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0x7dd15d, wireframe: true });
const torus = new THREE.Mesh(geometry, material);
torus.position.set(8,-1,10);
scene.add(torus);


// Lights
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Helpers below
// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff, wireframe: true });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// Background
scene.background = new THREE.Color(0x000000);

const geometry_1 = new THREE.SphereGeometry( 100, 100, 100 );
const wireframe = new THREE.WireframeGeometry( geometry_1 );
const line = new THREE.LineSegments( wireframe );
line.material.depthTest = false;
line.material.opacity = 0.25;
line.material.transparent = true;
scene.add( line );

// Sphere
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    color: 0xaaaaaa,
    wireframe: true,
  })
);

scene.add(sphere);

sphere.position.z = 30;
sphere.position.setX(-10);

// Animation for each Section => custom Camera Animation
function animateSection1() {
  const t = window.scrollY;
  camera.position.x = 10 * Math.cos(t * 0.001);
  camera.position.y = 10 * Math.sin(t * 0.001);
  camera.position.z = 30 + t * -0.01;
  camera.lookAt(0, 0, 0);
}

function animateSection2() {
  const t = window.scrollY;
  camera.position.y = 100 * Math.cos(t * 2);  // Vertical movement
  camera.position.x = 0;  // Keep it centered
  camera.position.z = 0 + t * -0.01;
  camera.lookAt(0, 10, 0); // Gradually look upward
}

function animateSection3() {
  const t = window.scrollY;
  camera.position.x = 8 * Math.sin(t * 0.0115);
  camera.position.y = 8 * Math.cos(t * 0.0115);
  camera.position.z = 25 + t * -0.01;
  camera.lookAt(-5, -5, 0);
}

// Check which section is in view
function getCurrentSection() {
  const sections = document.querySelectorAll('.section');
  let currentSection = 1;

  sections.forEach((section, index) => {
    const sectionTop = section.getBoundingClientRect().top;
    if (sectionTop <= window.innerHeight && sectionTop >= 0) {
      currentSection = index + 1;
    }
  });

  return currentSection;
}

// Scroll Animation for each Section their own Camera Movement
function moveCamera() {
  const currentSection = getCurrentSection();
  const t = window.scrollY;

  switch (currentSection) {
    case 1:
      animateSection1();
      break;
    case 2:
      animateSection2();
      break;
    case 3:
      animateSection3();
      break;
    default:
      break;
  }

  // Rotate the sphere
  sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.01;
  sphere.rotation.z += 0.01;
}

// Set that moveCamera runs on scroll
window.addEventListener('scroll', moveCamera);
moveCamera();

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  sphere.rotation.x += 0.005;

  renderer.render(scene, camera);
}

animate();
