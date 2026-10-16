/* ═══════════════════════════════════════════
   BATIN · Laberinto del Tiempo — registro de partidas
   Lo usan el juego (index.html) y el panel (panel.html).
   1) Siempre guarda en el navegador (localStorage).
   2) Si hay endpoint en config.js, envía la partida a Google Sheets
      con el mismo formato que la OCA (mismo Code.gs).
═══════════════════════════════════════════ */

(function () {
  'use strict';

  var K_PARTIDAS = 'batin_lab2_partidas';
  var K_PEND     = 'batin_lab2_pendientes';
  var K_ACTUAL   = 'batin_lab2_actual';
  var MODO       = 'laberinto';

  function leer(clave, porDefecto) {
    try { var v = window.localStorage.getItem(clave); return v ? JSON.parse(v) : porDefecto; }
    catch (e) { return porDefecto; }
  }
  function escribir(clave, valor) {
    try { window.localStorage.setItem(clave, JSON.stringify(valor)); return true; }
    catch (e) { return false; }
  }
  function borrar(clave) { try { window.localStorage.removeItem(clave); } catch (e) {} }
  function endpoint() { var c = window.LAB_CONFIG || {}; return (c.endpoint || '').trim(); }

  /* Una fila por respuesta. Columnas compatibles con la planilla de la OCA:
     equipo = alias · tema = era (pasado/futuro) · n = número de caso */
  function aFilas(p) {
    return (p.respuestas || []).map(function (r) {
      return {
        partida: p.id, fecha: p.fecha, curso: p.curso, modo: MODO,
        equipo: p.alias, qid: r.qid, tema: r.era, sub: r.sub, n: r.caso,
        ok: !!r.ok, elegida: r.elegida || '', t: r.t
      };
    });
  }

  function guardarPartida(p) {
    var lista = leer(K_PARTIDAS, []);
    var i = lista.findIndex(function (x) { return x.id === p.id; });
    if (i >= 0) lista[i] = p; else lista.push(p);
    if (lista.length > 400) lista = lista.slice(lista.length - 400);
    return escribir(K_PARTIDAS, lista);
  }

  function encolar(id) {
    var pend = leer(K_PEND, []);
    if (pend.indexOf(id) < 0) pend.push(id);
    escribir(K_PEND, pend);
  }

  function enviarPendientes() {
    var url = endpoint();
    if (!url) return Promise.resolve('sin-endpoint');
    var pend = leer(K_PEND, []);
    if (!pend.length) return Promise.resolve('nada');
    var lista = leer(K_PARTIDAS, []);
    var envios = pend.map(function (id) {
      var p = lista.find(function (x) { return x.id === id; });
      if (!p || !(p.respuestas || []).length) return Promise.resolve(id);
      return fetch(url, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ accion: 'partida', partida: { id: p.id, fecha: p.fecha, curso: p.curso, modo: MODO }, filas: aFilas(p) })
      }).then(function () { return id; }).catch(function () { return null; });
    });
    return Promise.all(envios).then(function (res) {
      var restantes = pend.filter(function (id) { return res.indexOf(id) < 0; });
      escribir(K_PEND, restantes);
      return restantes.length ? 'sin-conexion' : 'enviado';
    });
  }

  function registrarFin(p) {
    guardarPartida(p);
    encolar(p.id);
    borrar(K_ACTUAL);
    return enviarPendientes();
  }

  function filasLocales() {
    var out = [];
    leer(K_PARTIDAS, []).forEach(function (p) { out = out.concat(aFilas(p)); });
    return out;
  }

  function filasRemotas(clave) {
    var url = endpoint();
    if (!url) return Promise.reject(new Error('No hay endpoint configurado en config.js'));
    var sep = url.indexOf('?') >= 0 ? '&' : '?';
    return fetch(url + sep + 'k=' + encodeURIComponent(clave || ''))
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (!j || !j.ok) throw new Error((j && j.error) || 'Respuesta inválida');
        return j.filas
          .filter(function (f) { return f.modo === MODO || f.tema === 'pasado' || f.tema === 'futuro'; })
          .map(function (f) {
            f.ok = (f.ok === true || f.ok === 'TRUE' || f.ok === 'true' || f.ok === 1);
            f.n = Number(f.n) || 0;
            return f;
          });
      });
  }

  window.LabRegistro = {
    guardarPartida: guardarPartida,
    registrarFin: registrarFin,
    enviarPendientes: enviarPendientes,
    filasLocales: filasLocales,
    filasRemotas: filasRemotas,
    partidasLocales: function () { return leer(K_PARTIDAS, []); },
    borrarLocales: function () { borrar(K_PARTIDAS); borrar(K_PEND); },
    pendientes: function () { return leer(K_PEND, []).length; },
    hayEndpoint: function () { return !!endpoint(); },
    actual: {
      leer:    function () { return leer(K_ACTUAL, null); },
      guardar: function (s) { return escribir(K_ACTUAL, s); },
      borrar:  function () { borrar(K_ACTUAL); }
    }
  };
})();
