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

const QUESTIONS = [
  {
    situation: "Votre visiteur entre dans le bien. Vous commencez par…",
    choixA: "Lui donner toutes les infos : surface, charges, DPE, étage.",
    choixB: "Le laisser découvrir la pièce principale en silence pendant 15 secondes.",
    bonne: "B",
    feedbackBon: "Le cerveau a besoin d’un moment pour se projeter. En 15 secondes de silence, votre visiteur commence à se voir vivre ici. Aucune fiche technique ne crée cet effet.",
    feedbackMauvais: "Trop d’infos d’un coup, c’est comme du bruit. Le cerveau se met en mode « analyse froide » au lieu de se projeter. Résultat : il repart sans émotion.",
    friction: "Surcharge d’informations",
    conseil: "Laissez respirer. Le silence est votre meilleur argument de vente.",
  },
  {
    situation: "Le visiteur dit « C’est plus petit que ce que j’imaginais ». Vous répondez…",
    choixA: "« C’est 65m², c’est la taille standard pour ce type de bien dans le quartier. »",
    choixB: "« Je comprends cette impression. Regardez comment la lumière agrandit cet espace — et ce coin là-bas, vous mettriez quoi ? »",
    bonne: "B",
    feedbackBon: "Quand quelqu’un dit « c’est petit », il ne parle pas de mètres carrés. Il exprime un ressenti. En le faisant se projeter (« vous mettriez quoi ? »), vous transformez une objection en imagination.",
    feedbackMauvais: "Répondre par des chiffres à une émotion, c’est comme répondre en anglais à quelqu’un qui parle français. Le message ne passe pas.",
    friction: "Répondre avec la raison à une émotion",
    conseil: "Quand le visiteur exprime un ressenti, répondez avec du ressenti. Les chiffres viendront après.",
  },
  {
    situation: "Vous avez 3 biens à proposer à un acquéreur. Vous lui montrez…",
    choixA: "Les 3 biens dans la même journée pour qu’il puisse comparer.",
    choixB: "2 biens max, dont un clairement au-dessus du lot.",
    bonne: "B",
    feedbackBon: "Trop de choix tue la décision. C’est prouvé : au-delà de 2 options, le cerveau bloque et reporte sa décision. Montrer 2 biens dont un favori, c’est faciliter la prise de décision.",
    feedbackMauvais: "3 visites dans une journée, c’est comme 3 épisodes de séries différentes. À la fin, tout se mélange. Votre visiteur rentre chez lui en disant « on va réfléchir ».",
    friction: "Trop de choix",
    conseil: "Limitez les options. Deux biens, un favori clair. Le cerveau vous remerciera.",
  },
  {
    situation: "Le visiteur hésite. Il dit « Je vais réfléchir ». Vous…",
    choixA: "Lui rappelez qu’il y a d’autres visiteurs intéressés pour créer de l’urgence.",
    choixB: "Lui demandez : « Qu’est-ce qui vous manque pour vous sentir en confiance ? »",
    bonne: "B",
    feedbackBon: "« Je vais réfléchir » veut souvent dire « il me manque quelque chose pour me sentir en sécurité ». En posant cette question, vous découvrez le vrai blocage — et vous pouvez y répondre.",
    feedbackMauvais: "La pression de la concurrence fonctionne parfois. Mais elle crée du stress, pas de la confiance. Un client pressé peut signer… et se rétracter dans les 10 jours.",
    friction: "Créer du stress au lieu de la confiance",
    conseil: "Le vrai levier, ce n’est pas l’urgence. C’est la confiance.",
  },
  {
    situation: "Votre annonce en ligne est publiée depuis 3 semaines sans contact. Vous…",
    choixA: "Baissez le prix de 5% pour relancer l’intérêt.",
    choixB: "Changez la photo principale et le titre de l’annonce.",
    bonne: "B",
    feedbackBon: "La première chose que voit un acheteur en ligne, c’est la photo et le titre. Si personne ne clique, ce n’est pas un problème de prix — c’est un problème de première impression. Changer la vitrine coûte 0€ et peut tout changer.",
    feedbackMauvais: "Baisser le prix sans comprendre pourquoi ça ne marche pas, c’est comme baisser le volume quand la chanson ne plaît pas. Le problème n’est pas le son, c’est la chanson.",
    friction: "Mauvaise première impression en ligne",
    conseil: "Avant de toucher au prix, changez la vitrine. La première photo décide de tout.",
  },
  {
    situation: "Pendant la visite, le visiteur commence à ouvrir les placards et mesurer les murs. Vous…",
    choixA: "L’accompagnez dans chaque pièce en commentant les détails techniques.",
    choixB: "Vous reculez d’un pas et le laissez explorer seul quelques minutes.",
    bonne: "B",
    feedbackBon: "Quand quelqu’un mesure et explore, il est en train de se projeter. C’est le meilleur signe possible. Si vous intervenez à ce moment, vous cassez son film intérieur. Laissez-le rêver.",
    feedbackMauvais: "Commenter chaque détail pendant que le visiteur explore, c’est comme parler pendant un film au cinéma. Ça coupe l’immersion — et l’envie.",
    friction: "Interrompre le moment de projection",
    conseil: "Quand le visiteur explore seul, il achète mentalement. Ne cassez pas ce moment.",
  },
  {
    situation: "Vous faites visiter un appartement avec un petit défaut visible (peinture abîmée). Vous…",
    choixA: "Espérez que le visiteur ne le remarquera pas et ne dites rien.",
    choixB: "Mentionnez le défaut vous-même en arrivant dans la pièce, avec la solution.",
    bonne: "B",
    feedbackBon: "Mentionner un défaut avant le visiteur crée un effet puissant : la confiance. Le cerveau se dit « si cette personne me montre les problèmes, c’est qu’elle ne me cache rien ». Vous devenez l’allié, pas le vendeur.",
    feedbackMauvais: "Si le visiteur découvre le défaut seul, il se demande « quoi d’autre on me cache ? ». Un seul doute suffit à tuer la confiance — et la vente avec.",
    friction: "Perte de confiance par omission",
    conseil: "Montrez les défauts vous-même. La transparence est votre arme secrète.",
  },
];

