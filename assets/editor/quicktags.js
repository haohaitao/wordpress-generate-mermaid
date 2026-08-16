(function () {
  "use strict";

  if (!window.QTags) {
    return;
  }

  window.QTags.addButton(
    "bmd_mermaid",
    "Mermaid",
    function () {
      var source = window.prompt(
        "输入 Mermaid 语法：",
        "flowchart TD\n    A[开始] --> B{条件判断}\n    B -->|是| C[执行操作]\n    B -->|否| D[结束]",
      );

      if (!source) {
        return;
      }

      window.QTags.insertContent(
        '<pre class="mermaid generate-mermaid-source">' +
          source
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;") +
          "</pre>",
      );
    },
    "",
    "",
    "m",
    "插入 Mermaid 图表",
    121,
  );
})();
