// Parser das atividades do acervo SPAECE.
// Cada atividade (campo `content`) e um texto unico com itens delimitados por
// "ITEM NN", alternativas em linhas "A) ... B) ... C) ... D) ..." e, ao final,
// um bloco GABARITO com pares "ITEM / RESPOSTA". Aqui separamos tudo em questoes
// individuais para o modo de projecao (TV / notebook).

export type Alternative = {
  letter: string;
  text: string;
};

export type ParsedQuestion = {
  /** Numero do item (ex.: 1, 2, 3...). */
  number: number;
  /** Texto de apoio + comando da questao (tudo antes das alternativas). */
  body: string;
  /** Alternativas A-D. */
  alternatives: Alternative[];
  /** Resposta correta ("A".."D") ou null se nao encontrada. */
  answer: string | null;
};

const ALT_RE = /^\s*([A-D])\)\s*(.*)$/;
const ALT_ANY_RE = /^\s*[A-D]\)\s/m;

/**
 * Converte o campo `content` de uma atividade em uma lista de questoes.
 * Tolera variacoes de espacamento, quebras de linha e acentos.
 */
export function parseQuestions(content: string): ParsedQuestion[] {
  if (!content) return [];

  // 1) Separa o corpo das questoes do bloco de gabarito.
  let body = content;
  let gabarito = "";
  const gIdx = content.search(/=+\s*\n\s*GABARITO/i);
  if (gIdx >= 0) {
    body = content.slice(0, gIdx);
    gabarito = content.slice(gIdx);
  }

  // 2) Le o gabarito: linhas "NN   X".
  const answers: Record<number, string> = {};
  const gRe = /^\s*(\d{1,2})\s+([A-D])\s*$/gm;
  let gm: RegExpExecArray | null;
  while ((gm = gRe.exec(gabarito)) !== null) {
    answers[parseInt(gm[1], 10)] = gm[2].toUpperCase();
  }

  // 3) Divide pelos delimitadores "ITEM NN".
  const parts = body.split(/\s*ITEM\s*(\d{1,2})\s*\n/i);
  const questions: ParsedQuestion[] = [];

  for (let i = 1; i + 1 < parts.length; i += 2) {
    const number = parseInt(parts[i], 10);
    const chunk = parts[i + 1] ?? "";
    const lines = chunk.split("\n");

    // Localiza o inicio das alternativas: primeira linha "A)" que seja
    // seguida (em ordem) por "B)", "C)" e "D)".
    let start = -1;
    for (let j = 0; j < lines.length; j++) {
      if (/^\s*A\)\s/.test(lines[j])) {
        const rest = lines.slice(j).join("\n");
        if (
          /^\s*B\)\s/m.test(rest) &&
          /^\s*C\)\s/m.test(rest) &&
          /^\s*D\)\s/m.test(rest)
        ) {
          start = j;
          break;
        }
      }
    }

    let bodyText = chunk;
    const alternatives: Alternative[] = [];

    if (start >= 0) {
      bodyText = lines.slice(0, start).join("\n").trim();
      const altLines = lines.slice(start);
      let current: Alternative | null = null;
      for (const line of altLines) {
        const am = line.match(ALT_RE);
        if (am) {
          if (current) alternatives.push(current);
          current = { letter: am[1].toUpperCase(), text: am[2].trim() };
        } else if (current && line.trim()) {
          // continuacao da alternativa (quebra de linha)
          current.text = `${current.text} ${line.trim()}`.trim();
        }
      }
      if (current) alternatives.push(current);
    }

    questions.push({
      number,
      body: bodyText,
      alternatives,
      answer: answers[number] ?? null,
    });
  }

  return questions;
}

/**
 * Separa o corpo da questao em texto de apoio (passage) e comando (stem).
 * O comando costuma ser o ultimo paragrafo, apos uma linha em branco.
 * Se nao for possivel separar com seguranca, retorna tudo como passage.
 */
export function splitStem(body: string): { passage: string; stem: string } {
  const trimmed = (body || "").trim();
  if (!trimmed) return { passage: "", stem: "" };
  const idx = trimmed.lastIndexOf("\n\n");
  if (idx > 0) {
    const stem = trimmed.slice(idx + 2).trim();
    const isSingleParagraph = !/\n\s*\n/.test(stem);
    if (stem && isSingleParagraph && stem.length <= 420) {
      return { passage: trimmed.slice(0, idx).trim(), stem };
    }
  }
  return { passage: trimmed, stem: "" };
}

export { ALT_ANY_RE };
