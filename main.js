import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//camera positions
camera.position.z = 60;
camera.position.y = 30;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambient = new THREE.AmbientLight(0x222222);
ambient.position.set(0,0,0);
scene.add(ambient);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const textureLoader = new THREE.TextureLoader();

const bg_texture = new THREE.TextureLoader().load('images/stars_milky_way.jpg');
const sun_texture = new THREE.TextureLoader().load('images/sun.jpg');
const sun_bump = new THREE.TextureLoader().load('images/sunmap.jpg');
const saturn_texture = new THREE.TextureLoader().load('images/saturnmap.jpg');
const bump_texture = new THREE.TextureLoader().load('images/bump_map.jpeg');
const ring_texture = new THREE.TextureLoader().load("images/saturn-rings-top.png");
const enceladus_texture = new THREE.TextureLoader().load('images/enceladus.jpg');
const mimas_texture = new THREE.TextureLoader().load('images/mimas.jpg');
const asteroid_texture = new THREE.TextureLoader().load('images/asteroid.jpg');

//sunlight
const sunlight = new THREE.DirectionalLight(0xffffff, 1);
sunlight.position.set(60, 20, -4);
scene.add(sunlight);

//background
const bg_geometry = new THREE.SphereGeometry(200, 100, 100);
const bg_material = new THREE.MeshBasicMaterial({ map: bg_texture, side: THREE.DoubleSide });
const bg_sphere = new THREE.Mesh(bg_geometry, bg_material);
scene.add(bg_sphere);

// sun
const sun_geometry = new THREE.SphereGeometry(5, 32, 32);
const sun_material = new THREE.MeshBasicMaterial({ map:sun_texture,  bumpMap:sun_bump, bumpScale:0.1 });
const sun = new THREE.Mesh(sun_geometry, sun_material);
sun.position.copy(sunlight.position);
scene.add(sun);

// saturn
const saturn_geometry = new THREE.SphereGeometry(15, 32, 100);
const saturn_material = new THREE.MeshStandardMaterial({ map: saturn_texture, bumpMap:bump_texture, bumpScale:0.1});
const saturn_sphere = new THREE.Mesh(saturn_geometry, saturn_material);
scene.add(saturn_sphere);

// ring
const ring_geometry  = new THREE.RingGeometry(23, 32, 100); 
const pos = ring_geometry .attributes.position;
const v3 = new THREE.Vector3();

for (let i = 0; i < pos.count; i++) {
  v3.fromBufferAttribute(pos, i);
  ring_geometry .attributes.uv.setXY(i, v3.length() < 25 ? 0 : 1, 1); // Adjust UV condition
}

const ring_material = new THREE.MeshBasicMaterial({
  map: ring_texture,
  color: 0xffffff,
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.8
});

const ring= new THREE.Mesh(ring_geometry, ring_material);
scene.add(ring);

// ring and saturn position
ring.position.x = 2;
ring.position.y = 6;
saturn_sphere.position.x = 2;
saturn_sphere.position.y = 6;

// ring angle
ring.rotation.x = Math.PI / 2;

// enceladus moon
const enceladus_geometry = new THREE.SphereGeometry(2, 32, 32);
const enceladus_material = new THREE.MeshLambertMaterial({ map: enceladus_texture, bumpMap:bump_texture, bumpScale:0.1 });
const enceladus = new THREE.Mesh(enceladus_geometry, enceladus_material);
const enceladusOrbitRadius = 25;
scene.add(enceladus);

// mimas moon
const mimas_geometry = new THREE.SphereGeometry(2, 32, 32);
const mimas_material = new THREE.MeshLambertMaterial({ map: mimas_texture, bumpMap:bump_texture, bumpScale:0.1 });
const mimas = new THREE.Mesh(mimas_geometry, mimas_material);
const mimasOrbitRadius = 20;
scene.add(mimas);

// particle system
const particleCount = 10000; // Number of particles
const particles = new Float32Array(particleCount * 3); // Array to hold particle positions

for (let i = 0; i < particleCount * 3; i += 3) {
  const radius = 200; // Radius of the background sphere
  const theta = Math.random() * Math.PI * 2; // Random angle around the sphere
  const phi = Math.acos(2 * Math.random() - 1); // Random angle from pole to equator

  particles[i] = radius * Math.sin(phi) * Math.cos(theta); // x position
  particles[i + 1] = radius * Math.sin(phi) * Math.sin(theta); // y position
  particles[i + 2] = radius * Math.cos(phi); // z position
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(particles, 3));

const material = new THREE.PointsMaterial({ size: 0.01, color: 0xffffff, transparent: true });

const particleSystem = new THREE.Points(geometry, material);
scene.add(particleSystem);

