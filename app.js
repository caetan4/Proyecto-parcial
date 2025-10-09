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
renderer.setClearColor(0x00019);

const camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 1000);
camera.position.z = 10;

// 3.1 Configurar mesh.
//const geo = new THREE.TorusKnotGeometry(1, 0.35, 128, 2,2);
//const geo = new THREE.SphereGeometry(1.5, 128, 128);
const geom= new THREE.TorusGeometry( 3.4, 0.1, 16, 5 ); 
const geo = new THREE.IcosahedronGeometry(1.5,4); 
geo.setAttribute("uv2", new THREE.BufferAttribute(geo.attributes.uv.array, 2));
geom.setAttribute("uv2", new THREE.BufferAttribute(geom.attributes.uv.array, 2));




const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: "#ffffff" }));
mesh.position.z = -7;
scene.add(mesh);

const mesh2 = new THREE.Mesh(geom, new THREE.MeshStandardMaterial({ color: "#ffffff" }));
mesh.position.z = -0;
scene.add(mesh2);

// 3.2 Crear luces.
const frontLight = new THREE.PointLight(0x1b046e, 1000, 100);
frontLight.position.set(7, 3, 3);
scene.add(frontLight);

const rimLight   = new THREE.PointLight(0x0d72099, 50, 10);
rimLight.position.set(-7, -3, -7);
scene.add(rimLight);

// Activar sombras en el renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Crear un plano como suelo
const floorGeometry = new THREE.PlaneGeometry(100, 100);
const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0x555555,
  roughness: 0.8,
  metalness: 0.2
});




///////// EN CLASE.

//// A) Cargar múltiples texturas
// //// A) Cargar múltiples texturas.
// 1. "Loading manager".

const manager = new THREE.LoadingManager();
const loader = new THREE.TextureLoader(manager);

const cubeTexLoader = new THREE.CubeTextureLoader(manager);

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

const rustedTextures = {
  albedo: loader.load('./assets/texturas/rusted/albedo.png'),
  metalness: loader.load('./assets/texturas/rusted/metallic.png'),
  normal: loader.load('./assets/texturas/rusted/normal.png'),
  roughness: loader.load('./assets/texturas/rusted/roughness.png'),
};

const vinesTextures = {
  albedo: loader.load('./assets/texturas/vines/vines_albedo.png'),
  ao: loader.load('./assets/texturas/vines/vines_ao.png'),
  metalness: loader.load('./assets/texturas/vines/vines_metallic.png'),
  normal: loader.load('./assets/texturas/vines/vines_normal-ogl.png'),
  height: loader.load('./assets/texturas/vines/vines_height.png'),

};

let brickMaterial, lavaMaterial, rustedMaterial, vinesMaterial;

function createMaterials() {
  brickMaterial = new THREE.MeshStandardMaterial({
    envMap: envMap,
    metalness: 2,
    roughness: 0.4,
    map: brickTexture.albedo,
    aoMap: brickTexture.ao,
    normalMap: brickTexture.normal,
    displacementMap: brickTexture.displacement,
    displacementScale: 0.1,
    side: THREE.FrontSide,
  });

  lavaMaterial = new THREE.MeshStandardMaterial({
    envMap: envMap,
    metalness: 6,
    roughness: 0,
  
    map: lavaTextures.albedo,
    aoMap: lavaTextures.ao,
    normalMap: lavaTextures.normal,
    emissiveMap: lavaTextures.emissive,
    emissive: new THREE.Color(0xffffff),
    displacementMap: lavaTextures.displacement,
    
    displacementScale: 0.25,
    side: THREE.FrontSide,
  });

  rustedMaterial = new THREE.MeshStandardMaterial({
    envMap: envMap,
    metalness: 1,
   
    map: rustedTextures.albedo,

    normalMap: rustedTextures.normal,
    roughnessMap: rustedTextures.roughness,
    displacementScale: 0.25,
    side: THREE.FrontSide,

  });

  vinesMaterial = new THREE.MeshStandardMaterial({
    envMap: envMap,
    metalness: 0.5,
  
    
    map: vinesTextures.albedo,
    aoMap: vinesTextures.ao,
    normalMap: vinesTextures.normal,
    roughnessMap: vinesTextures.roughness,

    displacementMap: vinesTextures.height,

    side: THREE.FrontSide,
  });
  mesh.material = brickMaterial;
  
  mesh2.material = vinesMaterial; // inicial por default
}


const envMap = cubeTexLoader.load([
   './assets/texturas/fondo2/posx.jpg', './assets/texturas/fondo2/negx.jpg',   // +X, -X
   './assets/texturas/fondo2/posy.jpg', './assets/texturas/fondo2/negy.jpg',   // +Y, -Y
   './assets/texturas/fondo2/posz.jpg', './assets/texturas/fondo2/negz.jpg'    // +Z, -Z
]);




scene.background = envMap;

manager.onLoad = function () {
  console.log("✅ Texturas listas");
  createMaterials();
};

// 6. Botones
const boton1 = document.getElementById("boton1");
const boton2 = document.getElementById("boton2");
const boton3 = document.getElementById("boton3");
const boton4 = document.getElementById("boton4");

boton1.addEventListener("mousedown", function() {
  mesh.material = lavaMaterial;
  //mesh2.material = vinesMaterial;
});

boton2.addEventListener("mousedown", function() {
  mesh.material = brickMaterial;
 // mesh2.material = rustedMaterial;
});

boton3.addEventListener("mousedown", function() {
  mesh.material = rustedMaterial;
 // mesh2.material = lavaMaterial;
});

boton4.addEventListener("mousedown", function() {
  mesh.material = vinesMaterial;
  mesh2.material = brickMaterial;
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
    gsap.to(mesh2.scale, {
        x: mesh2.scale.x * 1.3, // agranda 20%
        y: mesh2.scale.y * 1.3,
        z: mesh2.scale.z * 1.2,
        duration: 0.5,
        ease: "bounce.out" // prueba otros easing si quieres
    });
});
 