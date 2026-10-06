// Gerado automaticamente a partir de gen.py (fonte unica dos diagramas).
// Nao editar manualmente: rode `python3 gen_diagramas_ts.py` para regenerar.

export type Diagrama = {
  code: string; // codigo do arquivo, ex.: D01
  num: string; // codigo do descritor usado no acervo, ex.: D1
  index: number;
  title: string;
  href: string; // tela cheia (HTML)
  png: string; // imagem Full HD
};

export const diagramas: Diagrama[] = [
  {
    code: "D01",
    num: "D1",
    index: 1,
    title: "Localizar informações explícitas em um texto",
    href: "./diagramas/html/D01.html",
    png: "./diagramas/png/D01.png",
  },
  {
    code: "D02",
    num: "D2",
    index: 2,
    title: "Estabelecer relações entre partes do texto (coesão: retomadas e substituições)",
    href: "./diagramas/html/D02.html",
    png: "./diagramas/png/D02.png",
  },
  {
    code: "D03",
    num: "D3",
    index: 3,
    title: "Inferir o sentido de uma palavra ou expressão",
    href: "./diagramas/html/D03.html",
    png: "./diagramas/png/D03.png",
  },
  {
    code: "D04",
    num: "D4",
    index: 4,
    title: "Inferir uma informação implícita em um texto",
    href: "./diagramas/html/D04.html",
    png: "./diagramas/png/D04.png",
  },
  {
    code: "D05",
    num: "D5",
    index: 5,
    title: "Interpretar texto com auxílio de material gráfico diverso (charges, quadrinhos, fotos, gráficos)",
    href: "./diagramas/html/D05.html",
    png: "./diagramas/png/D05.png",
  },
  {
    code: "D06",
    num: "D6",
    index: 6,
    title: "Identificar o tema de um texto",
    href: "./diagramas/html/D06.html",
    png: "./diagramas/png/D06.png",
  },
  {
    code: "D07",
    num: "D7",
    index: 7,
    title: "Identificar a tese de um texto",
    href: "./diagramas/html/D07.html",
    png: "./diagramas/png/D07.png",
  },
  {
    code: "D08",
    num: "D8",
    index: 8,
    title: "Estabelecer relação entre a tese e os argumentos oferecidos para sustentá-la",
    href: "./diagramas/html/D08.html",
    png: "./diagramas/png/D08.png",
  },
  {
    code: "D09",
    num: "D9",
    index: 9,
    title: "Diferenciar as partes principais das secundárias em um texto",
    href: "./diagramas/html/D09.html",
    png: "./diagramas/png/D09.png",
  },
  {
    code: "D10",
    num: "D10",
    index: 10,
    title: "Identificar o conflito gerador do enredo e os elementos que constroem a narrativa",
    href: "./diagramas/html/D10.html",
    png: "./diagramas/png/D10.png",
  },
  {
    code: "D11",
    num: "D11",
    index: 11,
    title: "Estabelecer relação causa/consequência entre partes e elementos do texto",
    href: "./diagramas/html/D11.html",
    png: "./diagramas/png/D11.png",
  },
  {
    code: "D12",
    num: "D12",
    index: 12,
    title: "Identificar a finalidade de textos de diferentes gêneros",
    href: "./diagramas/html/D12.html",
    png: "./diagramas/png/D12.png",
  },
  {
    code: "D13",
    num: "D13",
    index: 13,
    title: "Identificar as marcas linguísticas que evidenciam o locutor e o interlocutor de um texto",
    href: "./diagramas/html/D13.html",
    png: "./diagramas/png/D13.png",
  },
  {
    code: "D14",
    num: "D14",
    index: 14,
    title: "Distinguir um fato da opinião relativa a esse fato",
    href: "./diagramas/html/D14.html",
    png: "./diagramas/png/D14.png",
  },
  {
    code: "D15",
    num: "D15",
    index: 15,
    title: "Estabelecer relações lógico-discursivas (conjunções, advérbios etc.)",
    href: "./diagramas/html/D15.html",
    png: "./diagramas/png/D15.png",
  },
  {
    code: "D16",
    num: "D16",
    index: 16,
    title: "Identificar efeitos de ironia ou humor em textos variados",
    href: "./diagramas/html/D16.html",
    png: "./diagramas/png/D16.png",
  },
  {
    code: "D17",
    num: "D17",
    index: 17,
    title: "Reconhecer o efeito de sentido decorrente do uso da pontuação e de outras notações",
    href: "./diagramas/html/D17.html",
    png: "./diagramas/png/D17.png",
  },
  {
    code: "D18",
    num: "D18",
    index: 18,
    title: "Reconhecer o efeito de sentido decorrente da escolha de uma determinada palavra ou expressão",
    href: "./diagramas/html/D18.html",
    png: "./diagramas/png/D18.png",
  },
  {
    code: "D19",
    num: "D19",
    index: 19,
    title: "Reconhecer o efeito de sentido decorrente da exploração de recursos ortográficos e/ou morfossintáticos",
    href: "./diagramas/html/D19.html",
    png: "./diagramas/png/D19.png",
  },
  {
    code: "D20",
    num: "D20",
    index: 20,
    title: "Reconhecer diferentes formas de tratar uma informação na comparação de textos sobre o mesmo tema",
    href: "./diagramas/html/D20.html",
    png: "./diagramas/png/D20.png",
  },
  {
    code: "D21",
    num: "D21",
    index: 21,
    title: "Reconhecer posições distintas entre duas ou mais opiniões relativas ao mesmo fato ou tema",
    href: "./diagramas/html/D21.html",
    png: "./diagramas/png/D21.png",
  },
];

// Mapa rapido: descritor do acervo (D1, D2, ...) -> diagrama correspondente.
export const diagramaPorDescritor: Record<string, Diagrama> = Object.fromEntries(
  diagramas.map((d) => [d.num, d])
);
