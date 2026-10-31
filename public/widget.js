/*
 * RAG Studio web widget loader.
 *
 * Paste the embed code from RAG Studio (Channels → Web Widget) before </body> on your site:
 *   <script src="https://<rag-studio>/widget.js" data-chatbot-id="…" data-color="…" data-position="…"
 *     data-welcome="…" data-domains="…" async></script>
 *
 * It adds one small iframe in the bottom corner. The iframe is a RAG Studio page (#/w/<chatbotId>) that draws the
 * chat bubble and the chat window, and tells this script when to grow (open) or shrink (closed) the frame.
 */
(function () {
  var script = document.currentScript;
  if (!script) return;
  // Loading the snippet again (e.g. pasting another chatbot's code into the browser console) replaces the widget.
  if (window.__ragStudioWidget && window.__ragStudioWidget.remove) window.__ragStudioWidget.remove();
  // A widget from an older copy of this file leaves only its iframe to find.
  Array.prototype.forEach.call(document.querySelectorAll('iframe[src*="#/w/"]'), function (old) {
    if (old.src.indexOf(script.src.replace(/[^/]*$/, "")) === 0) old.parentNode.removeChild(old);
  });

  var chatbotId = script.getAttribute("data-chatbot-id");
  if (!chatbotId) {
    console.warn("[RAG Studio widget] The embed code is missing data-chatbot-id.");
    return;
  }

  var base = script.src.replace(/[^/]*$/, ""); // the RAG Studio address that served this file
  var studioOrigin = new URL(base).origin;
  var CLOSED = { width: 88, height: 88 };
  var OPEN = { width: 412, height: 720 };

  var frame = document.createElement("iframe");
  frame.title = "Chat with us";
  // The embed code also carries the widget settings, for when the iframe can't read what RAG Studio saved
  // (browsers give an iframe on another site its own storage).
  var query = "?host=" + encodeURIComponent(location.host);
  [
    ["color", "data-color"],
    ["position", "data-position"],
    ["welcome", "data-welcome"],
    ["domains", "data-domains"],
  ].forEach(function (pair) {
    var value = script.getAttribute(pair[1]);
    if (value) query += "&" + pair[0] + "=" + encodeURIComponent(value);
  });
  frame.src = base + "#/w/" + encodeURIComponent(chatbotId) + query;
  frame.setAttribute("allowtransparency", "true");
  frame.style.cssText =
    "position:fixed;bottom:8px;right:8px;border:0;background:transparent;color-scheme:normal;" +
    "z-index:2147483000;display:none;width:" +
    CLOSED.width +
    "px;height:" +
    CLOSED.height +
    "px;" +
    "max-width:calc(100vw - 16px);max-height:calc(100vh - 16px);";

  var lastReason = null; // the widget re-checks its status every few seconds; warn once per reason

  var onMessage = function (event) {
    if (event.source !== frame.contentWindow || event.origin !== studioOrigin) return;
    var data = event.data;
    if (!data || data.type !== "rag-studio-widget") return;

    if (data.state === "hidden") {
      frame.style.display = "none";
      if (data.reason && data.reason !== lastReason) console.warn("[RAG Studio widget] Not shown: " + data.reason);
      lastReason = data.reason;
      return;
    }
    lastReason = null;
    var size = data.state === "open" ? OPEN : CLOSED;
    frame.style.display = "block";
    frame.style.width = size.width + "px";
    frame.style.height = size.height + "px";
    frame.style.left = data.position === "bottom-left" ? "8px" : "auto";
    frame.style.right = data.position === "bottom-left" ? "auto" : "8px";
  };
  window.addEventListener("message", onMessage);

  window.__ragStudioWidget = {
    chatbotId: chatbotId,
    remove: function () {
      window.removeEventListener("message", onMessage);
      if (frame.parentNode) frame.parentNode.removeChild(frame);
      window.__ragStudioWidget = null;
    },
  };

  var mount = function () {
    document.body.appendChild(frame);
  };
  if (document.body) mount();
  else document.addEventListener("DOMContentLoaded", mount);
})();
