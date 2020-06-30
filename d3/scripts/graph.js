/*
 * This file is part of symfinder.
 *
 * symfinder is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * symfinder is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with symfinder. If not, see <http://www.gnu.org/licenses/>.
 *
 * Copyright 2018-2019 Johann Mortara <johann.mortara@univ-cotedazur.fr>
 * Copyright 2018-2019 Xhevahire Tërnava <xhevahire.ternava@lip6.fr>
 * Copyright 2018-2019 Philippe Collet <philippe.collet@univ-cotedazur.fr>
 */

import {NodesFilter} from "./nodes-filter.js";
import {PackageColorer} from "./package-colorer.js";
import {VariantsFilter} from "./variants-filter.js";
import {IsolatedFilter} from "./isolated-filter.js";
import {HotspotsFilter} from "./hotspots-filter.js";

class Graph {

    constructor(jsonFile, jsonStatsFile, nodeFilters) {
        this.jsonFile = jsonFile;
        this.jsonStatsFile = jsonStatsFile;
        this.filter = new NodesFilter("#add-filter-button", "#package-to-filter", "#list-tab", nodeFilters, async () => await this.displayGraph());
        this.packageColorer = new PackageColorer("#add-package-button", "#package-to-color", "#color-tab", [], async () => await this.displayGraph());
        if(sessionStorage.getItem("firstTime") === null){
            sessionStorage.setItem("firstTime", "true");
        }
        this.color = d3.scaleLinear();
        this.setButtonsClickActions();
    }


    async displayGraph() {
        if (sessionStorage.getItem("firstTime") === "true") {
            sessionStorage.setItem("filteredIsolated", "false");
            sessionStorage.setItem("filteredVariants", "true");
            sessionStorage.setItem("onlyHotspots", "false");
            sessionStorage.setItem("firstTime", "false");
        }
        d3.selectAll("svg > *").remove();
        this.filterIsolated = sessionStorage.getItem("filteredIsolated") === "true";
        this.filterVariants = sessionStorage.getItem("filteredVariants") === "true";
        this.onlyHotspots = sessionStorage.getItem("onlyHotspots") === "true";
        await this.generateGraph();
        return this.graph;
    }

    async generateGraph() {

        this.width = window.innerWidth;
        this.height = window.innerHeight - 10;

        this.generateStructure(this.width, this.height);

        await this.getData(this);

    }

    generateStructure(width, height) {
        //	svg selection and sizing
        this.svg = d3.select("svg").attr("width", width).attr("height", height);

        this.svg.append('defs').append('marker')
            .attr('id', 'arrowhead')
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", -5)
            .attr("refY", 0)
            .attr("markerWidth", 4)
            .attr("markerHeight", 4)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,0L10,-5L10,5")
            .attr('fill', 'gray')
            .style('stroke', 'none');


        //add encompassing group for the zoom
        this.g = this.svg.append("g")
            .attr("class", "everything");

        this.link = this.g.append("g").selectAll(".link");
        this.node = this.g.append("g").selectAll(".node");
        this.label = this.g.append("g").selectAll(".label");
    }

    async getData(graph) {
        return new Promise((resolve, reject) => {
            d3.queue()
                .defer(d3.json, graph.jsonFile)
                .defer(d3.json, graph.jsonStatsFile)
                .await((err, gr, stats) => {
                    if (err) throw err;
                    graph.displayData(gr, stats);
                    graph.update();
                    resolve();
                });
        });

    }

    displayData(gr, stats) {
        //	data read and store

        document.getElementById("statistics").innerHTML =
            // "Number of VPs: " + stats["VPs"] + "<br>" +
            // "Number of methods VPs: " + stats["methodVPs"] + "<br>" +
            // "Number of constructors VPs: " + stats["constructorsVPs"] + "<br>" +
            "Number of class level VPs: " + stats["classLevelVPs"] + "<br>" +
            "Number of method level VPs: " + stats["methodLevelVPs"] + "<br>" +
            // "Number of variants: " + stats["variants"] + "<br>" +
            // "Number of methods variants: " + stats["methodsVariants"] + "<br>" +
            // "Number of constructors variants: " + stats["constructorsVariants"] + "<br>" +
            "Number of class level variants: " + stats["classLevelVariants"] + "<br>" +
            "Number of method level variants: " + stats["methodLevelVariants"];

        var sort = gr.nodes.filter(a => a.types.includes("CLASS")).map(a => parseInt(a.constructorVariants)).sort((a, b) => a - b);
        this.color.domain([sort[0] - 3, sort[sort.length - 1]]); // TODO deal with magic number

        var nodeByID = {};

        this.graph = gr;
        this.store = $.extend(true, {}, gr);

        this.graph.nodes.forEach(function (n) {
            n.radius = n.types.includes("CLASS") ? 10 + n.methodVPs : 10;
            nodeByID[n.name] = n;
        });

        this.graph.links.forEach(function (l) {
            l.sourceTypes = nodeByID[l.source].types;
            l.targetTypes = nodeByID[l.target].types;
        });

        this.store.nodes.forEach(function (n) {
            n.radius = n.types.includes("CLASS") ? 10 + n.methodVPs : 10;
        });

        this.store.links.forEach(function (l) {
            l.sourceTypes = nodeByID[l.source].types;
            l.targetTypes = nodeByID[l.target].types;
        });


        this.graph.nodes = this.filter.getNodesListWithoutMatchingFilter(gr.nodes);
        this.graph.links = this.filter.getLinksListWithoutMatchingFilter(gr.links);

        if (this.filterVariants) {
            var variantsFilter = new VariantsFilter(this.graph.nodes, this.graph.links);
            this.graph.nodes = variantsFilter.getFilteredNodesList();
            this.graph.links = variantsFilter.getFilteredLinksList();
        }

        if (this.filterIsolated) {
            var isolatedFilter = new IsolatedFilter(this.graph.nodes, this.graph.links);
            this.graph.nodes = isolatedFilter.getFilteredNodesList();
            this.graph.links = isolatedFilter.getFilteredLinksList();
        }

    }


