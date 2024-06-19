import { ARButton } from '../../libs/three/examples/jsm/webxr/ARButton.js';
import * as THREE from "../../libs/three/three.module.min.js";
import { VRButton } from "../../libs/three/examples/jsm/webxr/VRButton.js";
import {FBXLoader} from "../../libs/three/examples/jsm/loaders/FBXLoader.js";

document.addEventListener("DOMContentLoaded", () =>
{
    const start = async () =>
    {
        const array = initThreeScene();
        const scene = array[0];
        const camera = array[1];
        const renderer = array[2];

        // const  button = VRButton.createButton(renderer);
        //
        const button = ARButton.createButton(renderer);
        document.body.appendChild(button);

        {
            const planetGeometry = new THREE.SphereGeometry(3.0, 32, 32);
            const planetMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('../../assets/textures/planets/earth/earth_planet_texture.jpg') });
            const planet = new THREE.Mesh(planetGeometry, planetMaterial);
            setScale(planet);
            scene.add(planet);

            const moon = createSatellite(9, 0.3, 1.2, 'moon_satellite_texture');
            moon.position.setX(9);

            const iss = await createInternationSpaceStation(6, 0.1);
            iss.position.setX(6);
            const issLight = new THREE.AmbientLight(0xffffff, 0.5); // м'яке світло
            scene.add(issLight);

            scene.add(moon, iss);
            const satellites = [moon];

            // Добавляем орбиты
            // const orbit1 = addOrbit(scene, 6, 0x222222);
            // const orbit2 = addOrbit(scene, 9, 0x222222);

            renderer.setAnimationLoop(() =>
            {
                planet.rotation.y = ((planet.rotation.y >= 360) ? 0 : (planet.rotation.y + 0.001));

                let issRadius = parseInt(  iss.userData.radius) * iss.scale.getComponent(0);
                let issSpeed  = parseFloat(iss.userData.speed);

                iss.rotation.y = ((iss.rotation.y >= 360) ? 0 : (iss.rotation.y + issSpeed / 500));
                iss.position.setX(issRadius * Math.cos(issSpeed * Date.now() / 1000));
                iss.position.setY((issRadius * Math.sin(issSpeed * Date.now() / 1000 * Math.sqrt(2))) / 2.);
                iss.position.setZ(issRadius * Math.sin(issSpeed * Date.now() / 1000));

                issLight.position.setX(iss.position.x);
                issLight.position.setY(iss.position.y + 0.2);
                issLight.position.setZ(iss.position.z);

                for (let satellite of satellites)
                {
                    let radius = parseInt(  satellite.userData.radius) * satellite.scale.getComponent(0);
                    let speed  = parseFloat(satellite.userData.speed);

                    satellite.position.setX(radius * Math.cos(speed * Date.now() / 1000));
                    satellite.position.setY(0);
                    satellite.position.setZ(radius * Math.sin(speed * Date.now() / 1000));
                }
                renderer.render(scene, camera);
            })

        }
    }
    start();


});


function initThreeScene()
{
    // Создаем сцену
    const scene = new THREE.Scene();
    // Додавання світла
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // м'яке світло
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0); // напрям зверху
    scene.add(directionalLight);
    // Добавляем основной компонент
    scene.add(new THREE.Object3D());
    // Создаем камеру
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
    // camera.position.set(0, 1, 0); // Позиция над сферами
    // camera.lookAt(new THREE.Vector3(0, 0, 0)); // Направление в центр сцены
    camera.position.setZ(1);
    // Создаем рендерер
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);
    return [scene, camera, renderer];
}

function createSatellite(animationRadius, animationSpeed, sphereRadius, textureName)
{
    const satelliteGeometry = new THREE.SphereGeometry(sphereRadius, 32, 32);
    const satelliteMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('../../assets/textures/planets/earth/' + textureName + '.jpg') });
    const satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial);
    setScale(satellite);
    satellite.userData = { radius: animationRadius, speed: animationSpeed };
    return satellite;
}

async function createInternationSpaceStation(animationRadius, animationSpeed)
{
    // TAKES FROM FREE NASA REPOSITORY
    // https://github.com/nasa/NASA-3D-Resources/tree/master/3D%20Models/International%20Space%20Station
    const iss = await loadFbxModel('../../assets/model/international_space_station/ISSComplete1.fbx');
    iss.scale.set(0.02, 0.02, 0.02);
    iss.userData = { radius: animationRadius, speed: animationSpeed };
    return iss;
}

function addOrbit(scene, radius, color)
{
    const orbitGeometry = new THREE.TorusGeometry(radius, 0.025, 32, 100);
    const orbitMaterial = new THREE.MeshBasicMaterial({ color: color, alpha: 100});
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    setScale(orbit);
    orbit.rotation.x = Math.PI / 2;
    scene.add(orbit);
    return orbit;
}

function setScale(object)
{
    object.scale.set(0.025, 0.025, 0.025);
}

function onWindowResize()
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

async function loadFbxModel(path)
{
    const loader = new FBXLoader();
    // const texture = await loadTexture('../assets/model/padoru_v3/Padoru_Tex.png');
    return new Promise((resolve) =>
    {
        loader.load(path, (model) =>
        {
            model.traverse((child) =>
            {
                // if (child.isMesh)
                // {
                //     Для каждого материала в модели
                // child.material.map = texture;
                // }
            });
            resolve(model);
        });
    });
}