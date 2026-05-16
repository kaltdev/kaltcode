import {
    existsSync,
    mkdirSync,
    readFileSync,
    renameSync,
    rmSync,
    writeFileSync,
} from "fs";
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
        } catch (error) {
            try {
                renameSync(this.filePath, `${this.filePath}.corrupted.${Date.now()}`);
            } catch {
                console.warn(
                    `Failed to quarantine corrupted knowledge graph JSON at ${this.filePath}:`,
                    error,
                );
            }
            return null;
        }
    }

    saveGraph(graph: KnowledgeGraph): boolean {
        try {
            mkdirSync(this.projectDir, { recursive: true });
            writeFileSync(this.filePath, JSON.stringify(graph, null, 2), "utf8");
            return true;
        } catch (error) {
            console.error(
                `Failed to save project graph to JSON at ${this.filePath}:`,
                error,
            );
            return false;
        }
    }

    delete(): boolean {
        try {
            rmSync(this.filePath, { force: true });
            return true;
        } catch (error) {
            console.warn(
                `Failed to delete project graph JSON at ${this.filePath}:`,
                error,
            );
            return false;
        }
    }

    reset(): boolean {
        return this.delete();
    }
}
