import {District} from "../entities/district.interface";
import {ClassImplem} from "./classImplem.model";
import {Building} from "../entities/building.interface";

export class VPVariantsImplem extends District {
    public vp : ClassImplem;

    buildings : ClassImplem[];
    districts : VPVariantsImplem[];

    constructor(vp: ClassImplem = undefined) {
        super();
        this.vp = vp;
        if (vp !== undefined) {
            this.name = vp.fullName;
        } else {
            this.name = "";
        }
    }

    addBuilding(building: ClassImplem) {
        return this.buildings.push(building);
    }

    addDistrict(district: VPVariantsImplem) {
        return this.districts.push(district);
    }

    getTotalWidth(): number {
        return 0;
    }

    hasChild(obj: ClassImplem | VPVariantsImplem): boolean {
        for (let i = 0; i < this.buildings.length; i++) {
            if (this.buildings[i].name === obj.name) {
                return true;
            }
        }

        for (let i = 0; i < this.districts.length; i++) {
            if (this.buildings[i].name === obj.name) {
                return true;
            } else if (this.districts[i].hasChild(obj)) {
                return true;
            }
        }

        return false;
    }

    filterCompLevel(level: number): VPVariantsImplem | [VPVariantsImplem[],ClassImplem[]] {
        if (this.vp !== undefined && this.vp.compLevel > -1 && this.vp.compLevel <= level) {
            let result = new VPVariantsImplem(this.vp);

            result.buildings = this.buildings.filter(b => b.compLevel > -1 && b.compLevel <= level);

            this.districts.forEach(d => {
                const f = d.filterCompLevel(level);

                if (Array.isArray(f)) {
                    f[0].forEach(e => {
                        result.addDistrict(e);
                    });

                    f[1].forEach(e => {
                        result.addBuilding(e);
                    });
                } else {
                    result.addDistrict(f);
                }
            });
            console.log("1 - ", result);
            return result;
        } else { // If this should not appear
            let result : [VPVariantsImplem[],ClassImplem[]] = [[],[]];

            result[1] = this.buildings.filter(b => b.compLevel > -1 && b.compLevel <= level);

            this.districts.forEach(d => {
                const f = d.filterCompLevel(level);

                if (Array.isArray(f)) {
                    f[0].forEach(e => {
                        result[0].push(e);
                    });

                    f[1].forEach(e => {
                        result[1].push(e);
                    });
                } else {
                    result[0].push(f);
                }
            });
            console.log("2 - ", result);
            return result;
        }
    }
}