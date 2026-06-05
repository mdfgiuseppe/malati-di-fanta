// MALATI DI FANTA — Google Apps Script Backend v6
var SPREADSHEET_ID = '1jfFj3WzeEfAi56wV2C2GdusjJu0_dUVNsXut1xUfbzA';

function doGet(e) { return handleRequest(e); }
function doPost(e) { return handleRequest(e); }
function doOptions(e) {
  return sendCORSResponse({ok: true});
}

function sendCORSResponse(data) {
  var output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  output.addHeader('Access-Control-Allow-Origin', '*');
  output.addHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  output.addHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  output.addHeader('Access-Control-Max-Age', '86400');
  return output;
}

function handleRequest(e) {
  var params = e.parameter || {};
  var cbName = params.callback || '';
  var action = params.action || '';
  var result;

  // 🔍 DEBUG
  Logger.log('=== REQUEST ===');
  Logger.log('Action: ' + action);
  Logger.log('Key: ' + params.key);
  Logger.log('Data length: ' + (params.data ? params.data.length : 0));

  try {
    if (action==='saveKey') {
      var key = params.key || '';
      var data = params.data || '';

      Logger.log('SaveKey - Key: ' + key);
      Logger.log('SaveKey - Data start: ' + data.substring(0, 100));

      // Intercetta le quote
      if (key.indexOf('adm_gest_quote_') === 0) {
        Logger.log('🎯 INTERCETTATO: Quote');
        try {
          var quoteData = JSON.parse(data);
          var parts = key.split('_');
          var tk = parts[3];
          var lk = parts[4];
          Logger.log('Torneo: ' + tk + ', Lega: ' + lk);
          Object.keys(quoteData).forEach(function(squadra) {
            var q = quoteData[squadra];
            Logger.log('Salvando squadra: ' + squadra + ' -> importo: ' + q.importo);
            saveToQuoteSheet(tk, lk, squadra, q.pagato, q.data, q.importo);
          });
          Logger.log('✅ Quote salvate con successo');
        } catch(e) {
          Logger.log('❌ ERRORE parsing quote: ' + e.toString());
        }
      }
      // Intercetta l'importo della quota
      else if (key.indexOf('adm_gest_qimp_') === 0) {
        Logger.log('🎯 INTERCETTATO: Importo quota');
        writeValue('Config', key, data);
      }
      // Intercetta le spese
      else if (key === 'adm_gest_spese') {
        Logger.log('🎯 INTERCETTATO: Spese');
        try {
          var speseData = JSON.parse(data);
          speseData.forEach(function(spesa) {
            Logger.log('Salvando spesa: ' + spesa.desc);
            saveToSpesaSheet(spesa.desc || 'N/A', spesa.importo || 0, spesa.data || '');
          });
          Logger.log('✅ Spese salvate con successo');
        } catch(e) {
          Logger.log('❌ ERRORE parsing spese: ' + e.toString());
        }
      }

      // Salva sempre nel sistema KV (backup)
      writeValue('Config', key, data);
      result = {ok: true};
    }
    else if (action==='login') result = loginUser(params.username, params.password);
    else if (action==='getCalendario') result = getCalendario(params.torneo, params.lega);
    else if (action==='saveCalendario') result = saveCalendario(params.torneo, params.lega, params.data);
    else if (action==='getStadio') result = getStadio(params.torneo, params.lega);
    else if (action==='saveStadio') result = saveStadio(params.torneo, params.lega, params.data);
    else if (action==='getCoppe') result = getCoppe(params.torneo, params.coppa);
    else if (action==='saveCoppe') result = saveCoppe(params.torneo, params.coppa, params.data);
    else if (action==='getMulte') result = getMulte(params.torneo, params.lega);
    else if (action==='saveMulte') result = saveMulte(params.torneo, params.lega, params.data);
    else if (action==='getSponsor') result = getSponsor(params.torneo, params.lega, params.squadra);
    else if (action==='saveSponsor') result = saveSponsor(params.torneo, params.lega, params.squadra, params.data);
    else if (action==='getCrediti') result = getCrediti(params.torneo, params.lega);
    else if (action==='saveCrediti') result = saveCrediti(params.torneo, params.lega, params.squadra, params.valore);
    else if (action==='getUtenti') result = getUtenti();
    else if (action==='saveUtente') result = saveUtente(params.data);
    else if (action==='saveAllUtenti') result = saveAllUtenti(params.data);
    else if (action==='getPendingRequests') result = getPendingRequests();
    else if (action==='ping') result = {ok: true, ts: new Date().toISOString()};
    else if (action==='getRose') result = getRose(params.torneo, params.lega);
    else if (action==='saveRose') result = saveRose(params.torneo, params.lega, params.data);
    else if (action==='getTorneoConfig') result = getTorneoConfig(params.torneo);
    else if (action==='saveTorneoConfig') result = saveTorneoConfig(params.torneo, params.data);
    else result = {ok: false, error: 'Azione non riconosciuta: ' + action};
  } catch(err) {
    Logger.log('❌ ERRORE GENERALE: ' + err.toString());
    result = {ok: false, error: err.toString()};
  }

  var json = JSON.stringify(result);
  var out = cbName ? cbName + '(' + json + ')' : json;
  var mime = cbName ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON;
  var output = ContentService.createTextOutput(out).setMimeType(mime);
  output.addHeader('Access-Control-Allow-Origin', '*');
  output.addHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  output.addHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  output.addHeader('Access-Control-Max-Age', '86400');
  return output;
}

