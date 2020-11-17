import { Color3, Color4, Mesh, MeshBuilder, Scene, StandardMaterial, Vector3 } from '@babylonjs/core';
import { Building } from '../../model/entities/building.interface';

export class Building3D {
    elementModel: Building;
    scene: Scene;
    buildingElement: Building;
    depth: number;
    positionX: number;
    positionZ: number;

    constructor(scene: Scene, buildingElement: Building, depth: number, x: number, z: number) {
        this.scene = scene;
        this.elementModel = buildingElement;
        this.depth = depth;
        this.positionX = x;
        this.positionZ = z;
    }

    render(){
        var building: Mesh = MeshBuilder.CreateBox(
            this.elementModel.name,
            {   
                height: this.elementModel.height,
                width: this.elementModel.width, 
                depth: this.elementModel.width
            }, 
            this.scene);
        building.setPositionWithLocalVector(new Vector3(this.positionX, this.depth * 3 + this.elementModel.height / 2, this.positionZ));
        building.renderOutline = true;
        building.outlineColor = new Color3(0, 1, 0);
        building.outlineWidth = 0.1;
        building.edgesColor = new Color4(1, 0, 0);
        var mat = new StandardMaterial(this.elementModel.name+"Mat", this.scene);
        mat.ambientColor = new Color3(1, 0, 0);
        mat.diffuseColor = new Color3(1, 0, 0);
        mat.emissiveColor = new Color3(1, 0, 0);
        mat.specularColor = new Color3(1, 0, 0);
        building.material = mat;
    }
}