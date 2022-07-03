"use strict";

let ambientLight;
let spotLight;

const helper = {

    initEmptyScene: function (sceneElements) {

        // ************************** //
        // Create the 3D scene
        // ************************** //
        sceneElements.sceneGraph = new THREE.Scene();
        sceneElements.sceneGraph.background = new THREE.Color( 0xf0ddaa );

        // ************************** //
        // Add camera
        // ************************** //
        const width = window.innerWidth;
        const height = window.innerHeight;
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 500);
        sceneElements.camera = camera;
        camera.position.set(0, 12, 28);
        camera.lookAt(0, 0, 0);

        // ************************** //
        // Control for the camera
        // ************************** //
        sceneElements.control = new THREE.OrbitControls(camera);
        sceneElements.control.screenSpacePanning = true;

        // ************************** //
        // Illumination
        // ************************** //

        // ************************** //
        // Add ambient light
        // ************************** //
        ambientLight = new THREE.AmbientLight('rgb(255, 255, 255)', 0.6);
        sceneElements.sceneGraph.add(ambientLight);

        // ***************************** //
        // Add spotlight (with shadows)
        // ***************************** //
        spotLight = new THREE.SpotLight('rgb(255, 255, 255)', 0.5);
        spotLight.position.set(-25, 8, 0);
        sceneElements.sceneGraph.add(spotLight);

        // ***************************** //
        // Add pointlight (with shadows)
        // ***************************** //
        const pointLight = new THREE.PointLight('rgb(255, 255, 255)', 0.5)
        pointLight.position.set(-15, 5, -4);
        sceneElements.sceneGraph.add(pointLight)

        // Setup shadow properties for the spotlight
        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 2048;
        spotLight.shadow.mapSize.height = 2048;

        // Give a name to the spot light
        spotLight.name = "light";

        // *********************************** //
        // Create renderer (with shadow map)
        // *********************************** //
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        sceneElements.renderer = renderer;
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);
        

        // Setup shadowMap property
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;


        // **************************************** //
        // Add the rendered image in the HTML DOM
        // **************************************** //
        const htmlElement = document.querySelector("#Tag3DScene");
        htmlElement.appendChild(renderer.domElement);
    },

    render: function render(sceneElements) {
        sceneElements.renderer.render(sceneElements.sceneGraph, sceneElements.camera);
    },
};