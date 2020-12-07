import { Config } from './../../../model/entitiesImplems/config.model';
import { VPVariantsImplem } from './../../../model/entitiesImplems/vpVariantsImplem.model';
import { Link } from '../../../model/entities/link.interface';
import {Color3, Mesh, MeshBuilder, Scene, StandardMaterial, Vector3} from '@babylonjs/core';
import { Element3D } from '../../common/3Dinterfaces/element3D.interface';
import { Building3D } from '../../common/3Delements/building3D';
import { Road3D } from './road3D';
import { EntitiesList } from '../../../model/entitiesList';
import { Building } from '../../../model/entities/building.interface';
import { Link3DFactory } from '../../common/3Dfactory/link3D.factory';

export class City3D {

    config: Config;
    scene: Scene;

    roads: Road3D[] = [];
    buildings: Building3D[] = [];
    links: Link[] = [];

    floor: Mesh;

    constructor(config: Config, scene: Scene, entities: EntitiesList) {
        this.config = config;
        this.scene = scene;
        this.links = entities.links;
        this.init(entities);
    }

    private init(entities: EntitiesList) {

        let d3elem = new Road3D(this.scene, entities.district as VPVariantsImplem);
        this.roads.push(d3elem);

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
        this.config.clones = {
            objects: [],
            map: new Map<Building, {
                original: Building3D,
                clones: Building3D[]
            }>()
        };

        this.roads[0].build(this.config);
        // this.roads.forEach(d => {
        //     d.build(this.config);
        // });
        this.buildings.forEach(b => {
            b.build();
        });
        this.links.forEach(l => {
            let src = this.findSrcLink(l.source.fullName);
            let dest = this.findSrcLink(l.target.fullName);
            let type = l.type;
            if (src !== undefined && dest !== undefined) {
                let link = Link3DFactory.createLink(src, dest, type, this.scene);
                src.link(link);
                dest.link(link);
                // src.link(dest, type);
                //dest.link(src, type);
            }
        });

        for (let [, value] of this.config.clones.map) {
            for (let b of value.clones) {
                if (b !== undefined) {
                    let link = Link3DFactory.createLink(value.original, b, "DUPLICATES", this.scene);
                    value.original.link(link);
                    b.link(link);
                    // value.original.link(b, "DUPLICATES");
                    //b.link(value.original, "DUPLICATES");
                }
            }
        }

        this.floor = MeshBuilder.CreateBox(
            "cityFloor",
            {
                height: 0.01,
                width: this.getSize(),
                depth: this.getSize()
            },
            this.scene);
    }

    getSize(): number {
        return Math.max(this.roads[0].getWidth(), this.roads[0].getLength());
    }

    place() {
        this.roads[0].place(0, 0, 1, 0);
        this.floor.setPositionWithLocalVector(new Vector3(this.getSize()/2, -0.01, 0));
    }

    render() {
        this.roads.forEach(d => {
            d.render(this.config);
        });
        this.buildings.forEach(b => {
            b.render(this.config);
        });

        let mat = new StandardMaterial("FloorMat", this.scene);
        mat.ambientColor = Color3.FromHexString("#222222");
        mat.diffuseColor = Color3.FromHexString("#222222");
        mat.emissiveColor = Color3.FromHexString("#222222");
        mat.specularColor = Color3.FromHexString("#000000");
        mat.alpha = 0.3;
        this.floor.material = mat;
    }

}