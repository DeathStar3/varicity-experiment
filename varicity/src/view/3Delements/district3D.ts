import { Color3, Color4, StandardMaterial } from '@babylonjs/core';
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

    get(name: string): Building3D {
        let building: Building3D = undefined;
        if(name.includes(this.elementModel.name)) {
            for(let b of this.d3Buildings) {
                if(b.getName() == name) {
                    return building = b;
                }
            }
            for(let d of this.d3Districts) {
                let b = d.get(name);
                if(b != undefined) {
                    return building = b;
                };
            }
        } else {
            return building;
        }
        return building;
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
            nextX += d3Building.elementModel.getWidth() + 2; // 10 = padding between districts
        });        
    }

    render(config: any) {
        this.d3Model = MeshBuilder.CreateBox(
            "package", 
            {
                height: 30, 
                width: this.elementModel.getTotalWidth(), 
                depth: this.elementModel.getTotalWidth()
            }, 
            this.scene);
        this.d3Model.setPositionWithLocalVector(this.vector);//new Vector3(this.x + (this.elementModel.getTotalWidth() / 2), 30 * this.depth - 15, this.z));

        // if config -> district -> colors -> outline is defined
        if(config.district.colors.outline) {
            this.d3Model.renderOutline = true;
            this.d3Model.outlineColor = Color3.FromHexString(config.district.colors.outline);
        } else {
            console.log("outline not defined");
        }

        // if config -> district -> colors -> edges is defined
        if(config.district.colors.edges) {
            this.d3Model.outlineWidth = 0.1;
            this.d3Model.edgesColor = Color4.FromHexString(config.district.colors.edges);
        } else {
            console.log("edges not defined");
        }

        let mat = new StandardMaterial("District", this.scene);
        // if config -> district -> colors -> faces is defined
        if(config.district.colors.faces) {
            mat.ambientColor = Color3.FromHexString(config.district.colors.faces[0].color);
            mat.diffuseColor = Color3.FromHexString(config.district.colors.faces[0].color);
            mat.emissiveColor = Color3.FromHexString(config.district.colors.faces[0].color);
            mat.specularColor = Color3.FromHexString("#000000");
        } else {
            console.log("faces not defined");
            // mat.ambientColor = new Color3(1, 0, 0);
            // mat.diffuseColor = new Color3(1, 0, 0);
            // mat.emissiveColor = new Color3(1, 0, 0);
            // mat.specularColor = new Color3(1, 0, 0);
        }
        this.d3Model.material = mat;
        
        // let nextX = this.x //- (this.elementModel.getTotalWidth() /2);
        this.d3Districts.forEach(d => {
        // this.elementModel.districts.forEach(d => {
            // let d3District = new District3D(this.scene, d, this.depth+1, nextX, this.z)
            // this.d3Districts.push(d3District);
            // d3District.render();
            d.render(config);
            // nextX += d3District.elementModel.getTotalWidth() + 5; // 10 = padding between districts            
        });

        this.d3Buildings.forEach(b => {
        // this.elementModel.buildings.forEach(b => {
            // let d3Building = new Building3D(this.scene, b, this.depth, nextX, this.z);
            // this.d3Buildings.push(d3Building);
            // d3Building.render();
            b.render(config);
            // nextX += d3Building.elementModel.width + 2; // 10 = padding between districts
        });
    }
}