    //	general update pattern for updating the graph
    update() {

        // this.argoTraces = ['org.argouml.ui.explorer.ExplorerPopup', 'org.argouml.ui.explorer.rules.GoNamespaceToDiagram', 'org.argouml.ui.explorer.rules.GoStatemachineToDiagram', 'org.argouml.uml.diagram.activity.ui.UMLActivityDiagram', 'org.argouml.uml.diagram.DiagramFactory', 'org.argouml.uml.diagram.state.ui.FigFinalState', 'org.argouml.uml.diagram.state.ui.FigStateVertex', 'org.argouml.uml.diagram.state.ui.UMLStateDiagram', 'org.argouml.uml.diagram.deployment.ui.UMLDeploymentDiagram', 'org.argouml.persistence.ModelMemberFilePersister', 'org.argouml.uml.diagram.state.StateDiagramGraphModel', 'org.argouml.uml.diagram.state.ui.StateDiagramRenderer', 'org.argouml.application.Main', 'org.argouml.application.PostLoad', 'org.argouml.application.LoadModules', 'org.argouml.notation.providers.uml.AbstractMessageNotationUml', 'org.argouml.notation.providers.uml.AssociationRoleNotationUml', 'org.argouml.notation.providers.uml.ClassifierRoleNotationUml', 'org.argouml.ui.cmd.GenericArgoMenuBar', 'org.argouml.ui.cmd.ShortcutMgr', 'org.argouml.ui.explorer.PerspectiveManager', 'org.argouml.ui.explorer.rules.GoClassifierToCollaboration', 'org.argouml.ui.explorer.rules.GoCollaborationToDiagram', 'org.argouml.ui.explorer.rules.GoCollaborationToInteraction', 'org.argouml.ui.explorer.rules.GoModelToCollaboration', 'org.argouml.ui.explorer.rules.GoOperationToCollaboration', 'org.argouml.ui.explorer.rules.GoOperationToCollaborationDiagram', 'org.argouml.ui.explorer.rules.GoProjectToCollaboration', 'org.argouml.uml.diagram.collaboration.CollabDiagramGraphModel', 'org.argouml.uml.diagram.collaboration.ui.ActionAddClassifierRole', 'org.argouml.uml.diagram.collaboration.ui.CollabDiagramRenderer', 'org.argouml.uml.diagram.collaboration.ui.CollaborationDiagramPropPanelFactory', 'org.argouml.uml.diagram.collaboration.ui.FigAssociationRole', 'org.argouml.uml.diagram.collaboration.ui.FigMessageGroup', 'org.argouml.uml.diagram.collaboration.ui.FigClassifierRole', 'org.argouml.uml.diagram.collaboration.ui.InitCollaborationDiagram', 'org.argouml.uml.diagram.collaboration.ui.PropPanelUMLCollaborationDiagram', 'org.argouml.uml.diagram.collaboration.ui.SelectionClassifierRole', 'org.argouml.uml.diagram.collaboration.ui.UMLCollaborationDiagram', 'org.argouml.uml.diagram.ui.ActionAddMessage', 'org.argouml.uml.diagram.ui.FigMessage', 'org.argouml.uml.diagram.UmlDiagramRenderer', 'org.argouml.uml.ui.ActionCollaborationDiagram', 'org.argouml.uml.ui.ActionNewDiagram', 'org.argouml.uml.ui.behavior.activity_graphs.ActionNewEntryCallAction', 'org.argouml.uml.ui.behavior.collaborations.ActionAddClassifierRoleBase', 'org.argouml.uml.ui.behavior.collaborations.ActionAddMessagePredecessor', 'org.argouml.uml.ui.behavior.collaborations.ActionRemoveClassifierRoleBase', 'org.argouml.uml.ui.behavior.collaborations.ActionSetAssociationRoleBase', 'org.argouml.uml.ui.behavior.collaborations.ActionSetRepresentedClassifierCollaboration', 'org.argouml.uml.ui.behavior.collaborations.ActionSetRepresentedOperationCollaboration', 'org.argouml.uml.ui.behavior.collaborations.UMLAssociationRoleBaseComboBoxModel', 'org.argouml.uml.ui.behavior.collaborations.UMLClassifierRoleAvailableContentsListModel', 'org.argouml.uml.ui.behavior.collaborations.UMLClassifierRoleAvailableFeaturesListModel', 'org.argouml.uml.ui.behavior.collaborations.UMLMessageActivatorComboBox', 'org.argouml.uml.ui.behavior.collaborations.UMLMessageActivatorComboBoxModel', 'org.argouml.uml.ui.behavior.common_behavior.ActionNewAction', 'org.argouml.uml.ui.behavior.common_behavior.PropPanelStimulus', 'org.argouml.notation.NotationProviderFactory2', 'org.argouml.notation.providers.uml.CallStateNotationUml', 'org.argouml.notation.providers.uml.InitNotationUml', 'org.argouml.notation.providers.uml.StateBodyNotationUml', 'org.argouml.notation.providers.uml.TransitionNotationUml', 'org.argouml.ui.explorer.rules.GoBehavioralFeatureToStateDiagram', 'org.argouml.ui.explorer.rules.GoClassifierToStateMachine', 'org.argouml.ui.explorer.rules.GoCompositeStateToSubvertex', 'org.argouml.ui.explorer.rules.GoProjectToStateMachine', 'org.argouml.ui.explorer.rules.GoStateMachineToState', 'org.argouml.ui.explorer.rules.GoStateMachineToTop', 'org.argouml.ui.explorer.rules.GoStateMachineToTransition', 'org.argouml.ui.explorer.rules.GoStateToDownstream', 'org.argouml.ui.explorer.rules.GoStateToIncomingTrans', 'org.argouml.ui.explorer.rules.GoStateToOutgoingTrans', 'org.argouml.uml.diagram.state.PredIsFinalState', 'org.argouml.uml.diagram.state.PredIsStartState', 'org.argouml.uml.diagram.state.ui.ActionCreatePseudostate', 'org.argouml.uml.diagram.state.ui.ButtonActionNewCallEvent', 'org.argouml.uml.diagram.state.ui.ButtonActionNewChangeEvent', 'org.argouml.uml.diagram.state.ui.ButtonActionNewEffect', 'org.argouml.uml.diagram.state.ui.ButtonActionNewEvent', 'org.argouml.uml.diagram.state.ui.ButtonActionNewSignalEvent', 'org.argouml.uml.diagram.state.ui.ButtonActionNewTimeEvent', 'org.argouml.uml.diagram.state.ui.FigBranchState', 'org.argouml.uml.diagram.state.ui.FigCompositeState', 'org.argouml.uml.diagram.state.ui.FigConcurrentRegion', 'org.argouml.uml.diagram.state.ui.FigDeepHistoryState', 'org.argouml.uml.diagram.state.ui.FigForkState', 'org.argouml.uml.diagram.state.ui.FigHistoryState', 'org.argouml.uml.diagram.state.ui.FigInitialState', 'org.argouml.uml.diagram.state.ui.FigJoinState', 'org.argouml.uml.diagram.state.ui.FigJunctionState', 'org.argouml.uml.diagram.state.ui.FigShallowHistoryState', 'org.argouml.uml.diagram.state.ui.FigSimpleState', 'org.argouml.uml.diagram.state.ui.FigState', 'org.argouml.uml.diagram.state.ui.FigStubState', 'org.argouml.uml.diagram.state.ui.FigSubmachineState', 'org.argouml.uml.diagram.state.ui.FigSynchState', 'org.argouml.uml.diagram.state.ui.FigTransition', 'org.argouml.uml.diagram.state.ui.InitStateDiagram', 'org.argouml.uml.diagram.state.ui.PropPanelUMLStateDiagram', 'org.argouml.uml.diagram.state.ui.SelectionState', 'org.argouml.uml.diagram.state.ui.StateDiagramPropPanelFactory', 'org.argouml.uml.diagram.ui.ActionAddConcurrentRegion', 'org.argouml.uml.ui.AbstractActionAddModelElement2', 'org.argouml.uml.ui.ActionDeleteModelElements', 'org.argouml.uml.ui.ActionStateDiagram', 'org.argouml.uml.ui.behavior.activity_graphs.ActionAddEventAsTrigger', 'org.argouml.uml.ui.behavior.state_machines.ActionAddEventAsDeferrableEvent', 'org.argouml.uml.ui.behavior.state_machines.ActionNewCallEvent', 'org.argouml.uml.ui.behavior.state_machines.ActionNewChangeEvent', 'org.argouml.uml.ui.behavior.state_machines.ActionNewCompositeState', 'org.argouml.uml.ui.behavior.state_machines.ActionNewEvent', 'org.argouml.uml.ui.behavior.state_machines.ActionNewFinalState', 'org.argouml.uml.ui.behavior.state_machines.ActionNewGuard', 'org.argouml.uml.ui.behavior.state_machines.ActionNewPseudoState', 'org.argouml.uml.ui.behavior.state_machines.ActionNewSignalEvent', 'org.argouml.uml.ui.behavior.state_machines.ActionNewSimpleState', 'org.argouml.uml.ui.behavior.state_machines.ActionNewStubState', 'org.argouml.uml.ui.behavior.state_machines.ActionNewSubmachineState', 'org.argouml.uml.ui.behavior.state_machines.ActionNewSynchState', 'org.argouml.uml.ui.behavior.state_machines.ActionNewTimeEvent', 'org.argouml.uml.ui.behavior.state_machines.ActionNewTransition', 'org.argouml.uml.ui.behavior.state_machines.ActionSetCompositeStateConcurrent', 'org.argouml.uml.ui.behavior.state_machines.ActionSetContextStateMachine', 'org.argouml.uml.ui.behavior.state_machines.ActionSetStubStateReferenceState', 'org.argouml.uml.ui.behavior.state_machines.ActionSetSubmachineStateSubmachine', 'org.argouml.uml.ui.behavior.state_machines.ButtonActionNewGuard', 'org.argouml.uml.ui.behavior.state_machines.PropPanelStubState', 'org.argouml.uml.ui.behavior.state_machines.PropPanelSubmachineState', 'org.argouml.uml.ui.behavior.state_machines.PropPanelSynchState', 'org.argouml.uml.ui.behavior.state_machines.PropPanelTransition', 'org.argouml.uml.ui.behavior.state_machines.UMLChangeExpressionModel', 'org.argouml.uml.ui.behavior.state_machines.UMLStubStateComboBoxModel', 'org.argouml.uml.ui.behavior.state_machines.UMLSubmachineStateComboBoxModel', 'org.argouml.uml.ui.behavior.state_machines.UMLSynchStateBoundDocument', 'org.argouml.uml.ui.ElementPropPanelFactory', 'org.argouml.uml.ui.UMLExpressionExpressionModel', 'org.argouml.uml.ui.UMLTimeExpressionModel', 'org.argouml.uml.diagram.use_case.ui.UMLUseCaseDiagram', 'org.argouml.uml.diagram.use_case.ui.UseCaseDiagramRenderer', 'org.argouml.uml.diagram.use_case.UseCaseDiagramGraphModel', 'org.argouml.uml.ui.ActionUseCaseDiagram', 'org.argouml.moduleloader.ModuleLoader2', 'org.argouml.uml.diagram.sequence.SequenceDiagramGraphModel', 'org.argouml.uml.diagram.sequence.ui.FigClassifierRole', 'org.argouml.uml.diagram.sequence.ui.FigLifeLine', 'org.argouml.uml.diagram.sequence.ui.FigMessagePort', 'org.argouml.uml.diagram.sequence.ui.ModeCreateMessage', 'org.argouml.uml.diagram.sequence.ui.SequenceDiagramLayer', 'org.argouml.uml.diagram.sequence.ui.SequenceDiagramRenderer', 'org.argouml.application.helpers.ApplicationVersion', 'org.argouml.application.StartCritics', 'org.argouml.cognitive.AbstractCognitiveTranslator', 'org.argouml.cognitive.Agency', 'org.argouml.cognitive.checklist.CheckItem', 'org.argouml.cognitive.checklist.Checklist', 'org.argouml.cognitive.checklist.ChecklistStatus', 'org.argouml.cognitive.checklist.CheckManager', 'org.argouml.cognitive.checklist.ui.InitCheckListUI', 'org.argouml.cognitive.checklist.ui.TabChecklist', 'org.argouml.cognitive.checklist.ui.TableModelChecklist', 'org.argouml.cognitive.CompoundCritic', 'org.argouml.cognitive.ControlMech', 'org.argouml.cognitive.Critic', 'org.argouml.cognitive.critics.SnoozeOrder', 'org.argouml.cognitive.critics.ui.ActionOpenCritics', 'org.argouml.cognitive.critics.ui.CriticBrowserDialog', 'org.argouml.cognitive.critics.ui.TableCritics', 'org.argouml.cognitive.critics.ui.TableModelCritics', 'org.argouml.cognitive.critics.Wizard', 'org.argouml.cognitive.critics.WizardItem', 'org.argouml.cognitive.Decision', 'org.argouml.cognitive.DecisionModel', 'org.argouml.cognitive.Designer', 'org.argouml.cognitive.Goal', 'org.argouml.cognitive.GoalModel', 'org.argouml.cognitive.Highlightable', 'org.argouml.cognitive.ListSet', 'org.argouml.cognitive.Offender', 'org.argouml.cognitive.Poster', 'org.argouml.cognitive.ResolvedCritic', 'org.argouml.cognitive.StandardCM', 'org.argouml.cognitive.EnabledCM', 'org.argouml.cognitive.NotSnoozedCM', 'org.argouml.cognitive.DesignGoalsCM', 'org.argouml.cognitive.CurDecisionCM', 'org.argouml.cognitive.CompositeCM', 'org.argouml.cognitive.AndCM', 'org.argouml.cognitive.OrCM', 'org.argouml.cognitive.ToDoItem', 'org.argouml.cognitive.ToDoList', 'org.argouml.cognitive.ToDoListEvent', 'org.argouml.cognitive.ToDoListListener', 'org.argouml.cognitive.Translator', 'org.argouml.cognitive.ui.AbstractGoList', 'org.argouml.cognitive.ui.AbstractGoList2', 'org.argouml.cognitive.ui.ActionAutoCritique', 'org.argouml.cognitive.ui.ActionGoToCritique', 'org.argouml.cognitive.ui.ActionNewToDoItem', 'org.argouml.cognitive.ui.ActionOpenDecisions', 'org.argouml.cognitive.ui.ActionOpenGoals', 'org.argouml.cognitive.ui.ActionResolve', 'org.argouml.cognitive.ui.ActionSnooze', 'org.argouml.cognitive.ui.AddToDoItemDialog', 'org.argouml.cognitive.ui.DesignIssuesDialog', 'org.argouml.cognitive.ui.DismissToDoItemDialog', 'org.argouml.cognitive.ui.GoalsDialog', 'org.argouml.cognitive.ui.GoListToDecisionsToItems', 'org.argouml.cognitive.ui.GoListToGoalsToItems', 'org.argouml.cognitive.ui.GoListToOffenderToItem', 'org.argouml.cognitive.ui.GoListToPosterToItem', 'org.argouml.cognitive.ui.GoListToPriorityToItem', 'org.argouml.cognitive.ui.GoListToTypeToItem', 'org.argouml.cognitive.ui.InitCognitiveUI', 'org.argouml.cognitive.ui.KnowledgeTypeNode', 'org.argouml.cognitive.ui.PriorityNode', 'org.argouml.cognitive.ui.TabToDo', 'org.argouml.cognitive.ui.ToDoByDecision', 'org.argouml.cognitive.ui.ToDoByGoal', 'org.argouml.cognitive.ui.ToDoByOffender', 'org.argouml.cognitive.ui.ToDoByPoster', 'org.argouml.cognitive.ui.ToDoByPriority', 'org.argouml.cognitive.ui.ToDoByType', 'org.argouml.cognitive.ui.ToDoItemAction', 'org.argouml.cognitive.ui.ToDoPane', 'org.argouml.cognitive.ui.ToDoPerspective', 'org.argouml.cognitive.ui.ToDoTreeRenderer', 'org.argouml.cognitive.ui.WizDescription', 'org.argouml.cognitive.ui.WizStep', 'org.argouml.cognitive.ui.WizStepChoice', 'org.argouml.cognitive.ui.WizStepConfirm', 'org.argouml.cognitive.ui.WizStepCue', 'org.argouml.cognitive.ui.WizStepManyTextFields', 'org.argouml.cognitive.ui.WizStepTextField', 'org.argouml.cognitive.UnresolvableException', 'org.argouml.kernel.MemberList', 'org.argouml.kernel.ProjectImpl', 'org.argouml.kernel.ProjectManager', 'org.argouml.pattern.cognitive.critics.CrConsiderFacade', 'org.argouml.pattern.cognitive.critics.CrConsiderSingleton', 'org.argouml.pattern.cognitive.critics.CrSingletonViolatedMissingStaticAttr', 'org.argouml.pattern.cognitive.critics.CrSingletonViolatedOnlyPrivateConstructors', 'org.argouml.pattern.cognitive.critics.InitPatternCritics', 'org.argouml.persistence.AbstractFilePersister', 'org.argouml.persistence.OffenderXMLHelper', 'org.argouml.persistence.ResolvedCriticXMLHelper', 'org.argouml.persistence.ToDoItemXMLHelper', 'org.argouml.persistence.TodoListMemberFilePersister', 'org.argouml.persistence.TodoParser', 'org.argouml.persistence.TodoTokenTable', 'org.argouml.persistence.XmiFilePersister', 'org.argouml.profile.init.InitProfileSubsystem', 'org.argouml.profile.init.ProfileLoader', 'org.argouml.profile.internal.ocl.CrOCL', 'org.argouml.profile.internal.ProfileManagerImpl', 'org.argouml.profile.internal.ProfileMeta', 'org.argouml.profile.internal.ProfileUML', 'org.argouml.profile.internal.ui.ProfilePropPanelFactory', 'org.argouml.profile.internal.ui.PropPanelCritic', 'org.argouml.profile.Profile', 'org.argouml.profile.UserDefinedProfile', 'org.argouml.ui.Clarifier', 'org.argouml.ui.cmd.ActionNew', 'org.argouml.ui.cmd.ActionSelectAll', 'org.argouml.ui.cmd.ActionSelectInvert', 'org.argouml.ui.DisplayTextTree', 'org.argouml.ui.explorer.rules.GoCriticsToCritic', 'org.argouml.ui.explorer.rules.GoProfileToCritics', 'org.argouml.ui.ProjectBrowser', 'org.argouml.uml.cognitive.checklist.Init', 'org.argouml.uml.cognitive.checklist.UMLCheckItem', 'org.argouml.uml.cognitive.ChildGenFind', 'org.argouml.uml.cognitive.ChildGenSearch', 'org.argouml.uml.cognitive.critics.AbstractCrTooMany', 'org.argouml.uml.cognitive.critics.AbstractCrUnconventionalName', 'org.argouml.uml.cognitive.critics.ChildGenUML', 'org.argouml.uml.cognitive.critics.ClAttributeCompartment', 'org.argouml.uml.cognitive.critics.ClClassName', 'org.argouml.uml.cognitive.critics.ClOperationCompartment', 'org.argouml.uml.cognitive.critics.CrAlreadyRealizes', 'org.argouml.uml.cognitive.critics.CrAssocNameConflict', 'org.argouml.uml.cognitive.critics.CrAttrNameConflict', 'org.argouml.uml.cognitive.critics.CrCircularAssocClass', 'org.argouml.uml.cognitive.critics.CrCircularComposition', 'org.argouml.uml.cognitive.critics.CrCircularInheritance', 'org.argouml.uml.cognitive.critics.CrClassMustBeAbstract', 'org.argouml.uml.cognitive.critics.CrConflictingComposites', 'org.argouml.uml.cognitive.critics.CrConstructorNeeded', 'org.argouml.uml.cognitive.critics.CrCrossNamespaceAssoc', 'org.argouml.uml.cognitive.critics.CrDisambigClassName', 'org.argouml.uml.cognitive.critics.CrDisambigStateName', 'org.argouml.uml.cognitive.critics.CrDupParamName', 'org.argouml.uml.cognitive.critics.CrDupRoleNames', 'org.argouml.uml.cognitive.critics.CrEmptyPackage', 'org.argouml.uml.cognitive.critics.CrFinalSubclassed', 'org.argouml.uml.cognitive.critics.CrForkOutgoingTransition', 'org.argouml.uml.cognitive.critics.CrIllegalGeneralization', 'org.argouml.uml.cognitive.critics.CrIllegalName', 'org.argouml.uml.cognitive.critics.CrInterfaceAllPublic', 'org.argouml.uml.cognitive.critics.CrInterfaceOperOnly', 'org.argouml.uml.cognitive.critics.CrInvalidBranch', 'org.argouml.uml.cognitive.critics.CrInvalidFork', 'org.argouml.uml.cognitive.critics.CrInvalidForkTriggerOrGuard', 'org.argouml.uml.cognitive.critics.CrInvalidHistory', 'org.argouml.uml.cognitive.critics.CrInvalidInitial', 'org.argouml.uml.cognitive.critics.CrInvalidJoin', 'org.argouml.uml.cognitive.critics.CrInvalidJoinTriggerOrGuard', 'org.argouml.uml.cognitive.critics.CrInvalidPseudoStateTrigger', 'org.argouml.uml.cognitive.critics.CrInvalidSynch', 'org.argouml.uml.cognitive.critics.CrJoinIncomingTransition', 'org.argouml.uml.cognitive.critics.CrMergeClasses', 'org.argouml.uml.cognitive.critics.CrMissingAttrName', 'org.argouml.uml.cognitive.critics.CrMissingClassName', 'org.argouml.uml.cognitive.critics.CrMissingOperName', 'org.argouml.uml.cognitive.critics.CrMissingStateName', 'org.argouml.uml.cognitive.critics.CrMultiComposite', 'org.argouml.uml.cognitive.critics.CrMultipleAgg', 'org.argouml.uml.cognitive.critics.CrMultipleDeepHistoryStates', 'org.argouml.uml.cognitive.critics.CrMultipleInitialStates', 'org.argouml.uml.cognitive.critics.CrMultipleShallowHistoryStates', 'org.argouml.uml.cognitive.critics.CrNameConflict', 'org.argouml.uml.cognitive.critics.CrNameConflictAC', 'org.argouml.uml.cognitive.critics.CrNameConfusion', 'org.argouml.uml.cognitive.critics.CrNavFromInterface', 'org.argouml.uml.cognitive.critics.CrNoAssociations', 'org.argouml.uml.cognitive.critics.CrNodesOverlap', 'org.argouml.uml.cognitive.critics.CrNoGuard', 'org.argouml.uml.cognitive.critics.CrNoIncomingTransitions', 'org.argouml.uml.cognitive.critics.CrNoInitialState', 'org.argouml.uml.cognitive.critics.CrNoInstanceVariables', 'org.argouml.uml.cognitive.critics.CrNonAggDataType', 'org.argouml.uml.cognitive.critics.CrNoOperations', 'org.argouml.uml.cognitive.critics.CrNoOutgoingTransitions', 'org.argouml.uml.cognitive.critics.CrNoTransitions', 'org.argouml.uml.cognitive.critics.CrNoTriggerOrGuard', 'org.argouml.uml.cognitive.critics.CrNWayAgg', 'org.argouml.uml.cognitive.critics.CrOperNameConflict', 'org.argouml.uml.cognitive.critics.CrOppEndConflict', 'org.argouml.uml.cognitive.critics.CrOppEndVsAttr', 'org.argouml.uml.cognitive.critics.CrProfile', 'org.argouml.uml.cognitive.critics.CrReservedName', 'org.argouml.uml.cognitive.critics.CrSubclassReference', 'org.argouml.uml.cognitive.critics.CrTooManyAssoc', 'org.argouml.uml.cognitive.critics.CrTooManyAttr', 'org.argouml.uml.cognitive.critics.CrTooManyClasses', 'org.argouml.uml.cognitive.critics.CrTooManyOper', 'org.argouml.uml.cognitive.critics.CrTooManyStates', 'org.argouml.uml.cognitive.critics.CrTooManyTransitions', 'org.argouml.uml.cognitive.critics.CrUML', 'org.argouml.uml.cognitive.critics.CrUnconventionalAttrName', 'org.argouml.uml.cognitive.critics.CrUnconventionalClassName', 'org.argouml.uml.cognitive.critics.CrUnconventionalOperName', 'org.argouml.uml.cognitive.critics.CrUnconventionalPackName', 'org.argouml.uml.cognitive.critics.CrUnnavigableAssoc', 'org.argouml.uml.cognitive.critics.CrUselessAbstract', 'org.argouml.uml.cognitive.critics.ChildGenDerivedClasses', 'org.argouml.uml.cognitive.critics.CrUselessInterface', 'org.argouml.uml.cognitive.critics.CrUtilityViolated', 'org.argouml.uml.cognitive.critics.CrZeroLengthEdge', 'org.argouml.uml.cognitive.critics.InitCognitiveCritics', 'org.argouml.uml.cognitive.critics.ProfileCodeGeneration', 'org.argouml.uml.cognitive.critics.ProfileGoodPractices', 'org.argouml.uml.cognitive.critics.UMLWizard', 'org.argouml.uml.cognitive.critics.WizAddConstructor', 'org.argouml.uml.cognitive.critics.WizAddInstanceVariable', 'org.argouml.uml.cognitive.critics.WizAddOperation', 'org.argouml.uml.cognitive.critics.WizAssocComposite', 'org.argouml.uml.cognitive.critics.WizBreakCircularComp', 'org.argouml.uml.cognitive.critics.WizCueCards', 'org.argouml.uml.cognitive.critics.WizManyNames', 'org.argouml.uml.cognitive.critics.WizMEName', 'org.argouml.uml.cognitive.critics.WizNavigable', 'org.argouml.uml.cognitive.critics.WizOperName', 'org.argouml.uml.cognitive.critics.WizTooMany', 'org.argouml.uml.cognitive.ProjectMemberTodoList', 'org.argouml.uml.cognitive.UMLDecision', 'org.argouml.uml.cognitive.UMLToDoItem', 'org.argouml.uml.diagram.ui.FigEdgeModelElement', 'org.argouml.uml.diagram.ui.FigNodeModelElement', 'org.argouml.uml.reveng.ImportCommon', 'org.argouml.uml.ui.TabProps', 'org.argouml.uml.cognitive.critics.CrClassWithoutComponent', 'org.argouml.uml.cognitive.critics.CrCompInstanceWithoutNode', 'org.argouml.uml.cognitive.critics.CrComponentInstanceWithoutClassifier', 'org.argouml.uml.cognitive.critics.CrComponentWithoutNode', 'org.argouml.uml.cognitive.critics.CrInstanceWithoutClassifier', 'org.argouml.uml.cognitive.critics.CrInterfaceWithoutComponent', 'org.argouml.uml.cognitive.critics.CrNodeInsideElement', 'org.argouml.uml.cognitive.critics.CrNodeInstanceInsideElement', 'org.argouml.uml.cognitive.critics.CrNodeInstanceWithoutClassifier', 'org.argouml.uml.cognitive.critics.CrObjectWithoutClassifier', 'org.argouml.uml.cognitive.critics.CrObjectWithoutComponent', 'org.argouml.uml.cognitive.critics.CrWrongDepEnds', 'org.argouml.uml.cognitive.critics.CrWrongLinkEnds', 'org.argouml.notation.providers.uml.ObjectFlowStateStateNotationUml', 'org.argouml.notation.providers.uml.ObjectFlowStateTypeNotationUml', 'org.argouml.uml.diagram.activity.ActivityDiagramGraphModel', 'org.argouml.uml.diagram.activity.layout.ActivityDiagramLayouter', 'org.argouml.uml.diagram.activity.ui.ActionCreatePartition', 'org.argouml.uml.diagram.activity.ui.ActivityDiagramPropPanelFactory', 'org.argouml.uml.diagram.activity.ui.ActivityDiagramRenderer', 'org.argouml.uml.diagram.activity.ui.FigActionState', 'org.argouml.uml.diagram.activity.ui.FigCallState', 'org.argouml.uml.diagram.activity.ui.FigObjectFlowState', 'org.argouml.uml.diagram.activity.ui.FigPartition', 'org.argouml.uml.diagram.activity.ui.FigPool', 'org.argouml.uml.diagram.activity.ui.FigSubactivityState', 'org.argouml.uml.diagram.activity.ui.InitActivityDiagram', 'org.argouml.uml.diagram.activity.ui.ModePlacePartition', 'org.argouml.uml.diagram.activity.ui.PropPanelUMLActivityDiagram', 'org.argouml.uml.diagram.activity.ui.SelectionActionState', 'org.argouml.uml.diagram.activity.ui.SelectionCallState', 'org.argouml.uml.diagram.ArgoDiagramImpl', 'org.argouml.uml.ui.ActionActivityDiagram', 'org.argouml.uml.ui.ActionLayout', 'org.argouml.uml.ui.behavior.activity_graphs.ActionNewClassifierInState', 'org.argouml.uml.ui.behavior.activity_graphs.ActionSetSynch', 'org.argouml.uml.ui.behavior.activity_graphs.ActionAddCISState', 'org.argouml.uml.ui.behavior.activity_graphs.ActionRemoveCISState', 'org.argouml.uml.ui.behavior.activity_graphs.ActionAddOFSState', 'org.argouml.uml.ui.behavior.activity_graphs.ActionRemoveOFSState', 'org.argouml.uml.ui.behavior.activity_graphs.ActionAddOFSParameter', 'org.argouml.uml.ui.behavior.activity_graphs.ActionNewOFSParameter', 'org.argouml.uml.ui.behavior.activity_graphs.ActionRemoveOFSParameter', 'org.argouml.uml.ui.behavior.activity_graphs.ActionAddPartitionContent', 'org.argouml.notation.providers.uml.ExtensionPointNotationUml', 'org.argouml.uml.diagram.static_structure.ui.UMLClassDiagram', 'org.argouml.uml.diagram.ui.ActionAddExtensionPoint', 'org.argouml.uml.diagram.ui.ActionCompartmentDisplay', 'org.argouml.uml.diagram.use_case.ui.FigActor', 'org.argouml.uml.diagram.use_case.ui.FigExtend', 'org.argouml.uml.diagram.use_case.ui.FigInclude', 'org.argouml.uml.diagram.use_case.ui.FigUseCase', 'org.argouml.uml.diagram.use_case.ui.InitUseCaseDiagram', 'org.argouml.uml.diagram.use_case.ui.PropPanelUMLUseCaseDiagram', 'org.argouml.uml.diagram.use_case.ui.SelectionActor', 'org.argouml.uml.diagram.use_case.ui.SelectionUseCase', 'org.argouml.uml.diagram.use_case.ui.StylePanelFigUseCase', 'org.argouml.uml.diagram.use_case.ui.UseCaseDiagramPropPanelFactory', 'org.argouml.uml.ui.behavior.use_cases.ActionAddExtendExtensionPoint', 'org.argouml.uml.ui.behavior.use_cases.ActionNewActor', 'org.argouml.uml.ui.behavior.use_cases.ActionNewExtendExtensionPoint', 'org.argouml.uml.ui.behavior.use_cases.ActionNewExtensionPoint', 'org.argouml.uml.ui.behavior.use_cases.ActionNewUseCase', 'org.argouml.uml.ui.behavior.use_cases.ActionNewUseCaseExtensionPoint', 'org.argouml.uml.ui.behavior.use_cases.PropPanelActor', 'org.argouml.uml.ui.behavior.use_cases.PropPanelExtend', 'org.argouml.uml.ui.behavior.use_cases.PropPanelExtensionPoint', 'org.argouml.uml.ui.behavior.use_cases.PropPanelInclude', 'org.argouml.uml.ui.behavior.use_cases.PropPanelUseCase', 'org.argouml.uml.ui.behavior.use_cases.UMLExtendBaseListModel', 'org.argouml.uml.ui.behavior.use_cases.UMLExtendExtensionListModel', 'org.argouml.uml.ui.behavior.use_cases.UMLExtendExtensionPointListModel', 'org.argouml.uml.ui.behavior.use_cases.UMLExtensionPointExtendListModel', 'org.argouml.uml.ui.behavior.use_cases.UMLExtensionPointLocationDocument', 'org.argouml.uml.ui.behavior.use_cases.UMLExtensionPointUseCaseListModel', 'org.argouml.uml.ui.behavior.use_cases.UMLIncludeAdditionListModel', 'org.argouml.uml.ui.behavior.use_cases.UMLIncludeBaseListModel', 'org.argouml.uml.ui.behavior.use_cases.UMLIncludeListModel', 'org.argouml.uml.ui.behavior.use_cases.UMLUseCaseExtendListModel', 'org.argouml.uml.ui.behavior.use_cases.UMLUseCaseExtensionPointListModel', 'org.argouml.uml.ui.behavior.use_cases.UMLUseCaseIncludeListModel', 'org.argouml.uml.ui.UMLConditionExpressionModel', 'org.argouml.ui.explorer.rules.GoClassifierToSequenceDiagram', 'org.argouml.ui.explorer.rules.GoOperationToSequenceDiagram', 'org.argouml.uml.diagram.sequence.MessageNode', 'org.argouml.uml.diagram.sequence.ui.ActionAddClassifierRole', 'org.argouml.uml.diagram.sequence.ui.FigActivation', 'org.argouml.uml.diagram.sequence.ui.FigBirthActivation', 'org.argouml.uml.diagram.sequence.ui.FigCallActionMessage', 'org.argouml.uml.diagram.sequence.ui.FigCreateActionMessage', 'org.argouml.uml.diagram.sequence.ui.FigDestroyActionMessage', 'org.argouml.uml.diagram.sequence.ui.FigHead', 'org.argouml.uml.diagram.sequence.ui.FigMessage', 'org.argouml.uml.diagram.sequence.ui.FigReturnActionMessage', 'org.argouml.uml.diagram.sequence.ui.InitSequenceDiagram', 'org.argouml.uml.diagram.sequence.ui.ModeChangeHeight', 'org.argouml.uml.diagram.sequence.ui.ModeContract', 'org.argouml.uml.diagram.sequence.ui.ModeExpand', 'org.argouml.uml.diagram.sequence.ui.PropPanelUMLSequenceDiagram', 'org.argouml.uml.diagram.sequence.ui.SelectionClassifierRole', 'org.argouml.uml.diagram.sequence.ui.SelectionMessage', 'org.argouml.uml.diagram.sequence.ui.SequenceDiagramPropPanelFactory', 'org.argouml.uml.diagram.sequence.ui.UMLSequenceDiagram', 'org.argouml.uml.diagram.ui.ActionSetAddMessageMode', 'org.argouml.uml.ui.ActionSequenceDiagram', 'org.argouml.application.api.AbstractArgoJPanel', 'org.argouml.application.api.Argo', 'org.argouml.application.events.ArgoEventPump', 'org.argouml.application.helpers.ResourceLoaderWrapper', 'org.argouml.configuration.ConfigurationFactory', 'org.argouml.configuration.ConfigurationHandler', 'org.argouml.configuration.ConfigurationProperties', 'org.argouml.gefext.DeferredBufferedImage', 'org.argouml.i18n.Translator', 'org.argouml.kernel.DefaultUndoManager', 'org.argouml.kernel.ProfileConfiguration', 'org.argouml.language.ui.LanguageComboBox', 'org.argouml.moduleloader.ModuleStatus', 'org.argouml.notation.Notation', 'org.argouml.notation.NotationNameImpl', 'org.argouml.notation.NotationProvider', 'org.argouml.notation.providers.java.OperationNotationJava', 'org.argouml.notation.providers.uml.AttributeNotationUml', 'org.argouml.notation.providers.uml.MessageNotationUml', 'org.argouml.notation.ui.NotationComboBox', 'org.argouml.ocl.ArgoFacade', 'org.argouml.ocl.ArgoAny', 'org.argouml.persistence.ArgoParser', 'org.argouml.persistence.DiagramMemberFilePersister', 'org.argouml.persistence.OldZargoFilePersister', 'org.argouml.persistence.PGMLStackParser', 'org.argouml.persistence.PrivateHandler', 'org.argouml.persistence.ProfileConfigurationFilePersister', 'org.argouml.persistence.ProfileConfigurationParser', 'org.argouml.persistence.SAXParserBase', 'org.argouml.persistence.UmlFilePersister', 'org.argouml.persistence.XmlInputStream', 'org.argouml.persistence.XMLTokenTableBase', 'org.argouml.persistence.ZargoFilePersister', 'org.argouml.persistence.ZipFilePersister', 'org.argouml.profile.FileModelLoader', 'org.argouml.profile.internal.ocl.ComputeDesignMaterials', 'org.argouml.profile.internal.ocl.ContextApplicable', 'org.argouml.profile.internal.ocl.DefaultOclEvaluator', 'org.argouml.profile.internal.ocl.EvaluateExpression', 'org.argouml.profile.internal.ocl.uml14.ModelAccessModelInterpreter', 'org.argouml.profile.internal.ocl.uml14.OclAPIModelInterpreter', 'org.argouml.profile.internal.ocl.uml14.Uml14ModelInterpreter', 'org.argouml.profile.ReaderModelLoader', 'org.argouml.profile.ResourceModelLoader', 'org.argouml.profile.StreamModelLoader', 'org.argouml.profile.ZipModelLoader', 'org.argouml.ui.ActionCreateEdgeModelElement', 'org.argouml.ui.DetailsPane', 'org.argouml.ui.explorer.ActionExportProfileXMI', 'org.argouml.ui.explorer.DnDExplorerTree', 'org.argouml.ui.explorer.ArgoDropTargetListener', 'org.argouml.ui.explorer.ExplorerEventAdaptor', 'org.argouml.ui.explorer.ActionCreateAssociation', 'org.argouml.ui.explorer.ActionCreateAssociationRole', 'org.argouml.ui.explorer.ExplorerTreeModel', 'org.argouml.ui.explorer.PerspectiveConfigurator', 'org.argouml.ui.HelpBox', 'org.argouml.ui.LoadSwingWorker', 'org.argouml.ui.LookAndFeelMgr', 'org.argouml.ui.MultiEditorPane', 'org.argouml.ui.StylePanel', 'org.argouml.ui.StylePanelFig', 'org.argouml.ui.SwingWorker', 'org.argouml.ui.TabResults', 'org.argouml.ui.TabText', 'org.argouml.ui.targetmanager.TargetManager', 'org.argouml.ui.targetmanager.Remover', 'org.argouml.ui.TreeModelComposite', 'org.argouml.uml.diagram.DiagramAppearance', 'org.argouml.uml.diagram.DiagramUndoManager', 'org.argouml.uml.diagram.DiagramUtils', 'org.argouml.uml.diagram.static_structure.ClassDiagramGraphModel', 'org.argouml.uml.diagram.static_structure.layout.ClassdiagramInheritanceEdge', 'org.argouml.uml.diagram.static_structure.layout.ClassdiagramLayouter', 'org.argouml.uml.diagram.static_structure.layout.NodeRow', 'org.argouml.uml.diagram.static_structure.layout.ClassdiagramModelElementFactory', 'org.argouml.uml.diagram.static_structure.ui.ClassDiagramRenderer', 'org.argouml.uml.diagram.static_structure.ui.FigClassifierBoxWithAttributes', 'org.argouml.uml.diagram.static_structure.ui.FigComment', 'org.argouml.uml.diagram.static_structure.ui.FigDataType', 'org.argouml.uml.diagram.static_structure.ui.FigEdgeNote', 'org.argouml.uml.diagram.static_structure.ui.FigInterface', 'org.argouml.uml.diagram.static_structure.ui.FigPackage', 'org.argouml.uml.diagram.static_structure.ui.PackagePortFigRect', 'org.argouml.uml.diagram.static_structure.ui.FigPackageFigText', 'org.argouml.uml.diagram.ui.ActionSetMode', 'org.argouml.uml.diagram.ui.ArgoFigGroup', 'org.argouml.uml.diagram.ui.CompartmentFigText', 'org.argouml.uml.diagram.ui.DiagramNameDocument', 'org.argouml.uml.diagram.ui.DnDJGraph', 'org.argouml.uml.diagram.ui.FigAssociation', 'org.argouml.uml.diagram.ui.FigMultiplicity', 'org.argouml.uml.diagram.ui.FigOrdering', 'org.argouml.uml.diagram.ui.FigRole', 'org.argouml.uml.diagram.ui.FigAssociationEndAnnotation', 'org.argouml.uml.diagram.ui.FigEdgeAssociationClass', 'org.argouml.uml.diagram.ui.FigEditableCompartment', 'org.argouml.uml.diagram.ui.FigSingleLineText', 'org.argouml.uml.diagram.ui.FigStereotypesGroup', 'org.argouml.uml.diagram.ui.ModeAddToDiagram', 'org.argouml.uml.diagram.ui.AddToDiagramMemento', 'org.argouml.uml.diagram.ui.ModeCreateAssociationClass', 'org.argouml.uml.diagram.ui.ModeCreateGraphEdge', 'org.argouml.uml.diagram.ui.PathItemPlacement', 'org.argouml.uml.diagram.ui.SelectionNodeClarifiers2', 'org.argouml.uml.diagram.ui.TabDiagram', 'org.argouml.uml.diagram.ui.ArgoEditor', 'org.argouml.uml.diagram.ui.UMLDiagram', 'org.argouml.uml.diagram.UMLMutableGraphSupport', 'org.argouml.uml.generator.AbstractSection', 'org.argouml.uml.generator.GeneratorManager', 'org.argouml.uml.generator.TempFileUtils', 'org.argouml.uml.generator.ui.ClassGenerationDialog', 'org.argouml.uml.reveng.DiagramInterface', 'org.argouml.uml.reveng.ImportClassLoader', 'org.argouml.uml.reveng.ImporterManager', 'org.argouml.uml.ui.ActionAddDiagram', 'org.argouml.uml.ui.ActionClassDiagram', 'org.argouml.uml.ui.ActionImportFromSources', 'org.argouml.uml.ui.ActionSaveAllGraphics', 'org.argouml.uml.ui.ActionSaveGraphics', 'org.argouml.uml.ui.ActionSaveProject', 'org.argouml.uml.ui.ActionSaveProjectAs', 'org.argouml.uml.ui.foundation.core.PropPanelMethod', 'org.argouml.uml.ui.foundation.core.UMLMethodProcedureExpressionModel', 'org.argouml.uml.ui.foundation.core.UMLModelElementNamespaceComboBoxModel', 'org.argouml.uml.ui.foundation.extension_mechanisms.ActionSetTagDefinitionOwner', 'org.argouml.uml.ui.foundation.extension_mechanisms.ActionSetTagDefinitionType', 'org.argouml.uml.ui.foundation.extension_mechanisms.PropPanelTagDefinition', 'org.argouml.uml.ui.foundation.extension_mechanisms.UMLTagDefinitionNamespaceComboBoxModel', 'org.argouml.uml.ui.foundation.extension_mechanisms.ActionSetTagDefinitionNamespace', 'org.argouml.uml.ui.foundation.extension_mechanisms.UMLTagDefinitionComboBoxModel', 'org.argouml.uml.ui.PropPanel', 'org.argouml.uml.ui.SaveGraphicsManager', 'org.argouml.uml.ui.SaveScaledEPSAction', 'org.argouml.uml.ui.SavePNGAction2', 'org.argouml.uml.ui.SaveGIFAction2', 'org.argouml.uml.ui.SourcePathTableModel', 'org.argouml.uml.ui.TabConstraints', 'org.argouml.uml.ui.CR', 'org.argouml.uml.ui.TabSrc', 'org.argouml.uml.ui.TabStyle', 'org.argouml.uml.ui.TabTaggedValues', 'org.argouml.uml.ui.ActionRemoveTaggedValue', 'org.argouml.uml.ui.TabTaggedValuesModel', 'org.argouml.uml.ui.UMLComboBox2', 'org.argouml.uml.ui.UMLComboBoxModel2', 'org.argouml.uml.ui.UMLExpressionBodyField', 'org.argouml.uml.ui.UMLList2', 'org.argouml.uml.ui.UMLModelElementListModel2', 'org.argouml.uml.ui.UMLMutableLinkedList', 'org.argouml.uml.ui.UMLPlainTextDocument', 'org.argouml.uml.ui.UMLRecurrenceExpressionModel', 'org.argouml.uml.util.namespace.StringNamespace', 'org.argouml.util.ArgoFrame', 'org.argouml.util.FileFilters', 'org.argouml.util.ItemUID', 'org.argouml.util.logging.AwtExceptionHandler', 'org.argouml.util.osdep.OSXAdapter', 'org.argouml.util.osdep.StartBrowser', 'org.argouml.util.ToolBarUtility', 'org.argouml.util.Tools', 'org.argouml.uml.cognitive.critics.CrSeqInstanceWithoutClassifier', 'org.argouml.uml.diagram.deployment.DeploymentDiagramGraphModel', 'org.argouml.uml.diagram.deployment.ui.DeploymentDiagramRenderer', 'org.argouml.uml.ui.ActionDeploymentDiagram', 'org.argouml.uml.diagram.deployment.ui.AbstractFigComponent', 'org.argouml.uml.diagram.deployment.ui.AbstractFigNode', 'org.argouml.uml.diagram.deployment.ui.CubePortFigRect', 'org.argouml.uml.diagram.deployment.ui.DeploymentDiagramPropPanelFactory', 'org.argouml.uml.diagram.deployment.ui.FigComponent', 'org.argouml.uml.diagram.deployment.ui.FigComponentInstance', 'org.argouml.uml.diagram.deployment.ui.FigMNode', 'org.argouml.uml.diagram.deployment.ui.FigNodeInstance', 'org.argouml.uml.diagram.deployment.ui.FigObject', 'org.argouml.uml.diagram.deployment.ui.InitDeploymentDiagram', 'org.argouml.uml.diagram.deployment.ui.PropPanelUMLDeploymentDiagram', 'org.argouml.uml.diagram.deployment.ui.SelectionComponent', 'org.argouml.uml.diagram.deployment.ui.SelectionComponentInstance', 'org.argouml.uml.diagram.deployment.ui.SelectionNode', 'org.argouml.uml.diagram.deployment.ui.SelectionNodeInstance', 'org.argouml.uml.diagram.deployment.ui.SelectionObject', 'org.argouml.uml.diagram.static_structure.ui.SelectionClass', 'org.argouml.uml.diagram.static_structure.ui.SelectionGeneralizableElement', 'org.argouml.uml.diagram.static_structure.ui.SelectionStereotype']
        // this.sat4jTraces = ['org.sat4j.specs.SearchListener', 'org.sat4j.specs.FakeConstr', 'org.sat4j.specs.IConstr', 'org.sat4j.specs.ISolver', 'org.sat4j.specs.UnitClauseProvider', 'org.sat4j.specs.SearchListenerAdapter', 'org.sat4j.specs.Constr', 'org.sat4j.tools.Minimal4CardinalityModel', 'org.sat4j.tools.GroupClauseSelectorSolver', 'org.sat4j.tools.FullClauseSelectorSolver', 'org.sat4j.tools.NegationDecorator', 'org.sat4j.tools.CheckMUSSolutionListener', 'org.sat4j.tools.ModelIterator', 'org.sat4j.tools.LexicoDecorator', 'org.sat4j.tools.GateTranslator', 'org.sat4j.tools.TextOutputTracing', 'org.sat4j.tools.DecisionLevelTracing', 'org.sat4j.tools.StatisticsSolver', 'org.sat4j.tools.SearchMinOneListener', 'org.sat4j.tools.Minimal4InclusionModel', 'org.sat4j.tools.DimacsOutputSolver', 'org.sat4j.tools.SingleSolutionDetector', 'org.sat4j.tools.OptToSatAdapter', 'org.sat4j.tools.LearnedTracing', 'org.sat4j.tools.ConflictDepthTracing', 'org.sat4j.tools.LearnedClauseSizeTracing', 'org.sat4j.tools.SolutionFoundListener', 'org.sat4j.tools.LBDTracing', 'org.sat4j.tools.DimacsStringSolver', 'org.sat4j.tools.ManyCore', 'org.sat4j.tools.DotSearchTracing', 'org.sat4j.tools.SearchEnumeratorListener', 'org.sat4j.tools.SpeedTracing', 'org.sat4j.tools.HeuristicsTracing', 'org.sat4j.tools.MultiTracing', 'org.sat4j.tools.ConflictLevelTracing', 'org.sat4j.tools.DecisionTracing', 'org.sat4j.tools.ClausalCardinalitiesDecorator', 'org.sat4j.tools.LearnedClausesSizeTracing', 'org.sat4j.tools.RupSearchListener', 'org.sat4j.tools.SolutionCounter', 'org.sat4j.minisat.restarts.MiniSATRestarts', 'org.sat4j.minisat.restarts.NoRestarts', 'org.sat4j.minisat.restarts.LubyRestarts', 'org.sat4j.minisat.restarts.EMARestarts', 'org.sat4j.minisat.restarts.ArminRestarts', 'org.sat4j.minisat.restarts.FixedPeriodRestarts', 'org.sat4j.minisat.restarts.Glucose21Restarts', 'org.sat4j.minisat.constraints.card.MinWatchCard', 'org.sat4j.minisat.constraints.card.MaxWatchCard', 'org.sat4j.minisat.constraints.card.AtLeast', 'org.sat4j.minisat.constraints.xor.Xor', 'org.sat4j.minisat.constraints.cnf.UnitClauses', 'org.sat4j.minisat.constraints.cnf.CBClause', 'org.sat4j.minisat.constraints.cnf.HTClause', 'org.sat4j.minisat.constraints.cnf.UnitClause', 'org.sat4j.minisat.constraints.cnf.OriginalHTClause', 'org.sat4j.minisat.constraints.cnf.LearntWLClause', 'org.sat4j.minisat.constraints.cnf.BinaryClauses', 'org.sat4j.minisat.constraints.cnf.WLClause', 'org.sat4j.minisat.constraints.cnf.OriginalWLClause', 'org.sat4j.minisat.constraints.cnf.LearntBinaryClause', 'org.sat4j.minisat.constraints.cnf.LearntHTClause', 'org.sat4j.minisat.constraints.cnf.OriginalBinaryClause', 'org.sat4j.minisat.constraints.cnf.BinaryClause', 'org.sat4j.minisat.orders.SubsetVarOrder', 'org.sat4j.minisat.orders.PositiveLiteralSelectionStrategy', 'org.sat4j.minisat.orders.RandomLiteralSelectionStrategy', 'org.sat4j.minisat.orders.UserFixedPhaseSelectionStrategy', 'org.sat4j.minisat.orders.OrientedOrder', 'org.sat4j.minisat.orders.PureOrder', 'org.sat4j.minisat.orders.NaturalStaticOrder', 'org.sat4j.minisat.orders.VarOrderHeap', 'org.sat4j.minisat.orders.RSATPhaseSelectionStrategy', 'org.sat4j.minisat.orders.LevelBasedVarOrderHeap', 'org.sat4j.minisat.orders.PhaseCachingAutoEraseStrategy', 'org.sat4j.minisat.orders.NegativeLiteralSelectionStrategy', 'org.sat4j.minisat.orders.RandomWalkDecorator', 'org.sat4j.minisat.orders.PhaseInLastLearnedClauseSelectionStrategy', 'org.sat4j.minisat.orders.TabuListDecorator', 'org.sat4j.minisat.orders.RSATLastLearnedClausesPhaseSelectionStrategy', 'org.sat4j.minisat.core.ISimplifier', 'org.sat4j.minisat.core.Solver', 'org.sat4j.minisat.core.SizeLCDS', 'org.sat4j.minisat.core.RestartStrategy', 'org.sat4j.minisat.core.ActivityLCDS', 'org.sat4j.minisat.core.AgeLCDS', 'org.sat4j.minisat.core.IPhaseSelectionStrategy', 'org.sat4j.minisat.core.IOrder', 'org.sat4j.minisat.core.Glucose2LCDS', 'org.sat4j.minisat.core.LearnedConstraintsDeletionStrategy', 'org.sat4j.minisat.core.LearningStrategy', 'org.sat4j.minisat.core.GlucoseLCDS', 'org.sat4j.minisat.learning.NoLearningButHeuristics', 'org.sat4j.minisat.learning.PercentLengthLearning', 'org.sat4j.minisat.learning.ActiveLearning', 'org.sat4j.minisat.learning.FixedLengthLearning', 'org.sat4j.minisat.learning.NoLearningNoHeuristics', 'org.sat4j.minisat.learning.MiniSATLearning', 'org.sat4j.minisat.learning.ClauseOnlyLearning', 'org.sat4j.reader.DimacsReader', 'org.sat4j.reader.AAGReader', 'org.sat4j.reader.AIGReader', 'org.sat4j.reader.Reader', 'org.sat4j.reader.GroupedCNFReader', 'org.sat4j.reader.InstanceReader', 'org.sat4j.reader.LecteurDimacs', 'org.sat4j.reader.JSONReader', 'org.sat4j.opt.MaxSatDecorator', 'org.sat4j.opt.MinOneDecorator', 'org.sat4j.OptimizationMode', 'org.sat4j.DecisionMode', 'org.sat4j.core.ConstrGroup']

        //	UPDATE
        this.node = this.node.data(this.graph.nodes, function (d) {
            return d.name;
        });
        //	EXIT
        this.node.exit().remove();
        //	ENTER
        var newNode = this.node.enter().append("circle")
            .attr("class", "node")
            .style("stroke-dasharray", function (d) {
                return d.types.includes("ABSTRACT") ? "3,3" : "3,0"
            })
            // .style("stroke", (d) => this.sat4jTraces.includes(d.name) ? "blue" : "black")
            .style("stroke", "black")
            .style("stroke-width", function (d) {
                return d.types.includes("ABSTRACT") ? d.classVariants + 1 : d.classVariants;
            })
            .attr("r", function (d) {
                return d.radius
            })
            .attr("fill", (d) => {
                let nodeColor = d.types.includes("INTERFACE") ? d3.rgb(0, 0, 0) : d3.rgb(this.getNodeColor(d.name, d.constructorVariants));
                if (this.onlyHotspots) {
                    return d.types.includes("HOTSPOT") ? nodeColor : d3.rgb(220, 220, 220);
                } else {
                    return nodeColor;
                }
            })
            .attr("name", function (d) {
                return d.name
            });

        newNode.append("title").text(function (d) {
            return "types: " + d.types + "\n" + "name: " + d.name;
        });

        //	ENTER + UPDATE
        this.node = this.node.merge(newNode);

        //	UPDATE
        this.link = this.link.data(this.graph.links, function (d) {
            return d.name;
        });
        //	EXIT
        this.link.exit().remove();
        //	ENTER
        var newLink = this.link.enter().append("line")
            .attr("stroke-width", 1)
            .attr("class", "link")
            .attr("source", d => d.source)
            .attr("target", d => d.target)
            .attr('marker-start', "url(#arrowhead)")
            .style("pointer-events", "none");

        newLink.append("title")
            .text(function (d) {
                return "source: " + d.source + "\n" + "target: " + d.target;
            });
        //	ENTER + UPDATE
        this.link = this.link.merge(newLink);

        //  UPDATE
        this.label = this.label.data(this.graph.nodes, function (d) {
            return d.name;
        });
        //	EXIT
        this.label.exit().remove();
        //  ENTER
        var newLabel = this.label.enter().append("text")
            .attr("dx", -5)
            .attr("dy", ".35em")
            .attr("name", d => d.name)
            .attr("fill", (d) => {
                var nodeColor = d.types.includes("INTERFACE") ? d3.rgb(0, 0, 0) : d3.rgb(this.getNodeColor(d.name, d.constructorVariants));
                return contrastColor(nodeColor);
            })
            .text(function (d) {
                return ["STRATEGY", "FACTORY", "TEMPLATE", "DECORATOR"].filter(p => d.types.includes(p)).map(p => p[0]).join(", ");
            });

        //	ENTER + UPDATE
        this.label = this.label.merge(newLabel);

        d3.selectAll("circle.node").on("contextmenu", async (node) => {
            d3.event.preventDefault();
            await this.filter.addFilterAndRefresh(d3.select(node).node().name);
        });

        this.addAdvancedBehaviour(newNode, this.width, this.height);
    }

