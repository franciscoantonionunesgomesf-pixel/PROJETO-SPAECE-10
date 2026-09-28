import { describe, expect, it, vi } from "vitest";

vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn(async () => ({
    choices: [{ message: { content: JSON.stringify({
      title: "Jogo das pistas",
      description: "Jogo para praticar inferência.",
      estimatedTime: "25 minutos",
      instructions: "Forme equipes e distribua as pistas.",
      items: [{ prompt: "Qual informação pode ser inferida?", options: ["A", "B"], answer: "A", rationale: "A pista indica essa conclusão." }],
    }) } }],
  })),
}));

import { appRouter } from "./routers";

describe("materials.generate", () => {
  const caller = appRouter.createCaller({
    user: null,
    req: { protocol: "https", headers: {} } as any,
    res: {} as any,
  });

  it("returns a structured material with the requested descriptor", async () => {
    const result = await caller.materials.generate({
      materialType: "jogo",
      descriptor: "D02",
      topic: "notícias sobre meio ambiente",
      difficulty: "intermediario",
      quantity: 1,
    });

    expect(result.title).toBe("Jogo das pistas");
    expect(result.descriptor).toBe("D02");
    expect(result.materialType).toBe("jogo");
    expect(result.items).toHaveLength(1);
  });

  it("rejects an empty topic before invoking the model", async () => {
    await expect(caller.materials.generate({
      materialType: "atividade",
      descriptor: "D06",
      topic: "",
      difficulty: "inicial",
      quantity: 2,
    })).rejects.toThrow();
  });
});
