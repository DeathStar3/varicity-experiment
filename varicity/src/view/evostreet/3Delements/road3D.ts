import { Config } from './../../../model/entitiesImplems/config.model';
import { ActionManager, Color3, Color4, ExecuteCodeAction, MeshBuilder, StandardMaterial, Vector3 } from '@babylonjs/core';
import { Element3D } from '../../common/3Dinterfaces/element3D.interface';
import { Building3D } from '../../common/3Delements/building3D';
import { Scene } from '@babylonjs/core';
import { Mesh } from '@babylonjs/core';
import { VPVariantsImplem } from "../../../model/entitiesImplems/vpVariantsImplem.model";

export class Road3D implements Element3D {
    padding: number = 0;

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

    roadWidth = 0.3;

    status: boolean = false;

    constructor(scene: Scene, vpElmt: VPVariantsImplem) {
        this.scene = scene;

        this.elementModel = vpElmt;
        if (vpElmt.vp) {
            this.vp = new Building3D(scene, vpElmt.vp, 0);
        }
    }

    private spreadElements(elements: Element3D[], left: Element3D[], right: Element3D[]): void {
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

    private sumOfWidths(list: Element3D[]): number {
        return list.reduce<number>((prev, cur) => prev += cur.getWidth(), 0);
    }

    /**
     * 
     * @param right right side = true, left side = false
     * 
     * @returns the width of the side
     */
    getSideWidth(right: boolean): number {
        if (right) { // right
            return Math.max(
                this.rightVPs.reduce(((a, b) => Math.max(a, b.getLength())), 0),
                this.rightVariants.reduce(((a, b) => Math.max(a, b.getLength())), 0),
                this.getVpWidth() / 2
            );
        } else { // left
            return Math.max(
                this.leftVPs.reduce(((a, b) => Math.max(a, b.getLength())), 0),
                this.leftVariants.reduce(((a, b) => Math.max(a, b.getLength())), 0),
                this.getVpWidth() / 2
            );
        }
    }

    getVpWidth(): number {
        return this.vp === undefined ? 0 : this.vp.getWidth();
    }

    getVpPadding(): number {
        return this.vp === undefined ? 0 : this.vp.padding;
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
        ) + (this.getVpWidth());
    }

