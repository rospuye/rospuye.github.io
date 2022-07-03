"use strict";

// window sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// To store the scene graph, and elements usefull to rendering the scene
const sceneElements = {
    sceneGraph: null,
    camera: null,
    control: null,
    renderer: null,
};

// head spin counter
let head_spin_counter = 0;

// emotional state booleans
let calm_flag = false;
let friendly_flag = false;
let aggressive_flag = false;

// debug panel
const gui = new dat.GUI();

// loaders
const gltfLoader = new THREE.GLTFLoader()
const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager)
let mixer = null // for fox model animation

// textures
const water_texture = textureLoader.load('/textures/water.jpg')

const grass_texture = textureLoader.load('/textures/grass.jpg')
grass_texture.repeat.x = 5
grass_texture.repeat.y = 5
grass_texture.wrapS = THREE.RepeatWrapping
grass_texture.wrapT = THREE.RepeatWrapping

const tiles_texture = textureLoader.load('/textures/tiles.jpg')
tiles_texture.repeat.x = 2
tiles_texture.repeat.y = 2
tiles_texture.wrapS = THREE.RepeatWrapping
tiles_texture.wrapT = THREE.RepeatWrapping

const wallColor = textureLoader.load('/textures/wall/wall_BaseColor.jpg')
const wallAmbientOcclusion = textureLoader.load('/textures/wall/wall_AmbientOcclusion.jpg')
const wallNormal = textureLoader.load('/textures/wall/wall_Normal.jpg')
const wallRoughness = textureLoader.load('/textures/wall/wall_Roughness.jpg')
const wallHeight = textureLoader.load('/textures/wall/wall_Height.png')

const floorColor = textureLoader.load('/textures/floor/floor_Color.jpg')
const floorAmbientOcclusion = textureLoader.load('/textures/floor/floor_AmbientOcclusion.jpg')
const floorNormal = textureLoader.load('/textures/floor/floor_Normal.jpg')
const floorRoughness = textureLoader.load('/textures/floor/floor_Roughness.jpg')
const floorHeight = textureLoader.load('/textures/floor/floor_Height.png')

const grassColor = textureLoader.load('/textures/grass/grass_Color.jpg')
const grassAmbientOcclusion = textureLoader.load('/textures/grass/grass_AmbientOcclusion.jpg')
const grassNormal = textureLoader.load('/textures/grass/grass_Normal.jpg')
const grassRoughness = textureLoader.load('/textures/grass/grass_Roughness.jpg')
const grassHeight = textureLoader.load('/textures/grass/grass_Height.png')

const skyColor = textureLoader.load('/textures/sky.jpg')

// animation timelines
let talking_head_movements = gsap.timeline({ repeat: -1, repeatDelay: 0 });
let talking_arm1_movements = gsap.timeline({ repeat: -1, repeatDelay: 0 });
let talking_forearm1_movements = gsap.timeline({ repeat: -1, repeatDelay: 0 });
let talking_arm2_movements = gsap.timeline({ repeat: -1, repeatDelay: 0 });
let talking_forearm2_movements = gsap.timeline({ repeat: -1, repeatDelay: 0 });

let head_spin_movement = gsap.timeline({ repeat: 0, repeatDelay: 0 });

let antenna1_movement = gsap.timeline({ repeat: -1, repeatDelay: 0 });
let antenna2_movement = gsap.timeline({ repeat: -1, repeatDelay: 0 });
let antenna1_light_movement = gsap.timeline({ repeat: -1, repeatDelay: 0 });
let antenna2_light_movement = gsap.timeline({ repeat: -1, repeatDelay: 0 });

let energetic_light_movement = gsap.timeline({ repeat: -1, repeatDelay: 0 });
let energetic_light_movement2 = gsap.timeline({ repeat: -1, repeatDelay: 0 });

let wave_head = gsap.timeline({ repeat: 0, repeatDelay: 0 });
let wave_arm = gsap.timeline({
    repeat: 0,
    repeatDelay: 0,
    onComplete: function () {
        if (!friendly_flag) {
            eye_change("neutral");
        }
        neutral_talking(true, false);
    },
});
let wave_arm2 = gsap.timeline({ repeat: 0, repeatDelay: 0 });

let duck_movement = gsap.timeline({ repeat: -1, repeatDelay: 0 });

