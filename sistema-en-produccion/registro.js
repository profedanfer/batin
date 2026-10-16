/* ═══════════════════════════════════════════
   BATIN · Sistema en Producción — registro
   · El progreso de cada equipo se guarda en el navegador y se puede retomar.
   · Al terminar cada sala, sus resultados se registran y (si hay endpoint)
     se envían a Google Sheets con el mismo formato que la OCA (mismo Code.gs).
     Columnas: equipo = nombre del equipo · tema = sala · n = intentos
               ok = resuelto al primer intento · elegida = primera respuesta equivocada
═══════════════════════════════════════════ */

(function () {
  'use strict';

  var K_REG = 'batin_sp3_registros';   // resultados por sala (para el panel y el envío)
  var K_PEND = 'batin_sp3_pendientes';
  var K_EST = 'batin_sp3_partidas';    // estado completo de cada equipo (para retomar)
  var MODO = 'escape';

  function leer(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function escribir(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  function borrar(k) { try { localStorage.removeItem(k); } catch (e) {} }
  function endpoint() { var c = window.SP_CONFIG || {}; return (c.endpoint || '').trim(); }

  function aFilas(r) {
    return (r.retos || []).map(function (x) {
      return {
        partida: r.id, fecha: r.fecha, curso: r.curso, modo: MODO, equipo: r.equipo,
        qid: x.qid, tema: r.sala, sub: x.sub, n: x.intentos, ok: x.intentos === 1,
        elegida: (x.pista ? '[pista] ' : '') + (x.primera || ''), t: x.t
      };
    });
  }

  function enviarPendientes() {
    var url = endpoint();
    if (!url) return Promise.resolve('sin-endpoint');
    var pend = leer(K_PEND, []);
    if (!pend.length) return Promise.resolve('nada');
    var regs = leer(K_REG, []);
    return Promise.all(pend.map(function (id) {
      var r = regs.find(function (x) { return x.id === id; });
      if (!r) return Promise.resolve(id);
      return fetch(url, {
        method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ accion: 'partida', partida: { id: r.id, fecha: r.fecha, curso: r.curso, modo: MODO }, filas: aFilas(r) })
      }).then(function () { return id; }).catch(function () { return null; });
    })).then(function (res) {
      var resto = pend.filter(function (id) { return res.indexOf(id) < 0; });
      escribir(K_PEND, resto);
      return resto.length ? 'sin-conexion' : 'enviado';
    });
  }

  /* r = { id: partida + '-' + sala, fecha, curso, equipo, sala, retos: [...] } */
  function registrarSala(r) {
    var regs = leer(K_REG, []);
    var i = regs.findIndex(function (x) { return x.id === r.id; });
    if (i >= 0) regs[i] = r; else regs.push(r);
    if (regs.length > 600) regs = regs.slice(regs.length - 600);
    escribir(K_REG, regs);
    var pend = leer(K_PEND, []); if (pend.indexOf(r.id) < 0) pend.push(r.id); escribir(K_PEND, pend);
    return enviarPendientes();
  }

  function filasRemotas(clave) {
    var url = endpoint();
    if (!url) return Promise.reject(new Error('No hay endpoint configurado en config.js'));
    return fetch(url + (url.indexOf('?') >= 0 ? '&' : '?') + 'k=' + encodeURIComponent(clave || ''))
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (!j || !j.ok) throw new Error((j && j.error) || 'Respuesta inválida');
        return j.filas.filter(function (f) { return f.modo === MODO; }).map(function (f) {
          f.ok = (f.ok === true || f.ok === 'TRUE' || f.ok === 'true' || f.ok === 1);
          f.n = Number(f.n) || 1;
          return f;
        });
      });
  }

  window.SpRegistro = {
    registrarSala: registrarSala,
    enviarPendientes: enviarPendientes,
    filasLocales: function () { var out = []; leer(K_REG, []).forEach(function (r) { out = out.concat(aFilas(r)); }); return out; },
    filasRemotas: filasRemotas,
    pendientes: function () { return leer(K_PEND, []).length; },
    hayEndpoint: function () { return !!endpoint(); },
    partidas: {
      todas: function () { return leer(K_EST, {}); },
      guardar: function (p) { var t = leer(K_EST, {}); t[p.id] = p; escribir(K_EST, t); },
      borrar: function (id) { var t = leer(K_EST, {}); delete t[id]; escribir(K_EST, t); }
    },
    borrarTodo: function () { borrar(K_REG); borrar(K_PEND); borrar(K_EST); }
  };
})();
