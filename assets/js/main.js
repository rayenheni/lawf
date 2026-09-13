/* lawf — vanilla JS, ~90 lignes, aucune dépendance.
   1) menu mobile (attribut `hidden` : hors tab-order quand fermé)
   2) compteurs animés (désactivés si prefers-reduced-motion)
   3) composeur honnête : le formulaire fabrique en direct les liens
      WhatsApp / e-mail ; rien n'est jamais "envoyé" en silence
   4) année du pied de page                                        */
(function () {
  "use strict";

  /* ---------- menu mobile ---------- */
  var burger = document.querySelector("[data-menu-btn]");
  var panel = document.querySelector("[data-menu-panel]");
  if (burger && panel) {
    var setMenu = function (open) {
      if (open) panel.removeAttribute("hidden");
      else panel.setAttribute("hidden", "");
      burger.setAttribute("aria-expanded", String(open));
    };
    burger.addEventListener("click", function () {
      setMenu(panel.hasAttribute("hidden"));
    });
    panel.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !panel.hasAttribute("hidden")) {
        setMenu(false);
        burger.focus();
      }
    });
  }

  /* ---------- compteurs ---------- */
  var counters = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
  var reduce =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    counters.forEach(function (el) {
      el.textContent = el.getAttribute("data-count");
    });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          io.unobserve(el);
          var target = parseInt(el.getAttribute("data-count"), 10) || 0;
          var t0 = performance.now();
          var dur = 1200;
          var tick = function (now) {
            var p = Math.min(1, (now - t0) / dur);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = String(Math.round(target * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(function (el) {
      el.textContent = "0";
      io.observe(el);
    });
  }

  /* ---------- composeur WhatsApp / e-mail ---------- */
  var form = document.querySelector("[data-compose]");
  if (form) {
    var wa = document.getElementById("compose-wa");
    var mail = document.getElementById("compose-mail");
    var labels = JSON.parse(form.getAttribute("data-labels"));
    var greeting = form.getAttribute("data-greeting");
    var build = function () {
      var name = (form.elements.name.value || "").trim();
      var reach = (form.elements.contact.value || "").trim();
      var msg = (form.elements.message.value || "").trim();
      var body = [greeting, "", labels.name + ": " + name, labels.contact + ": " + reach, "", msg].join(
        "\n"
      );
      if (wa)
        wa.href =
          "https://wa.me/" + form.getAttribute("data-whatsapp") + "?text=" + encodeURIComponent(body);
      if (mail)
        mail.href =
          "mailto:" +
          form.getAttribute("data-email") +
          "?subject=" +
          encodeURIComponent(labels.subject + " — " + name) +
          "&body=" +
          encodeURIComponent(body);
    };
    form.addEventListener("input", build);
    build();
  }

  /* ---------- année ---------- */
  Array.prototype.forEach.call(document.querySelectorAll("[data-year]"), function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
