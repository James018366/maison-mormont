/* =========================================================
   MAISON MORMONT · GRAND REGISTRE
   ---------------------------------------------------------
   ✏️  Modifie ces lignes pour mettre à jour tout le site d'un coup.
   ========================================================= */
const MAISON = {
  seigneur:       "Alastor Mormont",       // prénom RP du Seigneur
  joueurSeigneur: "James",       // pseudo du joueur
  frere:          "Jorah Mormont",
  joueurFrere:    "Mortiphax",
  annee:          "183"
};

/* ---------- Navigation ---------- */
const NAV = [
  ["index.html",      "Accueil"],
  ["maison.html",     "Histoire"],
  ["membres.html",    "Membres"],
  ["arbre.html",      "Arbre"],
  ["artefacts.html",  "Artéfacts"],
  ["objectifs.html",  "Objectifs"],
  ["ile.html",        "L'Île"],
  ["chroniques.html", "Chroniques"],
  ["diplomatie.html", "Diplomatie"],
  ["candidature.html","Candidature"]
];

/* ---------- Blason (SVG partagé) ---------- */
const CREST_DEFS = `
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <linearGradient id="shieldG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2d5a37"/><stop offset="1" stop-color="#0f2415"/></linearGradient>
  <linearGradient id="rimG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9d3bf"/><stop offset="1" stop-color="#6e6a5c"/></linearGradient>
  <linearGradient id="steelG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5d6670"/><stop offset=".5" stop-color="#d7dde3"/><stop offset="1" stop-color="#5d6670"/></linearGradient>
  <symbol id="crest" viewBox="0 0 100 120">
    <path d="M50 4 L94 16 V58 C94 88 72 106 50 116 C28 106 6 88 6 58 V16 Z" fill="url(#rimG)"/>
    <path d="M50 10 L88 20 V58 C88 84 69 100 50 109 C31 100 12 84 12 58 V20 Z" fill="url(#shieldG)"/>
    <g fill="#183a22">
      <path d="M18 30 l5 -10 l5 10 z M18 42 l5 -10 l5 10 z M18 54 l5 -10 l5 10 z M20 68 l5 -10 l5 10 z"/>
      <path d="M72 30 l5 -10 l5 10 z M72 42 l5 -10 l5 10 z M72 54 l5 -10 l5 10 z M70 68 l5 -10 l5 10 z"/>
      <path d="M30 86 l5 -10 l5 10 z M45 92 l5 -10 l5 10 z M60 86 l5 -10 l5 10 z"/>
    </g>
    <g fill="#070b08">
      <ellipse cx="50" cy="64" rx="15" ry="13"/>
      <ellipse cx="34" cy="45" rx="5.2" ry="6.5" transform="rotate(-20 34 45)"/>
      <ellipse cx="44" cy="39" rx="5.2" ry="6.8" transform="rotate(-6 44 39)"/>
      <ellipse cx="56" cy="39" rx="5.2" ry="6.8" transform="rotate(6 56 39)"/>
      <ellipse cx="66" cy="45" rx="5.2" ry="6.5" transform="rotate(20 66 45)"/>
    </g>
    <g fill="#e8e2d0">
      <path d="M31 39 l-2 -8 l4 6 z"/><path d="M42 32 l-1 -8 l3 7 z"/>
      <path d="M58 32 l1 -8 l1 8 z"/><path d="M69 39 l2 -8 l0 7 z"/>
    </g>
  </symbol>
</defs></svg>`;