// emotions on the debug UI
const parameters = {

    // friendliness
    f_neutral: () => {

        friendly_flag = false;
        aggressive_flag = false;

        head_spin_movement.to(eyebrow1.rotation, { z: 0, duration: 0 });
        head_spin_movement.to(eyebrow2.rotation, { z: 0, duration: 0 });

        gsap.to(ambientLight, { intensity: 0.6, duration: 2 });

        spotLight.color = new THREE.Color(0xffffff);
        gsap.to(spotLight.position, { x: -25, duration: 2 });
        gsap.to(spotLight.position, { y: 8, duration: 2 });
        gsap.to(spotLight.position, { z: 0, duration: 2 });
        gsap.to(spotLight, { intensity: 0.5, duration: 2 });

        sceneElements.sceneGraph.background = new THREE.Color(0xf0ddaa);

        if (!calm_flag) {
            eye_change("neutral");
        }

        const aureola = sceneElements.sceneGraph.getObjectByName("aureola");
        aureola.visible = false;

    },
    aggressive: () => {

        friendly_flag = false;
        aggressive_flag = true;

        head_spin_movement.to(eyebrow1.rotation, { z: -0.2, duration: 0 });
        head_spin_movement.to(eyebrow2.rotation, { z: 0.2, duration: 0 });

        gsap.to(ambientLight, { intensity: 0.8, duration: 2 });

        spotLight.color = new THREE.Color(0xff0000);
        gsap.to(spotLight.position, { x: 0, duration: 2 });
        gsap.to(spotLight.position, { y: 10, duration: 2 });
        gsap.to(spotLight.position, { z: 20, duration: 2 });
        gsap.to(spotLight, { intensity: 0.3, duration: 2 });

        sceneElements.sceneGraph.background = new THREE.Color(0x000000);

        if (!calm_flag) {
            eye_change("neutral");
        }

        const aureola = sceneElements.sceneGraph.getObjectByName("aureola");
        aureola.visible = false;
    },
    friendly: () => {

        friendly_flag = true;
        aggressive_flag = false;

        head_spin_movement.to(eyebrow1.rotation, { z: 0, duration: 0 });
        head_spin_movement.to(eyebrow2.rotation, { z: 0, duration: 0 });

        gsap.to(spotLight.position, { x: -25, duration: 2 });
        gsap.to(spotLight.position, { y: 8, duration: 2 });
        gsap.to(spotLight.position, { z: 0, duration: 2 });

        gsap.to(ambientLight, { intensity: 0.8, duration: 2 });
        sceneElements.sceneGraph.background = new THREE.Color(0x8bd991);
        spotLight.color = new THREE.Color(0xc9b983);

        gsap.to(spotLight, { intensity: 0.9, duration: 2 });

        // calm eyes superimpose themselves to other eye changes
        if (!calm_flag) {
            eye_change("friendly");
        }

        const aureola = sceneElements.sceneGraph.getObjectByName("aureola");
        aureola.visible = true;

    },

    // calmness
    c_neutral: () => {

        calm_flag = false;

        const antenna1 = sceneElements.sceneGraph.getObjectByName("antenna1");
        const antenna2 = sceneElements.sceneGraph.getObjectByName("antenna2");

        const antenna1_light = sceneElements.sceneGraph.getObjectByName("antenna1_light");
        const antenna2_light = sceneElements.sceneGraph.getObjectByName("antenna2_light");

        antenna1_movement.pause();
        antenna2_movement.pause();
        antenna1_light_movement.pause();
        antenna2_light_movement.pause();
        antenna1_light.visible = false;
        antenna2_light.visible = false;

        gsap.to(antenna1.rotation, { x: 0, duration: 0.2 });
        gsap.to(antenna2.rotation, { x: 0, duration: 0.2 });

        if (friendly_flag) {
            eye_change("friendly");
        }
        else {
            eye_change("neutral");
        }

        energetic_light_movement.pause();
        energetic_light_movement2.pause();
        gsap.to(spotLight, { intensity: 0.5, duration: 0.2 });
        gsap.to(spotLight.position, { x: -25, duration: 2 });
        gsap.to(spotLight.position, { z: 0, duration: 2 });

        // aggressive eyebrows superimpose themselves to energetic eyebrow changes
        if (!aggressive_flag) {
            gsap.to(eyebrow1.rotation, { z: 0, duration: 0 });
            gsap.to(eyebrow2.rotation, { z: 0, duration: 0 });
            gsap.to(eyebrow1.position, { y: 1.35, duration: 0.5 });
            gsap.to(eyebrow2.position, { y: 1.35, duration: 0.5 });
        }

    },
    energetic: () => {

        calm_flag = false;

        const antenna1 = sceneElements.sceneGraph.getObjectByName("antenna1");
        const antenna2 = sceneElements.sceneGraph.getObjectByName("antenna2");

        const antenna1_light = sceneElements.sceneGraph.getObjectByName("antenna1_light");
        const antenna2_light = sceneElements.sceneGraph.getObjectByName("antenna2_light");

        antenna1_movement.to(antenna1.rotation, { x: 0.07, duration: 0.2 });
        antenna1_movement.to(antenna1.rotation, { x: -0.07, duration: 0.4 });
        antenna1_movement.to(antenna1.rotation, { x: 0, duration: 0.2 });

        antenna2_movement.to(antenna2.rotation, { x: -0.07, duration: 0.2 });
        antenna2_movement.to(antenna2.rotation, { x: 0.07, duration: 0.4 });
        antenna2_movement.to(antenna2.rotation, { x: 0, duration: 0.2 });

        antenna1_light_movement.to(antenna1_light, { intensity: 0, duration: 0.2 });
        antenna1_light_movement.to(antenna1_light, { intensity: 10, duration: 0.4 });
        antenna1_light_movement.to(antenna1_light, { intensity: 5, duration: 0.2 });

        antenna2_light_movement.to(antenna2_light, { intensity: 10, duration: 0.2 });
        antenna2_light_movement.to(antenna2_light, { intensity: 0, duration: 0.4 });
        antenna2_light_movement.to(antenna2_light, { intensity: 5, duration: 0.2 });

        antenna1_movement.play();
        antenna2_movement.play();
        antenna1_light_movement.play();
        antenna2_light_movement.play();

        antenna1_light.visible = true;
        antenna2_light.visible = true;

        if (friendly_flag) {
            eye_change("friendly");
        }
        else {
            eye_change("neutral");
        }

        energetic_light_movement.to(spotLight, { intensity: 1, duration: 0.4 });
        energetic_light_movement.to(spotLight, { intensity: 0, duration: 0.8 });
        energetic_light_movement.to(spotLight, { intensity: 0.5, duration: 0.4 });

        energetic_light_movement2.to(spotLight.position, { x: 5, duration: 2 });
        energetic_light_movement2.to(spotLight.position, { z: -5, duration: 1 });
        energetic_light_movement2.to(spotLight.position, { x: -5, duration: 2 });
        energetic_light_movement2.to(spotLight.position, { z: 5, duration: 2 });
        energetic_light_movement2.to(spotLight.position, { x: 5, duration: 2 });
        energetic_light_movement2.to(spotLight.position, { z: 0, duration: 1 });
        energetic_light_movement2.to(spotLight.position, { x: -5, duration: 2 });

        energetic_light_movement.play();
        energetic_light_movement2.play();

        // aggressive eyebrows superimpose themselves to energetic eyebrow changes
        if (!aggressive_flag) {
            gsap.to(eyebrow1.rotation, { z: 0.2, duration: 0 });
            gsap.to(eyebrow2.rotation, { z: -0.2, duration: 0 });
            gsap.to(eyebrow1.position, { y: 1.4, duration: 0.5 });
            gsap.to(eyebrow2.position, { y: 1.4, duration: 0.5 });
        }

    },
    calm: () => {

        calm_flag = true;

        const antenna1 = sceneElements.sceneGraph.getObjectByName("antenna1");
        const antenna2 = sceneElements.sceneGraph.getObjectByName("antenna2");

        const antenna1_light = sceneElements.sceneGraph.getObjectByName("antenna1_light");
        const antenna2_light = sceneElements.sceneGraph.getObjectByName("antenna2_light");

        antenna1_movement.pause();
        antenna2_movement.pause();
        antenna1_light_movement.pause();
        antenna2_light_movement.pause();
        antenna1_light.visible = false;
        antenna2_light.visible = false;

        gsap.to(antenna1.rotation, { x: 0, duration: 0.2 });
        gsap.to(antenna2.rotation, { x: 0, duration: 0.2 });

        eye_change("calm");

        energetic_light_movement.pause();
        energetic_light_movement2.pause();
        gsap.to(spotLight, { intensity: 0.5, duration: 0.2 });
        gsap.to(spotLight.position, { x: -25, duration: 2 });
        gsap.to(spotLight.position, { z: 0, duration: 2 });

        // aggressive eyebrows superimpose themselves to energetic eyebrow changes
        if (!aggressive_flag) {
            gsap.to(eyebrow1.rotation, { z: 0, duration: 0 });
            gsap.to(eyebrow2.rotation, { z: 0, duration: 0 });
            gsap.to(eyebrow1.position, { y: 1.35, duration: 0.5 });
            gsap.to(eyebrow2.position, { y: 1.35, duration: 0.5 });
        }

    },

}

