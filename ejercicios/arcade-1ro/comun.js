/* ═══════════════════════════════════════════
   BATIN · Arcade de 1° — piezas compartidas
   utilidades · visuales (planilla, informe, diapositiva, gráfico)
   · un desafío (componente) · modales · registro (navegador + Google Sheets)
═══════════════════════════════════════════ */

(function () {
  'use strict';
  var CFG = window.AR_CONFIG || {};

  /* ─────────── Utilidades ─────────── */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function q(s, base) { return (base || document).querySelector(s); }
  function qa(s, base) { return Array.prototype.slice.call((base || document).querySelectorAll(s)); }
  function azar(n) { return Math.floor(Math.random() * n); }
  function mezclar(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = azar(i + 1), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function indices(n) { var a = []; for (var i = 0; i < n; i++) a.push(i); return a; }
  function ahora() { return new Date().toISOString(); }
  function mmss(ms) { var s = Math.max(0, Math.floor(ms / 1000)), m = Math.floor(s / 60), x = s % 60; return m + ':' + (x < 10 ? '0' : '') + x; }
  function num(v) {
    if (typeof v !== 'number') return v;
    var neg = v < 0, x = Math.abs(v), ent = Math.floor(x), dec = Math.round((x - ent) * 100);
    if (dec === 100) { ent++; dec = 0; }
    var s = String(ent).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    if (dec) { var d = String(dec); if (d.length < 2) d = '0' + d; s += ',' + d.replace(/0$/, ''); }
    return (neg ? '-' : '') + s;
  }

  /* Comparar respuestas escritas sin que importen mayúsculas, tildes,
     espacios, «Gs.», el signo % ni la coma o el punto decimal.
     En fórmulas, «;» y «,» separan argumentos y valen igual. */
  function normalizar(s) {
    s = String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[“”«»]/g, '"').replace(/[‘’]/g, "'").replace(/\s+/g, '');
    if (s.charAt(0) === '=') return s.replace(/,/g, ';');
    return s.replace(/₲|gs\.?|guaranies|%/g, '')
      .replace(/(\d)\.(?=\d{3}(\D|$))/g, '$1')
      .replace(/(\d),(\d)/g, '$1.$2')
      .replace(/[;,]/g, ' ').trim();
  }

  var NIVEL_NOM = { 3: 'Aplicar', 4: 'Analizar', 5: 'Evaluar', 6: 'Crear' };
  var TEMA = {
    excel:    { nom: 'Excel', ico: '📊' },
    datos:    { nom: 'Encuestas y datos', ico: '📋' },
    word:     { nom: 'Informe en Word', ico: '📄' },
    ppt:      { nom: 'Presentación', ico: '🖥️' },
    proyecto: { nom: 'Proyecto y viabilidad', ico: '🚀' }
  };
  var TIPO_NOM = { opcion: 'Elige', valor: 'Responde', ordenar: 'Ordena', clasificar: 'Clasifica', traza: 'Completa la tabla', fragmento: 'Señala', celda: 'Toca la celda' };
  var PJ = {
    gatiel: { nom: 'GATIEL', emoji: '🐱', img: { explicando: '../../img/gatiel_explicando.png', idea: '../../img/gatiel_idea.png', accion: '../../img/gatiel_accion.png', leyendo: '../../img/gatiel_leyendo.png', saludando: '../../img/gatiel_saludando.png', trabajando: '../../img/gatiel_trabajando.png' } },
    bit:    { nom: 'BIT', emoji: '🤖', img: { explicando: '../../img/bit_explicando.png', idea: '../../img/bit_idea.png', accion: '../../img/bit_motivando.png', ok: '../../img/bit_ok.png', saludando: '../../img/bit_saludando.png', trabajando: '../../img/bit_trabajando.png' } },
    techi:  { nom: 'TECHI', emoji: '👩‍💻', img: { explicando: '../../img/techi_explicando.png', idea: '../../img/techi_idea.png', accion: '../../img/techi_accion.png', saludando: '../../img/techi_saludando.png', estudiando: '../../img/techi_estudiando.png', trabajando: '../../img/techi_trabajando.png' } }
  };
  function personaje(quien, txt, gesto, color) {
    var p = PJ[quien] || PJ.bit, img = p.img[gesto] || p.img.explicando;
    return '<div class="a-guia"' + (color ? ' style="--gc:' + color + '"' : '') + '><img src="' + img + '" alt="' + p.nom + '" onerror="this.outerHTML=\'<span class=&quot;emo&quot;>' + p.emoji + '</span>\'"><div><div class="nm">' + p.nom + '</div><p>' + txt + '</p></div></div>';
  }

  /* ═══════════════════════════════════════════
     VISUALES
     hoja   → { cols:['A','B'], desde:1, filas:[[...]], activa:'B6', barra:'=SUMA(B2:B5)', nombre:'Hoja1' }
     diapo  → { titulo, texto:[...], fondo, color, grafico }
     doc    → { enc, titulo, parrafos:[...], pie }   (un párrafo que empieza con «## » es un título)
     grafico→ { tipo:'barras'|'torta'|'linea', titulo, datos:[['Sí',18],['No',12]], resaltar:'Sí', pct:true }
  ═══════════════════════════════════════════ */
  function parseRef(ref) { var m = /^([A-Z]+)(\d+)$/.exec(String(ref || '').toUpperCase()); return m ? { col: m[1], fila: Number(m[2]) } : null; }

  function hojaHTML(v, clic) {
    var act = parseRef(v.activa), desde = v.desde || 1, marcadas = {};
    (v.marcar || []).forEach(function (r) { marcadas[String(r).toUpperCase()] = 1; });
    var h = '<div class="xl' + (clic ? ' clic' : '') + '">';
    if (v.nombre) h += '<div class="xl-nom">📊 ' + esc(v.nombre) + '</div>';
    if (v.barra || act) h += '<div class="fx"><span class="ref">' + esc(v.activa || '') + '</span><span class="f">fx</span><span class="val">' + esc(v.barra || '') + '</span></div>';
    h += '<div class="xl-scroll"><table><thead><tr><th></th>' + v.cols.map(function (c) { return '<th' + (act && act.col === c ? ' class="act"' : '') + '>' + esc(c) + '</th>'; }).join('') + '</tr></thead><tbody>';
    v.filas.forEach(function (fila, i) {
      var nf = desde + i;
      h += '<tr><th' + (act && act.fila === nf ? ' class="act"' : '') + '>' + nf + '</th>';
      v.cols.forEach(function (c, j) {
        var val = fila[j], cls = [], ref = c + nf;
        if (typeof val === 'number') cls.push('num');
        if (typeof val === 'string' && /^#/.test(val)) cls.push('err');
        if (typeof val === 'string' && /^=/.test(val)) cls.push('fml');
        if (act && act.col === c && act.fila === nf) cls.push('act');
        if (marcadas[ref]) cls.push('marca');
        h += '<td' + (cls.length ? ' class="' + cls.join(' ') + '"' : '') + (clic ? ' data-ref="' + ref + '" tabindex="0" role="button" aria-label="Celda ' + ref + '"' : '') + '>' + esc(num(val == null ? '' : val)) + '</td>';
      });
      h += '</tr>';
    });
    return h + '</tbody></table></div></div>';
  }

  var GRISES = ['#2f3a4a', '#7a8698', '#b9c2cf', '#55627a', '#dde3ea'];
  function graficoHTML(g) {
    var datos = g.datos || [], tot = datos.reduce(function (a, d) { return a + d[1]; }, 0) || 1;
    var max = Math.max.apply(null, datos.map(function (d) { return d[1]; }).concat([1]));
    var tit = g.titulo ? '<div class="gr-tit">' + esc(g.titulo) + '</div>' : '';
    function etq(d) { if (/%/.test(d[0])) return ''; return g.pct ? Math.round(100 * d[1] / tot) + '%' : num(d[1]); }
    if (g.tipo === 'torta') {
      var acc = 0, partes = datos.map(function (d, i) {
        var c = g.resaltar ? (d[0] === g.resaltar ? 'var(--gr-ac)' : GRISES[(i % 4) + 1]) : GRISES[i % GRISES.length];
        var a0 = acc; acc += 360 * d[1] / tot; return c + ' ' + a0.toFixed(1) + 'deg ' + acc.toFixed(1) + 'deg';
      });
      return '<div class="gr">' + tit + '<div class="gr-torta"><span class="pie" style="background:conic-gradient(' + partes.join(',') + ')"></span><ul>' +
        datos.map(function (d, i) { var c = g.resaltar ? (d[0] === g.resaltar ? 'var(--gr-ac)' : GRISES[(i % 4) + 1]) : GRISES[i % GRISES.length]; return '<li><i style="background:' + c + '"></i>' + esc(d[0]) + (etq(d) ? ' · ' + etq(d) : '') + '</li>'; }).join('') + '</ul></div></div>';
    }
    if (g.tipo === 'linea') {
      var W = 300, H = 120, n = datos.length, pts = datos.map(function (d, i) { return [20 + (n > 1 ? i * (W - 40) / (n - 1) : 0), H - 18 - (d[1] / max) * (H - 36)]; });
      return '<div class="gr">' + tit + '<svg viewBox="0 0 ' + W + ' ' + H + '" class="gr-linea" role="img" aria-label="Gráfico de línea"><polyline points="' + pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ') + '" fill="none" stroke="currentColor" stroke-width="3"/>' +
        pts.map(function (p, i) { return '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="4" fill="currentColor"/><text x="' + p[0].toFixed(1) + '" y="' + (H - 3) + '" text-anchor="middle">' + esc(datos[i][0]) + '</text><text x="' + p[0].toFixed(1) + '" y="' + (p[1] - 8).toFixed(1) + '" text-anchor="middle" class="v">' + esc(etq(datos[i])) + '</text>'; }).join('') + '</svg></div>';
    }
    return '<div class="gr">' + tit + '<div class="gr-barras">' + datos.map(function (d) {
      var res = g.resaltar && d[0] === g.resaltar;
      return '<div class="b"><span class="l">' + esc(d[0]) + '</span><span class="t"><i class="' + (res ? 'res' : '') + '" style="width:' + Math.max(2, Math.round(100 * d[1] / max)) + '%"></i></span><span class="v">' + esc(etq(d)) + '</span></div>';
    }).join('') + '</div></div>';
  }

  function diapoHTML(v, cuerpo) {
    var txt = Array.isArray(v.texto) ? v.texto : (v.texto ? [v.texto] : []);
    return '<div class="diapo' + (v.cargada ? ' cargada' : '') + '" style="' + (v.fondo ? 'background:' + esc(v.fondo) + ';' : '') + (v.color ? 'color:' + esc(v.color) : '') + '">' +
      '<div class="dt">' + esc(v.titulo || '') + '</div>' +
      (cuerpo || (txt.length ? '<ul>' + txt.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' : '')) +
      (v.grafico ? graficoHTML(v.grafico) : '') +
      (v.pie ? '<div class="dp">' + esc(v.pie) + '</div>' : '') + '</div>';
  }

  function parrafo(t) { return /^## /.test(t) ? '<h5>' + esc(t.slice(3)) + '</h5>' : '<p>' + esc(t) + '</p>'; }
  function docHTML(v, cuerpo) {
    return '<div class="doc">' + (v.enc ? '<div class="enc">' + esc(v.enc) + '</div>' : '') +
      (v.titulo ? '<div class="dtit">' + esc(v.titulo) + '</div>' : '') +
      (cuerpo || (v.parrafos || []).map(parrafo).join('')) +
      (v.grafico ? graficoHTML(v.grafico) : '') +
      (v.pie ? '<div class="pie">' + esc(v.pie) + '</div>' : '') + '</div>';
  }

  /* Un visual suelto: { tipo:'hoja'|'diapo'|'doc'|'grafico', ... } */
  function visual(v) {
    if (!v) return '';
    if (v.tipo === 'hoja') return hojaHTML(v);
    if (v.tipo === 'diapo') return diapoHTML(v);
    if (v.tipo === 'doc') return docHTML(v);
    if (v.tipo === 'grafico') return '<div class="gr-solo">' + graficoHTML(v) + '</div>';
    return '';
  }
  function visualesDe(r, salvo) {
    var h = '';
    if (r.hoja && salvo !== 'hoja') h += hojaHTML(r.hoja);
    if (r.doc && salvo !== 'doc') h += docHTML(r.doc);
    if (r.diapo && salvo !== 'diapo') h += diapoHTML(r.diapo);
    if (r.grafico) h += '<div class="gr-solo">' + graficoHTML(r.grafico) + '</div>';
    if (r.tabla) h += tablaHTML(r.tabla);
    if (r.vis) h += '<div class="a-comparar">' + r.vis.map(function (v) { return '<figure><figcaption>' + esc(v.etq || '') + '</figcaption>' + visual(v) + '</figure>'; }).join('') + '</div>';
    return h ? '<div class="a-vis">' + h + '</div>' : '';
  }
  function tablaHTML(t) {
    return '<div class="a-tabla-wrap"><table class="a-tabla"><thead><tr>' + t.cols.map(function (c) { return '<th>' + esc(c) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      t.filas.map(function (f) { return '<tr>' + f.map(function (v, i) { return i === 0 ? '<th>' + esc(v) + '</th>' : '<td>' + esc(num(v)) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
  }

  /* Texto con fragmentos para señalar: «Frase normal [[fragmento]] más texto».
     Cada línea (\n) es un párrafo o una viñeta. Devuelve { html, frags } */
  function fragmentos(txt) {
    var frags = [], lineas = String(txt).split('\n');
    var html = lineas.map(function (l) {
      return l.split(/\[\[|\]\]/).map(function (p, i) {
        if (i % 2 === 0) return esc(p);
        frags.push(p);
        return '<span class="frag" data-fr="' + (frags.length - 1) + '" tabindex="0" role="button">' + esc(p) + '</span>';
      }).join('');
    });
    return { lineas: html, frags: frags };
  }

  /* ═══════════════════════════════════════════
     COMPONENTE: un desafío
     o = { revelar: bool, pista: bool, sinVisual: bool, alResponder: fn(ok, respuesta) }
  ═══════════════════════════════════════════ */
  function montarReto(cont, r, o) {
    var hecho = false;
    var salvo = r.tipo === 'celda' ? 'hoja' : r.tipo === 'fragmento' ? (r.marco || 'doc') : '';
    cont.innerHTML =
      '<div class="a-q">' + esc(r.q) + '</div>' +
      (o.sinVisual ? '' : visualesDe(r, salvo)) +
      '<div class="a-zona"></div><div class="a-pistabox"></div><div class="a-msgz"></div>' +
      '<div class="a-pie"><span class="der a-acc"></span></div>';
    var zona = q('.a-zona', cont), acc = q('.a-acc', cont);
    var api = { detalle: '' };
    function msg(tipo, titulo, txt) { q('.a-msgz', cont).innerHTML = '<div class="a-msg ' + tipo + '"><b class="t">' + titulo + '</b>' + esc(txt) + '</div>'; }
    function terminar(ok, resp) {
      if (hecho) return; hecho = true;
      qa('.a-zona button, .a-zona input, .a-acc button', cont).forEach(function (b) { b.disabled = true; });
      qa('.a-zona [data-ref], .a-zona .frag', cont).forEach(function (t) { t.removeAttribute('tabindex'); t.classList.add('quieto'); });
      o.alResponder(ok, resp);
    }
    api.pista = function () { if (r.pista) q('.a-pistabox', cont).innerHTML = '<div class="a-msg pista"><b class="t">🔎 Pista</b>' + esc(r.pista) + '</div>'; };
    api.bloquear = function () { if (!hecho) terminar(false, '[tiempo agotado]'); };
    api.hecho = function () { return hecho; };
    if (o.pista) api.pista();
    function boton(txt) { acc.innerHTML = '<button class="a-btn solid a-comp" type="button">' + txt + '</button>'; return q('.a-comp', acc); }
    function clicable(el, fn) {
      el.addEventListener('click', fn);
      el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); } });
    }

    if (r.tipo === 'opcion') {
      var orden = mezclar(indices(r.op.length)), letras = 'ABCDEF';
      zona.innerHTML = '<div class="a-ops' + (r.op.some(function (x) { return String(x).length > 70; }) ? ' una' : '') + '">' + orden.map(function (idx, k) {
        return '<button type="button" class="op" data-idx="' + idx + '"><span class="k">' + letras[k] + '</span><span class="tx">' + esc(r.op[idx]) + '</span></button>';
      }).join('') + '</div>';
      qa('.op', zona).forEach(function (b) {
        b.addEventListener('click', function () {
          if (hecho) return;
          var idx = Number(b.dataset.idx), ok = idx === 0;
          if (o.revelar) { b.classList.add(ok ? 'bien' : 'mal'); var c = q('.op[data-idx="0"]', zona); if (c) c.classList.add('bien'); }
          else b.classList.add('elegida');
          terminar(ok, r.op[idx]);
        });
      });
      api.mitad = function () { mezclar(qa('.op', zona).filter(function (b) { return b.dataset.idx !== '0'; })).slice(0, Math.max(0, r.op.length - 2)).forEach(function (b) { b.classList.add('fuera'); b.disabled = true; }); };
    }

    else if (r.tipo === 'valor') {
      zona.innerHTML = '<div class="a-valor">' + (r.prefijo ? '<span class="pre">' + esc(r.prefijo) + '</span>' : '') + '<input type="text" class="a-val" autocomplete="off" spellcheck="false" placeholder="' + esc(r.placeholder || 'Escribe tu respuesta') + '">' + (r.sufijo ? '<span class="pre">' + esc(r.sufijo) + '</span>' : '') + '</div>';
      var inp = q('.a-val', zona);
      var comp = function () {
        var v = inp.value.trim(); if (!v) { inp.focus(); return; }
        var n = normalizar(v);
        var ok = r.acepta.some(function (a) { return normalizar(a) === n; });
        if (o.revelar) inp.classList.add(ok ? 'bien' : 'mal');
        terminar(ok, v);
      };
      boton('Comprobar').addEventListener('click', comp);
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); comp(); } });
    }

    else if (r.tipo === 'ordenar') {
      var ord; do { ord = mezclar(indices(r.lineas.length)); } while (r.lineas.length > 1 && ord.every(function (v, i) { return r.lineas[v] === r.lineas[i]; }));
      var marcar = false;
      var pintarO = function () {
        zona.innerHTML = '<ol class="a-orden">' + ord.map(function (idx, pos) {
          var cls = marcar ? (r.lineas[idx] === r.lineas[pos] ? 'bien' : 'mal') : '';
          return '<li class="' + cls + '"><span class="n">' + (pos + 1) + '</span><span class="tx">' + esc(r.lineas[idx]) + '</span>' +
            (hecho ? '' : '<button type="button" data-sube="' + pos + '" aria-label="Subir"' + (pos === 0 ? ' disabled' : '') + '>▲</button><button type="button" data-baja="' + pos + '" aria-label="Bajar"' + (pos === ord.length - 1 ? ' disabled' : '') + '>▼</button>') + '</li>';
        }).join('') + '</ol>';
        qa('[data-sube]', zona).forEach(function (b) { b.addEventListener('click', function () { mover(Number(b.dataset.sube), -1); }); });
        qa('[data-baja]', zona).forEach(function (b) { b.addEventListener('click', function () { mover(Number(b.dataset.baja), 1); }); });
      };
      var mover = function (pos, d) { var t = ord[pos]; ord[pos] = ord[pos + d]; ord[pos + d] = t; pintarO(); var bt = q('[data-' + (d < 0 ? 'sube' : 'baja') + '="' + (pos + d) + '"]', zona); if (bt && !bt.disabled) bt.focus(); };
      pintarO();
      boton('Comprobar el orden').addEventListener('click', function () {
        var ok = ord.every(function (idx, pos) { return r.lineas[idx] === r.lineas[pos]; });
        hecho = true; marcar = !!o.revelar; pintarO(); hecho = false;
        terminar(ok, ord.map(function (i) { return r.lineas[i]; }).join(' | '));
      });
    }

    else if (r.tipo === 'clasificar') {
      var ordC = mezclar(indices(r.items.length)), asig = {}, marcarC = false;
      var pintarC = function () {
        zona.innerHTML = '<div class="a-clas">' + ordC.map(function (idx) {
          var it = r.items[idx], a = asig[idx];
          var cls = marcarC ? (a === it.c ? ' bien' : ' mal') : '';
          return '<div class="it' + cls + '"><span class="t">' + esc(it.t) + '</span><span class="a-seg">' +
            r.categorias.map(function (c) { return '<button type="button" data-it="' + idx + '" data-cat="' + esc(c) + '"' + (a === c ? ' class="act"' : '') + (hecho ? ' disabled' : '') + '>' + esc(c) + '</button>'; }).join('') +
            '</span>' + (marcarC && a !== it.c ? '<span class="corr">→ ' + esc(it.c) + '</span>' : '') + '</div>';
        }).join('') + '</div>';
        qa('[data-cat]', zona).forEach(function (b) { b.addEventListener('click', function () { asig[b.dataset.it] = b.dataset.cat; pintarC(); }); });
      };
      pintarC();
      boton('Comprobar').addEventListener('click', function () {
        var faltan = r.items.length - Object.keys(asig).length;
        if (faltan > 0) { msg('pista', 'Falta completar', 'Quedan ' + faltan + ' sin ubicar.'); return; }
        var malos = r.items.filter(function (it, i) { return asig[i] !== it.c; });
        hecho = true; marcarC = !!o.revelar; pintarC(); hecho = false;
        terminar(!malos.length, malos.length ? malos[0].t + ' → ' + asig[r.items.indexOf(malos[0])] : '');
      });
    }

    else if (r.tipo === 'traza') {
      var huecos = [];
      zona.innerHTML = '<div class="a-tabla-wrap"><table class="a-tabla a-traza"><thead><tr>' + r.cols.map(function (c) { return '<th>' + esc(c) + '</th>'; }).join('') + '</tr></thead><tbody>' +
        r.filas.map(function (f, fi) {
          return '<tr>' + f.map(function (v, ci) {
            var m = /^\{(.*)\}$/.exec(String(v));
            if (m) { huecos.push(m[1].split('|')); return '<td><input type="text" class="a-celda" data-h="' + (huecos.length - 1) + '" autocomplete="off" spellcheck="false" aria-label="' + esc(r.cols[ci]) + ', fila ' + (fi + 1) + '"></td>'; }
            return '<td class="dada">' + esc(num(v)) + '</td>';
          }).join('') + '</tr>';
        }).join('') + '</tbody></table></div><div class="a-ayuda">✏️ Completa las celdas vacías (Tab pasa a la siguiente)</div>';
      var ins = qa('.a-celda', zona);
      ins.forEach(function (inp, i) { inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); if (ins[i + 1]) ins[i + 1].focus(); else q('.a-comp', acc).click(); } }); });
      boton('Comprobar la tabla').addEventListener('click', function () {
        var vacios = ins.filter(function (i) { return !i.value.trim(); }).length;
        if (vacios) { msg('pista', 'Faltan celdas', 'Quedan ' + vacios + ' celda' + (vacios === 1 ? '' : 's') + ' vacía' + (vacios === 1 ? '' : 's') + '.'); return; }
        var mal = [];
        ins.forEach(function (inp, i) {
          var ok = huecos[i].some(function (h) { return normalizar(inp.value) === normalizar(h); });
          if (o.revelar) { inp.classList.add(ok ? 'bien' : 'mal'); if (!ok) inp.title = 'Correcto: ' + huecos[i][0]; }
          if (!ok) mal.push(inp.value + '≠' + huecos[i][0]);
        });
        terminar(!mal.length, ins.map(function (i) { return i.value.trim(); }).join(' | '));
      });
      api.correctas = function () { return huecos.map(function (h) { return h[0]; }).join(' · '); };
    }

    else if (r.tipo === 'fragmento') {
      var F = fragmentos(r.texto), marco = r.marco || 'doc', cuerpo;
      if (marco === 'diapo') cuerpo = '<ul>' + F.lineas.map(function (l) { return '<li>' + l + '</li>'; }).join('') + '</ul>';
      else cuerpo = F.lineas.map(function (l) { return '<p>' + l + '</p>'; }).join('');
      var base = marco === 'diapo' ? (r.diapo || {}) : (r.doc || {});
      zona.innerHTML = (marco === 'diapo' ? diapoHTML(base, cuerpo) : docHTML(base, cuerpo)) + '<div class="a-ayuda">👆 Toca la parte del texto que corresponde</div>';
      qa('.frag', zona).forEach(function (s) {
        clicable(s, function () {
          if (hecho) return;
          var k = Number(s.dataset.fr), ok = k === r.correcta;
          if (o.revelar) { s.classList.add(ok ? 'bien' : 'mal'); var c = q('.frag[data-fr="' + r.correcta + '"]', zona); if (c) c.classList.add('bien'); }
          else s.classList.add('elegida');
          terminar(ok, F.frags[k]);
        });
      });
      api.correcto = F.frags[r.correcta];
    }

    else if (r.tipo === 'celda') {
      zona.innerHTML = hojaHTML(r.hoja, true) + '<div class="a-ayuda">👆 Toca la celda</div>';
      var correctas = [].concat(r.correcta).map(function (x) { return String(x).toUpperCase(); });
      qa('[data-ref]', zona).forEach(function (td) {
        clicable(td, function () {
          if (hecho) return;
          var ok = correctas.indexOf(td.dataset.ref) >= 0;
          if (o.revelar) { td.classList.add(ok ? 'bien' : 'mal'); correctas.forEach(function (c) { var x = q('[data-ref="' + c + '"]', zona); if (x) x.classList.add('bien'); }); }
          else td.classList.add('elegida');
          terminar(ok, td.dataset.ref);
        });
      });
    }
    return api;
  }
  function respuestaCorrecta(r) {
    if (r.tipo === 'opcion') return r.op[0];
    if (r.tipo === 'valor') return r.acepta[0];
    if (r.tipo === 'celda') return [].concat(r.correcta).join(' o ');
    if (r.tipo === 'fragmento') { var f = fragmentos(r.texto).frags; return '«' + f[r.correcta] + '»'; }
    if (r.tipo === 'traza') { var hs = []; r.filas.forEach(function (f) { f.forEach(function (v) { var m = /^\{(.*)\}$/.exec(String(v)); if (m) hs.push(m[1].split('|')[0]); }); }); return hs.join(' · '); }
    if (r.tipo === 'ordenar') return r.lineas.map(function (l, i) { return (i + 1) + ') ' + l; }).join('  ');
    if (r.tipo === 'clasificar') return r.items.map(function (it) { return it.t + ' → ' + it.c; }).join(' · ');
    return '';
  }

  /* ─────────── Modal ─────────── */
  function modal(capa, ico, tit, cuerpo, botones) {
    capa.innerHTML = '<div class="a-velo"><div class="a-modal" role="dialog" aria-modal="true" aria-label="' + esc(tit) + '">' + (ico ? '<div class="gran">' + ico + '</div>' : '') + '<h2>' + esc(tit) + '</h2>' + cuerpo +
      '<div class="a-pie centro">' + botones.map(function (b, i) { return '<button type="button" class="a-btn' + (b[1] ? ' solid' : '') + '" data-mb="' + i + '">' + b[0] + '</button>'; }).join('') + '</div></div></div>';
    qa('[data-mb]', capa).forEach(function (el) { el.addEventListener('click', function () { var b = botones[Number(el.dataset.mb)]; capa.innerHTML = ''; if (b[2]) b[2](); }); });
    var p = q('.a-btn.solid', capa); if (p) p.focus();
  }

  /* ─────────── Registro ─────────── */
  var MODOS = ['auditoria', 'planilla', 'feria'];
  var K_REG = 'batin_ar1_respuestas', K_PEND = 'batin_ar1_pendientes', K_EST = 'batin_ar1_estado';
  function leer(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function escribir(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  function endpoint() { return (CFG.endpoint || '').trim(); }
  var enviando = false;
  function enviarPendientes() {
    var url = endpoint();
    if (!url) return Promise.resolve('sin-endpoint');
    var pend = leer(K_PEND, []);
    if (!pend.length || enviando) return Promise.resolve('nada');
    enviando = true;
    var lote = pend.slice(0, 60), f0 = lote[0];
    return fetch(url, {
      method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ accion: 'partida', partida: { id: f0.partida + '-' + Date.now().toString(36), fecha: f0.fecha, curso: f0.curso, modo: f0.modo }, filas: lote })
    }).then(function () { escribir(K_PEND, leer(K_PEND, []).slice(lote.length)); enviando = false; return leer(K_PEND, []).length ? enviarPendientes() : 'enviado'; })
      .catch(function () { enviando = false; return 'sin-conexion'; });
  }
  function registrar(partida, curso, modo, equipo, r, ok, resp, extra) {
    var fila = { partida: partida, fecha: ahora(), curso: curso, modo: modo, equipo: equipo, qid: r.id, tema: r.tema,
      sub: r.sub + ' · N' + r.nv, n: 1, ok: !!ok, elegida: (extra || '') + (ok ? '' : String(resp || '').slice(0, 200)), t: ahora() };
    var regs = leer(K_REG, []); regs.push(fila); if (regs.length > 4000) regs = regs.slice(regs.length - 4000); escribir(K_REG, regs);
    if (endpoint()) { var p = leer(K_PEND, []); p.push(fila); escribir(K_PEND, p); if (p.length >= 8) enviarPendientes(); }
  }
  function filasRemotas(clave) {
    var url = endpoint();
    if (!url) return Promise.reject(new Error('No hay endpoint configurado en config.js'));
    return fetch(url + (url.indexOf('?') >= 0 ? '&' : '?') + 'k=' + encodeURIComponent(clave || '')).then(function (r) { return r.json(); }).then(function (j) {
      if (!j || !j.ok) throw new Error((j && j.error) || 'Respuesta inválida');
      return j.filas.filter(function (f) { return MODOS.indexOf(f.modo) >= 0; }).map(function (f) { f.ok = (f.ok === true || f.ok === 'TRUE' || f.ok === 'true' || f.ok === 1); return f; });
    });
  }
  if (leer(K_PEND, []).length) enviarPendientes();

  function selectorCursos(id) { var c = CFG.cursos && CFG.cursos.length ? CFG.cursos : ['1° A']; return '<select id="' + id + '">' + c.map(function (x) { return '<option>' + esc(x) + '</option>'; }).join('') + '</select>'; }

  window.AR = {
    CFG: CFG, esc: esc, q: q, qa: qa, azar: azar, mezclar: mezclar, indices: indices, ahora: ahora, mmss: mmss, num: num, normalizar: normalizar,
    NIVEL_NOM: NIVEL_NOM, TEMA: TEMA, TIPO_NOM: TIPO_NOM, personaje: personaje,
    visual: visual, visualesDe: visualesDe, hojaHTML: hojaHTML, tablaHTML: tablaHTML,
    montarReto: montarReto, respuestaCorrecta: respuestaCorrecta, modal: modal, selectorCursos: selectorCursos,
    puntos: function (nv) { return (CFG.puntosNivel || {})[nv] || 100; },
    registro: {
      registrar: registrar, enviarPendientes: enviarPendientes, filasRemotas: filasRemotas,
      filasLocales: function () { return leer(K_REG, []); },
      pendientes: function () { return leer(K_PEND, []).length; },
      hayEndpoint: function () { return !!endpoint(); },
      estado: function (k, v) { var t = leer(K_EST, {}); if (arguments.length > 1) { if (v === null) delete t[k]; else t[k] = v; escribir(K_EST, t); } return t[k]; },
      estados: function () { return leer(K_EST, {}); },
      borrarTodo: function () { try { localStorage.removeItem(K_REG); localStorage.removeItem(K_PEND); localStorage.removeItem(K_EST); } catch (e) {} }
    }
  };
})();
