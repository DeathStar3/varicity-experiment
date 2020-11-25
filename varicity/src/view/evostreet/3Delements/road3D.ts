import { ActionManager, Color3, Color4, ExecuteCodeAction, MeshBuilder, StandardMaterial, Vector3 } from '@babylonjs/core';
import { Element3D } from '../../common/3Dinterfaces/element3D.interface';
import { Building3D } from '../../common/3Delements/building3D';
import { Scene } from '@babylonjs/core';
import { Mesh } from '@babylonjs/core';
import { VPVariantsImplem } from "../../../model/entitiesImplems/vpVariantsImplem.model";

export class Road3D implements Element3D {
    padding: number = 5;

    elementModel: VPVariantsImplem;

    leftVPs: Road3D[] = [];
    rightVPs: Road3D[] = [];

    leftVariants: Building3D[] = [];
    rightVariants: Building3D[] = [];

    vp: Building3D;

    scene: Scene;

    d3Model: Mesh;

    vector: Vector3;

    orientationX: number;
    orientationZ: number;

    constructor(scene: Scene, vpElmt: VPVariantsImplem) {
        this.scene = scene;
        if (vpElmt.vp) {
            this.vp = new Building3D(scene, vpElmt.vp, 0);
        }

        this.elementModel = vpElmt;

        const buildings3D: Building3D[] = vpElmt.buildings.map(b => new Building3D(scene, b, 0));
        const roads3D: Road3D[] = vpElmt.districts.map(v => new Road3D(scene, v));

        this.spreadElements(buildings3D, this.leftVariants, this.rightVariants);
        this.spreadElements(roads3D, this.leftVPs, this.rightVPs);
    }

    spreadElements(elements: Element3D[], left: Element3D[], right: Element3D[]): void {
        if (elements.length > 0) {
            const sorted = elements.sort((a, b) => b.getWidth() - a.getWidth());
            let i = 0;
            while (i < sorted.length && this.sumOfWidths(sorted) / 2 > this.sumOfWidths(left)) {
                left.push(sorted[i]);
                i++;
            }
            sorted.slice(i).forEach(e => {
                right.push(e);
            });
        }
    }

    sumOfWidths(list: Element3D[]): number {
        return list.reduce<number>((prev, cur) => prev += cur.getWidth(), 0);
    }

    /**
     * 
     * @param side right side = true, left side = false
     * 
     * @returns the width of the side
     */
    getSideWidth(side: boolean): number {
        if(side) { // right
            return Math.max(
                this.rightVPs.reduce(((a, b) => a > b.getLength() ? a : b.getLength()), 0),
                this.rightVariants.reduce(((a, b) => a > b.getLength() ? a : b.getLength()), 0)
            );
        } else { // left
            return Math.max(
                this.leftVPs.reduce(((a, b) => a > b.getLength() ? a : b.getLength()), 0),
                this.leftVariants.reduce(((a, b) => a > b.getLength() ? a : b.getLength()), 0)
            );
        }
    }

    getWidth(): number {
        return this.getSideWidth(true) + this.getSideWidth(false);
    }

    getLength(): number {
        return Math.max(
            this.leftVariants.reduce(((a, b) => a + b.getWidth()), 0),
            this.rightVariants.reduce(((a, b) => a + b.getWidth()), 0)
        ) + Math.max(
            this.leftVPs.reduce(((a, b) => a + b.getWidth()), 0),
            this.rightVPs.reduce(((a, b) => a + b.getWidth()), 0)
        );
    }

    get(name: string): Building3D {
        let building: Building3D = undefined;
        const arrConcat = this.leftVariants.concat(this.rightVariants);
        if (name.includes(this.elementModel.name)) {
            for (let b of arrConcat) {
                if (b.getName() == name) {
                    return building = b;
                }
            }
            const roadsConcat = this.leftVPs.concat(this.rightVPs);
            for (let d of roadsConcat) {
                let b = d.get(name);
                if (b != undefined) {
                    return building = b;
                };
            }
        } else {
            return building;
        }
        return building;
    }

    build(config?: any) {

    }