function getOrCreateSheet(name) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(['chiave', 'valore', 'aggiornato']);
  }
  return sheet;
}

function readValue(sheetName, key) {
  var sheet = getOrCreateSheet(sheetName);
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === key) {
      try { return JSON.parse(data[i][1]); } catch(e) { return data[i][1]; }
    }
  }
  return null;
}

function writeValue(sheetName, key, value) {
  var sheet = getOrCreateSheet(sheetName);
  var data = sheet.getDataRange().getValues();
  var ts = new Date().toLocaleString('it-IT');
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === key) {
      sheet.getRange(i+1, 2).setValue(JSON.stringify(value));
      sheet.getRange(i+1, 3).setValue(ts);
      return;
    }
  }
  sheet.appendRow([key, JSON.stringify(value), ts]);
}

function loginUser(username, password) {
  if (!username || !password) return {ok: false, error: 'Credenziali mancanti'};
  var usernameLower = username.toLowerCase();
  var adminPsw = readValue('Config', 'admin_password') || 'admin2026';
  if (usernameLower === 'admin' && password === adminPsw) {
    return {ok: true, user: {username:'admin', nome:'Admin', ruolo:'admin'}};
  }
  var utenti = readValue('Utenti', 'lista') || [];
  var user = null;
  for (var i=0; i<utenti.length; i++) {
    if (utenti[i].username.toLowerCase()===usernameLower && utenti[i].password===password && utenti[i].attivo!==false) {
      user = utenti[i]; break;
    }
  }
  if (user) return {ok: true, user: {username:user.username, nome:user.nome, lega:user.lega}};
  return {ok: false, error: 'Credenziali non valide'};
}

function getUtenti() { return {ok: true, data: readValue('Utenti', 'lista') || []}; }

function saveUtente(dataStr) {
  var user = JSON.parse(dataStr);
  var lista = readValue('Utenti', 'lista') || [];
  var found = false;
  for (var i=0; i<lista.length; i++) {
    if (lista[i].username.toLowerCase()===user.username.toLowerCase()) { lista[i]=user; found=true; break; }
  }
  if (!found) lista.push(user);
  writeValue('Utenti', 'lista', lista);
  return {ok: true};
}

function saveAllUtenti(dataStr) {
  var lista = JSON.parse(dataStr);
  writeValue('Utenti', 'lista', lista);
  return {ok: true};
}

function getPendingRequests() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName('Form Responses 1');
  if (!sheet) return {ok: true, data: []};
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return {ok: true, data: []};
  var requests = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (!row[4]) continue; // salta se email è vuota
    requests.push({
      timestamp: row[0] ? new Date(row[0]).toLocaleDateString('it-IT') : '',
      cognome: row[1] || '',
      nome: row[2] || '',
      dataNascita: row[3] || '',
      email: row[4] || '',
      whatsapp: row[5] || '',
      squadra: row[6] || ''
    });
  }
  var utenti = readValue('Utenti', 'lista') || [];
  var registeredEmails = utenti.map(function(u) {
    return (u.email || u.username || '').toLowerCase().trim();
  });
  var pending = requests.filter(function(r) {
    var email = (r.email || '').toLowerCase().trim();
    return email && registeredEmails.indexOf(email) === -1;
  });
  return {ok: true, data: pending};
}

