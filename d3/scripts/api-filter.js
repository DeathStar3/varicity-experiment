
import {NodesFilter} from "./nodes-filter.js";

/**
 * This filter removes nodes being isolated, meaning that they are not linked to any other node.
 */
class ApiFilter extends NodesFilter {

    constructor(filterButtonSelector, filterInputSelector, filtersListSelector, nodeFilters, displayGraphFunction) {
        super(filterButtonSelector, filterInputSelector, filtersListSelector, nodeFilters, displayGraphFunction);

        this.getFilteredNodesList = () => {
            var nodesToKeep = new Set();
            this.linksList.forEach(l => {
                nodesToKeep.add(l.source);
                nodesToKeep.add(l.target);
            });
            return this.nodesList.filter(n => nodesToKeep.has(n.name));
        };

        this.getFilterItem = (filter) => {
            return '' +
                '<li class="list-group-item d-flex justify-content-between align-items-center" id="' + filter + '" data-toggle="list"\n' +
                '               role="tab" aria-controls="profile" style="background-color: ' + this.packagesMap.get(filter) + '">'
                + filter +
                '<button type="button btn-dark" class="close" aria-label="Close">\n' +
                '  <span aria-hidden="true">&times;</span>\n' +
                '</button>' +
                '</li>';

        };
    }

    /**
         * Inspired by https://stackoverflow.com/questions/43193341/how-to-generate-random-pastel-or-brighter-color-in-javascript
         * @returns {string}
         */
        getNewColor() {
            return "hsl(" + 360 * Math.random() + ',' + 100 + '%,' + 50 + '%)'
        }

        getColorForName(name, types) {
            var colorFromMap = "";
            var colorFilter = "";
            this.packagesMap.forEach((value, key) => {
                if (name.startsWith(key) && key.length >= colorFilter.length) {
                    colorFilter = key;
                    colorFromMap = value;
                }
            });
            if (colorFromMap === "") {
                return types.includes('PUBLIC') ? "#2FFF00" : "#FF0000";
            } else {
                return colorFromMap.toString();
            }
        }


}

export {ApiFilter};