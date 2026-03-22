import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════
   CHARTE GRAPHIQUE — Système 1 Immo
   ═══════════════════════════════════════════ */
const C = {
  bg: "#15161E", bgAlt: "#181A25", card: "#1E2029", cardHover: "#252735",
  primary: "#72AAEE", primaryDark: "#4D8BD5", orange: "#E4763F",
  text: "#F0F0F0", muted: "#ABABAB", mutedDark: "#6B7280",
  border: "#2F3241", success: "#4ADE80", danger: "#EF4444", warning: "#D4A035",
};

/* ═══════════════════════════════════════════
   DATA QUIZ — Le Cerveau du Client
   ═══════════════════════════════════════════ */
const QUIZ = {
  titre: "Le Cerveau de Votre Client",
  sousTitre: "5 situations terrain. Quelle est la bonne approche ?",
  intro: "Chaque situation est tirée de cas réels. Votre réponse révèle si vous vendez avec le cerveau... ou contre lui.",
  questions: [
    {
      scenario: "Vous faites visiter un T4 lumineux. L'acquéreur entre, vous commencez par :",
      choixA: "Réciter la fiche technique : surface, étage, DPE, charges, orientation.",
      choixB: "L'amener directement au salon baigné de lumière et le laisser s'imprégner 15 secondes en silence.",
      bonneReponse: "B",
      explicationBonne: "Le cerveau décide par l'émotion, pas par les données. Ces 15 secondes de silence créent un moment de projection. Le client se voit vivre là. Aucune fiche technique ne produit cet effet.",
      explicationMauvaise: "Sur mes 53 ventes en 2023, les biens vendus au-dessus de l'estimation avaient tous un point commun : la visite était construite autour d'un seul moment de projection. Pas autour de 15 données techniques.",
      consequence: "Résultat probable : le client hoche la tête poliment... et ne rappelle jamais.",
      coutEstime: "Mandat perdu + 3 mois de retard sur la vente",
      source: "Kahneman, D. (2011) — Thinking, Fast and Slow",
    },
    {
      scenario: "Un acquéreur hésite entre votre bien et un concurrent. Il vous dit : \"Je vais réfléchir.\" Vous répondez :",
      choixA: "\"Prenez votre temps, je reste disponible.\"",
      choixB: "\"Je comprends. Sachez que j'ai deux autres visites programmées cette semaine sur ce bien. Je vous rappelle vendredi pour faire le point.\"",
      bonneReponse: "B",
      explicationBonne: "L'aversion à la perte est 2,5× plus puissante que le désir de gain (Kahneman & Tversky). Créer une rareté perçue active le système d'urgence du cerveau. Ce n'est pas de la manipulation — c'est une information vraie présentée au bon moment.",
      explicationMauvaise: "\"Prenez votre temps\" donne au cerveau la permission de procrastiner. Sans tension, pas de décision. Le client repart, compare, oublie l'émotion de la visite, et finit par acheter ailleurs.",
      consequence: "Le client achète chez le concurrent 2 semaines plus tard.",
      coutEstime: "Commission perdue : ~8 000 à 15 000 €",
      source: "Tversky & Kahneman (1991) — Loss Aversion in Riskless Choice",
    },
    {
      scenario: "Vous estimez un bien. Le propriétaire a vu sur internet que son voisin a vendu 15% plus cher. Vous :",
      choixA: "Vous montrez vos comparables et expliquez pourquoi le prix doit être inférieur.",
      choixB: "Vous commencez par valider son ancrage : \"C'est une bonne référence. Regardons ensemble ce qui fait la différence entre les deux biens.\"",
      bonneReponse: "B",
      explicationBonne: "Le biais d'ancrage est l'un des plus puissants. Combattre frontalement l'ancrage du client renforce sa résistance. En le validant d'abord, vous désarmez la défense et ouvrez l'espace pour recadrer.",
      explicationMauvaise: "Contredire directement déclenche le biais de confirmation : le propriétaire cherchera toutes les raisons de prouver que VOUS avez tort. Vous perdez sa confiance avant même d'avoir commencé.",
      consequence: "Le propriétaire signe avec l'agence qui a dit oui à son prix. Le bien reste invendu 8 mois.",
      coutEstime: "Mandat exclusif perdu",
      source: "Ariely, D. (2008) — Predictably Irrational",
    },
    {
      scenario: "Fin de visite. L'acquéreur a aimé le bien mais semble indécis. Votre dernière action :",
      choixA: "Résumer tous les points forts du bien pour finir sur une note positive.",
      choixB: "Revenir dans la pièce qui l'a le plus ému et lui demander : \"Vous vous voyez prendre votre café ici le matin ?\"",
      bonneReponse: "B",
      explicationBonne: "L'effet Peak-End (Kahneman) : on ne retient que le pic émotionnel et la fin d'une expérience. En terminant sur un moment de projection émotionnelle, vous ancrez le bien dans sa mémoire comme un souvenir positif.",
      explicationMauvaise: "Un résumé de points forts est rationnel. Le cerveau ne décide pas rationnellement. Un listing final ne laisse aucune empreinte émotionnelle — juste une impression de \"présentation commerciale\".",
      consequence: "Le client se souvient de la visite comme \"correcte\" mais pas mémorable. Il visite 5 autres biens et oublie le vôtre.",
      coutEstime: "Bien vendu 2 mois plus tard, 8% sous le prix",
      source: "Kahneman, D. (1999) — Peak-End Rule",
    },
    {
      scenario: "Vous prospectez en porte-à-porte. Un propriétaire vous ouvre et dit : \"Les agents immobiliers, c'est tous les mêmes.\" Vous répondez :",
      choixA: "\"Je comprends votre méfiance. Laissez-moi vous montrer en quoi nous sommes différents avec nos services premium.\"",
      choixB: "\"Vous avez raison. 90% des agents font exactement la même chose. C'est pour ça que je fais autrement. Vous avez 2 minutes ?\"",
      bonneReponse: "B",
      explicationBonne: "La validation de la croyance du prospect + la rupture cognitive (\"c'est pour ça que je fais autrement\") active la curiosité. Vous n'êtes plus dans la catégorie \"agent immobilier\" — vous êtes une exception. Le cerveau adore les exceptions.",
      explicationMauvaise: "\"Laissez-moi vous montrer\" est une phrase de commercial. Elle confirme exactement le stéréotype que le prospect vient d'énoncer. Résultat : la porte se ferme dans les 10 secondes.",
      consequence: "Porte fermée. Quartier grillé.",
      coutEstime: "Zone de prospection compromise",
      source: "Cialdini, R. (2006) — Influence: The Psychology of Persuasion",
    },
  ],
};