const getProfil = (score, total) => {
  const pct = (score / total) * 100;
  if (pct >= 85) return { titre: "Vous lisez dans le cerveau de vos clients", emoji: "🧠", couleur: C.success, desc: "Vous comprenez ce qui se passe dans la tête de vos visiteurs. Vos visites ne sont pas des récitations — ce sont des expériences. Continuez à affiner votre approche." };
  if (pct >= 57) return { titre: "Bonne intuition, mais quelques pièges à éviter", emoji: "💡", couleur: C.warning, desc: "Vous sentez les choses, mais certains réflexes classiques vous freinent encore. Les situations où vous avez trébuché sont les plus courantes — et les plus coûteuses." };
  return { titre: "Mode automatique activé", emoji: "⚡", couleur: C.danger, desc: "Vous faites comme on vous a appris. Le problème ? Ce qu’on enseigne en formation classique va souvent à l’encontre de ce que le cerveau du client attend. La bonne nouvelle : quelques ajustements changent tout." };
};

function ChoixBtn({ label, lettre, onClick, disabled, selected, isCorrect }) {
  const base = { width: "100%", padding: "16px 20px", borderRadius: "12px", border: `1px solid ${C.border}`, background: C.card, color: C.text, fontSize: "15px", lineHeight: "1.5", cursor: disabled ? "default" : "pointer", textAlign: "left", transition: "all 0.2s ease", display: "flex", gap: "12px", alignItems: "flex-start" };
  if (selected && isCorrect) Object.assign(base, { borderColor: C.success, background: "#1a2e1a" });
  else if (selected && !isCorrect) Object.assign(base, { borderColor: C.danger, background: "#2e1a1a" });
  return (
    <button style={base} onClick={onClick} disabled={disabled}
      onMouseEnter={e => { if (!disabled) { e.target.style.borderColor = C.primary; e.target.style.background = C.cardHover; }}}
      onMouseLeave={e => { if (!disabled && !selected) { e.target.style.borderColor = C.border; e.target.style.background = C.card; }}}>
      <span style={{ fontWeight: 700, color: C.primary, minWidth: "24px" }}>{lettre}.</span>
      <span>{label}</span>
    </button>
  );
}