let friendliness = gui.addFolder('Friendliness')
let calmness = gui.addFolder('Calmness')

friendliness.add(parameters, 'aggressive')
friendliness.add(parameters, 'f_neutral')
friendliness.add(parameters, 'friendly')

calmness.add(parameters, 'energetic')
calmness.add(parameters, 'c_neutral')
calmness.add(parameters, 'calm')

helper.initEmptyScene(sceneElements); // initialize the empty scene
load3DObjects(sceneElements.sceneGraph); // add elements within the scene

requestAnimationFrame(computeFrame); // animate

// raycaster for detecting clicks on robot
const raycaster = new THREE.Raycaster();
let currentIntersect = null

// HANDLING EVENTS

// Event Listeners
window.addEventListener('resize', resizeWindow);

// To keep track of the keyboard - WASD
var keyD = false, keyA = false, keyS = false, keyW = false;
document.addEventListener('keydown', onDocumentKeyDown, false);
document.addEventListener('keyup', onDocumentKeyUp, false);
document.addEventListener('keypress', onDocumentKeyPress, false);

/**
 * Mouse
 */
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX / sizes.width * 2 - 1;
    mouse.y = - (event.clientY / sizes.height) * 2 + 1;
})

window.addEventListener('click', () => {
    if (currentIntersect) {
        head_spin_counter += 1;
        if (head_spin_counter > 3) {
            head_spin_counter = 1;
        }
        head_spin(head_spin_counter);
    }
})

// Update render image size and camera aspect when the window is resized
function resizeWindow(eventParam) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    sceneElements.camera.aspect = width / height;
    sceneElements.camera.updateProjectionMatrix();

    sceneElements.renderer.setSize(width, height);
}

function onDocumentKeyDown(event) {
    switch (event.keyCode) {
        case 68: //d
            keyD = true;
            break;
        case 83: //s
            keyS = true;
            break;
        case 65: //a
            keyA = true;
            break;
        case 87: //w
            keyW = true;
            break;
    }
}
function onDocumentKeyUp(event) {
    switch (event.keyCode) {
        case 68: //d
            keyD = false;
            break;
        case 83: //s
            keyS = false;
            break;
        case 65: //a
            keyA = false;
            break;
        case 87: //w
            keyW = false;
            break;
    }
}

function onDocumentKeyPress(event) {

    const shoulder1Joint = sceneElements.sceneGraph.getObjectByName("shoulder1Joint");
    const elbow1Joint = sceneElements.sceneGraph.getObjectByName("elbow1Joint");
    const shoulder2Joint = sceneElements.sceneGraph.getObjectByName("shoulder2Joint");
    const elbow2Joint = sceneElements.sceneGraph.getObjectByName("elbow2Joint");

    // stop talking first (for walking in any direction or waving)
    if (event.keyCode == 100 || event.keyCode == 115 || event.keyCode == 97 || event.keyCode == 119 || event.keyCode == 32) {
        neutral_talking(false, false);
        gsap.to(head.rotation, { x: 0, duration: 0.3 });
        gsap.to(head.rotation, { z: 0, duration: 0.3 });

        gsap.to(shoulder1Joint.rotation, { x: 0, duration: 0.3 });
        gsap.to(elbow1Joint.rotation, { x: 0, duration: 0.3 });
        gsap.to(shoulder1Joint.rotation, { z: 0, duration: 0.3 });
        gsap.to(elbow1Joint.rotation, { z: 0, duration: 0.3 });

        gsap.to(shoulder2Joint.rotation, { x: 0, duration: 0.3 });
        gsap.to(elbow2Joint.rotation, { x: 0, duration: 0.3 });
        gsap.to(shoulder2Joint.rotation, { z: 0, duration: 0.3 });
        gsap.to(elbow2Joint.rotation, { z: 0, duration: 0.3 });
    }

    // and then walking body rotations (which depends on direction)
    switch (event.keyCode) {
        case 100: //d

            gsap.to(torso2.rotation, { z: -0.45, duration: 0.3 });
            gsap.to(torso3.rotation, { z: -0.03, duration: 0.3 });
            gsap.to(head.rotation, { y: Math.PI / 2, duration: 0.3 });
            gsap.to(arms.rotation, { y: Math.PI / 2, duration: 0.3 });

            break;

        case 115: //s

            gsap.to(torso2.rotation, { x: -0.45, duration: 0.3 });
            gsap.to(torso3.rotation, { x: -0.03, duration: 0.3 });

            break;

        case 97: //a

            gsap.to(torso2.rotation, { z: 0.45, duration: 0.3 });
            gsap.to(torso3.rotation, { z: 0.03, duration: 0.3 });
            gsap.to(head.rotation, { y: -Math.PI / 2, duration: 0.3 });
            gsap.to(arms.rotation, { y: -Math.PI / 2, duration: 0.3 });

            break;

        case 119: //w

            gsap.to(torso2.rotation, { x: 0.45, duration: 0.3 });
            gsap.to(torso3.rotation, { x: 0.03, duration: 0.3 });
            gsap.to(head.rotation, { y: Math.PI, duration: 0.3 });
            gsap.to(arms.rotation, { y: Math.PI, duration: 0.3 });

            break;

        case 32: //h (wave)
            eye_change("friendly");

            wave_head.to(head.rotation, { z: 0.2, duration: 0.5 });
            wave_head.to(head.rotation, { z: 0.2, duration: 7 });
            wave_head.to(head.rotation, { z: 0, duration: 0.5 });

            wave_arm.to(shoulder1Joint.rotation, { x: -1.5, duration: 1 });
            wave_arm.to(shoulder1Joint.rotation, { x: -1.5, duration: 9.5 });
            wave_arm.to(shoulder1Joint.rotation, { x: 0, duration: 1 });

            wave_arm2.to(elbow1Joint.rotation, { x: -1.5, duration: 1 });
            wave_arm2.to(elbow1Joint.rotation, { z: -0.5, duration: 0.25 });
            wave_arm2.to(elbow1Joint.rotation, { z: 0.5, duration: 0.5 });
            wave_arm2.to(elbow1Joint.rotation, { z: -0.5, duration: 0.5 });
            wave_arm2.to(elbow1Joint.rotation, { z: 0.5, duration: 0.5 });
            wave_arm2.to(elbow1Joint.rotation, { z: -0.5, duration: 0.5 });
            wave_arm2.to(elbow1Joint.rotation, { z: 0.5, duration: 0.5 });
            wave_arm2.to(elbow1Joint.rotation, { z: -0.5, duration: 0.5 });
            wave_arm2.to(elbow1Joint.rotation, { z: 0.5, duration: 0.5 });
            wave_arm2.to(elbow1Joint.rotation, { z: -0.5, duration: 0.5 });
            wave_arm2.to(elbow1Joint.rotation, { z: 0.5, duration: 0.5 });
            wave_arm2.to(elbow1Joint.rotation, { z: -0.5, duration: 0.5 });
            wave_arm2.to(elbow1Joint.rotation, { z: 0.5, duration: 0.5 });
            wave_arm2.to(elbow1Joint.rotation, { z: -0.5, duration: 0.5 });
            wave_arm2.to(elbow1Joint.rotation, { z: 0.5, duration: 0.5 });
            wave_arm2.to(elbow1Joint.rotation, { z: -0.5, duration: 0.5 });
            wave_arm2.to(elbow1Joint.rotation, { z: 0.5, duration: 0.5 });
            wave_arm2.to(elbow1Joint.rotation, { z: -0.5, duration: 0.5 });
            wave_arm2.to(elbow1Joint.rotation, { z: 0, duration: 0.25 });
            wave_arm2.to(elbow1Joint.rotation, { x: 0, duration: 1 });

            break;

    }
}

