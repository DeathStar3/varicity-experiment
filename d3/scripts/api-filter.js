
import {NodesFilter} from "./nodes-filter.js";


/**
 * This filter removes nodes being isolated, meaning that they are not linked to any other node.
 */
class ApiFilter extends NodesFilter {

    constructor(filterButtonSelector, filterInputSelector, filtersListSelector, nodeFilters, displayGraphFunction) {
        super(filterButtonSelector, filterInputSelector, filtersListSelector, nodeFilters, displayGraphFunction);

    }

    addFilteringToButton() {
        $(this.filterButtonSelector).on('click', async e => {
            e.preventDefault();
            let input = $(this.filterInputSelector);
            let inputValue = input.val();
            var as = inputValue.split(',');
            input.val("");
            as.forEach(element=> this.addFilter(element.trim()));
            await this.displayGraphFunction();
        });

    }

    getLinksListWithMatchingFilter(listToFilter){
        return listToFilter.filter(l => this.filtersList.some(filter => NodesFilter.matchesFilter(l.source, filter)) || this.filtersList.some(filter => NodesFilter.matchesFilter(l.target, filter)))
    }

    getNodesListWithMatchingFilter(listToFilter){
        return listToFilter.filter(n => this.filtersList.some(filter => NodesFilter.matchesFilter(n.name, filter)))
    }



}

export {ApiFilter};