import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { join } from "path";
import type { KnowledgeGraph } from "../knowledgeGraph.js";
import { parseKnowledgeGraph } from "./knowledgeGraphStorage.js";

export class JSONProvider {
    private readonly filePath: string;

    constructor(private readonly projectDir: string) {
        this.filePath = join(projectDir, "knowledge_graph.json");
    }

    loadGraph(): KnowledgeGraph | null {
        if (!existsSync(this.filePath)) return null;

        try {
            return parseKnowledgeGraph(
                JSON.parse(readFileSync(this.filePath, "utf8")),
            );
        } catch {
            return null;
        }
    }

    saveGraph(graph: KnowledgeGraph): void {
        mkdirSync(this.projectDir, { recursive: true });
        writeFileSync(this.filePath, JSON.stringify(graph, null, 2), "utf8");
    }

    delete(): void {
        rmSync(this.filePath, { force: true });
    }
}

