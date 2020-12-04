import { UIController } from './../../../controller/ui/ui.controller';
import { Config } from './../../../model/entitiesImplems/config.model';
import { Element3D } from '../3Dinterfaces/element3D.interface';
import {
    ActionManager,
    Color3,
    Color4,
    ExecuteCodeAction,
    HighlightLayer,
    Mesh,
    MeshBuilder,
    Scene,
    StandardMaterial,
    Vector3
} from '@babylonjs/core';
import { Building } from '../../../model/entities/building.interface';
import { Link3D } from '../3Dinterfaces/link3D.interface';

export class Building3D extends Element3D {
    elementModel: Building;

    depth: number;

    center: Vector3;
    top: Vector3;
    bot: Vector3;

    d3ModelOutline: Mesh;
    d3ModelPyramid: Mesh = undefined;

    links: Link3D[] = [];

    padding = 0.2;
    heightScale = 0.3;
    outlineWidth = 0.05;

    edgesWidth: number = 7.0;

    highlightLayer: HighlightLayer;

    constructor(scene: Scene, buildingElement: Building, depth: number) {
        super(scene);
        this.elementModel = buildingElement;
        this.depth = depth;
    }

    showAllLinks(status?: boolean) {
        if (status == undefined) this.links.forEach(l => l.display());
        else this.links.forEach(l => l.display(status));
    }

    getWidth(): number {
        return this.elementModel.getWidth() + this.padding; // 2.5 av 2.5 ap
        // return this.elementModel.getWidth();// 2.5 av 2.5 ap
    }

    getLength(): number {
        return this.getWidth();
    }

    getHeight(): number {
        return this.elementModel.getHeight() * this.heightScale;
    }

    getName() {
        return this.elementModel.fullName;
    }

    link(link: Link3D) {
        this.links.push(link);
    }

    highlight(arg: boolean) {
        if(arg) {
            this.highlightLayer = new HighlightLayer("hl", this.scene);
            this.highlightLayer.addMesh(this.d3Model, Color3.Blue());
        } else {
            this.highlightLayer.removeAllMeshes();
        }
    }

    build() {
    }

    place(x: number, z: number) {
        let halfHeight = this.getHeight() / 2;
        this.center = new Vector3(x, halfHeight + this.depth * 30, z);
        this.top = this.center.add(new Vector3(0, halfHeight, 0));
        this.bot = this.center.add(new Vector3(0, -halfHeight, 0));
    }

    render(config: Config) {
        // Display building
        this.d3Model = MeshBuilder.CreateBox(
            this.elementModel.name,
            {
                height: this.getHeight(),
                width: this.elementModel.getWidth(),
                depth: this.elementModel.getWidth()
            },
            this.scene);
        this.d3Model.setPositionWithLocalVector(this.center);

        this.d3Model.actionManager = new ActionManager(this.scene);
        const out = this.elementModel.toString();
        const links = this.links;
        this.d3Model.actionManager.registerAction(
            new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnPointerOverTrigger
                },
                () => {
                    links.forEach(l => l.display());
                    UIController.displayObjectInfo(this);
                    // document.getElementById("nodes_details").innerText = out;
                }
            )
        );
        this.d3Model.actionManager.registerAction(
            new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnPointerOutTrigger
                },
                function () {
                    links.forEach(l => l.display());
                }
            )
        );

        // if config -> building -> colors -> outline is defined
        if (config.building.colors.outlines) {
            const outlineColor = this.getColor(config.building.colors.outlines, this.elementModel.types);
            if (outlineColor !== undefined) {
                this.d3ModelOutline = MeshBuilder.CreateBox(
                    this.elementModel.name,
                    {
                        height: this.getHeight() + this.outlineWidth,
                        width: this.elementModel.getWidth() + this.outlineWidth,
                        depth: this.elementModel.getWidth() + this.outlineWidth,
                        sideOrientation: Mesh.BACKSIDE,
                        updatable: false
                    },
                    this.scene);
                let outlineMat = new StandardMaterial('outlineMaterial', this.scene);
                this.d3ModelOutline.material = outlineMat;
                this.d3ModelOutline.parent = this.d3Model;
                outlineMat.diffuseColor = Color3.FromHexString(outlineColor);
                outlineMat.emissiveColor = Color3.FromHexString(outlineColor);
            } else {
                this.d3Model.renderOutline = false;
            }
        } else {
            this.d3Model.renderOutline = false;
        }

        let mat = new StandardMaterial(this.elementModel.name + "Mat", this.scene);
        if (config.force_color) {
            mat.ambientColor = Color3.FromHexString(config.force_color);
            mat.diffuseColor = Color3.FromHexString(config.force_color);
            mat.emissiveColor = Color3.FromHexString(config.force_color);
            mat.specularColor = Color3.FromHexString("#000000");
        } else {
            if (config.building.colors.faces) {
                const buildingColor = this.getColor(config.building.colors.faces, this.elementModel.types);
                if (buildingColor !== undefined) {
                    mat.ambientColor = Color3.FromHexString(buildingColor);
                    mat.diffuseColor = Color3.FromHexString(buildingColor);
                    mat.emissiveColor = Color3.FromHexString(buildingColor);
                    mat.specularColor = Color3.FromHexString("#000000");
                } else {
                    mat.ambientColor = new Color3(1, 0, 0);
                    mat.diffuseColor = new Color3(1, 0, 0);
                    mat.emissiveColor = new Color3(1, 0, 0);
                    mat.specularColor = new Color3(0, 0, 0);
                }
            } else {
                mat.ambientColor = new Color3(1, 0, 0);
                mat.diffuseColor = new Color3(1, 0, 0);
                mat.emissiveColor = new Color3(1, 0, 0);
                mat.specularColor = new Color3(0, 0, 0);
            }
        }

        this.d3Model.material = mat;

        // draw top pyramid if API class
        if (this.elementModel.types.includes("API")) {
            this.d3ModelPyramid = MeshBuilder.CreateCylinder("pyramid", {
                diameterTop: 0,
                tessellation: 4,
                diameterBottom: this.getWidth(),
                height: this.getWidth()
            }, this.scene);
            this.d3ModelPyramid.setPositionWithLocalVector(this.top.add(new Vector3(0, this.getWidth() / 2 + this.edgesWidth/120, 0)));
            this.d3ModelPyramid.rotate(new Vector3(0, 1, 0), Math.PI / 4);
            this.d3ModelPyramid.material = mat;
            this.d3ModelPyramid.material.backFaceCulling = false;
        }

        if (config.building.colors.edges) {
            const edgesColor = this.getColor(config.building.colors.edges, this.elementModel.types);
            if (edgesColor !== undefined) {
                this.d3Model.enableEdgesRendering();
                this.d3Model.edgesWidth = this.edgesWidth;
                const c = Color3.FromHexString(edgesColor);
                this.d3Model.edgesColor = new Color4(c.r, c.g, c.b, 1);
                if (this.d3ModelPyramid !== undefined) {
                    this.d3ModelPyramid.enableEdgesRendering();
                    this.d3ModelPyramid.edgesWidth = this.edgesWidth;
                    const c = Color3.FromHexString(edgesColor);
                    this.d3ModelPyramid.edgesColor = new Color4(c.r, c.g, c.b, 1);
                }
            }
        }

        // Display links to other buildings
        this.links.forEach(l => {
            l.render(config);
        });
    }
}