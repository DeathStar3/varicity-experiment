import { Building3D } from './building3D';
import { Scene } from '@babylonjs/core';
import { Mesh, MeshBuilder, Vector3 } from '@babylonjs/core';
import { District } from '../../model/entities/district.interface';

export class District3D {
    elementModel: District;
    scene: Scene;
    depth: number;

    d3Model: Mesh;
    x = 0;
    z = 0;

    d3Buildings: Building3D[] = [];
    d3Districts: District3D[] = [];

    constructor(scene: Scene, element: District, depth: number, x: number, z: number) {
        this.scene = scene;
        this.depth = depth;
        this.elementModel = element;
        this.x = x;
        this.z = z;
    }

    render() {
        this.d3Model = MeshBuilder.CreateBox(
            "package", 
            {
                height: 10, 
                width: this.elementModel.getTotalWidth(), 
                depth: this.elementModel.getTotalWidth()
            }, 
            this.scene);
        this.d3Model.setPositionWithLocalVector(new Vector3(this.x, 10 * this.depth, this.z));
        this.elementModel.districts.forEach(d => {
            let d3District = new District3D(this.scene, d, this.depth+1, this.x, this.z)
            this.d3Districts.push(d3District);
            d3District.render();
        });
        this.elementModel.buildings.forEach(b => {
            // let d3Building = new Building3D(this.scene, b, this.depth+1, x, y);
            // this.d3Buildings.push(d3Building);
            // d3Building.render();
        });
    }
}