/* ═══════════════════════════════════════════
   COMPOSANTS
   ═══════════════════════════════════════════ */

function ProgressBar({ current, total }) {
  const pct = ((current) / total) * 100;
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: C.muted }}>Question {current + 1} / {total}</span>
        <span style={{ fontSize: 11, color: C.primary }}>{Math.round(pct)}%</span>
      </div>
      <div style={{ height: 4, background: C.card, borderRadius: 4, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 4,
          background: `linear-gradient(90deg, ${C.primary}, ${C.primaryDark})`,
          width: `${pct}%`, transition: "width 0.5s ease",
        }} />
      </div>
    </div>
  );
}

function ChoixButton({ label, lettre, onClick, disabled, etat }) {
  const isCorrect = etat === "correct";
  const isWrong = etat === "wrong";
  const isRevealed = etat === "revealed";

  let bg = C.card;
  let borderColor = C.border;
  let glow = "none";
  if (isCorrect) { bg = `${C.success}15`; borderColor = C.success; glow = `0 0 20px ${C.success}30`; }
  if (isWrong) { bg = `${C.danger}15`; borderColor = C.danger; glow = `0 0 20px ${C.danger}30`; }
  if (isRevealed) { bg = `${C.success}08`; borderColor = `${C.success}50`; }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%", padding: "16px 18px", borderRadius: 12, cursor: disabled ? "default" : "pointer",
        background: bg, border: `2px solid ${borderColor}`,
        textAlign: "left", transition: "all 0.3s ease", boxShadow: glow,
        transform: isWrong ? "translateX(0)" : "none",
        animation: isWrong ? "shake 0.5s ease" : "none",
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
          background: isCorrect ? C.success : isWrong ? C.danger : `${C.primary}15`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 15, fontWeight: 800,
          color: isCorrect ? "white" : isWrong ? "white" : C.primary,
          transition: "all 0.3s ease",
        }}>
          {isCorrect ? "\u2713" : isWrong ? "\u2717" : lettre}
        </div>
        <div style={{ fontSize: 14, color: C.text, lineHeight: 1.6, fontWeight: 500 }}>
          {label}
        </div>
      </div>
    </button>
  );
}