    place(x: number, z: number, orientationX: number, orientationZ: number) {
        this.orientationX = orientationX;
        this.orientationZ = orientationZ;

        let width = this.getWidth();
        let length = this.getLength();

        this.vector = new Vector3(x , 0, z );

        if (this.vp) this.vp.place(x, z);

        let offsetL = this.vp ? this.vp.getWidth() / 2 : 0;
        this.leftVariants.forEach(e => {
            let vX = /* horizontal case: */ ((width + e.getWidth() / 2) + offsetL) * orientationX +
                /* vertical case: */ e.getWidth() / 2 * orientationZ;
            let vZ = /* horizontal case: */ e.getWidth() / 2 * orientationX +
                /* vertical case: */ ((width + e.getWidth()) / 2 + offsetL) * orientationZ
            e.place(vX + x, vZ + z);
            offsetL += e.getWidth();
        });

        let offsetR = this.vp ? this.vp.getWidth() / 2 : 0;
        this.rightVariants.forEach(e => {
            let vX = /* horizontal case: */ ((width + e.getWidth() / 2) + offsetR) * orientationX -
                /* vertical case: */ e.getWidth() / 2 * orientationZ;
            let vZ = /* horizontal case: */ - e.getWidth() / 2 * orientationX +
                /* vertical case: */ ((width + e.getWidth()) / 2 + offsetR) * orientationZ
            e.place(vX + x, vZ + z);
            offsetR += e.getWidth();
        });

        let offsetVL = Math.max(offsetL, offsetR); // to start drawing VPs
        let offsetVR = offsetVL;
        this.leftVPs.forEach(e => {
            let vX = /* horizontal case: */ (width + e.getSideWidth(false) + offsetVL) * orientationX -
                /* vertical case: */ e.vp.getLength() / 2 * orientationZ;
            let vZ = /* horizontal case: */ - e.vp.getLength() / 2 * orientationX +
                /* vertical case: */ (width + e.getSideWidth(false) + offsetVL) * orientationZ;
            e.place(vX + x, vZ + z, -orientationZ, orientationX);
            offsetVL += e.getWidth();
        });
        this.rightVPs.forEach(e => {
            let vX = /* horizontal case: */ (width + e.getSideWidth(true) + offsetVR) * orientationX -
                /* vertical case: */ e.vp.getLength() / 2 * orientationZ;
            let vZ = /* horizontal case: */ - e.vp.getLength() / 2 * orientationX +
                /* vertical case: */ (width + e.getSideWidth(true) + offsetVR) * orientationZ;
            e.place(vX + x, vZ + z, orientationZ, -orientationX);
            offsetVR += e.getWidth();
        });
    }

    render(config: any) {
        this.d3Model = MeshBuilder.CreateBox(
            "package",
            {
                height: 2,
                width: this.getWidth() / 2 - this.padding,
                depth: this.getLength() / 2 - this.padding
            },
            this.scene);
        console.log(this);
        this.d3Model.setPositionWithLocalVector(this.vector);//new Vector3(this.x + (this.elementModel.getTotalWidth() / 2), 30 * this.depth - 15, this.z));

        // if config -> district -> colors -> outline is defined
        if (config.district.colors.outline) {
            this.d3Model.renderOutline = true;
            this.d3Model.outlineColor = Color3.FromHexString(config.district.colors.outline);
        } else {
            console.log("outline not defined");
        }

        // if config -> district -> colors -> edges is defined
        if (config.district.colors.edges) {
            this.d3Model.outlineWidth = 0.1;
            this.d3Model.edgesColor = Color4.FromHexString(config.district.colors.edges);
        } else {
            console.log("edges not defined");
        }

        let mat = new StandardMaterial("District", this.scene);
        // if config -> district -> colors -> faces is defined
        if (config.district.colors.faces) {
            let faces = config.district.colors.faces;
            let done = false;
            if(this.vp) {
                    mat.ambientColor = Color3.FromHexString(config.district.colors.faces[1].color);
                    mat.diffuseColor = Color3.FromHexString(config.district.colors.faces[1].color);
                    mat.emissiveColor = Color3.FromHexString(config.district.colors.faces[1].color);
                    mat.specularColor = Color3.FromHexString("#000000");
            } else {
                    mat.ambientColor = Color3.FromHexString(config.district.colors.faces[0].color);
                    mat.diffuseColor = Color3.FromHexString(config.district.colors.faces[0].color);
                    mat.emissiveColor = Color3.FromHexString(config.district.colors.faces[0].color);
                    mat.specularColor = Color3.FromHexString("#000000");
            }
            // for (let face of faces) {
            //     if(!this.vp) break;
            //     // for (let type of this.elementModel.types) {
            //         // if (type == face.name) {
            //             mat.ambientColor = Color3.FromHexString(face.color);
            //             mat.diffuseColor = Color3.FromHexString(face.color);
            //             mat.emissiveColor = Color3.FromHexString(face.color);
            //             mat.specularColor = Color3.FromHexString(face.color);
            //             done = true;
            //             break;
            //         // }
            //     // }
            //     if (done) break;
            // }
            // if (!done || !this.vp) {
            //     mat.ambientColor = Color3.FromHexString(config.district.colors.faces[0].color);
            //     mat.diffuseColor = Color3.FromHexString(config.district.colors.faces[0].color);
            //     mat.emissiveColor = Color3.FromHexString(config.district.colors.faces[0].color);
            //     mat.specularColor = Color3.FromHexString("#000000");
            // }
        } else {
            console.log("faces not defined");
        }
        this.d3Model.material = mat;

        if(this.vp) this.vp.render(config);

        const variants = this.leftVariants.concat(this.rightVariants);
        variants.forEach(d => {
            d.render(config);
        });

        const vps = this.leftVPs.concat(this.rightVPs);
        vps.forEach(b => {
            b.render(config);
        });

        this.d3Model.actionManager = new ActionManager(this.scene);
        this.d3Model.actionManager.registerAction(
            new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnLeftPickTrigger
                },
                () => this.showAllLinks()
            )
        );
    }

    showAllLinks() {
        const variants = this.leftVariants.concat(this.rightVariants);
        variants.forEach(v => {
            v.showAllLinks()
        });

        const vps = this.leftVPs.concat(this.rightVPs);
        vps.forEach(vp => {
            vp.showAllLinks()
        });
    }
}