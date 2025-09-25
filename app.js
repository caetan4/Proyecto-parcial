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

// 3.1 Configurar mesh.
//const geo = new THREE.TorusKnotGeometry(1, 0.35, 128, 5, 2);
// const geo = new THREE.SphereGeometry(1.5, 128, 128);
const geo = new THREE.IcosahedronGeometry(1.5, 4); // detail > 0 para displacement
geo.setAttribute("uv2", new THREE.BufferAttribute(geo.attributes.uv.array, 2));

// Material temporal (será reemplazado en createMaterial)
const material = new THREE.MeshStandardMaterial({
    color: "#ffffff",
    //wireframe: true,SS
});
const mesh = new THREE.Mesh(geo, material);
scene.add(mesh);
mesh.position.z = -7;

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

manager.onStart = function (url, itemsLoaded, itemsTotal) {
    var text = "holaa mundo";
    var text2 = '${text}, como estas?';
    console.log(`Iniciando carga de: ${url} (${itemsLoaded + 1}/${itemsTotal})`);
};

manager.onProgress = function (url, itemsLoaded, itemsTotal) {
    console.log(`Cargando: ${url} (${itemsLoaded}/${itemsTotal})`);
};

manager.onLoad = function () {
    console.log('✅ ¡Todas las texturas cargadas!');
    createMaterial();
};

manager.onError = function (url) {
    console.error(`❌ Error al cargar: ${url}`);
};
// 2. "Texture loader" para nuestros assets.
const loader = new THREE.TextureLoader(manager);

//3. Cargamos texturas guardadas en el folder del proyecto.
///////// EJEMPLO DE LADRILLOS (comentado).
const brickTexture= {
   albedo: loader.load('./assets/texturas/bricks/albedo.png'),
   ao: loader.load('./assets/texturas/bricks/ao.png'),
   metalness: loader.load('./assets/texturas/bricks/metallic.png'),
   normal: loader.load('./assets/texturas/bricks/normal.png'),
   roughness: loader.load('./assets/texturas/bricks/roughness.png'),
   displacement: loader.load('./assets/texturas/bricks/displacement.png'),
};

// 🎇 NUEVO: Texturas de lava PBR (intentamos carpeta 'columned-lava-rock-unity' y en fallback 'lava')
const lavaTextures = {
    albedo: loader.load('./assets/texturas/columned-lava-rock-unity/columned-lava-rock_albedo.png'),
    ao: loader.load('./assets/texturas/columned-lava-rock-unity/columned-lava-rock_ao.png'),    
    metalness: loader.load('./assets/texturas/columned-lava-rock-unity/columned-lava-rock_metallic.png'),
    normal: loader.load('./assets/texturas/columned-lava-rock-unity/columned-lava-rock_normal-ogl.png'),
  //  roughness: loader.load('./assets/texturas/columned-lava-rock-unity/columned-lava-rock_roughness.png'),
    emissive: loader.load('./assets/texturas/columned-lava-rock-unity/columned-lava-rock_emissive.png'),
    displacement: loader.load('./assets/texturas/columned-lava-rock-unity/columned-lava-rock_height.png'),


};


var lavaMaterial;

function createMaterial() {
    lavaMaterial = new THREE.MeshStandardMaterial({
        map: lavaTextures.albedo,
        aoMap: lavaTextures.ao,
        normalMap: lavaTextures.normal,
        metalness: 1,
        metalnessMap: lavaTextures.metalness,
       // roughness: 0.8, 
        //roughnessMap : tex.roughness,
        // global si no tienes roughnessMap
        emissiveMap: lavaTextures.emissive,
        emissive: new THREE.Color(0xffffff),
        displacementMap: lavaTextures.displacement,
        displacementScale: 0.25,
        side: THREE.FrontSide,
        // wireframe: true,
    });

    mesh.material = lavaMaterial;
}



//// B) Rotación al scrollear.

// 1. Crear un objeto con la data referente al SCROLL para ocuparla en todos lados.
var scroll = {
    y: 0,
    lerpedY: 0,
    speed: 0.010,
    cof: 0.07
};

// 2. Escuchar el evento scroll y actualizar el valor del scroll.
function updateScrollData(eventData) {
    scroll.y += eventData.deltaX * scroll.speed;
}

window.addEventListener("wheel", updateScrollData);
// 3. Aplicar el valor del scroll a la rotación del mesh. (en el loop de animación)
function updateMeshRotation() {
    mesh.rotation.y = scroll.lerpedY;
}
// 5. Vamos a suavizar un poco el valor de rotación para que los cambios de dirección sean menos bruscos.
function lerpScrollY() {
    scroll.lerpedY += (scroll.y - scroll.lerpedY) * scroll.cof;
}


//// C) Movimiento de cámara con mouse (fricción) aka "Gaze Camera".

///////// FIN DE LA CLASE.

var mouse = {
    x: 0,
    y: 0,
    normalOffset: {
        x: 0,
        y: 0
    },
    lerpNormalOffset: {
        x: 0,
        y: 0
    },

    cof: 0.07,
    gazeRange: {
        x: 7,
        y: 3
    }
}

/////////
// Final. Crear loop de animación para renderizar constantemente la escena.
function animate() {
    requestAnimationFrame(animate);

    // mesh.rotation.x -= 0.005;

    lerpScrollY();
    updateMeshRotation();
    renderer.render(scene, camera);
}

animate();






// 🔄 resize adaptativo
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
 