import { City3D } from './3Delements/city3D';
import { EntitiesList } from './../model/entitiesList';
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight } from "@babylonjs/core";
import { ConfigLoader } from '../controller/parser/configLoader';

export class SceneRenderer {
    constructor(entitiesList: EntitiesList) {
        // create the canvas html element and attach it to the webpage
        var canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.id = "gameCanvas";
        document.body.appendChild(canvas);

        // initialize babylon scene and engine
        var engine: Engine = new Engine(canvas, true);
        var scene = new Scene(engine);

        var camera: ArcRotateCamera = new ArcRotateCamera("Camera", 2 * Math.PI / 3, Math.PI / 3, 1000, Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        camera.panningSensibility = 10;
        var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
        // var sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);
        // sphere.setPositionWithLocalVector(new Vector3(0, 0, 0));
        // var sphere2: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 2 }, scene);
        // sphere2.setPositionWithLocalVector(new Vector3(3, 0, 0));

        // let districtElement = new PackageImplem("com");
        // districtElement.addDistrict(new PackageImplem("com.polytech"));
        // districtElement.districts[0].addBuilding(new ClassImplem("class1", 10, 15));
        // districtElement.districts[0].addBuilding(new ClassImplem("class2", 10, 15));
        // districtElement.districts[0].addBuilding(new ClassImplem("class3", 10, 15));
        // let districtElement2 = new PackageImplem("com");
        // districtElement2.addDistrict(new PackageImplem("com.polytech"));
        // districtElement2.districts[0].addBuilding(new ClassImplem("class1", 10, 15));
        // districtElement2.districts[0].addBuilding(new ClassImplem("class2", 10, 15));
        // districtElement2.districts[0].addBuilding(new ClassImplem("class3", 10, 15));

        // let entities: PackageImplem[] = [];
        // entities.push(districtElement, districtElement2);

        const config = ConfigLoader.loadDataFile("config");
        
        const city = new City3D(config, scene, entitiesList);
        city.build();
        city.place();
        city.render();
        // let nextX = 0
        // // entities.forEach(d => {
        // entitiesList.districts.forEach(d => {
        //     let d3elem = new District3D(scene, d, 0, nextX - (d.getTotalWidth() / 2), 0);
        //     d3elem.build();
        //     d3elem.render(config);
        //     nextX += d3elem.elementModel.getTotalWidth() + 5; // 10 = padding between districts
        // });

        // let d3elem = new District3D(scene, districtElement, 0);
        // d3elem.render();
        // let d3elem2 = new District3D(scene, districtElement, 0);
        // d3elem2.render();
        // let d3Building = new Building3D(scene, new ClassImplem("classBuilding",10,10),100,10,10);
        // d3Building.render();

        // var quartier: Mesh = MeshBuilder.CreateBox("package", {height: 20, width: 270, depth: 200}, scene);
        // quartier.setPositionWithLocalVector(new Vector3(0 + (270 /2), -20, 0));
        // var quartier2: Mesh = MeshBuilder.CreateBox("package", {height: 20, width: 10, depth: 10}, scene);
        // quartier2.setAbsolutePosition(new Vector3(0, 20, 0));
        // for(let i =0; i<10; i++) {
        //     var building: Mesh = MeshBuilder.CreateBox("buildin"+i, { height: 20, width: 10, depth: 10 }, scene);
        //     building.setPositionWithLocalVector(new Vector3(30* i, 0, 0));
        //     building.renderOutline = true;
        //     building.outlineColor = new Color3(0, 1, 0);
        //     building.outlineWidth = 0.1;
        //     building.edgesColor = new Color4(1, 0, 0);
        //     var mat = new StandardMaterial("buildingMat"+i, scene);
        //     mat.ambientColor = new Color3(1, 0, 0);
        //     mat.diffuseColor = new Color3(1, 0, 0);
        //     mat.emissiveColor = new Color3(1, 0, 0);
        //     mat.specularColor = new Color3(1, 0, 0);
        //     building.material = mat;
        //     var curve = Curve3.CreateQuadraticBezier(new Vector3(30*i, 20, 10), new Vector3(30*i+15, 35, 10), new Vector3(30*(i+1), 20, 10), 25);
        //     MeshBuilder.CreateLines("curve"+i, {points: curve.getPoints()}, scene);
        // }

        document.getElementById("reset_camera").addEventListener("click", (ev) => {
            camera.position = Vector3.Zero();
            camera.radius = 1000;
            camera.alpha =  2 * Math.PI / 3;
            camera.beta = Math.PI / 3;
        });

        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
                if (scene.debugLayer.isVisible()) {
                    scene.debugLayer.hide();
                } else {
                    scene.debugLayer.show();
                }
            }
        });

        // run the main render loop
        engine.runRenderLoop(() => {
            scene.render();
        });
    }
}