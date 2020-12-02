import { Scene, ArcRotateCamera, Vector3, HemisphericLight } from "@babylonjs/core";
import { City3D } from "./3Delements/city3D";
import { SceneRenderer } from "../sceneRenderer";
import {EntitiesList} from "../../model/entitiesList";

export class EvostreetImplem extends SceneRenderer {

    buildScene(entitiesList: EntitiesList) {
        this.scene = new Scene(this.engine);

        this.camera = new ArcRotateCamera("Camera", 2 * Math.PI / 3, Math.PI / 3, 100, Vector3.Zero(), this.scene);
        this.camera.attachControl(this.canvas, true);
        this.camera.panningSensibility = 100;
        this.light = new HemisphericLight("light1", new Vector3(0, 1, 0), this.scene);

        const city = new City3D(this.config, this.scene, entitiesList);
        city.build();
        city.place();
        city.render();
    }
}