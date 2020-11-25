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
            let d3elem = new District3D(this.scene, d, 0);
            this.districts.push(d3elem);
            // d3elem.build();
            // d3elem.render(this.config);
        });

        entities.buildings.forEach(b => {
            let d3elem = new Building3D(this.scene, b, 0);
            this.buildings.push(d3elem);
            // d3elem.build();
            // d3elem.render(this.config);
        });
    }

    private findSrcLink(name: string): Building3D {
        let building: Building3D = undefined;
        for (let b of this.buildings) {
            if (b.getName() == name) return building = b;
        }
        for (let d of this.districts) {
            let b = d.get(name);
            if (b != undefined) return building = b;
        }
        return building;
    }

    build() {
        this.districts.forEach(d => {
            d.build(this.config);
        });
        this.buildings.forEach(b => {
            b.build();
        });
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

        this.place();
    }

    getSize(): number {
        return this.districts[0].getSize();
    }

    place() {
        let d3elements: Element3D[] = [];
        d3elements = d3elements.concat(this.buildings, this.districts);
        d3elements = d3elements.sort((a, b) => a.getSize() - b.getSize());
        let currentX: number = 0;
        let currentZ: number = 0;
        let nextZ = 0;
        let size = this.getSize();
        d3elements.forEach(e => {
            e.place(currentX, currentZ);
            currentX += size;
            if (currentX === 0)
                nextZ += e.getSize();
            if (currentX >= size) {
                currentX = 0;
                currentZ = nextZ;
            }
        });
    }

    render() {
        console.log("rendering");
        this.districts.forEach(d => {
            d.render(this.config);
        });
        this.buildings.forEach(b => {
            b.render(this.config);
        })
    }

}