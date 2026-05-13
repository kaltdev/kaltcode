import { mkdirSync } from "fs";
import { join } from "path";
import type { KnowledgeGraph } from "../knowledgeGraph.js";
import { parseKnowledgeGraph } from "./knowledgeGraphStorage.js";

type BunDatabase = {
    close: () => void;
    exec: (sql: string) => void;
    query: (sql: string) => {
        get: (...params: unknown[]) => unknown;
        run: (...params: unknown[]) => unknown;
    };
};

type BunSqliteModule = {
    Database?: new (path: string) => BunDatabase;
};

export class SQLiteProvider {
    isReady = false;
    private db: BunDatabase | null = null;
    private readonly filePath: string;

    constructor(private readonly projectDir: string) {
        this.filePath = join(projectDir, "knowledge.db");
    }

    async init(): Promise<void> {
        if (this.isReady) return;

        try {
            mkdirSync(this.projectDir, { recursive: true });
            const sqlite = (await import("bun:sqlite")) as BunSqliteModule;
            if (!sqlite.Database) return;

            this.db = new sqlite.Database(this.filePath);
            this.db.exec(`
                CREATE TABLE IF NOT EXISTS knowledge_graph (
                    id INTEGER PRIMARY KEY CHECK (id = 1),
                    data TEXT NOT NULL,
                    last_update_time INTEGER NOT NULL
                )
            `);
            this.isReady = true;
        } catch {
            this.close();
        }
    }

    loadGraph(): KnowledgeGraph | null {
        if (!this.db || !this.isReady) return null;

        try {
            const row = this.db
                .query("SELECT data FROM knowledge_graph WHERE id = 1")
                .get() as { data?: unknown } | null;
            if (typeof row?.data !== "string") return null;
            return parseKnowledgeGraph(JSON.parse(row.data));
        } catch {
            return null;
        }
    }

    saveGraph(graph: KnowledgeGraph): void {
        if (!this.db || !this.isReady) return;

        try {
            this.db
                .query(
                    `INSERT INTO knowledge_graph (id, data, last_update_time)
                     VALUES (1, ?, ?)
                     ON CONFLICT(id) DO UPDATE SET
                        data = excluded.data,
                        last_update_time = excluded.last_update_time`,
                )
                .run(JSON.stringify(graph), graph.lastUpdateTime);
        } catch {
            this.close();
        }
    }

    close(): void {
        try {
            this.db?.close();
        } catch {
            /* ignore */
        }
        this.db = null;
        this.isReady = false;
    }
}

