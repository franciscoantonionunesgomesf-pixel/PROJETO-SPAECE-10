import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  X,
} from "lucide-react";
import { parseQuestions, splitStem } from "@/lib/parseQuestions";

type ProjectorProps = {
  title: string;
  descriptor: string;
  content: string;
  onClose: () => void;
  onDownload: () => void;
};

/**
 * Modo de projeção (TV interativa / notebook).
 * Mostra uma questão por vez, com tipografia grande, navegação e
 * revelação do gabarito. Pensado para o professor conduzir a turma.
 */
export default function Projector({
  title,
  descriptor,
  content,
  onClose,
  onDownload,
}: ProjectorProps) {
  const questions = useMemo(() => parseQuestions(content), [content]);
  const total = questions.length;

  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);

  const question = questions[index];
  const split = useMemo(
    () => (question ? splitStem(question.body) : { passage: "", stem: "" }),
    [question]
  );

  const goTo = useCallback(
    (next: number) => {
      if (total === 0) return;
      const clamped = Math.min(Math.max(next, 0), total - 1);
      setIndex(clamped);
      setShowAnswer(false);
      setSelected(null);
    },
    [total]
  );

  const go = useCallback((delta: number) => goTo(index + delta), [goTo, index]);

  // Trava o scroll do fundo enquanto projeta.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Acompanha o estado de tela cheia do navegador.
  useEffect(() => {
    const onFs = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = rootRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => undefined);
    } else {
      document.exitFullscreen?.().catch(() => undefined);
    }
  }, []);

  // Atalhos de teclado para conduzir a aula.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowRight":
        case "PageDown":
          event.preventDefault();
          go(1);
          break;
        case "ArrowLeft":
        case "PageUp":
          event.preventDefault();
          go(-1);
          break;
        case " ":
          event.preventDefault();
          setShowAnswer((v) => !v);
          break;
        case "Escape":
          event.preventDefault();
          if (document.fullscreenElement) {
            document.exitFullscreen?.().catch(() => undefined);
          } else {
            onClose();
          }
          break;
        case "Home":
          event.preventDefault();
          goTo(0);
          break;
        case "End":
          event.preventDefault();
          goTo(total - 1);
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, goTo, onClose, total]);

  const progress = total ? ((index + 1) / total) * 100 : 0;

  return (
    <div className="projector" ref={rootRef} role="dialog" aria-modal="true" aria-label="Modo de projeção">
      <div className="proj-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      <header className="proj-top">
        <div className="proj-top-left">
          <span className="proj-badge">{descriptor}</span>
          <span className="proj-title">{title}</span>
        </div>
        <div className="proj-top-right">
          <button
            className={`proj-toggle ${showAnswer ? "is-on" : ""}`}
            onClick={() => setShowAnswer((v) => !v)}
            title="Mostrar / ocultar o gabarito (espaço)"
          >
            {showAnswer ? <EyeOff size={18} /> : <Eye size={18} />}
            <span>{showAnswer ? "Ocultar gabarito" : "Mostrar gabarito"}</span>
          </button>
          <button
            className="proj-icon"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Sair da tela cheia" : "Tela cheia"}
          >
            {isFullscreen ? <Minimize2 size={19} /> : <Maximize2 size={19} />}
          </button>
          <button className="proj-icon proj-close" onClick={onClose} title="Fechar (Esc)">
            <X size={20} />
          </button>
        </div>
      </header>

      <main className="proj-stage">
        {question ? (
          <article className="proj-q" key={question.number}>
            <div className="proj-q-num">
              Questão {index + 1} <span>de {total}</span>
            </div>

            {split.stem ? (
              <>
                <div className="proj-passage">{split.passage}</div>
                <div className="proj-stem">{split.stem}</div>
              </>
            ) : (
              <div className="proj-passage">{question.body}</div>
            )}

            <div className="proj-alts">
              {question.alternatives.map((alt) => {
                const isCorrect = showAnswer && alt.letter === question.answer;
                const isWrong =
                  showAnswer &&
                  selected === alt.letter &&
                  alt.letter !== question.answer;
                return (
                  <button
                    key={alt.letter}
                    className={`proj-alt ${selected === alt.letter ? "is-selected" : ""} ${
                      isCorrect ? "is-correct" : ""
                    } ${isWrong ? "is-wrong" : ""}`}
                    onClick={() => setSelected(alt.letter)}
                  >
                    <span className="proj-alt-letter">{alt.letter}</span>
                    <span className="proj-alt-text">{alt.text}</span>
                    {isCorrect && (
                      <span className="proj-alt-check">
                        <Check size={20} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </article>
        ) : (
          <div className="proj-empty">
            <strong>Não foi possível separar as questões desta atividade.</strong>
            <span>Use a opção “Baixar PDF” para acessar o material completo.</span>
          </div>
        )}
      </main>

      <footer className="proj-bottom">
        <div className="proj-nav-group">
          <button className="proj-nav" disabled={index === 0} onClick={() => go(-1)}>
            <ChevronLeft size={20} /> Anterior
          </button>
          <button
            className="proj-nav proj-nav-primary"
            disabled={index >= total - 1}
            onClick={() => go(1)}
          >
            Próxima <ChevronRight size={20} />
          </button>
        </div>

        <div className="proj-count">
          <strong>{index + 1}</strong>
          <span>/ {total}</span>
        </div>

        <button className="proj-pdf" onClick={onDownload} title="Baixar esta atividade em PDF">
          <Download size={18} /> Baixar PDF
        </button>
      </footer>
    </div>
  );
}
