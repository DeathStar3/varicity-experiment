import {EntitiesList} from "../../model/entitiesList";
import * as data from '../../../symfinder_files/jfreechart-v1.5.0.json';

export class Algo {
    public parse(fileName: string) : EntitiesList {
        // const rawData = fs.readFileSync("../../symfinder_files/"+fileName+".json");
        // const jsonData = JSON.parse(rawData.toString());
        console.log(JSON.stringify(data));
        return new EntitiesList();
    }
}