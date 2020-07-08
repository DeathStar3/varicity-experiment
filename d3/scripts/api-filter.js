import {Filter} from "./filter.js";

/**
 * This filter removes nodes being isolated, meaning that they are not linked to any other node.
 */
class ApiFilter extends Filter {

    constructor(nodesList, linksList) {
        super(nodesList, linksList);

        this.getFilteredNodesList = () => {
            var nodesToKeep = new Set();
            this.linksList.forEach(l => {
                nodesToKeep.add(l.source);
                nodesToKeep.add(l.target);
            });
            return this.nodesList.filter(n => nodesToKeep.has(n.name));
        };

    }

}

export {ApiFilter};