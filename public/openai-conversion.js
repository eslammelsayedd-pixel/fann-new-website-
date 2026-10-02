/* Staged only. Release requires owner approval, consent UI and durable server receipts. */
(function (w, d) {
  'use strict';
  var ENABLED = false; // Keep false until the reviewed release prerequisites are met.
  var consent = false;
  var initialized = false;
  var sent = new Set();
  function initialize() {
    if (!ENABLED || !consent || initialized) return;
    // Queue consent BEFORE init, and only fetch the SDK after affirmative consent.
    if (!w.oaiq) {
      var q = function () { q.q.push(arguments); };
      q.q = [];
      w.oaiq = q;
    }
    w.oaiq('consent', false);
    w.oaiq('init', { pixelId: '5TNUVWtpTdznDLy9GfKLwk', debug: true });
    w.oaiq('consent', true);
    var j = d.createElement('script');
    j.async = true;
    j.src = 'https://bzrcdn.openai.com/sdk/oaiq.min.js';
    d.head.appendChild(j);
    initialized = true;
  }
  function measureWhatsAppClick() {
    if (!ENABLED || !consent || !initialized || !w.crypto || typeof w.crypto.randomUUID !== 'function') return false;
    w.oaiq('measure', 'custom', { type: 'custom' }, { custom_event_name: 'whatsapp_click', event_id: w.crypto.randomUUID(), opt_out: true });
    return true;
  }
  d.addEventListener('click', function (event) {
    if (!event.isTrusted || event.defaultPrevented) return;
    var anchor = event.target && event.target.closest ? event.target.closest('a[href]') : null;
    if (!anchor) return;
    try {
      var url = new URL(anchor.href);
      if (url.protocol === 'https:' && (url.hostname === 'wa.me' || (url.hostname === 'api.whatsapp.com' && url.pathname === '/send'))) measureWhatsAppClick();
    } catch (_) { /* never interrupt navigation */ }
  });
  w.fannOpenAIConversion = Object.freeze({
    // Wire only to an explicit, reviewed visitor consent control. No implied consent.
    setConsent: function (granted) {
      consent = granted === true;
      if (!consent && initialized) w.oaiq('consent', false);
      if (consent && initialized) w.oaiq('consent', true);
      if (consent) initialize();
    },
    measurePersistedLead: function (receipt) {
      if (!ENABLED || !consent || !initialized || !receipt || receipt.persisted !== true) return false;
      // Opaque server-issued UUID only, never contact details or a client-generated ID.
      var id = receipt.submissionId;
      if (typeof id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id) || sent.has(id)) return false;
      w.oaiq('measure', 'lead_created', { type: 'customer_action' }, { event_id: id, opt_out: true });
      sent.add(id);
      return true;
    }
  });
})(window, document);
