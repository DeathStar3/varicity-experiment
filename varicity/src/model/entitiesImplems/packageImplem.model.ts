import { District } from '../entities/district.interface';
import { ClassImplem } from './classImplem.model';

export class PackageImplem implements District {
    buildings: ClassImplem[];
    districts: PackageImplem[];
    name: string;
    startX: number;
    startY: number;

    constructor(name: string) {
        this.name = name;
    }

    addDistrict(district: PackageImplem) {
        // depending on district.name => com.polytech.unice.*
        // find the corresponding district com.polytech
        // add district unice to the corresponding district com.polytech
        return this.districts.push(district);
    }

    addBuilding(building: ClassImplem) {
        // depending on building.name => com.polytech.unice.Object
        // find the corresponding district com.polytech.unice
        // add building Object to the corresponding district com.polytech.unice
        return this.buildings.push(building);
    }

    // returns if obj is a child of this
    hasChild(obj: PackageImplem | ClassImplem): boolean {

        const objNameSplitted = obj.name.split('.');
        const thisNameSplitted = this.name.split('.');

        // Possible to optimize ?
        // objNameSplitted should always be > thisNameSplitted, since it will be recursive
        // therefore, it should be possible to only compare thisNameSplitted[thisNameSplitted.length] with districtNameSplitted[thisNameSplitted.length]
        // since previous districts should have compared the others before
        for(let i = 0; i < thisNameSplitted.length; i++) {
            if(thisNameSplitted[i] != objNameSplitted[i]) {
                return false;
            }
        }
        return true;
    }

    getTotalWidth(): number {
        throw new Error('Method not implemented.');
    }
}