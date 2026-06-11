/* ============================================================
   analytics.js — measurement layer for nadia pomirleanu's site
   ------------------------------------------------------------
   SETUP (one time):
   1. Create a Google Analytics 4 property at analytics.google.com
   2. Copy your Measurement ID (looks like G-XXXXXXXXXX)
   3. Paste it below, replacing the placeholder
   That's it — every page already loads this file.

   WHAT IT TRACKS automatically (as GA4 events):
   - page_view ............ every page, with page title & path
   - white_paper_download . any click on a link ending in .pdf
   - contact_click ........ any mailto: link (label = which page/intent)
   - survey_click ......... links on ongoing.html marked data-survey
   - outbound_click ....... links leaving the site (Scholar, press, etc.)
   - newsletter_click ..... links marked data-newsletter
   These map directly to the strategy metrics: downloads,
   contact intent, survey participation, press referrals.
   ============================================================ */

(function () {
  var GA_ID = "G-ZP78CGV34E";

  // Graceful no-op until the ID is set, so the site never breaks.
  if (!GA_ID || GA_ID.indexOf("XXXX") !== -1) {
    console.info("[analytics] GA4 ID not set yet - tracking disabled.");
    window.track = function () {};
    return;
  }

  // --- load GA4 ---
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", GA_ID, { anonymize_ip: true });

  window.track = function (name, params) { gtag("event", name, params || {}); };

  // --- automatic click tracking ---
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a");
    if (!a || !a.href) return;
    var href = a.getAttribute("href") || "";
    var label = a.getAttribute("data-label") || a.textContent.trim().slice(0, 60);
    var page = location.pathname;

    if (href.indexOf("mailto:") === 0) {
      track("contact_click", { label: label, page: page });
    } else if (/\.pdf($|\?)/i.test(href)) {
      track("white_paper_download", { file: href.split("/").pop(), page: page });
    } else if (a.hasAttribute("data-survey")) {
      track("survey_click", { study: label, page: page });
    } else if (a.hasAttribute("data-newsletter")) {
      track("newsletter_click", { page: page });
    } else if (a.host && a.host !== location.host) {
      track("outbound_click", { destination: a.host, page: page });
    }
  });
})();
