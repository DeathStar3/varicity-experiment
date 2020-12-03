import { Building } from './building.interface';

export abstract class District {
    buildings: Building[];
    districts: District[];

    name: string;
    // width: number; // width will vary depending on number of districts and buildings, so maybe not declare it as attribute?

    abstract addDistrict(district: District);
    abstract addBuilding(building: Building);

    abstract getTotalWidth(): number;

    abstract hasChild(obj: District | Building): boolean;

    constructor() {
        this.buildings = [];
        this.districts = [];
    }

    // Get a building from its full name
    public getBuildingFromName(name: string) : Building {
        for (let i = 0; i < this.buildings.length; i++) {
            if (this.buildings[i].name === name) {
                return this.buildings[i];
            }
        }
        for (let i = 0; i < this.districts.length; i++) {
            const res = this.districts[i].getBuildingFromName(name);
            if (res !== undefined) {
                return res;
            }
        }
        return undefined;
    }

    public depth() : number {
        if (this.districts.length > 0) {
            const depths = this.districts.map(d => d.depth());
            return depths.reduce((a, b) => Math.max(a, b)) + 1;
        } else {
            return 1;
        }
    }
}