import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//camera positions
camera.position.z = 50;
camera.position.y = 10;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambient = new THREE.AmbientLight(0x222222);
scene.add(ambient);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const textureLoader = new THREE.TextureLoader();

const bg_texture = textureLoader.load('images/stars_milky_way.jpg');
const sun_texture = textureLoader.load('images/sunmap.jpg');
const saturn_texture = textureLoader.load('images/saturnmap.jpg');
const ring_texture = textureLoader.load('images/saturnringpattern.gif');
const ring_normal_map = textureLoader.load('images/saturnringpattern.jpg');
const enceladus_texture = textureLoader.load('images/enceladus.jpg');
const mimas_texture = textureLoader.load('images/mimas.jpg');
const asteroid_texture = textureLoader.load('images/asteroid.jpg');


//sunlight
const sunlight = new THREE.DirectionalLight(0xffffff, 1);
sunlight.position.set(60, 20, -4);
scene.add(sunlight);

//background
const bg_geometry = new THREE.SphereGeometry(200, 100, 100);
const bg_material = new THREE.MeshBasicMaterial({ map: bg_texture, side: THREE.DoubleSide });
const bg_sphere = new THREE.Mesh(bg_geometry, bg_material);
scene.add(bg_sphere);

//sun
const sun_geometry = new THREE.SphereGeometry(5, 32, 32);
const sun_material = new THREE.MeshBasicMaterial({ map:sun_texture });
const sun = new THREE.Mesh(sun_geometry, sun_material);
// sun.position.set(40, 10, 10);
sun.position.copy(sunlight.position);
scene.add(sun);

//saturn
const saturn_geometry = new THREE.SphereGeometry(15, 32, 100);
const saturn_material = new THREE.MeshStandardMaterial({ map: saturn_texture });
const saturn_sphere = new THREE.Mesh(saturn_geometry, saturn_material);
scene.add(saturn_sphere);

//ring
const ring_geometry = new THREE.RingGeometry(32, 23, 100);
const ring_material = new THREE.MeshStandardMaterial({
  map: ring_texture,
  normalMap: ring_normal_map,
  roughness: 0.6,
  metalness: 0.1,
  transparent: true,
  opacity: 0.8,
});
const ring = new THREE.Mesh(ring_geometry, ring_material);
scene.add(ring);

//ring and saturn position
ring.position.x = 2;
ring.position.y = 6;
saturn_sphere.position.x = 2;
saturn_sphere.position.y = 6;

//ring angle
ring.rotation.x = Math.PI / 2;

// enceladus moon
const enceladus_geometry = new THREE.SphereGeometry(1, 32, 32);
const enceladus_material = new THREE.MeshLambertMaterial({ map: enceladus_texture });
const enceladus = new THREE.Mesh(enceladus_geometry, enceladus_material);
const enceladusOrbitRadius = 25;
scene.add(enceladus);

// mimas moon
const mimas_geometry = new THREE.SphereGeometry(1, 32, 32);
const mimas_material = new THREE.MeshLambertMaterial({ map: mimas_texture });
const mimas = new THREE.Mesh(mimas_geometry, mimas_material);
const mimasOrbitRadius = 20;
scene.add(mimas);


//random asteroids
const numAsteroids = 10; //number of asteroids
const asteroids = [];
const asteroidMovements = [];

for (let i = 0; i < numAsteroids; i++) {
  const asteroidSize = Math.random() * 0.5 + 0.5;
  const asteroidGeometry = new THREE.DodecahedronGeometry(asteroidSize, 0);
  const asteroidMaterial = new THREE.MeshBasicMaterial({ map:asteroid_texture});

  const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
  asteroid.position.set((Math.random()-0.5) * 40,(Math.random()-0.5) * 40,(Math.random()-0.5) * 40);

  asteroids.push(asteroid);
  scene.add(asteroid);

  asteroidMovements.push({x: (Math.random() - 0.5) * 0.1,y: (Math.random() - 0.5) * 0.1,z: (Math.random() - 0.5) * 0.1,});
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

bg_sphere.receiveShadow = true;
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

function animate() {
  requestAnimationFrame(animate);

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


  asteroids.forEach((asteroid, index) => {
    // Accumulate movement deltas for each asteroid
    asteroid.position.x += asteroidMovements[index].x;
    asteroid.position.y += asteroidMovements[index].y;
    asteroid.position.z += asteroidMovements[index].z;

    // Ensure asteroids stay within a reasonable range
    const maxPosition = 40;
    const minPosition = -40;

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
