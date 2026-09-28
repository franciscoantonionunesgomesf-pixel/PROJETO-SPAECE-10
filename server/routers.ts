import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { invokeLLM } from "./_core/llm";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { createMaterial, listMaterials } from "./db";

const materialType = z.enum(["jogo", "atividade", "simulado"]);
const difficulty = z.enum(["inicial", "intermediario", "avancado"]);

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  materials: router({
    list: publicProcedure.input(z.object({ type: materialType.optional(), search: z.string().optional() }).optional()).query(({ input }) => listMaterials(input ?? {})),
    create: publicProcedure.input(z.object({ type: materialType, title: z.string().min(3).max(180), description: z.string().min(3), descriptor: z.string().min(2).max(32), difficulty, content: z.string().min(3) })).mutation(({ input }) => createMaterial(input)),
    generate: publicProcedure.input(z.object({ materialType, descriptor: z.string().min(2).max(32), topic: z.string().min(3).max(180), difficulty, quantity: z.number().int().min(1).max(10), extra: z.string().max(500).optional() })).mutation(async ({ input }) => {
      const response = await invokeLLM({
        model: "gpt-5-mini",
        messages: [
          { role: "system", content: "Você é o Gerador SPAECE Conecta, especialista em criar materiais didáticos de Língua Portuguesa para o 9º ano alinhados aos descritores do SPAECE. Gere itens claros, aplicáveis em sala e adequados ao nível informado. Não invente códigos: use exatamente o descritor recebido. Retorne somente JSON conforme o schema." },
          { role: "user", content: `Crie um ${input.materialType} sobre "${input.topic}" para o descritor ${input.descriptor}, nível ${input.difficulty}, com ${input.quantity} item(ns). ${input.extra ?? "Inclua instruções para o professor e gabarito comentado."}` },
        ],
        reasoning: { effort: "low" },
        response_format: { type: "json_schema", json_schema: { name: "material_educacional", strict: true, schema: { type: "object", properties: { title: { type: "string" }, description: { type: "string" }, estimatedTime: { type: "string" }, instructions: { type: "string" }, items: { type: "array", items: { type: "object", properties: { prompt: { type: "string" }, options: { type: "array", items: { type: "string" } }, answer: { type: "string" }, rationale: { type: "string" } }, required: ["prompt", "options", "answer", "rationale"], additionalProperties: false } } }, required: ["title", "description", "estimatedTime", "instructions", "items"], additionalProperties: false } } },
      });
      const content = response.choices[0]?.message?.content;
      if (typeof content !== "string") throw new Error("O gerador não retornou um conteúdo válido");
      return { ...JSON.parse(content), descriptor: input.descriptor, materialType: input.materialType, difficulty: input.difficulty };
    }),
  }),
});

export type AppRouter = typeof appRouter;
