import { Color3, Color4, Mesh, MeshBuilder, Scene, StandardMaterial, Vector3 } from '@babylonjs/core';
import { Building } from '../../model/entities/building.interface';

export class Building3D {
    d3Element: Building;

    constructor(scene: Scene) {
        var building: Mesh = MeshBuilder.CreateBox("building", { height: 20, width: 10, depth: 10 }, scene);
        building.setPositionWithLocalVector(new Vector3(30, 0, 0));
        building.renderOutline = true;
        building.outlineColor = new Color3(0, 1, 0);
        building.outlineWidth = 0.1;
        building.edgesColor = new Color4(1, 0, 0);
        var mat = new StandardMaterial("buildingMat", scene);
        mat.ambientColor = new Color3(1, 0, 0);
        mat.diffuseColor = new Color3(1, 0, 0);
        mat.emissiveColor = new Color3(1, 0, 0);
        mat.specularColor = new Color3(1, 0, 0);
        building.material = mat;
    }
}