function neutral_position() {

    gsap.to(torso2.rotation, { x: 0, duration: 0.3 });
    gsap.to(torso3.rotation, { x: 0, duration: 0.3 });
    gsap.to(torso2.rotation, { z: 0, duration: 0.3 });
    gsap.to(torso3.rotation, { z: 0, duration: 0.3 });
    gsap.to(head.rotation, { y: 0, duration: 0.3 });
    gsap.to(arms.rotation, { y: 0, duration: 0.3 });

    neutral_talking(true, false);

}

function neutral_talking(play, headspin) {

    const shoulder1Joint = sceneElements.sceneGraph.getObjectByName("shoulder1Joint");
    const elbow1Joint = sceneElements.sceneGraph.getObjectByName("elbow1Joint");

    const shoulder2Joint = sceneElements.sceneGraph.getObjectByName("shoulder2Joint");
    const elbow2Joint = sceneElements.sceneGraph.getObjectByName("elbow2Joint");

    // each time the function is called, the head swinging is slightly different (due to the random animation durations)
    // this talking is a timeline (see the definition of the talking_head_movements variable)
    // this means these animations below will be played in sequence
    talking_head_movements.to(head.rotation, { x: 0.1, duration: gsap.utils.random(0.25, 0.5, 0.05) });
    talking_head_movements.to(head.rotation, { z: gsap.utils.random(0.05, 0.1, 0.01), duration: gsap.utils.random(0.25, 0.5, 0.05) });
    talking_head_movements.to(head.rotation, { x: -0.1, duration: gsap.utils.random(0.25, 0.5, 0.05) });
    talking_head_movements.to(head.rotation, { x: 0.1, duration: gsap.utils.random(0.25, 0.5, 0.05) });
    talking_head_movements.to(head.rotation, { x: -0.1, duration: gsap.utils.random(0.25, 0.5, 0.05) });
    talking_head_movements.to(head.rotation, { z: gsap.utils.random(-0.05, -0.1, 0.01), duration: gsap.utils.random(0.25, 0.5, 0.05) });
    talking_head_movements.to(head.rotation, { x: 0.1, duration: gsap.utils.random(0.25, 0.5, 0.05) });
    talking_head_movements.to(head.rotation, { x: -0.1, duration: gsap.utils.random(0.25, 0.5, 0.05) });
    talking_head_movements.to(head.rotation, { z: 0, duration: gsap.utils.random(0.25, 0.5, 0.05) });

    // upper arm: x = -1.5 to 0; z = -0.4 to 1
    for (let i = 0; i < 3; i++) {
        talking_arm1_movements.to(shoulder1Joint.rotation, { x: 0, duration: gsap.utils.random(0.3, 1, 0.1) });
        talking_arm1_movements.to(shoulder1Joint.rotation, { x: gsap.utils.random(-0.5, -1.5, 0.1), duration: gsap.utils.random(0.3, 1, 0.1) });
        talking_arm1_movements.to(shoulder1Joint.rotation, { z: gsap.utils.random(-0.4, 1, 0.1), duration: gsap.utils.random(1.3, 2, 0.1) });
        talking_arm1_movements.to(shoulder1Joint.rotation, { z: gsap.utils.random(-0.4, 1, 0.1), duration: gsap.utils.random(0.3, 1, 0.1) });
        const rand_duration1 = gsap.utils.random(0.3, 1, 0.1);
        talking_arm1_movements.to(shoulder1Joint.rotation, { z: 0, duration: rand_duration1 });
        talking_arm1_movements.to(shoulder1Joint.rotation, { x: 0, duration: rand_duration1 });

        talking_arm2_movements.to(shoulder2Joint.rotation, { x: 0, duration: gsap.utils.random(0.3, 1, 0.1) });
        talking_arm2_movements.to(shoulder2Joint.rotation, { x: gsap.utils.random(-0.5, -1.5, 0.1), duration: gsap.utils.random(0.3, 1, 0.1) });
        talking_arm2_movements.to(shoulder2Joint.rotation, { z: gsap.utils.random(-1, 0.4, 0.1), duration: gsap.utils.random(1.3, 2, 0.1) });
        talking_arm2_movements.to(shoulder2Joint.rotation, { z: gsap.utils.random(-1, 0.4, 0.1), duration: gsap.utils.random(0.3, 1, 0.1) });
        const rand_duration2 = gsap.utils.random(0.3, 1, 0.1);
        talking_arm2_movements.to(shoulder2Joint.rotation, { z: 0, duration: rand_duration2 });
        talking_arm2_movements.to(shoulder2Joint.rotation, { x: 0, duration: rand_duration2 });
    }

    // lower arm: x = -0.5 to 0
    for (let i = 0; i < 3; i++) {
        talking_forearm1_movements.to(elbow1Joint.rotation, { x: 0, duration: gsap.utils.random(0.3, 1, 0.1) });
        talking_forearm1_movements.to(elbow1Joint.rotation, { x: gsap.utils.random(-0.5, 0, 0.1), duration: gsap.utils.random(0.3, 1, 0.1) });
        talking_forearm1_movements.to(elbow1Joint.rotation, { x: gsap.utils.random(-0.5, 0, 0.1), duration: gsap.utils.random(2, 4, 0.1) });
        talking_forearm1_movements.to(elbow1Joint.rotation, { x: 0, duration: gsap.utils.random(0.3, 1, 0.1) });

        talking_forearm2_movements.to(elbow2Joint.rotation, { x: 0, duration: gsap.utils.random(0.3, 1, 0.1) });
        talking_forearm2_movements.to(elbow2Joint.rotation, { x: gsap.utils.random(-0.5, 0, 0.1), duration: gsap.utils.random(0.3, 1, 0.1) });
        talking_forearm2_movements.to(elbow2Joint.rotation, { x: gsap.utils.random(-0.5, 0, 0.1), duration: gsap.utils.random(2, 4, 0.1) });
        talking_forearm2_movements.to(elbow2Joint.rotation, { x: 0, duration: gsap.utils.random(0.3, 1, 0.1) });
    }

    if (play) {
        talking_head_movements.play();

        if (!headspin) {
            talking_arm1_movements.seek(0); // start from beginning of animation timeline instead of paused timestamp
            talking_forearm1_movements.seek(0);
            talking_arm2_movements.seek(0);
            talking_forearm2_movements.seek(0);
        }

        talking_arm1_movements.play();
        talking_forearm1_movements.play();
        talking_arm2_movements.play();
        talking_forearm2_movements.play();
    }
    else {
        talking_head_movements.pause();

        talking_arm1_movements.pause();
        talking_forearm1_movements.pause();

        talking_arm2_movements.pause();
        talking_forearm2_movements.pause();
    }

}

