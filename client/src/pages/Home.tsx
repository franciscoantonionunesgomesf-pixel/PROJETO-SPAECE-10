import { useMemo, useState } from "react";
import { ArrowRight, BookOpen, Download, FileText, Library, Menu, Search, Sparkles, Target, X } from "lucide-react";
import { atividadesDrive } from "@/data/atividadesDrive";
import { downloadActivityPdf } from "@/lib/activityPdf";

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
            <span className="nav-label">Todos os descritores</span>
            <span className="nav-count">{atividadesDrive.length}</span>
          </button>
          {descriptors.map((d) => {
            const count = atividadesDrive.filter((a) => a.descriptor === d).length;
            return (
              <button
                key={d}
                className={`nav-item ${active === d ? "nav-item-active" : ""}`}
                onClick={() => {
                  setActive(d);
                  onClose();
                }}
              >
                <span className="nav-symbol nav-symbol-desc">{d}</span>
                <span className="nav-label">Descritor {d}</span>
                <span className="nav-count">{count}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="mini-note">
            <Target size={16} />
            <div>
              <strong>{totalQuestions} questões</strong>
              <span>em {atividadesDrive.length} atividades</span>
            </div>
          </div>
        </div>
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
          placeholder="Buscar por título ou descritor..."
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

function MaterialCard({ item, onView }: { item: Atividade; onView: (item: Atividade) => void }) {
  const questions = countItems(item.content);
  return (
    <article className="card">
      <div className="card-top">
        <span className="card-desc">{item.descriptor}</span>
        <span className={`card-level level-${item.difficulty}`}>{difficultyLabel[item.difficulty] ?? item.difficulty}</span>
      </div>
      <h3 className="card-title">{item.title}</h3>
      <p className="card-text">{item.description}</p>
      <div className="card-foot">
        <span className="card-questions">
          <FileText size={13} /> {questions} questões
        </span>
        <div className="card-actions">
          <button className="btn-ghost" onClick={() => onView(item)}>
            Ver <ArrowRight size={14} />
          </button>
          <button className="btn-solid" onClick={() => downloadActivityPdf(item)}>
            <Download size={14} /> PDF
          </button>
        </div>
      </div>
    </article>
  );
}

function ViewModal({ item, onClose }: { item: Atividade; onClose: () => void }) {
  const questions = countItems(item.content);
  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div className="modal-card" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-kicker">ATIVIDADE · {item.descriptor}</div>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>
        <div className="view-meta">
          <span className="pill pill-desc">{item.descriptor}</span>
          <span className="pill">{difficultyLabel[item.difficulty] ?? item.difficulty}</span>
          <span className="pill">{questions} questões</span>
          <span className="pill pill-mint">Gabarito incluso</span>
        </div>
        <div className="view-content">
          <div className="view-content-label">ITENS · QUESTÕES · GABARITO</div>
          <p>{item.content}</p>
        </div>
        <div className="view-actions">
          <button className="btn-ghost" onClick={onClose}>
            Fechar
          </button>
          <button className="btn-solid btn-lg" onClick={() => downloadActivityPdf(item)}>
            <Download size={16} /> Baixar PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [active, setActive] = useState<string>("todos");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selected, setSelected] = useState<Atividade | null>(null);
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

  const clearFilters = () => {
    setSearch("");
    setActive("todos");
  };

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
                Atividades prontas,
                <br />
                <em>organizadas por descritor.</em>
              </h1>
              <p>
                Encontre rapidamente a atividade certa para a sua aula, visualize as questões com o gabarito e baixe
                tudo em PDF com um clique.
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

          <section className="toolbar">
            <div className="chips">
              <button className={`chip ${active === "todos" ? "chip-active" : ""}`} onClick={() => setActive("todos")}>
                Todos
              </button>
              {descriptors.map((d) => (
                <button key={d} className={`chip ${active === d ? "chip-active" : ""}`} onClick={() => setActive(d)}>
                  {d}
                </button>
              ))}
            </div>
            <span className="result-count">
              {filtered.length} {filtered.length === 1 ? "atividade" : "atividades"}
            </span>
          </section>

          {filtered.length ? (
            <div className="grid">
              {filtered.map((item) => (
                <MaterialCard key={item.id} item={item} onView={setSelected} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <Search size={26} />
              <strong>Nenhuma atividade encontrada</strong>
              <span>Tente outro termo ou selecione outro descritor.</span>
              <button className="btn-ghost" onClick={clearFilters}>
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
      {selected && <ViewModal item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
