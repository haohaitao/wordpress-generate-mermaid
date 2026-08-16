(function () {
  "use strict";

  var defaultDiagram =
    "flowchart TD\n" +
    "    A[开始] --> B{条件判断}\n" +
    "    B -->|是| C[执行操作]\n" +
    "    B -->|否| D[结束]";

  tinymce.PluginManager.add("bmd_mermaid", function (editor) {
    editor.addButton("bmd_mermaid", {
      text: "Mermaid",
      icon: "visualblocks",
      onclick: function () {
        editor.windowManager.open({
          title: "插入 Mermaid 图表",
          minWidth: 620,
          body: [
            {
              type: "textbox",
              name: "source",
              label: "Mermaid 语法",
              value: defaultDiagram,
              multiline: true,
              minHeight: 320,
            },
          ],
          onsubmit: function (event) {
            editor.insertContent(
              '<pre class="mermaid generate-mermaid-source">' +
                window.tinymce.DOM.encode(event.data.source) +
                "</pre><p></p>",
            );
          },
        });
      },
    });
  });
})();