function head_spin(counter) {

    // stop moving head in talking-like movement
    neutral_talking(false, false);
    gsap.to(head.rotation, { x: 0, duration: 0.3 });
    gsap.to(head.rotation, { z: 0, duration: 0.3 });

    if (counter == 1) {
        head_spin_movement.to(head.rotation, { y: 2 * Math.PI, duration: 1 });
        neutral_talking(true, true);
    }
    else if (counter == 2) {
        head_spin_movement.to(head.rotation, { y: -2 * Math.PI, duration: 1 });
        neutral_talking(true, true);
    }
    else { // counter == 3

        // let alreadyInUpsetState = false;

        // if (eyebrow1.rotation.z != -0.2) {
        //     head_spin_movement.to(eyebrow1.rotation, { z: -0.2, duration: 0 });
        //     head_spin_movement.to(eyebrow2.rotation, { z: 0.2, duration: 0 });
        // }
        // else {
        //     alreadyInUpsetState = true;
        // }

        head_spin_movement.to(head.position, { y: head.position.y + 0.5, duration: 0.1 });
        head_spin_movement.to(head.rotation, { y: 4 * Math.PI, duration: 1 });
        head_spin_movement.to(head.position, { y: head.position.y, duration: 0.1 });
        head_spin_movement.to(head.position, { y: head.position.y, duration: 1 });

        // if (!alreadyInUpsetState) {
        //     head_spin_movement.to(eyebrow1.rotation, { z: 0, duration: 0 });
        //     head_spin_movement.to(eyebrow2.rotation, { z: 0, duration: 0 });
        // }

        neutral_talking(true, true);
        console.log(helper)
    }

    head_spin_movement.to(head.rotation, { y: 0, duration: 0 });
}

// change eyes depending on emotion
function eye_change(emotion) {

    const neutral_eye1 = sceneElements.sceneGraph.getObjectByName("neutral_eye1");
    const neutral_eye2 = sceneElements.sceneGraph.getObjectByName("neutral_eye2");
    const friendly_eye1 = sceneElements.sceneGraph.getObjectByName("friendly_eye1");
    const friendly_eye2 = sceneElements.sceneGraph.getObjectByName("friendly_eye2");
    const calm_eye1 = sceneElements.sceneGraph.getObjectByName("calm_eye1");
    const calm_eye2 = sceneElements.sceneGraph.getObjectByName("calm_eye2");

    // making all eyes invisible
    neutral_eye1.visible = false;
    neutral_eye2.visible = false;
    friendly_eye1.visible = false;
    friendly_eye2.visible = false;
    calm_eye1.visible = false;
    calm_eye2.visible = false;

    // only current emotion's eyes become visible
    switch (emotion) {
        case "neutral":
            neutral_eye1.visible = true;
            neutral_eye2.visible = true;
            break;
        case "friendly":
            friendly_eye1.visible = true;
            friendly_eye2.visible = true;
            break;
        case "calm":
            calm_eye1.visible = true;
            calm_eye2.visible = true;
            break;
    }

}

//////////////////////////////////////////////////////////////////

