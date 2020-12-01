import { Scene, ArcRotateCamera, HemisphericLight, Vector3 } from "@babylonjs/core";
import { EntitiesList } from "../../model/entitiesList";
import { City3D } from "./3Delements/city3D";
import { SceneRenderer } from "../sceneRenderer";

export class MetricityImplem extends SceneRenderer {

    buildScene(entitiesList: EntitiesList) {
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