function ResultatFeedback({ question, choixUser, visible }) {
  const correct = choixUser === question.bonneReponse;

  if (!visible) return null;

  return (
    <div style={{
      marginTop: 16, padding: 20, borderRadius: 12,
      background: correct ? `${C.success}08` : `${C.danger}08`,
      border: `1px solid ${correct ? C.success : C.danger}30`,
      animation: "fadeIn 0.4s ease",
    }}>
      {/* Verdict */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10, marginBottom: 12,
      }}>
        <div style={{
          fontSize: 28,
          animation: correct ? "pulse 0.6s ease" : "none",
        }}>
          {correct ? "\u2705" : "\u274c"}
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: correct ? C.success : C.danger }}>
            {correct ? "Bonne approche !" : "Mauvaise approche."}
          </div>
        </div>
      </div>

      {/* Explication */}
      <div style={{
        fontSize: 14, color: C.text, lineHeight: 1.7, marginBottom: 16,
      }}>
        {correct ? question.explicationBonne : question.explicationMauvaise}
      </div>

      {/* Conséquence si mauvaise réponse */}
      {!correct && (
        <div style={{
          padding: 14, background: `${C.danger}10`, borderRadius: 10,
          border: `1px solid ${C.danger}25`, marginBottom: 12,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.danger, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
            Cons\u00e9quence terrain
          </div>
          <div style={{ fontSize: 14, color: C.text, lineHeight: 1.5, marginBottom: 6 }}>
            {question.consequence}
          </div>
          <div style={{
            display: "inline-block", fontSize: 13, fontWeight: 700, color: C.danger,
            background: `${C.danger}15`, padding: "4px 10px", borderRadius: 6,
          }}>
            {question.coutEstime}
          </div>
        </div>
      )}

      {/* Source */}
      <div style={{ fontSize: 11, color: C.mutedDark, fontStyle: "italic" }}>
        {question.source}
      </div>
    </div>
  );
}