// Create and insert in the scene graph the models of the 3D scene
function load3DObjects(sceneGraph) {

    // ************************** //
    // Create a ground plane
    // ************************** //

    const grassMaterial = new THREE.MeshPhongMaterial({
        map: grassColor,
        aoMap: grassAmbientOcclusion,
        normalMap: grassNormal,
        roughnessMap: grassRoughness,
        heightMap: grassHeight,
        side: THREE.DoubleSide
    })

    const planeGeometry = new THREE.PlaneGeometry(15, 15);
    const planeObject = new THREE.Mesh(planeGeometry, grassMaterial);
    sceneGraph.add(planeObject);

    // Change orientation of the plane using rotation
    planeObject.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    // Set shadow property
    planeObject.receiveShadow = true;

    const floorMaterial = new THREE.MeshPhongMaterial({
        map: floorColor,
        aoMap: floorAmbientOcclusion,
        normalMap: floorNormal,
        roughnessMap: floorRoughness,
        heightMap: floorHeight,
        side: THREE.DoubleSide
    })

    const planeObject2 = new THREE.Mesh(planeGeometry, floorMaterial);
    planeObject2.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    planeObject2.position.x = -15
    sceneGraph.add(planeObject2);

    // ************************** //
    // Create walls
    // ************************** //

    const wallMaterial = new THREE.MeshPhongMaterial({
        map: wallColor,
        aoMap: wallAmbientOcclusion,
        normalMap: wallNormal,
        roughnessMap: wallRoughness,
        heightMap: wallHeight,
        side: THREE.DoubleSide
    })

    const wallObject = new THREE.Mesh(planeGeometry, wallMaterial);
    sceneGraph.add(wallObject);
    wallObject.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI / 2);
    wallObject.receiveShadow = true;
    wallObject.position.set(-15, 7.5, -7.5)

    const wallObject2 = new THREE.Mesh(planeGeometry, wallMaterial);
    sceneGraph.add(wallObject2);
    wallObject2.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);
    wallObject2.receiveShadow = true;
    wallObject2.position.set(-22.5, 7.5, 0)

    // ************************** //
    // Create sky
    // ************************** //

    const skyMaterial = new THREE.MeshPhongMaterial({
        map: skyColor,
        side: THREE.DoubleSide
    })

    const skyObject = new THREE.Mesh(planeGeometry, skyMaterial);
    sceneGraph.add(skyObject);
    skyObject.receiveShadow = true;
    skyObject.position.set(0, 7.5, -7.5)

    const skyObject2 = new THREE.Mesh(planeGeometry, skyMaterial);
    sceneGraph.add(skyObject2);
    skyObject2.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);
    skyObject2.receiveShadow = true;
    skyObject2.position.set(7.5, 7.5, 0)

    // ************************** //
    // Create the lake
    // ************************** //

    const lake_geometry = new THREE.CircleGeometry(3, 64);
    const lake_material = new THREE.MeshPhongMaterial({ map: water_texture });
    const lake = new THREE.Group();

    const lake1 = new THREE.Mesh(lake_geometry, lake_material);
    lake1.rotation.x = -Math.PI / 2
    lake1.position.y = 0.002 // avoid z-fighting
    lake1.scale.y = 0.8
    lake1.receiveShadow = true;

    const lake2 = new THREE.Mesh(lake_geometry, lake_material);
    lake2.rotation.x = -Math.PI / 2
    lake2.position.set(4, 0.002, 2)
    lake2.scale.set(0.3, 0.3, 0.3);
    lake2.receiveShadow = true;

    lake.add(lake1, lake2);
    lake.position.set(2, 0, 0);
    lake.name = "lake";
    sceneGraph.add(lake);

    // ************************** //
    // CREATING THE ROBOT
    // ************************** //
    const robot = new THREE.Group();
    robot.name = "robot";

    // ************************** //
    // Creating the head
    // ************************** //
    const head = new THREE.Group();
    head.name = "head";
    const material_head1 = new THREE.MeshPhongMaterial({ color: '#c6c8c9', ambient: 'rgb(25,25,25)', diffuse: 'rgb(4,4,4)', specular: 'rgb(77,77,77)', shininess: 76.8 });
    const material_head2 = new THREE.MeshPhongMaterial({ color: '#000000', ambient: 'rgb(25,25,25)', diffuse: 'rgb(4,4,4)', specular: 'rgb(77,77,77)', shininess: 76.8 });
    const material_eyes = new THREE.MeshPhongMaterial({ color: '#E1C16E', ambient: 'rgb(33,22,3)', diffuse: 'rgb(78,57,11)', specular: 'rgb(99,94,81)', shininess: 27.9 });
    const material_ears = new THREE.MeshPhongMaterial({ color: '#8a8a8a', ambient: 'rgb(3,0,0)', diffuse: 'rgb(6,0,0)', specular: 'rgb(8,6,6)', shininess: 32 });

    // Main head parts

    const geometry_head1 = new THREE.BoxGeometry(1.5, 1, 1.2);
    const head1 = new THREE.Mesh(geometry_head1, material_head1);
    head1.position.y = 1;
    head1.name = "head1";

    const geometry_head2 = new THREE.CylinderGeometry(0.6, 0.6, 1.2, 32);
    const head2 = new THREE.Mesh(geometry_head2, material_head1);
    head2.position.y = 1.5;
    head2.rotation.x = Math.PI / 2;
    head2.scale.set(1.25, 1, 0.5);
    head2.name = "head2";

    const head3 = new THREE.Mesh(geometry_head1, material_head2);
    head3.position.set(0, 1, 0.165);
    head3.scale.set(0.8, 0.8, 0.8);

    const head4 = new THREE.Mesh(geometry_head2, material_head2);
    head4.position.set(0, 1.4, 0.165);
    head4.rotation.x = Math.PI / 2;
    head4.scale.set(1, 0.8, 0.4);

    const aureola_geometry = new THREE.TorusGeometry(10, 1, 16, 100);
    // const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const aureola = new THREE.Mesh(aureola_geometry, material_eyes);
    aureola.scale.set(0.05, 0.05, 0.05);
    aureola.rotation.x = Math.PI / 2;
    aureola.position.y = 2.1;
    aureola.name = "aureola";
    aureola.visible = false;

    // Eyes

    const eyes = new THREE.Group();
    eyes.name = "eyes";

    // neutral eyes
    const eye_geometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 32);
    const eye1 = new THREE.Mesh(eye_geometry, material_eyes);
    eye1.position.set(-0.25, 1, 0.61);
    eye1.rotation.x = Math.PI / 2;
    eye1.scale.set(0.5, 1, 0.8);
    eye1.name = "neutral_eye1";
    // eye1.visible = false;

    const eye2 = new THREE.Mesh(eye_geometry, material_eyes);
    eye2.position.set(0.25, 1, 0.61);
    eye2.rotation.x = Math.PI / 2;
    eye2.scale.set(0.5, 1, 0.8);
    eye2.name = "neutral_eye2";
    // eye2.visible = false;

    // friendly eyes
    const friendly_eye_geometry = new THREE.RingGeometry(3, 5, 32, 1, 0, Math.PI);
    const friendly_eye1 = new THREE.Mesh(friendly_eye_geometry, material_eyes);
    friendly_eye1.position.set(-0.25, 1, 0.65);
    friendly_eye1.scale.set(0.04, 0.04, 0.04);
    friendly_eye1.name = "friendly_eye1";
    friendly_eye1.visible = false;

    const friendly_eye2 = new THREE.Mesh(friendly_eye_geometry, material_eyes);
    friendly_eye2.position.set(0.25, 1, 0.65);
    friendly_eye2.scale.set(0.04, 0.04, 0.04);
    friendly_eye2.name = "friendly_eye2";
    friendly_eye2.visible = false;

    // calm eyes
    const calm_eye_geometry = new THREE.RingGeometry(3, 5, 32, 1, Math.PI, Math.PI);
    const calm_eye1 = new THREE.Mesh(calm_eye_geometry, material_eyes);
    calm_eye1.position.set(-0.25, 1, 0.65);
    calm_eye1.scale.set(0.04, 0.04, 0.04);
    calm_eye1.name = "calm_eye1";
    calm_eye1.visible = false;

    const calm_eye2 = new THREE.Mesh(calm_eye_geometry, material_eyes);
    calm_eye2.position.set(0.25, 1, 0.65);
    calm_eye2.scale.set(0.04, 0.04, 0.04);
    calm_eye2.name = "calm_eye2";
    calm_eye2.visible = false;

    const eyebrow_geometry = new THREE.BoxGeometry(0.3, 0.07, 0.2);
    const eyebrow1 = new THREE.Mesh(eyebrow_geometry, material_head1);
    eyebrow1.position.set(-0.25, 1.35, 0.61);
    eyebrow1.name = "eyebrow1";

    const eyebrow2 = new THREE.Mesh(eyebrow_geometry, material_head1);
    eyebrow2.position.set(0.25, 1.35, 0.61);
    eyebrow2.name = "eyebrow2";

    eyes.add(eye1, eye2, friendly_eye1, friendly_eye2, calm_eye1, calm_eye2);
    eyes.add(eyebrow1, eyebrow2);

    // Antennas

    const antennas = new THREE.Group();

    const ear_geometry = new THREE.BoxGeometry(0.2, 0.7, 0.35);
    const ear1 = new THREE.Mesh(ear_geometry, material_ears);
    ear1.position.set(-0.85, 1.1, 0);
    const ear2 = new THREE.Mesh(ear_geometry, material_ears);
    ear2.position.set(0.85, 1.1, 0);

    antennas.add(ear1, ear2);

    const antenna_stick_geometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 8);
    const antenna_point_geometry = new THREE.SphereGeometry(0.08);

    const antenna_stick1 = new THREE.Mesh(antenna_stick_geometry, material_head1);
    antenna_stick1.position.set(-0.85, 1.6, 0);
    const antenna_point1 = new THREE.Mesh(antenna_point_geometry, material_head1);
    antenna_point1.position.set(-0.85, 1.8, 0);

    const antenna1_light = new THREE.PointLight(0xff0000, 5, 0.5);
    antenna1_light.position.set(-0.85, 1.6, 0);
    antenna1_light.name = "antenna1_light";
    antenna1_light.visible = false;

    const antenna1 = new THREE.Group();
    antenna1.name = "antenna1";
    antenna1.add(antenna_stick1, antenna_point1, antenna1_light);

    const antenna_stick2 = new THREE.Mesh(antenna_stick_geometry, material_head1);
    antenna_stick2.position.set(0.85, 1.6, 0);
    const antenna_point2 = new THREE.Mesh(antenna_point_geometry, material_head1);
    antenna_point2.position.set(0.85, 1.8, 0);

    const antenna2_light = new THREE.PointLight(0xff0000, 5, 0.5);
    antenna2_light.position.set(0.85, 1.8, 0);
    antenna2_light.name = "antenna2_light";
    antenna2_light.visible = false;


    const antenna2 = new THREE.Group();
    antenna2.name = "antenna2";
    antenna2.add(antenna_stick2, antenna_point2, antenna2_light);
    antennas.add(antenna1, antenna2);

    head.add(head1, head2, head3, head4, aureola);
    head.add(eyes);
    head.add(antennas);
    head.position.y = 2.7;
    head.scale.set(1.3, 1.3, 1.3);

    // ************************** //
    // Creating the torso
    // ************************** //
    const torso = new THREE.Group();
    torso.name = "torso";
    const material_torso = new THREE.MeshPhongMaterial({ color: '#c6c8c9', ambient: 'rgb(25,25,25)', diffuse: 'rgb(4,4,4)', specular: 'rgb(77,77,77)', shininess: 76.8 });

    const geometry_torso1 = new THREE.CylinderGeometry(1.20, 1, 1.3, 32, 1);
    const torso1 = new THREE.Mesh(geometry_torso1, material_torso);
    torso1.name = "torso1";
    torso1.position.y = 2;
    torso1.castShadow = true;

    const geometry_torso2 = new THREE.SphereGeometry(1, 32, 16);
    const torso2 = new THREE.Mesh(geometry_torso2, material_torso);
    torso2.name = "torso2";
    torso2.position.y = 1.5;
    torso2.scale.y = 1.2;
    torso2.castShadow = true;

    const geometry_torso3 = new THREE.SphereGeometry(1, 32, 16);
    const torso3 = new THREE.Mesh(geometry_torso3, material_torso);
    torso3.name = "torso3";
    torso3.position.set(0, 2.66, 0);
    torso3.scale.set(1.2, 0.6, 1.2);
    torso3.castShadow = true;

    const arms = new THREE.Group();
    arms.name = "arms";

    const shoulder_geometry = new THREE.SphereGeometry(0.2, 32, 16);
    const hand_and_elbow_geometry = new THREE.SphereGeometry(0.15, 32, 16);
    const arm_part_geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.7, 8, 1);

    const shoulder1 = new THREE.Mesh(shoulder_geometry, material_ears);
    shoulder1.name = "shoulder1";
    shoulder1.position.set(1.35, 2.7, 0);
    shoulder1.scale.set(1.2, 1.2, 1.2);

    const shoulder2 = new THREE.Mesh(shoulder_geometry, material_ears);
    shoulder2.name = "shoulder2";
    shoulder2.position.set(-1.35, 2.7, 0);
    shoulder2.scale.set(1.2, 1.2, 1.2);

    const arm1 = new THREE.Mesh(arm_part_geometry, material_torso);
    arm1.position.set(0, -0.5, 0);
    arm1.name = "arm1";
    const arm2 = new THREE.Mesh(arm_part_geometry, material_torso);
    arm2.position.set(0, -0.5, 0);
    arm2.name = "arm2";

    const elbow1 = new THREE.Mesh(hand_and_elbow_geometry, material_ears);
    elbow1.position.set(0, -0.9, 0);
    elbow1.name = "elbow1";
    const elbow2 = new THREE.Mesh(hand_and_elbow_geometry, material_ears);
    elbow2.position.set(0, -0.9, 0);
    elbow2.name = "elbow2";

    const forearm1 = new THREE.Mesh(arm_part_geometry, material_torso);
    forearm1.position.set(0, -0.4, 0);
    const forearm2 = new THREE.Mesh(arm_part_geometry, material_torso);
    forearm2.position.set(0, -0.4, 0);

    const hand1 = new THREE.Mesh(hand_and_elbow_geometry, material_ears);
    hand1.position.set(0, -0.7, 0);
    const hand2 = new THREE.Mesh(hand_and_elbow_geometry, material_ears);
    hand2.position.set(0, -0.7, 0);

    var shoulder1Joint = new THREE.Object3D();
    shoulder1Joint.position.set(shoulder1.position.x, shoulder1.position.y, shoulder1.position.z);
    shoulder1Joint.name = "shoulder1Joint";
    var elbow1Joint = new THREE.Object3D();
    elbow1Joint.name = "elbow1Joint";
    elbow1Joint.add(forearm1, hand1);
    shoulder1Joint.add(arm1, elbow1, elbow1Joint);

    var shoulder2Joint = new THREE.Object3D();
    shoulder2Joint.position.set(shoulder2.position.x, shoulder2.position.y, shoulder2.position.z);
    shoulder2Joint.name = "shoulder2Joint";
    var elbow2Joint = new THREE.Object3D();
    elbow2Joint.name = "elbow2Joint";
    elbow2Joint.add(forearm2, hand2);
    shoulder2Joint.add(arm2, elbow2, elbow2Joint);

    arms.add(shoulder1, shoulder1Joint, shoulder2, shoulder2Joint);

    torso.add(torso1);
    torso.add(torso2);
    torso.add(torso3);
    torso.add(arms);

    robot.add(head);
    robot.add(torso);
    robot.position.x = -4
    sceneGraph.add(robot);

    // MODELS

    // duck model quack quack
    gltfLoader.load(
        '/models/Duck/glTF/Duck.gltf',
        (gltf) => {
            let duck = gltf.scene.children[0]
            duck.scale.set(0.007, 0.007, 0.007)
            sceneGraph.add(duck)
            duck.position.x = 2

            duck_movement.to(duck.position, { x: 3, duration: 1 });
            duck_movement.to(duck.rotation, { y: 2, duration: 1 });
            duck_movement.to(duck.rotation, { y: 2, duration: 2 });
            duck_movement.to(duck.rotation, { y: Math.PI, duration: 2 });
            duck_movement.to(duck.rotation, { y: Math.PI, duration: 0.5 });
            duck_movement.to(duck.position, { x: 1, duration: 2.5 });

            duck_movement.to(duck.rotation, { y: Math.PI - 0.1, duration: 0.1 });
            for (let i = 0; i < 2; i++) {
                duck_movement.to(duck.rotation, { y: Math.PI + 0.1, duration: 0.2 });
                duck_movement.to(duck.rotation, { y: Math.PI - 0.1, duration: 0.2 });
            }
            duck_movement.to(duck.rotation, { y: Math.PI, duration: 0.1 });

            duck_movement.to(duck.rotation, { y: Math.PI, duration: 1.5 });
            duck_movement.to(duck.rotation, { y: 0, duration: 2 });
            duck_movement.to(duck.position, { x: 2, duration: 2 });

        }
    )

    // couch
    gltfLoader.load(
        '/models/Couch/scene.gltf',
        (gltf) => {
            while (gltf.scene.children.length) {
                let couch_part = gltf.scene.children[0]
                couch_part.position.set(-13, 0.01, -4)
                sceneGraph.add(couch_part)
            }
        }
    )

    // lamp
    gltfLoader.load(
        '/models/Lamp/scene.gltf',
        (gltf) => {
            while (gltf.scene.children.length) {
                let lamp_part = gltf.scene.children[0]
                lamp_part.position.set(-16, 0.01, -4)
                lamp_part.scale.set(0.03, 0.03, 0.03)
                sceneGraph.add(lamp_part)
            }
        }
    )

    // coffee table
    gltfLoader.load(
        '/models/CoffeeTable/scene.gltf',
        (gltf) => {
            while (gltf.scene.children.length) {
                let table_part = gltf.scene.children[0]
                table_part.position.set(-13, -1.35, 1)
                sceneGraph.add(table_part)
            }
        }
    )

    // trees
    gltfLoader.load(
        '/models/Trees/scene.gltf',
        (gltf) => {
            while (gltf.scene.children.length) {
                let tree_part = gltf.scene.children[0]
                tree_part.position.set(4, 0, -4)
                tree_part.scale.set(20, 20, 20)
                // tree_part.castShadow = true
                if (tree_part.isMesh) { tree_part.castShadow = true; }
                sceneGraph.add(tree_part)
            }
        }
    )

    // fox
    gltfLoader.load(
        '/models/Fox/glTF/Fox.gltf',
        (gltf) => {
            gltf.scene.scale.set(0.04, 0.04, 0.04)
            gltf.scene.position.set(0, 0, -4)
            gltf.scene.rotation.y = Math.PI / 3
            sceneGraph.add(gltf.scene)

            mixer = new THREE.AnimationMixer(gltf.scene)
            const action = mixer.clipAction(gltf.animations[0])
            action.play()
        }
    )

}

