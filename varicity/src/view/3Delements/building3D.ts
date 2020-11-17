import { Color3, Color4, Mesh, MeshBuilder, Scene, StandardMaterial, Vector3 } from '@babylonjs/core';
import { Building } from '../../model/entities/building.interface';

export class Building3D {
    d3Element: Building;
    scene: Scene;
    buildingElement: Building;
    depth: number;
    positionX: number;
    positionY: number;

    constructor(scene: Scene, buildingElement: Building, depth: number, x: number, y: number) {
        this.scene = scene;
        this.d3Element = buildingElement;
        this.depth = depth;
        this.positionX = x;
        this.positionY = y;
    }

    render(){
        var building: Mesh = MeshBuilder.CreateBox(
            this.d3Element.name,
            {   
                height: this.d3Element.height,
                width: this.d3Element.width, 
                depth: 10 
            }, 
            this.scene);
        building.setPositionWithLocalVector(new Vector3(30, this.depth, 0));
        building.renderOutline = true;
        building.outlineColor = new Color3(0, 1, 0);
        building.outlineWidth = 0.1;
        building.edgesColor = new Color4(1, 0, 0);
        var mat = new StandardMaterial(this.d3Element.name+"Mat", this.scene);
        mat.ambientColor = new Color3(1, 0, 0);
        mat.diffuseColor = new Color3(1, 0, 0);
        mat.emissiveColor = new Color3(1, 0, 0);
        mat.specularColor = new Color3(1, 0, 0);
        building.material = mat;
    }
}