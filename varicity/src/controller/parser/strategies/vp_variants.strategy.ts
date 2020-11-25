import { ConfigLoader } from './../configLoader';
import {EntitiesList} from "../../../model/entitiesList";
import {NodeElement} from "../symfinder_elements/nodes/node.element";
import {ClassImplem} from "../../../model/entitiesImplems/classImplem.model";
import {PackageImplem} from "../../../model/entitiesImplems/packageImplem.model";
import {FilesLoader} from "../filesLoader";
import {LinkElement} from "../symfinder_elements/links/link.element";
import {LinkImplem} from "../../../model/entitiesImplems/linkImplem.model";
import {VPVariantsImplem} from "../../../model/entitiesImplems/vpVariantsImplem.model";

export class VPVariantsStrategy {
    public parse(fileName: string) : EntitiesList {
        const data = FilesLoader.loadDataFile(fileName);

        // console.log('Analyzing with VP and variants strategy: ', data);

        const nodesList: NodeElement[] = [];
        data.nodes.forEach(n => {
            let node = new NodeElement(n.name);
            node.nbFunctions = (n.methodVariants === undefined) ? 0 : n.methodVariants;

            const attr = n.attributes;
            let nbAttributes = 0;
            attr.forEach(a => {
                nbAttributes += a.number;
            })
            const cVar = (n.constructorVariants === undefined) ? 0 : n.constructorVariants;
            node.nbAttributes = nbAttributes;
            node.nbConstructorVariants = cVar;

            node.types = n.types;
            nodesList.push(node);
        });

        const linkElements : LinkElement[] = [];
        data.links.forEach(l => {
            linkElements.push(new LinkElement(l.source, l.target, l.type));
        });

        nodesList.forEach(n => {
            n.nbVariants = this.getLinkedNodes(n, nodesList, linkElements).length;
        })

        const d = this.constructDistricts(nodesList, linkElements);

        // console.log(d);

        let result = new EntitiesList();
        result.addDistrict(d);

        const inheritancesList: LinkImplem[] = [];
        linkElements.forEach(le => {
            const source = result.getBuildingFromName(le.source.split('.'));
            const target = result.getBuildingFromName(le.target.split('.'));
            if (source !== undefined && target !== undefined)
                inheritancesList.push(new LinkImplem(source, target, le.type));
        })
        result.links = inheritancesList;


        // console.log(result);

        return result;
    }

    private constructDistricts(nodes: NodeElement[], links: LinkElement[]) : VPVariantsImplem {
        const trace : VPVariantsImplem[] = [];
        nodes.forEach(n => {
            this.constructDistrict(n, trace, nodes, links);
        });
        const res : VPVariantsImplem = new VPVariantsImplem();
        const maxDepth = trace.reduce<number>((a, b) => Math.max(a, b.depth()), 0);
        trace.filter(v => v.depth() === maxDepth).forEach(v => {
            res.addDistrict(v);
        });
        return res;
    }

    private constructDistrict(nodeElement: NodeElement, trace: VPVariantsImplem[], nodes: NodeElement[], links: LinkElement[]) : VPVariantsImplem {
        if (nodeElement.types.includes("VP")) { // if n is a vp
            // console.log("constructing district from vp : ", nodeElement.name);
            if (!nodeElement.analyzed) { // if n has not been analyzed yet
                // create a new district with n
                const res = new VPVariantsImplem(new ClassImplem(
                    nodeElement.name,
                    nodeElement.nbVariants,
                    nodeElement.nbConstructorVariants,
                    nodeElement.types,
                    nodeElement.name
                ));

                // construct districts for each of linked nodes
                // add each district to the district's districts
                // and add remaining classes to the district's buildings
                const linkedNodes = this.getLinkedNodes(nodeElement, nodes, links);
                // console.log("Linked to nodes : ", linkedNodes);

                linkedNodes.forEach(n => {
                    const d = this.constructDistrict(n, trace, nodes, links);
                    if (d === undefined) {
                        res.addBuilding(new ClassImplem(
                            n.name,
                            n.nbVariants,
                            n.nbConstructorVariants,
                            n.types,
                            n.name)
                        );
                    } else {
                        res.addDistrict(d);
                    }
                })

                // add result to the trace, set the node to have been analyzed, and return constructed district
                trace.push(res);
                nodeElement.analyzed = true;
                return res;
            } else { // else return its element found from the trace
                for (let i = 0; i < trace.length; i++) {
                    if (trace[i].vp.name === nodeElement.name) {
                        return trace[i];
                    }
                }
                throw "Error: node analyzed but not found in trace.";
            }
        } else { // else return undefined
            return undefined;
        }
    }

    private getLinkedNodes(n: NodeElement, nodes: NodeElement[], links: LinkElement[]) : NodeElement[]{
        const name = n.name;
        const res: NodeElement[] = [];

        links.forEach(l => {
            if (l.source === name && l.target !== name) {
                // console.log("Found link : ", l);
                res.push(this.findNodeByName(l.target, nodes));
            }
        });

        return res;
    }

    private findNodeByName(name: string, nodes: NodeElement[]) : NodeElement {
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].name === name) {
                return nodes[i];
            }
        }
        return undefined;
    }
}