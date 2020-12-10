import {ParsingStrategy} from "./parsing.strategy.interface";
import {JsonInputInterface} from "../../../model/entities/jsonInput.interface";
import {Config} from "../../../model/entitiesImplems/config.model";
import {EntitiesList} from "../../../model/entitiesList";
import {VPVariantsInheritanceStrategy} from "./vp_variants_inheritance.strategy";
import {VPVariantsCompositionStrategy} from "./vp_variants_composition.strategy";

export class VPVariantsStrategy implements ParsingStrategy{
    parse(data: JsonInputInterface, config: Config): EntitiesList {
        switch (config.parsing_mode){
            case "inheritance":
                return new VPVariantsInheritanceStrategy().parse(data,config);
            case "composition":
                return new VPVariantsCompositionStrategy().parse(data,config);
            default:
                return undefined;
        }
    }

}