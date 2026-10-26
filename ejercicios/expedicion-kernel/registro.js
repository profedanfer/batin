/* ═══════════════════════════════════════════
   BATIN · Expedición Kernel — registro
   · Cada respuesta se guarda en el navegador (para el panel) y, si hay
     endpoint, se envía a Google Sheets en tandas, con el mismo formato
     que la OCA (mismo Code.gs).
     Columnas: modo = expedicion | simulacro · equipo = jugador o equipo
               tema = región · sub = subtema · N (nivel) · ok · elegida
   · Las partidas en curso se guardan para poder seguir otro día.
═══════════════════════════════════════════ */

(function () {
  'use strict';

  var K_REG = 'batin_ek3_respuestas';
  var K_PEND = 'batin_ek3_pendientes';
  var K_EST = 'batin_ek3_partidas';
  var K_SIM = 'batin_ek3_simulacros';
  var LIMITE = 4000;

  function leer(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function escribir(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  function borrar(k) { try { localStorage.removeItem(k); } catch (e) {} }
  function endpoint() { var c = window.EK_CONFIG || {}; return (c.endpoint || '').trim(); }

  var enviando = false;
  function enviarPendientes() {
    var url = endpoint();
    if (!url) return Promise.resolve('sin-endpoint');
    var pend = leer(K_PEND, []);
    if (!pend.length) return Promise.resolve('nada');
    if (enviando) return Promise.resolve('enviando');
    enviando = true;
    var lote = pend.slice(0, 60);
    var f0 = lote[0];
    var id = f0.partida + '-' + Date.now().toString(36);
    return fetch(url, {
      method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ accion: 'partida', partida: { id: id, fecha: f0.fecha, curso: f0.curso, modo: f0.modo }, filas: lote })
    }).then(function () {
      var resto = leer(K_PEND, []).slice(lote.length);
      escribir(K_PEND, resto);
      enviando = false;
      return resto.length ? enviarPendientes() : 'enviado';
    }).catch(function () { enviando = false; return 'sin-conexion'; });
  }

  /* fila = { partida, fecha, curso, modo, equipo, qid, tema, sub, n, ok, elegida, t } */
  function registrar(fila, enviarYa) {
    var regs = leer(K_REG, []);
    regs.push(fila);
    if (regs.length > LIMITE) regs = regs.slice(regs.length - LIMITE);
    escribir(K_REG, regs);
    if (endpoint()) {
      var pend = leer(K_PEND, []); pend.push(fila); escribir(K_PEND, pend);
      if (enviarYa || pend.length >= 8) enviarPendientes();
    }
  }

  function filasRemotas(clave) {
    var url = endpoint();
    if (!url) return Promise.reject(new Error('No hay endpoint configurado en config.js'));
    return fetch(url + (url.indexOf('?') >= 0 ? '&' : '?') + 'k=' + encodeURIComponent(clave || ''))
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (!j || !j.ok) throw new Error((j && j.error) || 'Respuesta inválida');
        return j.filas.filter(function (f) { return f.modo === 'expedicion' || f.modo === 'simulacro'; }).map(function (f) {
          f.ok = (f.ok === true || f.ok === 'TRUE' || f.ok === 'true' || f.ok === 1);
          return f;
        });
      });
  }

  window.EkRegistro = {
    registrar: registrar,
    enviarPendientes: enviarPendientes,
    filasLocales: function () { return leer(K_REG, []); },
    filasRemotas: filasRemotas,
    pendientes: function () { return leer(K_PEND, []).length; },
    hayEndpoint: function () { return !!endpoint(); },
    partidas: {
      todas: function () { return leer(K_EST, {}); },
      guardar: function (p) { var t = leer(K_EST, {}); t[p.id] = p; escribir(K_EST, t); },
      borrar: function (id) { var t = leer(K_EST, {}); delete t[id]; escribir(K_EST, t); }
    },
    simulacros: {
      todos: function () { return leer(K_SIM, []); },
      agregar: function (s) { var t = leer(K_SIM, []); t.push(s); if (t.length > 500) t = t.slice(t.length - 500); escribir(K_SIM, t); }
    },
    borrarTodo: function () { borrar(K_REG); borrar(K_PEND); borrar(K_EST); borrar(K_SIM); }
  };
})();