    get(name: string): Building3D {
        let building: Building3D = undefined;
        const arrConcat = this.leftVariants.concat(this.rightVariants);
        if (name.includes(this.elementModel.name)) {
            for (let b of arrConcat) {
                if (b.getName() == name) {
                    return building = this.vp;
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

    build(config?: Config) {
        const buildings3D: Building3D[] = [];
        this.elementModel.buildings.forEach(b => {
            if (config.clones) {
                if (config.clones.objects.includes(b)) {
                    config.clones.map.get(b).clones.push(this.vp);
                } else {
                    let d3 = new Building3D(this.scene, b, 0);
                    config.clones.objects.push(b);
                    config.clones.map.set(b, { original: d3, clones: [] });
                    d3.build();
                    buildings3D.push(d3);
                }
            } else {
                let d3 = new Building3D(this.scene, b, 0);
                d3.build();
                buildings3D.push(d3);
            }
        });
        const roads3D: Road3D[] = [];
        this.elementModel.districts.forEach(v => {
            if (config.clones) {
                if (config.clones.objects.includes(v.vp)) {
                    config.clones.map.get(v.vp).clones.push(this.vp);
                } else {
                    let d3 = new Road3D(this.scene, v);
                    config.clones.objects.push(v.vp);
                    config.clones.map.set(v.vp, { original: d3.vp, clones: [] });
                    d3.build(config);
                    roads3D.push(d3);
                }
            } else {
                let d3 = new Road3D(this.scene, v);
                d3.build(config);
                roads3D.push(d3);
            }
        });

        this.spreadElements(buildings3D, this.leftVariants, this.rightVariants);
        this.spreadElements(roads3D, this.leftVPs, this.rightVPs);
    }

    getRoadLength(): number {
        return this.getLength() - this.getVpWidth();
    }

    place(x: number, z: number, orientationX: number, orientationZ: number) {
        this.orientationX = orientationX;
        this.orientationZ = orientationZ;

        if (this.vp) this.vp.place(x, z);

        this.vector = new Vector3(
            x + orientationX * (this.getRoadLength() / 2 + this.getVpWidth() / 2 - this.getVpPadding() / 2),
            0,
            z + orientationZ * (this.getRoadLength() / 2 + this.getVpWidth() / 2 - this.getVpPadding() / 2)
        );

        let offsetVL = this.getVpWidth() / 2; // to start drawing VPs
        let offsetVR = this.getVpWidth() / 2;
        this.leftVPs.forEach(e => {
            let vX =
                /* horizontal case: */ (e.getSideWidth(false) + offsetVL) * orientationX +
                /* vertical case:   */ (e.getVpWidth() / 2) * -orientationZ;
            let vZ =
                /* horizontal case: */ (e.getVpWidth() / 2) * orientationX +
                /* vertical case:   */ (e.getSideWidth(false) + offsetVL) * orientationZ;
            e.place(vX + x, vZ + z, -orientationZ, orientationX);
            offsetVL += e.getWidth();
        });
        this.rightVPs.forEach(e => {
            let vX =
                /* horizontal case: */ (e.getSideWidth(true) + offsetVR) * orientationX +
                /* vertical case:   */ (e.getVpWidth() / 2) * orientationZ;
            let vZ =
                /* horizontal case: */ - (e.getVpWidth() / 2) * orientationX +
                /* vertical case:   */ (e.getSideWidth(true) + offsetVR) * orientationZ;
            e.place(vX + x, vZ + z, orientationZ, -orientationX);
            offsetVR += e.getWidth();
        });

        let offsetL = Math.max(offsetVL, offsetVR);;
        let offsetR = Math.max(offsetVL, offsetVR);;

        this.leftVariants.forEach(e => {
            let vX =
                /* horizontal case: */ ((e.getWidth() / 2) + offsetL) * orientationX +
                /* vertical case:   */ (e.getWidth() / 2 - e.padding / 2 + this.roadWidth / 2) * -orientationZ;
            let vZ =
                /* horizontal case: */ (e.getWidth() / 2 - e.padding / 2 + this.roadWidth / 2) * orientationX +
                /* vertical case:   */ (e.getWidth() / 2 + offsetL) * orientationZ
            e.place(vX + x, vZ + z);
            offsetL += e.getWidth();
        });

        this.rightVariants.forEach(e => {
            let vX =
                /* horizontal case: */ ((e.getWidth() / 2) + offsetR) * orientationX -
                /* vertical case:   */ (e.getWidth() / 2 - e.padding / 2 + this.roadWidth / 2) * -orientationZ;
            let vZ =
                /* horizontal case: */ - (e.getWidth() / 2 - e.padding / 2 + this.roadWidth / 2) * orientationX +
                /* vertical case:   */ ((e.getWidth()) / 2 + offsetR) * orientationZ
            e.place(vX + x, vZ + z);
            offsetR += e.getWidth();
        });
    }

    render(config: Config) {
        this.d3Model = MeshBuilder.CreateBox(
            "package",
            {
                height: 0.001,
                width: (this.orientationX == 0 ? this.roadWidth : this.getRoadLength()),
                depth: (this.orientationZ == 0 ? this.roadWidth : this.getRoadLength())
            },
            this.scene);
        this.d3Model.setPositionWithLocalVector(this.vector);

        // if config -> district -> colors -> outline is defined
        if (config.district.colors.outline) {
            this.d3Model.renderOutline = true;
            this.d3Model.outlineColor = Color3.FromHexString(config.district.colors.outline);
        }

        // if config -> district -> colors -> edges is defined
        if (config.district.colors.edges) {
            this.d3Model.outlineWidth = 0.1;
            this.d3Model.edgesColor = Color4.FromHexString(config.district.colors.edges);
        }

        let mat = new StandardMaterial("District", this.scene);
        // if config -> district -> colors -> faces is defined
        if (config.district.colors.faces) {
            let faces = config.district.colors.faces;
            let done = false;
            if (this.vp) {
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
        }

        this.d3Model.material = mat;

        if (config.vp_building.color) {
            config.force_color = config.vp_building.color;
        }
        if (this.vp) this.vp.render(config);
        config.force_color = undefined;
        // testing purposes
        // else {
        //     let mesh = MeshBuilder.CreateBox(
        //         "src",
        //         {
        //             height: 50,
        //             width: 10,
        //             depth: 10
        //         },
        //         this.scene);
        //         mesh.setAbsolutePosition(new Vector3(this.getLength() / 2, 0, 0))
        // }

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
                () => {
                    this.showAllLinks();
                }
            )
        );
    }

    showAllLinks(status?: boolean) {
        if(status) this.status = status;
        else this.status = !this.status;
        if (this.vp) this.vp.showAllLinks(this.status);

        const variants = this.leftVariants.concat(this.rightVariants);
        variants.forEach(v => {
            v.showAllLinks(this.status);
        });

        const vps = this.leftVPs.concat(this.rightVPs);
        vps.forEach(vp => {
            vp.showAllLinks(this.status);
        });
    }
}