function ScoreFinal({ score, total, onRestart }) {
  const pct = Math.round((score / total) * 100);
  let verdict, couleur, emoji;
  if (pct >= 80) { verdict = "Expert en neurovente"; couleur = C.success; emoji = "\ud83e\udde0"; }
  else if (pct >= 60) { verdict = "Bon instinct, perfectible"; couleur = C.primary; emoji = "\ud83d\udca1"; }
  else if (pct >= 40) { verdict = "Des r\u00e9flexes \u00e0 d\u00e9construire"; couleur = C.warning; emoji = "\u26a0\ufe0f"; }
  else { verdict = "Votre cerveau vend contre vous"; couleur = C.danger; emoji = "\ud83d\udea8"; }

  return (
    <div style={{ animation: "fadeIn 0.6s ease" }}>
      {/* Score visuel */}
      <div style={{
        textAlign: "center", padding: 32, background: C.card, borderRadius: 16,
        border: `1px solid ${couleur}40`, position: "relative", overflow: "hidden",
        marginBottom: 20,
      }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          width: 250, height: 250, borderRadius: "50%",
          background: `radial-gradient(circle, ${couleur}12 0%, transparent 70%)`,
        }} />
        <div style={{ fontSize: 56, marginBottom: 8, zIndex: 1, position: "relative" }}>{emoji}</div>
        <div style={{ fontSize: 48, fontWeight: 900, color: couleur, zIndex: 1, position: "relative" }}>
          {score}/{total}
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: C.text, marginTop: 4, zIndex: 1, position: "relative" }}>
          {verdict}
        </div>
        <div style={{ fontSize: 14, color: C.muted, marginTop: 8, zIndex: 1, position: "relative" }}>
          {pct}% de bonnes r\u00e9ponses
        </div>
      </div>

      {/* Message personnalis\u00e9 */}
      <div style={{
        padding: 20, background: `${couleur}08`, borderRadius: 12,
        border: `1px solid ${couleur}25`, marginBottom: 20,
      }}>
        <div style={{ fontSize: 15, color: C.text, lineHeight: 1.7 }}>
          {pct >= 60
            ? "Vous comprenez d\u00e9j\u00e0 que la vente immobili\u00e8re est un jeu de perception, pas de donn\u00e9es. La m\u00e9thode Syst\u00e8me 1 Immo structure ces intuitions en un syst\u00e8me reproductible."
            : "La bonne nouvelle : ces erreurs sont les plus courantes du m\u00e9tier. La m\u00e9thode Syst\u00e8me 1 Immo vous apprend \u00e0 vendre avec le cerveau de votre client, pas contre lui."}
        </div>
      </div>

      {/* CTA LinkedIn */}
      <a
        href="https://www.linkedin.com/in/nordine-mouaouia-neurosciences-ia-immobilier/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "block", width: "100%", padding: "14px 20px", borderRadius: 12,
          background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`,
          color: "white", fontWeight: 700, fontSize: 15, textAlign: "center",
          textDecoration: "none",
          boxShadow: `0 0 30px ${C.primary}30`,
        }}
      >
        Suivez Nordine sur LinkedIn
      </a>
      <div style={{
        marginTop: 10, padding: "12px 16px", background: `${C.orange}10`,
        borderRadius: 10, border: `1px solid ${C.orange}25`, textAlign: "center",
      }}>
        <div style={{ fontSize: 13, color: C.text, fontWeight: 600, marginBottom: 2 }}>
          Recevez Insight Immo chaque mercredi
        </div>
        <div style={{ fontSize: 12, color: C.muted }}>
          Commentez "INSIGHT" sous mon dernier post LinkedIn
        </div>
      </div>

      <button
        onClick={onRestart}
        style={{
          display: "block", width: "100%", padding: "12px", marginTop: 10,
          borderRadius: 10, background: "transparent",
          border: `1px solid ${C.border}`, color: C.muted,
          cursor: "pointer", fontSize: 13,
        }}
      >
        Recommencer le quiz
      </button>

      <div style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: C.mutedDark }}>
        Nordine Mouaouia · SYSTEME1-IMMO™
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPOSANT PRINCIPAL
   ═══════════════════════════════════════════ */
export default function QuizCerveauClient() {
  const [etape, setEtape] = useState("intro"); // intro | quiz | score
  const [questionIndex, setQuestionIndex] = useState(0);
  const [choixUser, setChoixUser] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);

  const q = QUIZ.questions[questionIndex];
  const total = QUIZ.questions.length;

  const handleChoix = (lettre) => {
    if (choixUser) return;
    setChoixUser(lettre);
    if (lettre === q.bonneReponse) setScore(s => s + 1);
    setAnswers(prev => [...prev, lettre]);
    setTimeout(() => setShowFeedback(true), 400);
  };

  const handleNext = () => {
    if (questionIndex < total - 1) {
      setQuestionIndex(i => i + 1);
      setChoixUser(null);
      setShowFeedback(false);
    } else {
      setEtape("score");
    }
  };

  const handleRestart = () => {
    setEtape("intro");
    setQuestionIndex(0);
    setChoixUser(null);
    setShowFeedback(false);
    setScore(0);
    setAnswers([]);
  };

  return (
    <div style={{
      maxWidth: 600, margin: "0 auto", padding: "24px 16px",
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      background: `linear-gradient(180deg, ${C.bg} 0%, ${C.bgAlt} 50%, ${C.bg} 100%)`,
      minHeight: "100vh", color: C.text,
    }}>
      <style>{`
        @keyframes shake { 0%,100% { transform: translateX(0); } 20%,60% { transform: translateX(-6px); } 40%,80% { transform: translateX(6px); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.15); } 100% { transform: scale(1); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* ═══ INTRO ═══ */}
      {etape === "intro" && (
        <div style={{ animation: "fadeIn 0.5s ease" }}>
          {/* Badge */}
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{
              display: "inline-block", fontSize: 10, fontWeight: 600, color: C.primary,
              textTransform: "uppercase", letterSpacing: "0.15em", padding: "5px 14px",
              background: `${C.primary}10`, borderRadius: 20, border: `1px solid ${C.primary}25`,
            }}>
              SYSTEME1-IMMO™ · QUIZ INTERACTIF
            </div>
          </div>

          {/* Visual */}
          <div style={{
            textAlign: "center", padding: "40px 24px", background: C.card,
            borderRadius: 16, border: `1px solid ${C.border}`,
            position: "relative", overflow: "hidden", marginBottom: 20,
          }}>
            <div style={{
              position: "absolute", top: "40%", left: "50%", transform: "translate(-50%,-50%)",
              width: 300, height: 300, borderRadius: "50%",
              background: `radial-gradient(circle, ${C.primary}10 0%, transparent 70%)`,
            }} />
            <div style={{ fontSize: 56, marginBottom: 16, zIndex: 1, position: "relative" }}>{"\ud83e\udde0"}</div>
            <h1 style={{
              fontSize: 28, fontWeight: 900, lineHeight: 1.2, zIndex: 1, position: "relative",
              background: `linear-gradient(135deg, ${C.text}, ${C.primary})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              {QUIZ.titre}
            </h1>
            <p style={{ fontSize: 15, color: C.muted, marginTop: 10, zIndex: 1, position: "relative" }}>
              {QUIZ.sousTitre}
            </p>
          </div>

          {/* Description */}
          <div style={{
            padding: 16, background: `${C.orange}08`, borderRadius: 12,
            border: `1px solid ${C.orange}25`, marginBottom: 20,
            fontSize: 14, color: C.muted, lineHeight: 1.6,
          }}>
            {QUIZ.intro}
          </div>

          {/* Infos */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 24 }}>
            {[
              { val: `${total}`, label: "questions" },
              { val: "3 min", label: "dur\u00e9e" },
              { val: "\ud83c\udfaf", label: "score final" },
            ].map((item, i) => (
              <div key={i} style={{
                padding: "12px 8px", background: C.card, borderRadius: 10,
                border: `1px solid ${C.border}`, textAlign: "center",
              }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: C.primary }}>{item.val}</div>
                <div style={{ fontSize: 11, color: C.mutedDark }}>{item.label}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => setEtape("quiz")}
            style={{
              width: "100%", padding: "14px 24px", borderRadius: 12, border: "none",
              background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`,
              color: "white", fontWeight: 700, fontSize: 16, cursor: "pointer",
              boxShadow: `0 0 30px ${C.primary}30`, transition: "all 0.2s",
            }}
          >
            Commencer le quiz
          </button>
        </div>
      )}

      {/* ═══ QUIZ ═══ */}
      {etape === "quiz" && (
        <div style={{ animation: "slideUp 0.4s ease" }} key={questionIndex}>
          <ProgressBar current={questionIndex} total={total} />

          {/* Sc\u00e9nario */}
          <div style={{
            padding: 20, background: C.card, borderRadius: 12,
            border: `1px solid ${C.border}`, marginBottom: 16,
          }}>
            <div style={{
              fontSize: 11, fontWeight: 700, color: C.orange, textTransform: "uppercase",
              letterSpacing: "0.08em", marginBottom: 8,
            }}>
              Situation terrain
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: C.text, lineHeight: 1.6 }}>
              {q.scenario}
            </div>
          </div>

          {/* Choix */}
          <div style={{ display: "grid", gap: 10, marginBottom: 4 }}>
            <ChoixButton
              lettre="A"
              label={q.choixA}
              onClick={() => handleChoix("A")}
              disabled={choixUser !== null}
              etat={
                choixUser === null ? null
                : choixUser === "A" && q.bonneReponse === "A" ? "correct"
                : choixUser === "A" && q.bonneReponse !== "A" ? "wrong"
                : q.bonneReponse === "A" ? "revealed"
                : null
              }
            />
            <ChoixButton
              lettre="B"
              label={q.choixB}
              onClick={() => handleChoix("B")}
              disabled={choixUser !== null}
              etat={
                choixUser === null ? null
                : choixUser === "B" && q.bonneReponse === "B" ? "correct"
                : choixUser === "B" && q.bonneReponse !== "B" ? "wrong"
                : q.bonneReponse === "B" ? "revealed"
                : null
              }
            />
          </div>

          {/* Feedback */}
          <ResultatFeedback question={q} choixUser={choixUser} visible={showFeedback} />

          {/* Bouton suivant */}
          {showFeedback && (
            <button
              onClick={handleNext}
              style={{
                width: "100%", marginTop: 16, padding: "12px 20px", borderRadius: 10,
                border: "none", cursor: "pointer",
                background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`,
                color: "white", fontWeight: 700, fontSize: 14,
                animation: "fadeIn 0.3s ease",
              }}
            >
              {questionIndex < total - 1 ? "Question suivante \u2192" : "Voir mon score \u2192"}
            </button>
          )}
        </div>
      )}

      {/* ═══ SCORE ═══ */}
      {etape === "score" && (
        <ScoreFinal score={score} total={total} onRestart={handleRestart} />
      )}
    </div>
  );
}
