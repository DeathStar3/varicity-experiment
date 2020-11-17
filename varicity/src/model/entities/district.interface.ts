import { Building } from './building.interface';

export interface District {
    buildings: Building[];
    districts: District[];

    name: string;
    // width: number; // width will vary depending on number of districts and buildings, so maybe not declare it as attribute?

    startX: number;
    startY: number;

    addDistrict(district: District);
    addBuilding(building: Building);

    getTotalWidth(): number;

    hasChild(obj: District | Building): boolean;
}