function FeedbackCard({ question, choix }) {
  const correct = choix === question.bonne;
  return (
    <div style={{ marginTop: "16px", padding: "20px", borderRadius: "12px", border: `1px solid ${correct ? C.success : C.danger}`, background: correct ? "#0d1f0d" : "#1f0d0d", animation: "fadeIn 0.4s ease" }}>
      <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px", color: correct ? C.success : C.danger }}>
        {correct ? "✓ Bonne réponse" : "✗ Pas tout à fait"}
      </div>
      <p style={{ color: C.text, lineHeight: "1.6", margin: "0 0 12px 0", fontSize: "15px" }}>
        {correct ? question.feedbackBon : question.feedbackMauvais}
      </p>
      <div style={{ padding: "12px 16px", borderRadius: "8px", background: C.bgAlt, borderLeft: `3px solid ${C.orange}` }}>
        <div style={{ color: C.orange, fontWeight: 700, fontSize: "13px", marginBottom: "4px" }}>
          💡 Ce qui bloque : {question.friction}
        </div>
        <div style={{ color: C.muted, fontSize: "14px" }}>{question.conseil}</div>
      </div>
    </div>
  );
}

export default function DiagnosticFriction() {
  const [phase, setPhase] = useState("intro");
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [choix, setChoix] = useState(null);
  const [frictions, setFrictions] = useState([]);
  const topRef = useRef(null);

  useEffect(() => {
    if (topRef.current) topRef.current.scrollIntoView({ behavior: "smooth" });
  }, [current, phase]);

  const handleChoix = (lettre) => {
    if (choix) return;
    setChoix(lettre);
    const q = QUESTIONS[current];
    if (lettre === q.bonne) setScore(s => s + 1);
    else setFrictions(f => [...f, q.friction]);
  };

  const next = () => {
    if (current < QUESTIONS.length - 1) { setCurrent(c => c + 1); setChoix(null); }
    else setPhase("result");
  };

  const profil = getProfil(score, QUESTIONS.length);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif", display: "flex", justifyContent: "center", padding: "20px" }}>
      <div style={{ maxWidth: "640px", width: "100%", margin: "0 auto" }} ref={topRef}>
        <div style={{ textAlign: "center", padding: "8px", color: C.muted, fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>
          SYSTEME1-IMMO™ · DIAGNOSTIC GRATUIT
        </div>

        {phase === "intro" && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <h1 style={{ fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 800, textAlign: "center", lineHeight: 1.2, margin: "0 0 16px 0", background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Vos visites font-elles fuir vos acheteurs ?
            </h1>
            <p style={{ textAlign: "center", color: C.muted, fontSize: "16px", lineHeight: 1.6, margin: "0 0 24px 0" }}>
              7 situations de terrain. Des réflexes qui semblent logiques — mais qui bloquent la décision d’achat sans que vous le sachiez.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginBottom: "32px", flexWrap: "wrap" }}>
              {[{ val: "7", lab: "situations" }, { val: "3 min", lab: "chrono" }, { val: "🎯", lab: "diagnostic personnalisé" }].map((item, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "24px", fontWeight: 800, color: C.orange }}>{item.val}</div>
                  <div style={{ fontSize: "12px", color: C.muted }}>{item.lab}</div>
                </div>
              ))}
            </div>
            <button onClick={() => setPhase("quiz")} style={{ width: "100%", padding: "16px", borderRadius: "12px", border: "none", background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`, color: "#fff", fontSize: "16px", fontWeight: 700, cursor: "pointer", transition: "transform 0.2s", boxShadow: "0 4px 20px rgba(114,170,238,0.3)" }}
              onMouseEnter={e => e.target.style.transform = "scale(1.02)"}
              onMouseLeave={e => e.target.style.transform = "scale(1)"}>
              Découvrir mon diagnostic
            </button>
          </div>
        )}

        {phase === "quiz" && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: C.muted, fontSize: "14px" }}>Question {current + 1} / {QUESTIONS.length}</span>
                <span style={{ color: C.primary, fontSize: "14px", fontWeight: 600 }}>{score} bonne{score > 1 ? "s" : ""} réponse{score > 1 ? "s" : ""}</span>
              </div>
              <div style={{ height: "4px", background: C.border, borderRadius: "2px" }}>
                <div style={{ height: "100%", borderRadius: "2px", background: `linear-gradient(90deg, ${C.primary}, ${C.primaryDark})`, width: `${((current + 1) / QUESTIONS.length) * 100}%`, transition: "width 0.4s ease" }} />
              </div>
            </div>
            <div style={{ padding: "20px", borderRadius: "12px", background: C.card, border: `1px solid ${C.border}`, marginBottom: "16px" }}>
              <div style={{ color: C.orange, fontSize: "12px", fontWeight: 700, marginBottom: "8px", textTransform: "uppercase" }}>Situation de terrain</div>
              <p style={{ color: C.text, fontSize: "16px", lineHeight: 1.6, margin: 0, fontWeight: 500 }}>{QUESTIONS[current].situation}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <ChoixBtn label={QUESTIONS[current].choixA} lettre="A" onClick={() => handleChoix("A")} disabled={!!choix} selected={choix === "A"} isCorrect={QUESTIONS[current].bonne === "A"} />
              <ChoixBtn label={QUESTIONS[current].choixB} lettre="B" onClick={() => handleChoix("B")} disabled={!!choix} selected={choix === "B"} isCorrect={QUESTIONS[current].bonne === "B"} />
            </div>
            {choix && <FeedbackCard question={QUESTIONS[current]} choix={choix} />}
            {choix && (
              <button onClick={next} style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`, color: "#fff", fontSize: "15px", fontWeight: 700, cursor: "pointer", marginTop: "20px", transition: "transform 0.2s" }}
                onMouseEnter={e => e.target.style.transform = "scale(1.02)"}
                onMouseLeave={e => e.target.style.transform = "scale(1)"}>
                {current < QUESTIONS.length - 1 ? "Situation suivante →" : "Voir mon diagnostic →"}
              </button>
            )}
          </div>
        )}

        {phase === "result" && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <div style={{ textAlign: "center", padding: "32px 20px", borderRadius: "12px", background: C.card, border: `1px solid ${profil.couleur}`, marginBottom: "24px" }}>
              <div style={{ fontSize: "48px", marginBottom: "8px" }}>{profil.emoji}</div>
              <div style={{ fontSize: "42px", fontWeight: 800, color: profil.couleur }}>{score}/{QUESTIONS.length}</div>
              <h2 style={{ fontSize: "22px", fontWeight: 700, margin: "12px 0 8px 0", color: C.text }}>{profil.titre}</h2>
              <p style={{ color: C.muted, fontSize: "15px", lineHeight: 1.6, margin: 0 }}>{profil.desc}</p>
            </div>
            {frictions.length > 0 && (
              <div style={{ padding: "20px", borderRadius: "12px", background: C.card, border: `1px solid ${C.border}`, marginBottom: "24px" }}>
                <h3 style={{ color: C.orange, fontSize: "16px", fontWeight: 700, margin: "0 0 12px 0" }}>🔍 Ce qui bloque vos visiteurs</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {frictions.map((f, i) => (
                    <div key={i} style={{ padding: "10px 14px", borderRadius: "8px", background: C.bgAlt, borderLeft: `3px solid ${C.orange}`, color: C.text, fontSize: "14px" }}>{f}</div>
                  ))}
                </div>
                <p style={{ color: C.muted, fontSize: "14px", marginTop: "12px", marginBottom: 0 }}>Ces blocages sont invisibles pendant vos visites. Mais ils sont là — et ils coûtent des mandats.</p>
              </div>
            )}
            <a href="https://www.linkedin.com/in/nordine-mouaouia-neurosciences-ia-immobilier/" target="_blank" rel="noopener noreferrer"
              style={{ display: "block", width: "100%", padding: "16px", borderRadius: "12px", background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`, color: "#fff", fontSize: "16px", fontWeight: 700, textAlign: "center", textDecoration: "none", boxShadow: "0 4px 20px rgba(114,170,238,0.3)", transition: "transform 0.2s", marginBottom: "12px" }}
              onMouseEnter={e => e.target.style.transform = "scale(1.02)"}
              onMouseLeave={e => e.target.style.transform = "scale(1)"}>
              Suivez Nordine sur LinkedIn →
            </a>
            <p style={{ textAlign: "center", color: C.muted, fontSize: "13px", marginBottom: "32px" }}>Chaque semaine, des conseils concrets pour vendre avec le cerveau de vos clients — pas contre lui.</p>
            <button onClick={() => { setPhase("intro"); setCurrent(0); setScore(0); setChoix(null); setFrictions([]); }}
              style={{ width: "100%", padding: "12px", borderRadius: "12px", border: `1px solid ${C.border}`, background: "transparent", color: C.muted, fontSize: "14px", cursor: "pointer" }}>
              ↺ Recommencer le diagnostic
            </button>
            <div style={{ textAlign: "center", marginTop: "32px", padding: "16px 0", borderTop: `1px solid ${C.border}`, color: C.mutedDark, fontSize: "12px" }}>
              Nordine Mouaouia · SYSTEME1-IMMO™
            </div>
          </div>
        )}

        <style>{`
          @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          button { font-family: 'Inter', sans-serif; }
        `}</style>
      </div>
    </div>
  );
}
