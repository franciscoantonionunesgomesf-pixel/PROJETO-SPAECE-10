import { jsPDF } from "jspdf";

export type PdfActivity = {
  title: string;
  description: string;
  descriptor: string;
  difficulty?: string;
  content: string;
  type?: string;
};

// Paleta da marca SPAECE Conecta
const NAVY: [number, number, number] = [19, 39, 69];
const NAVY_SOFT: [number, number, number] = [45, 72, 116];
const CORAL: [number, number, number] = [235, 112, 92];
const MINT: [number, number, number] = [74, 169, 144];
const GRAY: [number, number, number] = [110, 125, 145];
const LIGHT: [number, number, number] = [242, 246, 251];
const LINE: [number, number, number] = [224, 231, 240];

const diffLabel: Record<string, string> = {
  inicial: "Nível inicial",
  intermediario: "Nível intermediário",
  avancado: "Nível avançado",
};

const typeLabel: Record<string, string> = {
  jogo: "Jogo",
  atividade: "Atividade",
  simulado: "Simulado",
};

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 70);
}

/**
 * Gera e baixa um PDF profissional de uma atividade/jogo/simulado.
 */
export function downloadActivityPdf(item: PdfActivity): void {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 50;
  const contentW = pageW - margin * 2;
  let y = 0;

  // ---- separa corpo e gabarito ----
  let body = item.content || "";
  let gabarito = "";
  const marker = "GABARITO";
  const idx = body.indexOf(marker);
  if (idx >= 0) {
    gabarito = body.slice(idx + marker.length).replace(/={3,}/g, "").trim();
    body = body.slice(0, idx).replace(/={3,}/g, "").trim();
  }

  // ---- cabeçalho de página ----
  const drawHeader = () => {
    doc.setFillColor(...NAVY);
    doc.rect(0, 0, pageW, 66, "F");
    doc.setFillColor(...CORAL);
    doc.rect(0, 66, pageW, 3.5, "F");

    // marca
    doc.setFillColor(...CORAL);
    doc.roundedRect(margin, 22, 20, 20, 4, 4, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("S", margin + 6.5, 36.5);

    doc.setFontSize(15);
    doc.text("SPAECE CONECTA", margin + 30, 33);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(178, 196, 222);
    doc.text(
      "Acervo de Língua Portuguesa · 9º ano · Materiais alinhados à Matriz de Referência SPAECE",
      margin + 30,
      48
    );
    y = 96;
  };

  // ---- rodapé de página ----
  const drawFooter = (pageNum: number, total: number) => {
    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.7);
    doc.line(margin, pageH - 46, pageW - margin, pageH - 46);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150, 162, 178);
    doc.text("SPAECE Conecta · material pedagógico para o professor", margin, pageH - 30);
    doc.text(`Página ${pageNum} de ${total}`, pageW - margin, pageH - 30, { align: "right" });
  };

  const ensure = (needed: number) => {
    if (y + needed > pageH - 64) {
      doc.addPage();
      drawHeader();
    }
  };

  // ---- quebra e escreve um bloco de texto preservando linhas ----
  const writeTextBlock = (
    text: string,
    opts: {
      size: number;
      style?: "normal" | "bold" | "italic";
      color?: [number, number, number];
      lineHeight?: number;
      gapAfter?: number;
    }
  ) => {
    const size = opts.size;
    const lh = opts.lineHeight ?? size * 1.5;
    doc.setFont("helvetica", opts.style ?? "normal");
    doc.setFontSize(size);
    doc.setTextColor(...(opts.color ?? GRAY));
    const lines = text.split("\n");
    for (const raw of lines) {
      const line = raw.replace(/\s+$/g, "");
      if (line.trim() === "") {
        y += lh * 0.55;
        continue;
      }
      const isItem = /^\s*ITEM\s*\d+/i.test(line);
      if (isItem) {
        ensure(lh * 2);
        y += lh * 0.35;
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...NAVY);
      } else {
        doc.setFont("helvetica", opts.style ?? "normal");
        doc.setTextColor(...(opts.color ?? GRAY));
      }
      const wrapped = doc.splitTextToSize(line, contentW) as string[];
      for (const w of wrapped) {
        ensure(lh);
        doc.text(w, margin, y);
        y += lh;
      }
    }
    y += opts.gapAfter ?? 0;
  };

  drawHeader();

  // ---- título ----
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...NAVY);
  const titleLines = doc.splitTextToSize(item.title, contentW) as string[];
  titleLines.forEach((ln) => {
    ensure(24);
    doc.text(ln, margin, y);
    y += 23;
  });
  y += 6;

  // ---- descrição ----
  if (item.description) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(...GRAY);
    const dLines = doc.splitTextToSize(item.description, contentW) as string[];
    dLines.forEach((ln) => {
      ensure(16);
      doc.text(ln, margin, y);
      y += 15;
    });
    y += 12;
  }

  // ---- caixa de metadados (chips) ----
  const chips: string[] = [];
  chips.push(`Descritor ${item.descriptor}`);
  if (item.type) chips.push(typeLabel[item.type] ?? item.type);
  if (item.difficulty) chips.push(diffLabel[item.difficulty] ?? item.difficulty);
  const itemCount = (body.match(/ITEM\s*\d+/gi) || []).length;
  if (itemCount) chips.push(`${itemCount} questões`);

  const chipH = 22;
  const chipPad = 12;
  const gap = 8;
  let cx = margin;
  ensure(chipH + 20);
  const boxTop = y - 6;
  let maxX = margin;
  // calcula quebra de linha dos chips
  const chipRows: { text: string; x: number }[][] = [[]];
  for (const c of chips) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    const w = doc.getTextWidth(c) + chipPad * 2;
    if (cx + w > pageW - margin) {
      chipRows.push([]);
      cx = margin;
    }
    chipRows[chipRows.length - 1].push({ text: c, x: cx });
    cx += w + gap;
    maxX = Math.max(maxX, cx - gap);
  }
  const rowsH = chipRows.length * (chipH + gap);
  doc.setFillColor(...LIGHT);
  doc.roundedRect(margin, boxTop, contentW, rowsH + 10, 8, 8, "F");

  let ry = boxTop + 16;
  for (const row of chipRows) {
    for (const chip of row) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      const w = doc.getTextWidth(chip.text) + chipPad * 2;
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(chip.x, ry - 12, w, chipH, 6, 6, "F");
      doc.setTextColor(...NAVY_SOFT);
      doc.text(chip.text, chip.x + chipPad, ry + 2);
    }
    ry += chipH + gap;
  }
  y = boxTop + rowsH + 26;

  // ---- faixa de seção: ENUNCIADO ----
  const sectionBand = (label: string, color: [number, number, number]) => {
    ensure(34);
    doc.setFillColor(...color);
    doc.roundedRect(margin, y - 12, contentW, 26, 6, 6, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.text(label, margin + 12, y + 5);
    y += 34;
  };

  sectionBand("ATIVIDADE · ITENS E QUESTÕES", NAVY_SOFT);
  writeTextBlock(body, { size: 10, color: [70, 84, 104], lineHeight: 15, gapAfter: 10 });

  // ---- gabarito ----
  if (gabarito) {
    y += 6;
    sectionBand("GABARITO", MINT);
    writeTextBlock(gabarito, { size: 10, color: [70, 84, 104], lineHeight: 15 });
  }

  // ---- rodapés com total de páginas ----
  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    drawFooter(p, total);
  }

  doc.save(`${slugify(item.title) || "atividade-spaece"}.pdf`);
}