(function build(){
  const page = (location.pathname.split("/").pop() || "index.html");
  const isHome = page === "index.html" || page === "";
  const body = document.body;

  body.insertAdjacentHTML("afterbegin", CREST_DEFS + (isHome ? `
    <div id="loader">
      <svg class="crest" viewBox="0 0 100 120"><use href="#crest"/></svg>
      <div class="txt">OUVERTURE DES PORTES DU FORT…</div>
      <div class="bar"><i></i></div>
    </div>` : "") + `
    <canvas id="snow"></canvas>
    <header><div class="wrap">
      <div class="top">
        <a class="brand" href="index.html" aria-label="Accueil Maison Mormont">
          <svg viewBox="0 0 100 120"><use href="#crest"/></svg>
          <span><b>MAISON MORMONT</b><small>GRAND REGISTRE · BAIE DES GLACES</small></span>
        </a>
        <div class="clock"><b id="clock">--:--:--</b><small>AN ${MAISON.annee} APR. LA CONQUÊTE</small></div>
      </div>
      <nav>${NAV.map(([h,t]) => `<a href="${h}"${(h===page||(isHome&&h==="index.html"))?' class="on"':''}>${t}</a>`).join("")}</nav>
    </div></header>`);

  body.insertAdjacentHTML("beforeend", `
    <footer class="wrap">
      <div class="m">NOUS VOICI</div>
      <small>MAISON MORMONT · ÎLE-AUX-OURS · AN ${MAISON.annee}</small>
    </footer>`);

  /* Remplir les champs dynamiques */
  document.querySelectorAll("[data-f]").forEach(el => { el.textContent = MAISON[el.dataset.f] ?? el.textContent; });

  /* Lien actif visible dans la nav */
  const on = document.querySelector("nav a.on"); if (on) on.scrollIntoView({block:"nearest",inline:"center"});

  /* Apparition des cartes */
  const reveal = () => document.querySelectorAll(".card").forEach((c,i)=>setTimeout(()=>c.classList.add("in"),60*i));
  if (isHome) addEventListener("load", () => setTimeout(() => { document.getElementById("loader").classList.add("hide"); reveal(); }, 1700));
  else reveal();

  /* Horloge */
  const clk = document.getElementById("clock");
  const tick = () => clk.textContent = new Date().toLocaleTimeString("fr-FR");
  tick(); setInterval(tick, 1000);

  /* Recherche (accueil) */
  const q = document.getElementById("q");
  if (q) {
    const cards = [...document.querySelectorAll(".card")], empty = document.getElementById("empty");
    const norm = s => s.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
    q.addEventListener("input", () => {
      const v = norm(q.value.trim()); let n = 0;
      cards.forEach(c => { const ok = !v || norm(c.textContent).includes(v); c.style.display = ok ? "" : "none"; if (ok) n++; });
      document.querySelectorAll(".sec").forEach(s => s.style.display = [...s.querySelectorAll(".card")].some(c => c.style.display !== "none") ? "" : "none");
      empty.classList.toggle("show", n === 0);
    });
    addEventListener("keydown", e => {
      if (e.key === "/" && document.activeElement !== q) { e.preventDefault(); q.focus(); }
      if (e.key === "Escape") { q.value = ""; q.dispatchEvent(new Event("input")); q.blur(); }
    });
  }

  /* Neige */
  const cv = document.getElementById("snow"), cx = cv.getContext("2d"); let W, H, flakes = [];
  const size = () => { W = cv.width = innerWidth; H = cv.height = innerHeight;
    flakes = Array.from({length: Math.min(140, W/8)}, () => ({x:Math.random()*W, y:Math.random()*H, r:Math.random()*1.8+.4, s:Math.random()*.6+.25, d:Math.random()*Math.PI*2})); };
  size(); addEventListener("resize", size);
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) (function loop(){
    cx.clearRect(0,0,W,H);
    for (const f of flakes) {
      f.y += f.s; f.d += .01; f.x += Math.sin(f.d)*.35;
      if (f.y > H) { f.y = -5; f.x = Math.random()*W; }
      cx.beginPath(); cx.arc(f.x,f.y,f.r,0,Math.PI*2); cx.fillStyle = `rgba(232,226,208,${.25+f.r/4})`; cx.fill();
    }
    requestAnimationFrame(loop);
  })();

  /* Bouton copier (candidature) */
  document.querySelectorAll("[data-copy]").forEach(b => b.addEventListener("click", async () => {
    const src = document.getElementById(b.dataset.copy);
    try { await navigator.clipboard.writeText(src.innerText); b.textContent = "✓ Copié"; setTimeout(()=>b.textContent = b.dataset.label, 1800); } catch(e) {}
  }));
})();

/* Arbre : centrer sur mobile */
document.querySelectorAll(".tree-wrap").forEach(w => { w.scrollLeft = (w.scrollWidth - w.clientWidth) / 2; });