// Displacement values
var delta = 0.01; // if you need it
var dispX = 0.08, dispZ = 0.08;

// CONTROLING THE ROBOT WITH THE KEYBOARD
const robot = sceneElements.sceneGraph.getObjectByName("robot");
const head = sceneElements.sceneGraph.getObjectByName("head");
const arms = sceneElements.sceneGraph.getObjectByName("arms");

const torso1 = sceneElements.sceneGraph.getObjectByName("torso1");
const torso2 = sceneElements.sceneGraph.getObjectByName("torso2");
const torso3 = sceneElements.sceneGraph.getObjectByName("torso3");
const head1 = sceneElements.sceneGraph.getObjectByName("head1");
const head2 = sceneElements.sceneGraph.getObjectByName("head2");

const elbow1Joint = sceneElements.sceneGraph.getObjectByName("elbow1Joint");
const elbow1 = sceneElements.sceneGraph.getObjectByName("elbow1");
const elbow2Joint = sceneElements.sceneGraph.getObjectByName("elbow2Joint");
const elbow2 = sceneElements.sceneGraph.getObjectByName("elbow2");

const eyebrow1 = sceneElements.sceneGraph.getObjectByName("eyebrow1");
const eyebrow2 = sceneElements.sceneGraph.getObjectByName("eyebrow2");

