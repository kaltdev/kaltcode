import type { KnowledgeGraph } from "../knowledgeGraph.js";

export function emptyKnowledgeGraph(): KnowledgeGraph {
    return {
        entities: {},
        relations: [],
        summaries: [],
        rules: [],
        lastUpdateTime: Date.now(),
    };
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return !!value && typeof value === "object" && !Array.isArray(value);
}

export function parseKnowledgeGraph(value: unknown): KnowledgeGraph | null {
    if (!isRecord(value)) return null;

    const entities = isRecord(value.entities) ? value.entities : {};
    const relations = Array.isArray(value.relations) ? value.relations : [];
    const summaries = Array.isArray(value.summaries) ? value.summaries : [];
    const rules = Array.isArray(value.rules) ? value.rules : [];
    const lastUpdateTime =
        typeof value.lastUpdateTime === "number"
            ? value.lastUpdateTime
            : Date.now();

    return {
        entities: entities as KnowledgeGraph["entities"],
        relations: relations as KnowledgeGraph["relations"],
        summaries: summaries as KnowledgeGraph["summaries"],
        rules: rules.filter((rule): rule is string => typeof rule === "string"),
        lastUpdateTime,
    };
}

