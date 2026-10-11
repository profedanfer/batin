/* ═══════════════════════════════════════════
   BATIN · batin.js
   Componentes compartidos: nav, footer, utils
═══════════════════════════════════════════ */

// ── BASE: se calcula según desde dónde se cargó este script ──
// En páginas de raíz: <script src="batin.js">        → BASE = ''
// En páginas de subcarpeta: <script src="../batin.js"> → BASE = '../'
const BATIN_BASE = (() => {
  const scriptEl = document.currentScript;
  const srcAttr = scriptEl ? scriptEl.getAttribute('src') : 'batin.js';
  return srcAttr.replace(/batin\.js(\?.*)?$/, '');
})();

// ── MODO CLARO / OSCURO ──
// Se guarda en el navegador con la clave 'batin-tema' ('claro' | 'oscuro').
// Por defecto: oscuro (la identidad de BATIN).
// Para evitar el "parpadeo", cada página repite estas dos líneas en su <head>:
//   <script>try{if(localStorage.getItem('batin-tema')==='claro')document.documentElement.dataset.tema='claro'}catch(e){}</script>
const BATIN_TEMA_CLAVE = 'batin-tema';

function batinTemaActual() {
  return document.documentElement.dataset.tema === 'claro' ? 'claro' : 'oscuro';
}

function batinAplicarTema(tema, guardar) {
  const html = document.documentElement;
  if (tema === 'claro') html.dataset.tema = 'claro';
  else delete html.dataset.tema;
  if (guardar) { try { localStorage.setItem(BATIN_TEMA_CLAVE, tema); } catch (e) {} }
  const btn = document.getElementById('batin-tema-btn');
  if (btn) {
    btn.textContent = tema === 'claro' ? '🌙' : '☀️';
    btn.title = tema === 'claro' ? 'Cambiar a modo oscuro (sala iluminada)' : 'Cambiar a modo claro (sala oscura)';
    btn.setAttribute('aria-label', btn.title);
  }
  // Aviso para páginas que quieran reaccionar (por ejemplo, la OCA)
  document.dispatchEvent(new CustomEvent('batin-tema', { detail: { tema } }));
}

function batinAlternarTema() {
  batinAplicarTema(batinTemaActual() === 'claro' ? 'oscuro' : 'claro', true);
}

// Aplicar lo guardado lo antes posible (por si la página no tiene la línea en el <head>)
(() => {
  let guardado = null;
  try { guardado = localStorage.getItem(BATIN_TEMA_CLAVE); } catch (e) {}
  if (guardado === 'claro') document.documentElement.dataset.tema = 'claro';
})();

// ── NAV HTML ──
const NAV_HTML = `
<nav class="batin-nav">
  <a href="${BATIN_BASE}index.html" class="nav-logo">
    <span class="nav-logo-badge">BATIN</span>
    <span class="nav-logo-text">profe.DanFer</span>
  </a>
  <div class="nav-links">
    <a href="${BATIN_BASE}index.html"        data-page="index">🏠 Inicio</a>
    <a href="${BATIN_BASE}el-sistema.html"   data-page="sistema">El Sistema</a>
    <a href="${BATIN_BASE}aprendiendo.html"  data-page="aprendiendo">Estoy aprendiendo</a>
    <a href="${BATIN_BASE}construyendo.html" data-page="construyendo">Estoy construyendo</a>
    <a href="${BATIN_BASE}huella.html"       data-page="huella">Estoy dejando huella</a>
  </div>
  <div class="nav-right">
    <button type="button" class="nav-tema" id="batin-tema-btn" onclick="batinAlternarTema()">☀️</button>
    <div class="nav-chars">
      <div class="nav-char gatiel" title="Gatiel · pensamiento crítico">🐱</div>
      <div class="nav-char bit"    title="Bit · guía técnico">🤖</div>
      <div class="nav-char techi"  title="Techi · identidad profesional">👩‍💻</div>
    </div>
  </div>
</nav>`;

// ── FOOTER HTML ──
const FOOTER_HTML = `
<footer class="batin-footer">
  <div class="footer-inner">
    <div class="footer-col">
      <h5>BATIN · profe.DanFer</h5>
      <p>Bachillerato Técnico en Servicios</p>
      <p>Especialidad Informática</p>
      <p>Centro Educativo Departamental</p>
      <p>Miguela Rodríguez · Asunción, Paraguay</p>
    </div>
    <div class="footer-col">
      <h5>Navegación</h5>
      <a href="${BATIN_BASE}index.html">Inicio · Soy BATIN</a>
      <a href="${BATIN_BASE}el-sistema.html">El Sistema</a>
      <a href="${BATIN_BASE}aprendiendo.html">Estoy aprendiendo</a>
      <a href="${BATIN_BASE}construyendo.html">Estoy construyendo</a>
      <a href="${BATIN_BASE}huella.html">Estoy dejando huella</a>
    </div>
    <div class="footer-col">
      <h5>Contacto</h5>
      <a href="mailto:profe.danfer@mec.edu.py">profe.danfer@mec.edu.py</a>
      <a href="mailto:profe.danfer@gmail.com">profe.danfer@gmail.com</a>
      <a href="https://sites.google.com/view/profe-danfer" target="_blank">sitio Google Sites ↗</a>
      <p style="margin-top:8px; font-size:11px; color:var(--texto4);">Malla curricular MEC · Resolución N.º 2141/2016 · Actualización Mayo 2026</p>
    </div>
  </div>
  <div class="footer-copy">
    <span>BATIN · profe.DanFer · 2026 · "No vienes a estudiar informática. Vienes a convertirte en técnico."</span>
    <span>🐱 Gatiel · 🤖 Bit · 👩‍💻 Techi</span>
  </div>
</footer>`;

// ── INYECTAR NAV Y FOOTER ──
document.addEventListener('DOMContentLoaded', () => {
  // Nav
  const navPlaceholder = document.getElementById('batin-nav');
  if (navPlaceholder) navPlaceholder.outerHTML = NAV_HTML;

  // Footer
  const footerPlaceholder = document.getElementById('batin-footer');
  if (footerPlaceholder) footerPlaceholder.outerHTML = FOOTER_HTML;

  // Botón de tema con el ícono que corresponde
  batinAplicarTema(batinTemaActual(), false);

  // Marcar página activa
  const page = document.body.dataset.page;
  if (page) {
    document.querySelectorAll('.nav-links a').forEach(a => {
      if (a.dataset.page === page) a.classList.add('act');
    });
  }

  // Scroll activo en nav
  window.addEventListener('scroll', () => {
    document.querySelector('.batin-nav')?.classList.toggle('scrolled', window.scrollY > 20);
  });
});

// ── UTILIDADES ──
function $(sel, ctx = document) { return ctx.querySelector(sel); }
function $$(sel, ctx = document) { return [...ctx.querySelectorAll(sel)]; }

// Tabs genéricos
function initTabs(containerSel) {
  $$(containerSel + ' [data-tab-btn]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tabBtn;
      const container = btn.closest(containerSel);
      $$('[data-tab-btn]', container).forEach(b => b.classList.remove('act'));
      $$('[data-tab-panel]', container).forEach(p => p.classList.remove('act'));
      btn.classList.add('act');
      $(`[data-tab-panel="${target}"]`, container)?.classList.add('act');
    });
  });
  // Activar el primero
  document.querySelectorAll(containerSel).forEach(container => {
    $('[data-tab-btn]', container)?.click();
  });
}

// Accordion genérico
function initAccordions() {
  $$('[data-accordion-btn]').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('[data-accordion-item]');
      const isOpen = item.classList.contains('open');
      $$('[data-accordion-item]').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}