function getCalendario(t,l) { return {ok:true, data:readValue('Calendari',t+'_'+l)||{}}; }
function saveCalendario(t,l,d) { writeValue('Calendari',t+'_'+l,JSON.parse(d)); return {ok:true}; }
function getStadio(t,l) { return {ok:true, data:readValue('Stadi',t+'_'+l)||{}}; }
function saveStadio(t,l,d) { writeValue('Stadi',t+'_'+l,JSON.parse(d)); return {ok:true}; }
function getCoppe(t,c) { return {ok:true, data:readValue('Coppe',t+'_'+c)||{}}; }
function saveCoppe(t,c,d) { writeValue('Coppe',t+'_'+c,JSON.parse(d)); return {ok:true}; }
function getMulte(t,l) { return {ok:true, data:readValue('Multe',t+'_'+l)||{}}; }
function saveMulte(t,l,d) { writeValue('Multe',t+'_'+l,JSON.parse(d)); return {ok:true}; }
function getSponsor(t,l,s) { return {ok:true, data:readValue('Sponsor',t+'_'+l+'_'+s)||{}}; }
function saveSponsor(t,l,s,d) { writeValue('Sponsor',t+'_'+l+'_'+s,JSON.parse(d)); return {ok:true}; }
function getCrediti(t,l) { return {ok:true, data:readValue('Crediti',t+'_'+l)||{}}; }
function saveCrediti(t,l,s,v) {
  var cr=readValue('Crediti',t+'_'+l)||{};
  cr[s]=parseFloat(v)||0;
  writeValue('Crediti',t+'_'+l,cr);
  return {ok:true};
}
function getRose(t,l) { return {ok:true, data:readValue('Rose',t+'_'+l)||{}}; }
function saveRose(t,l,d) { writeValue('Rose',t+'_'+l,JSON.parse(d)); return {ok:true}; }
function getTorneoConfig(t) { return {ok:true, data:readValue('TorneiConfig',t)||{}}; }
function saveTorneoConfig(t,d) { writeValue('TorneiConfig',t,JSON.parse(d)); return {ok:true}; }

// ===== FOGLI DEDICATI =====

function saveToQuoteSheet(torneo, lega, squadra, pagato, data, importo) {
  Logger.log('saveToQuoteSheet called: ' + torneo + ',' + lega + ',' + squadra + ',' + importo);
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName('Quote') || ss.insertSheet('Quote');

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Torneo', 'Lega', 'Squadra', 'Importo', 'Pagato', 'Data Pagamento', 'Aggiornato']);
    Logger.log('Creato foglio Quote con header');
  }

  var data_range = sheet.getDataRange().getValues();
  var numImporto = parseFloat((importo || '0').toString().replace(',', '.')) || 0;
  Logger.log('Importo convertito: ' + numImporto);

  for (var i = 1; i < data_range.length; i++) {
    if (data_range[i][0] === torneo && data_range[i][1] === lega && data_range[i][2] === squadra) {
      sheet.getRange(i+1, 4).setValue(numImporto);
      sheet.getRange(i+1, 5).setValue(pagato ? 'SÌ' : 'NO');
      sheet.getRange(i+1, 6).setValue(data || '');
      sheet.getRange(i+1, 7).setValue(new Date().toLocaleString('it-IT'));
      Logger.log('Riga aggiornata alla riga ' + (i+1));
      return;
    }
  }

  sheet.appendRow([torneo, lega, squadra, numImporto, pagato ? 'SÌ' : 'NO', data || '', new Date().toLocaleString('it-IT')]);
  Logger.log('Nuova riga aggiunta al foglio Quote');
}

function saveToSpesaSheet(descrizione, importo, data) {
  Logger.log('saveToSpesaSheet called: ' + descrizione + ',' + importo);
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName('Spese') || ss.insertSheet('Spese');

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Descrizione', 'Importo', 'Data', 'Aggiornato']);
    Logger.log('Creato foglio Spese con header');
  }

  var numImporto = parseFloat((importo || '0').toString().replace(',', '.')) || 0;
  sheet.appendRow([descrizione, numImporto, data || new Date().toLocaleDateString('it-IT'), new Date().toLocaleString('it-IT')]);
  Logger.log('Nuova spesa aggiunta al foglio Spese');
}

function saveToBilancioSheet(torneo, lega, incassi, spese, saldo) {
  Logger.log('saveToBilancioSheet called: ' + torneo + ',' + lega);
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName('Bilancio') || ss.insertSheet('Bilancio');

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Torneo', 'Lega', 'Incassi', 'Spese', 'Saldo', 'Aggiornato']);
    Logger.log('Creato foglio Bilancio con header');
  }

  var data_range = sheet.getDataRange().getValues();
  for (var i = 1; i < data_range.length; i++) {
    if (data_range[i][0] === torneo && data_range[i][1] === lega) {
      sheet.getRange(i+1, 3).setValue(incassi);
      sheet.getRange(i+1, 4).setValue(spese);
      sheet.getRange(i+1, 5).setValue(saldo);
      sheet.getRange(i+1, 6).setValue(new Date().toLocaleString('it-IT'));
      Logger.log('Bilancio aggiornato alla riga ' + (i+1));
      return;
    }
  }

  sheet.appendRow([torneo, lega, incassi, spese, saldo, new Date().toLocaleString('it-IT')]);
  Logger.log('Nuovo bilancio aggiunto al foglio Bilancio');
}