// Random Asteroids
const numAsteroids = 50; // Number of asteroids
const asteroids = [];
const asteroidMovements = [];

for (let i = 0; i < numAsteroids; i++) {
  const asteroidSize = Math.random() * 4 + 0.5;
  const asteroidGeometry = new THREE.DodecahedronGeometry(asteroidSize, 0);
  const asteroidMaterial = new THREE.MeshBasicMaterial({ map: asteroid_texture });

  const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
  
  const radius = 200; // Radius of the background sphere
  const theta = Math.random() * Math.PI * 2; // Random angle around the sphere
  const phi = Math.acos(2 * Math.random() - 1); // Random angle from pole to equator
  
  asteroid.position.x = radius * Math.sin(phi) * Math.cos(theta);
  asteroid.position.y = radius * Math.sin(phi) * Math.sin(theta);
  asteroid.position.z = radius * Math.cos(phi);
  
  asteroids.push(asteroid);
  scene.add(asteroid);
  
  asteroidMovements.push({
    x: (Math.random() - 0.5) * 0.1,
    y: (Math.random() - 0.5) * 0.1,
    z: (Math.random() - 0.5) * 0.1,
  });

  asteroid.receiveShadow = true;
  asteroid.castShadow = true;
}

// Enable shadows in the scene
renderer.shadowMap.enabled = true;
sunlight.castShadow = true;
enceladus.castShadow = true;
mimas.castShadow = true;
ring.castShadow = true;
saturn_sphere.castShadow = true;

enceladus.receiveShadow = true;
mimas.receiveShadow = true;
ring.receiveShadow = true;
saturn_sphere.receiveShadow = true;


// Increase the shadow camera's frustum values
sunlight.shadow.camera.left = -100;
sunlight.shadow.camera.right = 100;
sunlight.shadow.camera.top = 100;
sunlight.shadow.camera.bottom = -100;
sunlight.shadow.mapSize.width = 1024;
sunlight.shadow.mapSize.height = 1024;
sunlight.shadow.camera.near = 1;
sunlight.shadow.camera.far = 2000;

// Set up shadow properties for moons
enceladus.castShadow = true;
mimas.castShadow = true;

// Set up shadow properties for Saturn
saturn_sphere.receiveShadow = true;

// Animation
let enceladusAngle = 0;
let mimasAngle = Math.PI / 2;

//spaceship
var loader = new GLTFLoader();
var spaceship;
loader.load(
    './Intergalactic_Spaceships_Version_2/GLTF_SEPARATE/Intergalactic_Spaceships_Version_2.gltf',
    function (gltf) {

      var scaleFactor = 0.5; // Adjust this value to decrease the size
      gltf.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);
      spaceship=gltf.scene;
      scene.add(spaceship);
      spaceship.position.set(10,20,40);
      spaceship.rotation.set(0, Math.PI / 2, 0);
      spaceship.castShadow = true;
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.error('An error occurred:', error);
    }
);

function animate() {
  requestAnimationFrame(animate);
  controls.update()

  const enceladusX = Math.cos(enceladusAngle) * enceladusOrbitRadius;
  const enceladusY = Math.sin(enceladusAngle) * enceladusOrbitRadius;
  const enceladusZ = Math.sin(enceladusAngle) * enceladusOrbitRadius;
  enceladus.position.set(enceladusX, enceladusY, enceladusZ);

  const mimasX = Math.sin(mimasAngle) * mimasOrbitRadius;
  const mimasY = Math.cos(mimasAngle) * mimasOrbitRadius;
  const mimasZ = Math.cos(mimasAngle) * mimasOrbitRadius;
  mimas.position.set(mimasX, mimasY , mimasZ);

  enceladusAngle += 0.001;
  mimasAngle += 0.005;

  saturn_sphere.rotation.y += 0.01;
  enceladus.rotation.y += 0.1;
  mimas.rotation.y += 0.1;
  scene.rotation.y -= 0.001;

  asteroids.forEach((asteroid, index) => {
    // Accumulate movement deltas for each asteroid
    asteroid.position.x += asteroidMovements[index].x;
    asteroid.position.y += asteroidMovements[index].y;
    asteroid.position.z += asteroidMovements[index].z;

    // Ensure asteroids stay within a reasonable range
    const maxPosition = 100;
    const minPosition = -100;

    if (asteroid.position.x > maxPosition || asteroid.position.x < minPosition) {
      asteroidMovements[index].x *= -1;
    }
    if (asteroid.position.y > maxPosition || asteroid.position.y < minPosition) {
      asteroidMovements[index].y *= -1;
    }
    if (asteroid.position.z > maxPosition || asteroid.position.z < minPosition) {
      asteroidMovements[index].z *= -1;
    }
  });

    renderer.render(scene, camera);
}
animate();
