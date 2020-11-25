import { Element3D } from '../../common/3Dinterfaces/element3D.interface';
import { Building3D } from '../../common/3Delements/building3D';
import { Scene } from '@babylonjs/core';
import { Mesh } from '@babylonjs/core';
import {VPVariantsImplem} from "../../../model/entitiesImplems/vpVariantsImplem.model";

export class Road3D implements Element3D {
    d3Model: Mesh;
    padding: number;

    leftVPs : Road3D[] = [];
    rightVPs : Road3D[] = [];

    leftVariants : Building3D[] = [];
    rightVariants : Building3D[] = [];

    vp : Building3D;

    scene: Scene;

    constructor(scene: Scene, vpElmt: VPVariantsImplem) {
        this.scene = scene;
        this.vp = new Building3D(scene, vpElmt.vp, 0);

        const buildings3D : Building3D[] = vpElmt.buildings.map(b => new Building3D(scene, b, 0));
        const roads3D : Road3D[] = vpElmt.districts.map(v => new Road3D(scene, v));

        this.spreadElements(buildings3D, this.leftVariants, this.rightVariants);
        this.spreadElements(roads3D, this.leftVPs, this.rightVPs);
    }

    spreadElements(elements: Element3D[], left: Element3D[], right: Element3D[]) : void {
        if (elements.length > 0) {
            const sorted = elements.sort((a, b) => a.getWidth() - b.getWidth());
            let i = 0;
            while (i < sorted.length && this.sumOfWidths(sorted) > this.sumOfWidths(left) / 2){
                left.push(sorted[i]);
                i++;
            }
            sorted.slice(i).forEach(e => {
                right.push(e);
            });
        }
    }

    sumOfWidths(list: Element3D[]) : number {
        return list.reduce<number>((prev, cur) => prev += cur.getWidth(), 0);
    }

    getWidth(): number {
        return Math.max(
            this.leftVPs.reduce(((a, b) => a > b.getLength() ? a : b.getLength()), 0),
            this.leftVariants.reduce(((a, b) => a > b.getLength() ? a : b.getLength()), 0)
        ) + Math.max(
            this.rightVPs.reduce(((a, b) => a > b.getLength() ? a : b.getLength()), 0),
            this.rightVariants.reduce(((a, b) => a > b.getLength() ? a : b.getLength()), 0)
        )
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

    build(config?: any) {

    }

    place(x: number, z:number) {

    }

    render(config: any) {

    }
}