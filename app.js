///////// SCAFFOLD.
// 1. Importar librerías.
console.log(THREE);
console.log('app.js version: 20250924-1');


// 2. Configurar canvas.
const canvas = document.getElementById("lienzo");
if (!canvas) throw new Error("No se encontró el canvas con id 'lienzo'.");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 3. Configurar escena 3D.
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(canvas.width, canvas.height);
renderer.setClearColor("#0a0c2c");
const camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 1000);
camera.position.z = 7;
// 3.1 Configurar mesh.
//const geo = new THREE.TorusKnotGeometry(1, 0.35, 128, 5, 2);
// const geo = new THREE.SphereGeometry(1.5, 128, 128);
const geo = new THREE.IcosahedronGeometry(1.5, 4); // detail > 0 para displacement
geo.setAttribute("uv2", new THREE.BufferAttribute(geo.attributes.uv.array, 2));


const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: "#ffffff" }));
mesh.position.z = -7;
scene.add(mesh);

// 3.2 Crear luces.
const frontLight = new THREE.PointLight("#ffffff", 300, 100);
frontLight.position.set(7, 3, 3);
scene.add(frontLight);

const rimLight = new THREE.PointLight("#0066ff", 50, 100);
rimLight.position.set(-7, -3, -7);
scene.add(rimLight);



///////// EN CLASE.

//// A) Cargar múltiples texturas
// //// A) Cargar múltiples texturas.
// 1. "Loading manager".

const manager = new THREE.LoadingManager();
const loader = new THREE.TextureLoader(manager);

const brickTexture = {
  albedo: loader.load('./assets/texturas/bricks/albedo.png'),
  ao: loader.load('./assets/texturas/bricks/ao.png'),
  metalness: loader.load('./assets/texturas/bricks/metallic.png'),
  normal: loader.load('./assets/texturas/bricks/normal.png'),
  roughness: loader.load('./assets/texturas/bricks/roughness.png'),
  displacement: loader.load('./assets/texturas/bricks/displacement.png'),
};

const lavaTextures = {
  albedo: loader.load('./assets/texturas/columned-lava-rock-unity/columned-lava-rock_albedo.png'),
  ao: loader.load('./assets/texturas/columned-lava-rock-unity/columned-lava-rock_ao.png'),    
  metalness: loader.load('./assets/texturas/columned-lava-rock-unity/columned-lava-rock_metallic.png'),
  normal: loader.load('./assets/texturas/columned-lava-rock-unity/columned-lava-rock_normal-ogl.png'),
  emissive: loader.load('./assets/texturas/columned-lava-rock-unity/columned-lava-rock_emissive.png'),
  displacement: loader.load('./assets/texturas/columned-lava-rock-unity/columned-lava-rock_height.png'),
};

let brickMaterial, lavaMaterial;

function createMaterials() {
  brickMaterial = new THREE.MeshStandardMaterial({
    map: brickTexture.albedo,
    aoMap: brickTexture.ao,
    normalMap: brickTexture.normal,
    roughnessMap: brickTexture.roughness,
    displacementMap: brickTexture.displacement,
    displacementScale: 0.1,
    metalness: 0.3,
    side: THREE.FrontSide,
  });

  lavaMaterial = new THREE.MeshStandardMaterial({
    map: lavaTextures.albedo,
    aoMap: lavaTextures.ao,
    normalMap: lavaTextures.normal,
    metalness: 1,
    metalnessMap: lavaTextures.metalness,
    emissiveMap: lavaTextures.emissive,
    emissive: new THREE.Color(0xffffff),
    displacementMap: lavaTextures.displacement,
    displacementScale: 0.25,
    side: THREE.FrontSide,
  });

  mesh.material = brickMaterial; // inicial por default
}





manager.onLoad = function () {
  console.log("✅ Texturas listas");
  createMaterials();
};

// 6. Botones
const boton1 = document.getElementById("boton1");
const boton2 = document.getElementById("boton2");

boton1.addEventListener("mousedown", function() {
  mesh.material = lavaMaterial;
});

boton2.addEventListener("mousedown", function() {
  mesh.material = brickMaterial;
});

// 7. Scroll rotation
var scroll = { y: 0, lerpedY: 0, speed: 0.010, cof: 0.07 };
function updateScrollData(eventData) {
  scroll.y += eventData.deltaX * scroll.speed;
}
window.addEventListener("wheel", updateScrollData);

function updateMeshRotation() {
  mesh.rotation.y = scroll.lerpedY;
}
function lerpScrollY() {
  scroll.lerpedY += (scroll.y - scroll.lerpedY) * scroll.cof;
}

// 8. Movimiento de cámara con mouse ("gaze camera")
var mouse = {
  x: 0, y: 0,
  normalOffset: { x: 0, y: 0 },
  lerpNormalOffset: { x: 0, y: 0 },
  cof: 0.010,
  gazeRange: { x: 10, y: 10 }
};

function updateMouseData(e) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  let windowCenter = { x: canvas.width/2, y: canvas.height/2 };
  mouse.normalOffset.x = ((mouse.x - windowCenter.x) / canvas.width) * 2;
  mouse.normalOffset.y = ((mouse.y - windowCenter.y) / canvas.height) * 2;
}
window.addEventListener("mousemove", updateMouseData);

function updateCameraPosition() {
  camera.position.x = mouse.lerpNormalOffset.x * mouse.gazeRange.x;
  camera.position.y = -mouse.lerpNormalOffset.y * mouse.gazeRange.y;
}
function lerpDistanceToCenter() {
  mouse.lerpNormalOffset.x += (mouse.normalOffset.x - mouse.lerpNormalOffset.x) * mouse.cof;
  mouse.lerpNormalOffset.y += (mouse.normalOffset.y - mouse.lerpNormalOffset.y) * mouse.cof;
}




// 9. Animación
function animate() {
  requestAnimationFrame(animate);

  lerpScrollY();
  updateMeshRotation();

  lerpDistanceToCenter();
  updateCameraPosition();
  camera.lookAt(mesh.position);

  renderer.render(scene, camera);
}
animate();






window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


canvas.addEventListener("mousedown", () => {
    // GSAP anima la escala del mesh
    gsap.to(mesh.scale, {
        x: mesh.scale.x * 1.2, // agranda 20%
        y: mesh.scale.y * 1.2,
        z: mesh.scale.z * 1.2,
        duration: 0.8,
        ease: "bounce.out" // prueba otros easing si quieres
    });
});
 