// API - Google Sheets comunicazione
const GAS_URL = 'https://script.google.com/macros/s/AKfycbyAQAgaXj_SjZqJdwtcfaXrzcG-v1Bxqs7RRyofJTijzOMmu9J8ab4XdDScCW3hFUiw/exec';

const API = {
  call(params, callback) {
    const callId = Math.random().toString(36).substring(7);
    window[`callback_${callId}`] = function(data) {
      callback(null, data);
      delete window[`callback_${callId}`];
    };

    const script = document.createElement('script');
    script.src = GAS_URL + '?callback=callback_' + callId + '&' + new URLSearchParams(params).toString();
    document.head.appendChild(script);
  },

  getUtenti(callback) {
    this.call({ action: 'getUtenti' }, callback);
  },

  getTornei(callback) {
    this.call({ action: 'getTornei' }, callback);
  }
};
