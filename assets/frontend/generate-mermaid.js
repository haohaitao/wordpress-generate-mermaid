(function () {
  "use strict";

  var selector =
    '.mermaid:not([data-processed="true"]):not([data-mermaid-error])';
  var observerTimer;

  function getNodes(root) {
    var nodes = [];

    if (root.nodeType === 1 && root.matches(selector)) {
      nodes.push(root);
    }

    Array.prototype.push.apply(nodes, root.querySelectorAll(selector));
    return nodes;
  }

  function markError(node, error) {
    node.classList.add("generate-mermaid-error");
    node.setAttribute("data-mermaid-error", "true");
    node.setAttribute("role", "img");
    node.setAttribute("aria-label", "Mermaid 图表语法错误");

    if (error && error.message) {
      node.title = error.message;
    }
  }

  function renderNode(node) {
    if (node.dataset.generateMermaidRendering === "true") {
      return;
    }

    node.dataset.generateMermaidRendering = "true";
    node.classList.remove("generate-mermaid-error");
    node.removeAttribute("data-mermaid-error");

    window.mermaid
      .run({
        nodes: [node],
        suppressErrors: true,
      })
      .catch(function (error) {
        markError(node, error);
      })
      .then(function () {
        delete node.dataset.generateMermaidRendering;
      });
  }

  function renderMermaid(root) {
    if (!window.mermaid) {
      return;
    }

    getNodes(root || document).forEach(renderNode);
  }

  function scheduleRender(root) {
    window.clearTimeout(observerTimer);
    observerTimer = window.setTimeout(function () {
      renderMermaid(root || document);
    }, 60);
  }

  function observeContent() {
    if (!window.MutationObserver || !document.body) {
      return;
    }

    new MutationObserver(function (mutations) {
      var hasNewElement = mutations.some(function (mutation) {
        return Array.prototype.some.call(mutation.addedNodes, function (node) {
          return node.nodeType === 1;
        });
      });

      if (hasNewElement) {
        scheduleRender(document);
      }
    }).observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  function init() {
    if (!window.mermaid) {
      return;
    }

    window.mermaid.initialize({
      startOnLoad: false,
      securityLevel: "strict",
      theme: "default",
      suppressErrorRendering: true,
      flowchart: {
        htmlLabels: true,
        useMaxWidth: true,
      },
    });

    renderMermaid(document);
    observeContent();
  }

  window.beginMermaidRender = renderMermaid;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
