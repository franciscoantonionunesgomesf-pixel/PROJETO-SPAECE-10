import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Download,
  FileText,
  LayoutGrid,
  Library,
  Menu,
  MonitorPlay,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { atividadesDrive } from "@/data/atividadesDrive";
import { diagramaPorDescritor } from "@/data/diagramas";
import { downloadActivityPdf } from "@/lib/activityPdf";
import Projector from "@/components/Projector";

type Atividade = (typeof atividadesDrive)[number];

const difficultyLabel: Record<string, string> = {
  inicial: "Inicial",
  intermediario: "Intermediário",
  avancado: "Avançado",
};

function countItems(content: string): number {
  return (content.match(/ITEM\s*\d+/gi) || []).length;
}

const descriptors = Array.from(new Set(atividadesDrive.map((a) => a.descriptor)));
const totalQuestions = atividadesDrive.reduce((sum, a) => sum + countItems(a.content), 0);

function BrandMark() {
  return (
    <div className="brand-mark" aria-hidden="true">
      <span className="brand-dot brand-dot-one" />
      <span className="brand-dot brand-dot-two" />
      <span className="brand-dot brand-dot-three" />
    </div>
  );
}

function Sidebar({
  active,
  setActive,
  mobileOpen,
  onClose,
}: {
  active: string;
  setActive: (key: string) => void;
  mobileOpen: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {mobileOpen && <button className="sidebar-scrim" aria-label="Fechar menu" onClick={onClose} />}
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="brand-lockup">
          <BrandMark />
          <div>
            <div className="brand-name">
              spaece<span>conecta</span>
            </div>
            <div className="brand-caption">ACERVO · 9º ANO</div>
          </div>
          <button className="mobile-close" onClick={onClose} aria-label="Fechar menu">
            <X size={18} />
          </button>
        </div>

        <div className="sidebar-section-label">Descritores</div>
        <nav className="sidebar-nav" aria-label="Descritores">
          <button
            className={`nav-item ${active === "todos" ? "nav-item-active" : ""}`}
            onClick={() => {
              setActive("todos");
              onClose();
            }}
          >
            <span className="nav-symbol">
              <Library size={16} />
            </span>
            <span className="nav-label">Todas as atividades</span>
          </button>
          {descriptors.map((d) => (
            <button
              key={d}
              className={`nav-item ${active === d ? "nav-item-active" : ""}`}
              title={diagramaPorDescritor[d]?.title ?? `Descritor ${d}`}
              onClick={() => {
                setActive(d);
                onClose();
              }}
            >
              <span className="nav-symbol nav-symbol-desc">{d}</span>
              <span className="nav-label nav-label-desc">
                {diagramaPorDescritor[d]?.title ?? `Descritor ${d}`}
              </span>
            </button>
          ))}
        </nav>

        <a className="sidebar-gallery" href="./diagramas/">
          <span className="nav-symbol nav-symbol-diag">
            <LayoutGrid size={16} />
          </span>
          <span className="nav-label">Galeria de diagramas</span>
          <ArrowRight size={15} />
        </a>
      </aside>
    </>
  );
}

function Topbar({
  onMenu,
  search,
  setSearch,
}: {
  onMenu: () => void;
  search: string;
  setSearch: (value: string) => void;
}) {
  return (
    <header className="topbar">
      <div className="topbar-title">
        <button className="mobile-menu" onClick={onMenu} aria-label="Abrir menu">
          <Menu size={21} />
        </button>
        <span className="eyebrow">ACERVO</span>
        <span className="crumb-divider">/</span>
        <span className="crumb-current">Língua Portuguesa · 9º ano</span>
      </div>
      <label className="topbar-search">
        <Search size={16} />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar atividade..."
        />
        {search && (
          <button className="search-clear" onClick={() => setSearch("")} aria-label="Limpar busca">
            <X size={14} />
          </button>
        )}
      </label>
    </header>
  );
}

