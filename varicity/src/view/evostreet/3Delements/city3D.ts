import { VPVariantsImplem } from './../../../model/entitiesImplems/vpVariantsImplem.model';
import { Link } from '../../../model/entities/link.interface';
import { Scene } from '@babylonjs/core';
import { Element3D } from '../../common/3Dinterfaces/element3D.interface';
import { Building3D } from '../../common/3Delements/building3D';
import { Road3D } from './road3D';
import { EntitiesList } from '../../../model/entitiesList';

export class City3D {

    config: any;
    scene: Scene;

    roads: Road3D[] = [];
    buildings: Building3D[] = [];
    links: Link[] = [];

    constructor(config: any, scene: Scene, entities: EntitiesList) {
        this.config = config;
        this.scene = scene;
        this.links = entities.links;
        this.init(entities);
    }

    private init(entities: EntitiesList) {

        entities.districts.forEach(d => {
            let d3elem = new Road3D(this.scene, d as VPVariantsImplem);
            this.roads.push(d3elem);
        });

        entities.buildings.forEach(b => {
            let d3elem = new Building3D(this.scene, b, 0);
            this.buildings.push(d3elem);
        });
    }

    private findSrcLink(name: string): Building3D {
        let building: Building3D = undefined;
        for (let b of this.buildings) {
            if (b.getName() == name) return building = b;
        }
        for (let d of this.roads) {
            let b = d.get(name);
            if (b != undefined) return building = b;
        }
        return building;
    }

    build() {
        this.config.clones = {};
        this.config.clones.objects = [];
        this.config.clones.map = new Map<Building3D, {
            original: Building3D
            clones: Building3D[]
        }>();

        this.roads[0].build(this.config);
        // this.roads.forEach(d => {
        //     d.build(this.config);
        // });
        // this.buildings.forEach(b => {
        //     b.build();
        // });
        this.links.forEach(l => {
            let src = this.findSrcLink(l.source.fullName);
            let dest = this.findSrcLink(l.target.fullName);
            let type = l.type;
            if (src != undefined && dest != undefined) {
                src.link(dest, type);
                dest.link(src, type);
            }
            else {
                console.log("massive error help tasukete kudasai");
            }
        });

        for (let [, value] of this.config.clones.map) {
            for (let b of value.clones) {
                value.original.link(b, "SHARES");
                b.link(value.original, "SHARES");
            }
        }
    }

    getSize(): number {
        return this.roads[0].getWidth();
    }

    place() {
        let d3elements: Element3D[] = [];
        d3elements = d3elements.concat(this.buildings, this.roads);
        d3elements = d3elements.sort((a, b) => a.getWidth() - b.getWidth());
        this.roads[0].place(0, 0, 1, 0);
    }

    render() {
        this.roads.forEach(d => {
            d.render(this.config);
        });
        this.buildings.forEach(b => {
            b.render(this.config);
        })
    }

}