let neutral_position_called = true;
neutral_talking(true, false);

function computeFrame(time) {

    // detecting clicks on the robot
    raycaster.setFromCamera(mouse, sceneElements.camera);
    const objectsToTest = [head1, head2, torso1, torso2, torso3]
    const intersects = raycaster.intersectObjects(objectsToTest);

    if (intersects.length) {
        currentIntersect = intersects[0]
    }
    else {
        currentIntersect = null
    }

    // updating arm joint positions
    elbow1Joint.position.set(elbow1.position.x, elbow1.position.y, elbow1.position.z);
    elbow2Joint.position.set(elbow2.position.x, elbow2.position.y, elbow2.position.z);

    // walking around
    if (keyD && robot.position.x < 5) {
        robot.translateX(dispX);
        neutral_position_called = false;
    }
    if (keyW && robot.position.z > -5) {
        robot.translateZ(-dispZ);
        neutral_position_called = false;
    }
    if (keyA && robot.position.x > -20) {
        robot.translateX(-dispX);
        neutral_position_called = false;
    }
    if (keyS && robot.position.z < 5) {
        robot.translateZ(dispZ);
        neutral_position_called = false;
    }
    if (!keyD && !keyW && !keyA && !keyS) {
        if (!neutral_position_called) {
            neutral_position();
            neutral_position_called = true;
        }
    }

    // fox animation
    if (mixer) {
        mixer.update(delta)
    }

    // Rendering
    helper.render(sceneElements);
    // Update control of the camera
    sceneElements.control.update();
    // Call for the next frame
    requestAnimationFrame(computeFrame);
}