/** Diagrama da habilidade do descritor escolhido — único ponto de acesso aos diagramas. */
function DescriptorPanel({ descriptor }: { descriptor: string }) {
  const diag = diagramaPorDescritor[descriptor];
  if (!diag) return null;
  return (
    <section className="desc-panel" aria-label={`Diagrama da habilidade ${descriptor}`}>
      <img
        className="dp-thumb"
        src={diag.png}
        alt={`Diagrama ${diag.num}: ${diag.title}`}
        loading="lazy"
      />
      <div className="dp-copy">
        <span className="dp-kicker">
          <LayoutGrid size={13} /> DIAGRAMA DA HABILIDADE
        </span>
        <h2>{diag.title}</h2>
        <p>Projete na TV interativa para explicar a habilidade e, em seguida, aplique a atividade abaixo.</p>
        <div className="dp-actions">
          <a className="btn-solid btn-lg" href={diag.href} target="_blank" rel="noreferrer">
            <MonitorPlay size={16} /> Abrir em tela cheia
          </a>
          <a className="btn-ghost btn-lg" href={diag.png} download={`${diag.code}.png`}>
            <Download size={16} /> Baixar PNG
          </a>
        </div>
      </div>
    </section>
  );
}

function MaterialCard({
  item,
  onProject,
}: {
  item: Atividade;
  onProject: (item: Atividade) => void;
}) {
  const questions = countItems(item.content);
  return (
    <article className="card">
      <div className="card-top">
        <span className="card-desc">{item.descriptor}</span>
        <span className={`card-level level-${item.difficulty}`}>
          {difficultyLabel[item.difficulty] ?? item.difficulty}
        </span>
      </div>
      <h3 className="card-title">{item.title}</h3>
      <p className="card-text">{item.description}</p>
      <div className="card-foot">
        <span className="card-questions">
          <FileText size={13} /> {questions} questões
        </span>
        <div className="card-actions">
          <button className="btn-solid" onClick={() => onProject(item)}>
            <MonitorPlay size={14} /> Usar na TV
          </button>
          <button
            className="btn-ghost"
            onClick={() => downloadActivityPdf(item)}
            title="Baixar esta atividade em PDF"
          >
            <Download size={14} /> PDF
          </button>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const [active, setActive] = useState<string>("todos");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [projecting, setProjecting] = useState<Atividade | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return atividadesDrive.filter(
      (item) =>
        (active === "todos" || item.descriptor === active) &&
        (!q ||
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.descriptor.toLowerCase().includes(q))
    );
  }, [active, search]);

  const activeDiagram = active !== "todos" ? diagramaPorDescritor[active] : undefined;

  return (
    <div className="app-shell">
      <Sidebar active={active} setActive={setActive} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="main-shell">
        <Topbar onMenu={() => setMobileOpen(true)} search={search} setSearch={setSearch} />
        <main className="content">
          <section className="hero">
            <div className="hero-copy">
              <div className="hero-kicker">
                <Sparkles size={14} /> ACERVO SPAECE · LÍNGUA PORTUGUESA
              </div>
              <h1>
                Atividades e diagramas,
                <br />
                <em>por descritor.</em>
              </h1>
              <p>
                Escolha um descritor, projete o diagrama da habilidade e conduza as questões na TV interativa —
                uma por vez, com gabarito na hora. O PDF fica disponível quando precisar.
              </p>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <strong>{atividadesDrive.length}</strong>
                <span>atividades</span>
              </div>
              <div className="hero-stat">
                <strong>{descriptors.length}</strong>
                <span>descritores</span>
              </div>
              <div className="hero-stat">
                <strong>{totalQuestions}</strong>
                <span>questões</span>
              </div>
            </div>
          </section>

          {activeDiagram && <DescriptorPanel descriptor={active} />}

          <div className="section-head">
            <h2>{active === "todos" ? "Todas as atividades" : `Atividades · ${active}`}</h2>
            <span className="result-count">
              {filtered.length} {filtered.length === 1 ? "atividade" : "atividades"}
            </span>
          </div>

          {filtered.length ? (
            <div className="grid">
              {filtered.map((item) => (
                <MaterialCard key={item.id} item={item} onProject={setProjecting} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <Search size={26} />
              <strong>Nenhuma atividade encontrada</strong>
              <span>Tente outro termo ou selecione outro descritor.</span>
              <button
                className="btn-ghost"
                onClick={() => {
                  setSearch("");
                  setActive("todos");
                }}
              >
                Limpar filtros
              </button>
            </div>
          )}

          <footer className="footer">
            <span>Base pedagógica alinhada à Matriz de Referência SPAECE · Língua Portuguesa · 9º ano</span>
            <span className="footer-brand">
              <BookOpen size={13} /> SPAECE Conecta
            </span>
          </footer>
        </main>
      </div>
      {projecting && (
        <Projector
          title={projecting.title}
          descriptor={projecting.descriptor}
          content={projecting.content}
          onClose={() => setProjecting(null)}
          onDownload={() => downloadActivityPdf(projecting)}
        />
      )}
    </div>
  );
}
