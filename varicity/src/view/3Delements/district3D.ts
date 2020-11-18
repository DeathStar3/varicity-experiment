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
    vector: Vector3;

    d3Buildings: Building3D[] = [];
    d3Districts: District3D[] = [];

    constructor(scene: Scene, element: District, depth: number, x: number, z: number) {
        this.scene = scene;
        this.depth = depth;
        this.elementModel = element;
        this.x = x;
        this.z = z;
    }

    build() {
        this.vector = new Vector3(this.x + (this.elementModel.getTotalWidth() / 2), 30 * this.depth - 15, this.z);

        let nextX = this.x //- (this.elementModel.getTotalWidth() /2);

        this.elementModel.districts.forEach(d => {
            let d3District = new District3D(this.scene, d, this.depth+1, nextX, this.z)
            this.d3Districts.push(d3District);
            d3District.build();
            nextX += d3District.elementModel.getTotalWidth() + 5; // 10 = padding between districts            
        });

        this.elementModel.buildings.forEach(b => {
            let d3Building = new Building3D(this.scene, b, this.depth, nextX, this.z);
            this.d3Buildings.push(d3Building);
            d3Building.build();
            nextX += d3Building.elementModel.width + 2; // 10 = padding between districts
        });        
    }

    render() {
        this.d3Model = MeshBuilder.CreateBox(
            "package", 
            {
                height: 30, 
                width: this.elementModel.getTotalWidth(), 
                depth: this.elementModel.getTotalWidth()
            }, 
            this.scene);
        this.d3Model.setPositionWithLocalVector(this.vector);//new Vector3(this.x + (this.elementModel.getTotalWidth() / 2), 30 * this.depth - 15, this.z));
        
        // let nextX = this.x //- (this.elementModel.getTotalWidth() /2);
        this.d3Districts.forEach(d => {
        // this.elementModel.districts.forEach(d => {
            // let d3District = new District3D(this.scene, d, this.depth+1, nextX, this.z)
            // this.d3Districts.push(d3District);
            // d3District.render();
            d.render();
            // nextX += d3District.elementModel.getTotalWidth() + 5; // 10 = padding between districts            
        });

        this.d3Buildings.forEach(b => {
        // this.elementModel.buildings.forEach(b => {
            // let d3Building = new Building3D(this.scene, b, this.depth, nextX, this.z);
            // this.d3Buildings.push(d3Building);
            // d3Building.render();
            b.render();
            // nextX += d3Building.elementModel.width + 2; // 10 = padding between districts
        });
    }
}