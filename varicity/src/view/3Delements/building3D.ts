import {
    Action,
    ActionManager,
    Color3,
    Color4,
    Curve3, ExecuteCodeAction,
    InterpolateValueAction,
    LinesMesh,
    Mesh,
    MeshBuilder,
    Scene,
    StandardMaterial,
    Vector3
} from '@babylonjs/core';
import { Building } from '../../model/entities/building.interface';
import { Link3D } from './link3D';

export class Building3D {
    elementModel: Building;
    scene: Scene;

    depth: number;
    positionX: number;
    positionZ: number;

    center: Vector3;
    top: Vector3;
    bot: Vector3;

    d3Model: Mesh;

    links: Link3D[] = [];

    constructor(scene: Scene, buildingElement: Building, depth: number, x: number, z: number) {
        this.scene = scene;
        this.elementModel = buildingElement;
        this.depth = depth;
        this.positionX = x;
        this.positionZ = z;
    }

    getName() {
        return this.elementModel.fullName;
    }

    link(dest: Building3D, type: string) {
        this.links.push(new Link3D(this, dest, type, this.scene));
    }

    build() {
        let halfHeight = (5 * this.elementModel.height / 2);
        this.center = new Vector3(this.positionX + (this.elementModel.width / 2), this.depth * 3 * 10 + halfHeight, this.positionZ);
        this.top = this.center.add(new Vector3(0, halfHeight, 0));
        this.bot = this.center.add(new Vector3(0, -halfHeight, 0));
        this.elementModel.locate(this.center, this.bot, this.top);
    }

    render(config: any) {
        // Display building
        this.d3Model = MeshBuilder.CreateBox(
            this.elementModel.name,
            {
                height: this.elementModel.height * 5,
                width: this.elementModel.width,
                depth: this.elementModel.width
            },
            this.scene);
        this.d3Model.setPositionWithLocalVector(this.center);

        this.d3Model.actionManager = new ActionManager(this.scene);
        const out = this.elementModel.fullName
        const links = this.links;
        this.d3Model.actionManager.registerAction(
            new ExecuteCodeAction(
                {
                trigger: ActionManager.OnPointerOverTrigger
                },
                function() { 
                    links.forEach(l => l.display());
                    console.log(out);
                }
            )
        );
        this.d3Model.actionManager.registerAction(
            new ExecuteCodeAction(
                {
                trigger: ActionManager.OnPointerOutTrigger
                },
                function() { 
                    links.forEach(l => l.hide());
                    console.log(out);
                }
            )
        );

        // if config -> building -> colors -> outline is defined
        if (config.building.colors.outline) {
            this.d3Model.renderOutline = true;
            this.d3Model.outlineColor = Color3.FromHexString(config.building.colors.outline);
        } else {
            console.log("outline not defined");
            this.d3Model.renderOutline = true;
            this.d3Model.outlineColor = new Color3(0, 1, 0);
        }

        // if config -> building -> colors -> edges is defined
        if (config.building.colors.edges) {
            this.d3Model.outlineWidth = 0.1;
            this.d3Model.edgesColor = Color4.FromHexString(config.building.colors.edges);
        } else {
            console.log("edges not defined");
            this.d3Model.outlineWidth = 0.1;
            this.d3Model.edgesColor = new Color4(1, 0, 0);
        }

        var mat = new StandardMaterial(this.elementModel.name + "Mat", this.scene);
        // if config -> building -> colors -> faces is defined
        if (config.building.colors.faces) {
            let faces = config.building.colors.faces;
            let done = false;
            for (let face of faces) {
                for (let type of this.elementModel.types) {
                    if (type == face.name) {
                        mat.ambientColor = Color3.FromHexString(face.color);
                        mat.diffuseColor = Color3.FromHexString(face.color);
                        mat.emissiveColor = Color3.FromHexString(face.color);
                        mat.specularColor = Color3.FromHexString(face.color);
                        done = true;
                        break;
                    }
                }
                if (done) break;
            }
            if (!done) {
                mat.ambientColor = Color3.FromHexString(config.building.colors.faces[0].color);
                mat.diffuseColor = Color3.FromHexString(config.building.colors.faces[0].color);
                mat.emissiveColor = Color3.FromHexString(config.building.colors.faces[0].color);
                mat.specularColor = Color3.FromHexString(config.building.colors.faces[0].color);
            }
        } else {
            console.log("faces not defined");
            mat.ambientColor = new Color3(1, 0, 0);
            mat.diffuseColor = new Color3(1, 0, 0);
            mat.emissiveColor = new Color3(1, 0, 0);
            mat.specularColor = new Color3(1, 0, 0);
        }
        this.d3Model.material = mat;

        // Display links to other buildings
        this.links.forEach(l => {
            l.render(config);
        });
    }
}