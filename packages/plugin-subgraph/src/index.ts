import { Plugin } from "@elizaos/core";
import { queryActiveAccountsAction, querySubgraphAction, queryTokensInfoAction } from "./actions/querySubgraph";

export const SubgraphPlugin: Plugin = {
    name: "Subgraph",
    description: "Subgraph plugin for Eliza",
    actions: [querySubgraphAction, queryTokensInfoAction, queryActiveAccountsAction],
    // evaluators analyze the situations and actions taken by the agent. they run after each agent action
    // allowing the agent to reflect on what happened and potentially trigger additional actions or modifications
    evaluators: [],
    // providers supply information and state to the agent's context, help agent access necessary data
    providers: [],
};
export default SubgraphPlugin;