    addAdvancedBehaviour(newNode, width, height) {
        newNode.call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        );

        //	force simulation initialization
        var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().distance(100)
                .id(function (d) {
                    return d.name;
                }))
            .force("charge", d3.forceManyBody()
                .strength(function (d) {
                    return -50;
                }))
            .force("center", d3.forceCenter(width / 2, height / 2));


        //	update simulation nodes, links, and alpha
        simulation
            .nodes(this.graph.nodes)
            //	tick event handler with bounded box
            .on("tick", () => {
                this.node
                    // .attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
                    // .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });
                    .attr("cx", function (d) {
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        return d.y;
                    });

                this.link
                    .attr("x1", function (d) {
                        return d.source.x;
                    })
                    .attr("y1", function (d) {
                        return d.source.y;
                    })
                    .attr("x2", function (d) {
                        return d.target.x;
                    })
                    .attr("y2", function (d) {
                        return d.target.y;
                    });

                this.label
                    .attr("x", function (d) {
                        return d.x;
                    })
                    .attr("y", function (d) {
                        return d.y;
                    });
            });

        simulation.force("link")
            .links(this.graph.links);

        simulation.alpha(1).alphaTarget(0).restart();

        //add zoom capabilities
        var zoom_handler = d3.zoom()
            .on("zoom", () => this.g.attr("transform", d3.event.transform));

        zoom_handler(this.svg);

        //	drag event handlers
        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
    }

    getNodeColor(nodeName, valueOnScale){
        var upperRangeColor = this.packageColorer.getColorForName(nodeName);
        return this.color
            .range(["#FFFFFF", upperRangeColor])
            .interpolate(d3.interpolateRgb)(valueOnScale);
    }

    setButtonsClickActions(){
        $(document).on('click', ".list-group-item", async e => {
            e.preventDefault();
            $('.active').removeClass('active');
        });

        $(document).on('click', "#filter-isolated", async e => {
            e.preventDefault();
            const previouslyFiltered = sessionStorage.getItem("filteredIsolated") === "true";
            sessionStorage.setItem("filteredIsolated", previouslyFiltered ? "false" : "true");
            $("#filter-isolated").text(previouslyFiltered ? "Unfilter isolated nodes" : "Filter isolated nodes");
            await this.displayGraph();
        });

        $(document).on('click', "#filter-variants-button", async e => {
            e.preventDefault();
            const previouslyFiltered = sessionStorage.getItem("filteredVariants") === "true";
            sessionStorage.setItem("filteredVariants", previouslyFiltered ? "false" : "true");
            $("#filter-variants-button").text(previouslyFiltered ? "Hide variants" : "Show variants");
            await this.displayGraph();
        });

        $(document).on('click', "#hotspots-only-button", async e => {
            e.preventDefault();
            const previouslyFiltered = sessionStorage.getItem("onlyHotspots") === "true";
            sessionStorage.setItem("onlyHotspots", previouslyFiltered ? "false" : "true");
            $("#hotspots-only-button").text(previouslyFiltered ? "Show hotspots only" : "Show all nodes");
            await this.displayGraph();
        });

        $('#hide-info-button').click(function () {
            $(this).text(function (i, old) {
                return old === 'Show project information' ? 'Hide project information' : 'Show project information';
            });
        });

        $('#hide-legend-button').click(function () {
            $(this).text(function (i, old) {
                return old === 'Hide legend' ? 'Show legend' : 'Hide legend';
            });
        });
    }

}

function contrastColor(color) {
    var d = 0;

    // Counting the perceptive luminance - human eye favors green color...
    const luminance = (0.299 * color.r + 0.587 * color.g + 0.114 * color.b) / 255;

    if (luminance > 0.5)
        d = 0; // bright colors - black font
    else
        d = 255; // dark colors - white font

    return d3.rgb(d, d, d);
}

export { Graph };