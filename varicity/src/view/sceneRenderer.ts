import { City3D } from './3Delements/city3D';
import { EntitiesList } from './../model/entitiesList';
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight } from "@babylonjs/core";
import { ConfigLoader } from '../controller/parser/configLoader';

export class SceneRenderer {

    scene: Scene;
    engine: Engine;
    config: any;
    camera: ArcRotateCamera;
    light: HemisphericLight;

    canvas: HTMLCanvasElement;

    constructor() {
        // create the canvas html element and attach it to the webpage
        this.canvas = document.createElement("canvas");
        this.canvas.style.width = "100%";
        this.canvas.style.height = "100%";
        this.canvas.id = "gameCanvas";
        document.body.appendChild(this.canvas);

        // initialize babylon scene and engine
        this.engine = new Engine(this.canvas, true);
        this.scene = new Scene(this.engine);

        this.camera = new ArcRotateCamera("Camera", 2 * Math.PI / 3, Math.PI / 3, 1000, Vector3.Zero(), this.scene);
        this.camera.attachControl(this.canvas, true);
        this.camera.panningSensibility = 10;
        this.light = new HemisphericLight("light1", new Vector3(0, 1, 0), this.scene);

        this.config = ConfigLoader.loadDataFile("config");

        document.getElementById("reset_camera").addEventListener("click", () => {
            this.camera.position = Vector3.Zero();
            this.camera.radius = 1000;
            this.camera.alpha = 2 * Math.PI / 3;
            this.camera.beta = Math.PI / 3;
        });

        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
                if (this.scene.debugLayer.isVisible()) {
                    this.scene.debugLayer.hide();
                } else {
                    this.scene.debugLayer.show();
                }
            }
        });

        // run the main render loop
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }

    buildScene(entitiesList: EntitiesList) {
        this.scene.dispose();
        this.scene = new Scene(this.engine);

        this.camera = new ArcRotateCamera("Camera", 2 * Math.PI / 3, Math.PI / 3, 1000, Vector3.Zero(), this.scene);
        this.camera.attachControl(this.canvas, true);
        this.camera.panningSensibility = 10;
        this.light = new HemisphericLight("light1", new Vector3(0, 1, 0), this.scene);
        
        const city = new City3D(this.config, this.scene, entitiesList);
        city.build();
        city.place();
        city.render();
    }
}