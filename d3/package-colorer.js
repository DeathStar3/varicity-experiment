import {NodesFilter} from "./nodes-filter.js";

class PackageColorer extends NodesFilter {

    packagesMap;

    constructor(filterButtonSelector, filterInputSelector, filtersListSelector, nodeFilters, displayGraphFunction) {
        super(filterButtonSelector, filterInputSelector, filtersListSelector, nodeFilters, displayGraphFunction);
        this.packagesMap = new Map();

        this.addValue = (n) => {
            this.packagesMap.set(n, this.getNewColor().toString());
        };

        this.removeValue = (n) => {
            this.packagesMap.delete(n);
        }
    }

    /**
     * Inspired by https://stackoverflow.com/questions/43193341/how-to-generate-random-pastel-or-brighter-color-in-javascript
     * @returns {string}
     */
    getNewColor() {
        return "hsl(" + 360 * Math.random() + ',' + 100 + '%,' + 50 + '%)'
    }

    getColorForName(name){
        var colorFromMap = "";
        var colorFilter = "";
        this.packagesMap.forEach((value, key) =>{
            if(name.startsWith(key) && key.length >= colorFilter.length){
                colorFilter = key;
                colorFromMap = value;
            }
        });
        if(colorFromMap === ""){
            return "#FF0000";
        } else {
            return colorFromMap.toString();
        }
    }

}

export {PackageColorer};