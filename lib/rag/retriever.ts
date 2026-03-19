import { buildKnowledgeChunks } from "@/lib/knowledge/me";

export async function retrieveContext(query: string, k = 4): Promise<string> {
    // Since OpenAI is removed, simply return all chunks
    // as string. If the chunks are too large, Gemini can handle a large context window anyway.
    return buildKnowledgeChunks().join("\n\n");
}
