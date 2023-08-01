import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// Load the texture using THREE.TextureLoader
const textureLoader = new THREE.TextureLoader();

const saturn_texture = textureLoader.load('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/2115d5b9-b53e-4f1d-81e4-1d21461eeb45/dc6s6fu-e7a08936-a250-4df0-b25d-e9c3024e4423.jpg/v1/fill/w_1312,h_609,q_75,strp/saturn__mixed__texture_for_celestia__remastered__by_roanalcorano_dc6s6fu-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NjA5IiwicGF0aCI6IlwvZlwvMjExNWQ1YjktYjUzZS00ZjFkLTgxZTQtMWQyMTQ2MWVlYjQ1XC9kYzZzNmZ1LWU3YTA4OTM2LWEyNTAtNGRmMC1iMjVkLWU5YzMwMjRlNDQyMy5qcGciLCJ3aWR0aCI6Ijw9MTMxMiJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.lQA7oNa_ogvkEUjjxT7AWjC9wpNCVWrCvgmzDZJ_yPI'); // Saturn texture
const ring_texture = textureLoader.load('https://th.bing.com/th/id/OIP.W6jcvUW2dj4xm5EThWAFiwHaDt?pid=ImgDet&rs=1'); // saturn ring texture

//saturn
const saturn_geometry = new THREE.SphereGeometry(15, 32, 100);
const saturn_material = new THREE.MeshBasicMaterial({ map: saturn_texture}); 
const saturn_sphere = new THREE.Mesh(saturn_geometry, saturn_material);
scene.add(saturn_sphere);

//saturn ring
const ring_geometry = new THREE.RingGeometry( 32,23, 100 );
const ring_material = new THREE.MeshBasicMaterial( { map: ring_texture  , opacity: 0.8, transparent: true } ); 
const ring= new THREE.Mesh( ring_geometry, ring_material ); 
scene.add( ring );

//start rotation
ring.rotation.x = Math.PI / 2; // Rotate the torus horizontally

// Set initial rotation angle and rotation speed for the torus
let ringRotationAngle = 0;
const maxRingRotationAngle = Math.PI / 10; // rotation limit
camera.position.z = 50;

let positive_rotate = true;
const rotationSpeed =0.0005; //rotation speed

//Animation
function animate() {
  requestAnimationFrame(animate);

  // saturn rotation
  saturn_sphere.rotation.y += 0.01;

  // Limit the rotation of the ring
  if (positive_rotate) {
    if (ringRotationAngle < maxRingRotationAngle) {
      ring.rotation.x += rotationSpeed;
      ring.rotation.y += rotationSpeed;
      ringRotationAngle += rotationSpeed;
    } else {
      	positive_rotate = false;
    }
  } else {
    if (ringRotationAngle > -maxRingRotationAngle) {
      ring.rotation.x -= rotationSpeed;
      ring.rotation.y -= rotationSpeed;
      ringRotationAngle -= rotationSpeed;
    } else {
      	positive_rotate = true;
    }
  }



  renderer.render(scene, camera);
}

animate();
