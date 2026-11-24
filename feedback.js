/* Suggestions and bug reports: a small form that sends to the Spectre API. */
(function () {
  var API = "https://api.spectrebot.org/api/feedback";
  var css = [
    ".fb-fab{position:fixed;right:max(16px,env(safe-area-inset-right,0px));bottom:max(16px,env(safe-area-inset-bottom,0px));z-index:30;display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 18px;border-radius:999px;border:1px solid var(--line);background:rgba(18,14,32,.82);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);color:var(--ink);font:600 .95rem/1 var(--body);cursor:pointer;box-shadow:0 8px 30px rgba(0,0,0,.4)}",
    ".fb-fab:hover{border-color:var(--accent);color:var(--ink)}",
    ".fb-fab svg{width:18px;height:18px;stroke:var(--accent)}",
    "dialog.fb{width:min(520px,calc(100vw - 32px));max-height:calc(100vh - 32px);overflow:auto;padding:0;border:1px solid var(--line);border-radius:20px;background:#0D0A1A;color:var(--ink);box-shadow:0 30px 90px rgba(0,0,0,.6)}",
    "dialog.fb::backdrop{background:rgba(4,3,9,.72);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px)}",
    ".fb-in,.fb-in *{box-sizing:border-box}",
    ".fb-in{padding:26px 26px 24px;font:400 1rem/1.5 var(--body)}",
    ".fb-in h2{margin:0 0 4px;font:800 1.5rem/1.2 var(--display);letter-spacing:-.02em}",
    ".fb-in p.fb-sub{margin:0 0 18px;color:var(--muted);font-size:.95rem}",
    ".fb-tabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;padding:5px;margin:0 0 16px;border:1px solid var(--line);border-radius:14px;background:var(--soft)}",
    ".fb-tabs label{position:relative;display:flex;align-items:center;justify-content:center;min-height:44px;border-radius:10px;color:var(--muted);font-weight:600;font-size:.9rem;text-align:center;cursor:pointer}",
    ".fb-tabs input{position:absolute;opacity:0;inset:0;cursor:pointer}",
    ".fb-tabs label:has(input:checked){background:linear-gradient(100deg,#FF5CD1,#6B5BFF 60%,#3DB8FF);color:#fff}",
    ".fb-tabs label:has(input:focus-visible){outline:2px solid var(--accent);outline-offset:2px}",
    ".fb-in label.fb-l{display:block;margin:14px 0 6px;font-weight:600;font-size:.9rem;color:var(--ink)}",
    ".fb-in label.fb-l span{font-weight:400;color:var(--muted)}",
    ".fb-in textarea,.fb-in input[type=text]{width:100%;padding:12px 14px;border:1px solid var(--line);border-radius:12px;background:rgba(255,255,255,.05);color:var(--ink);font:400 1rem/1.5 var(--body)}",
    ".fb-in textarea{min-height:130px;resize:vertical}",
    ".fb-in textarea:focus,.fb-in input[type=text]:focus{outline:2px solid var(--accent);outline-offset:1px;border-color:transparent}",
    ".fb-count{margin-top:4px;text-align:right;color:var(--muted);font-size:.8rem}",
    ".fb-hp{position:absolute!important;left:-9999px;width:1px;height:1px;overflow:hidden}",
    ".fb-err{min-height:1.4em;margin:12px 0 0;color:var(--rose);font-size:.92rem}",
    ".fb-row{display:flex;gap:10px;justify-content:flex-end;margin-top:8px}",
    ".fb-btn{min-height:46px;padding:0 22px;border-radius:999px;border:1px solid var(--line);background:transparent;color:var(--ink);font:600 1rem/1 var(--body);cursor:pointer}",
    ".fb-btn:hover{border-color:var(--accent)}",
    ".fb-btn.fb-go{border:0;background:linear-gradient(100deg,#FF5CD1,#6B5BFF 60%,#3DB8FF);color:#fff}",
    ".fb-btn[disabled]{opacity:.6;cursor:default}",
    ".fb-done{text-align:center;padding:14px 0 6px}",
    ".fb-done svg{width:44px;height:44px;stroke:var(--cyan);margin-bottom:10px}",
    ".fb-done h2{margin-bottom:6px}",
    "@media (prefers-reduced-motion:no-preference){dialog.fb[open]{animation:fbin .18s ease-out}@keyframes fbin{from{opacity:0;transform:translateY(8px)}}}"
  ].join("\n");
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>';
  var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5"/></svg>';

  var fab = document.createElement("button");
  fab.type = "button"; fab.className = "fb-fab"; fab.innerHTML = ICON + "<span>Feedback</span>";
  fab.setAttribute("aria-haspopup", "dialog");
  document.body.appendChild(fab);

  var dlg = document.createElement("dialog");
  dlg.className = "fb"; dlg.setAttribute("aria-labelledby", "fb-title");
  dlg.innerHTML =
    '<form class="fb-in" novalidate>' +
    '<h2 id="fb-title">Send feedback</h2>' +
    '<p class="fb-sub">Got an idea, found a bug, or been raided? It goes straight to the Spectre team.</p>' +
    '<div class="fb-tabs" role="radiogroup" aria-label="Type">' +
    '<label><input type="radio" name="kind" value="suggestion" checked>Suggestion</label>' +
    '<label><input type="radio" name="kind" value="bug">Bug report</label>' +
    '<label><input type="radio" name="kind" value="raid">Raid report</label></div>' +
    '<label class="fb-l" for="fb-msg" id="fb-msg-l">Your suggestion</label>' +
    '<textarea id="fb-msg" name="message" maxlength="1500" required></textarea>' +
    '<div class="fb-count" id="fb-count" aria-hidden="true">0 / 1500</div>' +
    '<div id="fb-where-wrap" hidden><label class="fb-l" for="fb-where" id="fb-where-l">Where did it happen? <span>(optional)</span></label>' +
    '<input type="text" id="fb-where" name="where" maxlength="100" placeholder="A command, the dashboard, this website..."></div>' +
    '<label class="fb-l" for="fb-contact">Discord name or email <span>(optional, only if you want a reply)</span></label>' +
    '<input type="text" id="fb-contact" name="contact" maxlength="100" autocomplete="off">' +
    '<div class="fb-hp" aria-hidden="true"><label>Website <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>' +
    '<p class="fb-err" id="fb-err" role="alert"></p>' +
    '<div class="fb-row"><button type="button" class="fb-btn" id="fb-cancel">Cancel</button>' +
    '<button type="submit" class="fb-btn fb-go" id="fb-send">Send</button></div></form>';
  document.body.appendChild(dlg);

  var form = dlg.querySelector("form"), msg = form.message, err = dlg.querySelector("#fb-err"),
      sendBtn = dlg.querySelector("#fb-send"), formHTML = form.innerHTML;

  function kind() { return form.querySelector("input[name=kind]:checked").value; }
  function sync() {
    var k = kind(), raid = k === "raid";
    dlg.querySelector("#fb-msg-l").textContent = raid ? "What happened?" : k === "bug" ? "What went wrong?" : "Your suggestion";
    msg.placeholder = raid ? "What did the raiders do, and when? Include usernames or IDs if you have them." :
      k === "bug" ? "What did you do, what did you expect, and what happened instead?" : "What would make Spectre better?";
    dlg.querySelector("#fb-where-wrap").hidden = k === "suggestion";
    dlg.querySelector("#fb-where-l").innerHTML = raid ? "Server name or ID <span>(optional)</span>" : "Where did it happen? <span>(optional)</span>";
    dlg.querySelector("#fb-where").placeholder = raid ? "The server that was raided" : "A command, the dashboard, this website...";
    dlg.querySelector("#fb-count").textContent = msg.value.length + " / 1500";
  }
  function open(k) {
    if (!form.isConnected || !form.querySelector("#fb-msg")) { form = rebuild(); }
    form.querySelector("input[name=kind][value=" + (k === "bug" || k === "raid" ? k : "suggestion") + "]").checked = true;
    err.textContent = ""; sync();
    if (!dlg.open) dlg.showModal();
    msg.focus();
  }
  function rebuild() {
    var f = document.createElement("form"); f.className = "fb-in"; f.setAttribute("novalidate", ""); f.innerHTML = formHTML;
    dlg.replaceChildren(f); wire(f); return f;
  }
  function wire(f) {
    form = f; msg = f.message; err = f.querySelector("#fb-err"); sendBtn = f.querySelector("#fb-send");
    f.addEventListener("change", sync); msg.addEventListener("input", function () { err.textContent = ""; sync(); });
    f.querySelector("#fb-cancel").addEventListener("click", function () { dlg.close(); });
    f.addEventListener("submit", submit);
  }
  function submit(e) {
    e.preventDefault();
    var text = msg.value.trim();
    if (text.length < 10) { err.textContent = "Please write a little more (at least 10 characters)."; msg.focus(); return; }
    var body = { kind: kind(), message: text, where: form.where.value, contact: form.contact.value, website: form.website.value };
    sendBtn.disabled = true; sendBtn.textContent = "Sending..."; err.textContent = "";
    fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), credentials: "omit" })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        if (!res.ok) throw new Error(res.d.error || "Something went wrong. Please try again.");
        dlg.innerHTML = '<div class="fb-in fb-done">' + CHECK + '<h2>Thank you!</h2><p class="fb-sub">Your ' +
          ({ bug: "bug report", raid: "raid report" }[body.kind] || "suggestion") + ' was sent.</p>' +
          '<div class="fb-row" style="justify-content:center"><button type="button" class="fb-btn fb-go" id="fb-close">Close</button></div></div>';
        dlg.querySelector("#fb-close").addEventListener("click", function () { dlg.close(); }); dlg.querySelector("#fb-close").focus();
      })
      .catch(function (ex) {
        sendBtn.disabled = false; sendBtn.textContent = "Send";
        err.textContent = ex instanceof TypeError ? "Couldn't reach Spectre. Check your connection and try again." : ex.message;
      });
  }
  wire(form);
  fab.addEventListener("click", function () { open("suggestion"); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("[data-feedback]");
    if (a) { e.preventDefault(); open(a.getAttribute("data-feedback")); }
  });
})();
