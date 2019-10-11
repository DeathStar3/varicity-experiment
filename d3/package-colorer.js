import {NodesFilter} from "./nodes-filter.js";

class PackageColorer extends NodesFilter {

    packagesMap;

    constructor(filterButtonSelector, filterInputSelector, filtersListSelector, nodeFilters, displayGraphFunction) {
        super(filterButtonSelector, filterInputSelector, filtersListSelector, nodeFilters, displayGraphFunction);
        this.packagesMap = new Map();

        this.addValue = (n) => {
            this.packagesMap.set(n, "#0000FF");
        };

        this.removeValue = (n) => {
            this.packagesMap.delete(n);
        }
    }

    getColorForName(name){
        var colorFromMap = this.packagesMap.get(name);
        if(typeof colorFromMap == "undefined"){
            return "#FF0000";
        } else {
            return colorFromMap.toString();
        }
    }

}

export {PackageColorer};