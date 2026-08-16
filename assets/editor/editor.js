(function (wp) {
  "use strict";

  var el = wp.element.createElement;
  var useEffect = wp.element.useEffect;
  var useRef = wp.element.useRef;
  var useState = wp.element.useState;
  var registerBlockType = wp.blocks.registerBlockType;
  var Button = wp.components.Button;
  var ButtonGroup = wp.components.ButtonGroup;
  var TextareaControl = wp.components.TextareaControl;

  if (window.mermaid && !window.beginMermaidEditorReady) {
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
    window.beginMermaidEditorReady = true;
  }

  function Edit(props) {
    var attributes = props.attributes;
    var setAttributes = props.setAttributes;
    var modeState = useState("edit");
    var previewState = useState("");
    var errorState = useState("");
    var renderCount = useRef(0);
    var mode = modeState[0];
    var setMode = modeState[1];
    var svg = previewState[0];
    var setSvg = previewState[1];
    var error = errorState[0];
    var setError = errorState[1];

    useEffect(
      function () {
        var cancelled = false;
        var renderId;

        if (
          mode !== "preview" ||
          !attributes.source.trim() ||
          !window.mermaid
        ) {
          return function () {};
        }

        renderCount.current += 1;
        renderId =
          "generate-mermaid-" +
          props.clientId.replace(/[^a-z0-9]/gi, "") +
          "-" +
          renderCount.current;
        setError("");
        setSvg("");

        window.mermaid
          .render(renderId, attributes.source)
          .then(function (result) {
            if (!cancelled) {
              setSvg(result.svg);
            }
          })
          .catch(function (renderError) {
            if (!cancelled) {
              setSvg("");
              setError(renderError.message || "Mermaid 语法错误");
            }
          });

        return function () {
          cancelled = true;
        };
      },
      [mode, attributes.source],
    );

    return el(
      "div",
      { className: "bmd-editor-block" },
      el(
        "div",
        { className: "bmd-editor-toolbar" },
        el("span", { className: "bmd-editor-title" }, "Mermaid"),
        el(
          ButtonGroup,
          null,
          el(
            Button,
            {
              isPressed: mode === "edit",
              onClick: function () {
                setMode("edit");
              },
            },
            "编辑",
          ),
          el(
            Button,
            {
              isPressed: mode === "preview",
              onClick: function () {
                setMode("preview");
              },
            },
            "预览",
          ),
        ),
      ),
      mode === "edit"
        ? el(TextareaControl, {
            value: attributes.source,
            placeholder: "flowchart TD\n    A --> B",
            onChange: function (source) {
              setAttributes({ source: source });
            },
          })
        : el(
            "div",
            { className: "bmd-editor-preview" },
            error
              ? el("div", { className: "bmd-editor-error" }, error)
              : svg
                ? el("div", {
                    className: "bmd-editor-svg",
                    dangerouslySetInnerHTML: { __html: svg },
                  })
                : el(
                    "span",
                    { className: "bmd-editor-loading" },
                    "正在渲染...",
                  ),
          ),
    );
  }

  function Save(props) {
    return el(
      "pre",
      { className: "mermaid generate-mermaid-source" },
      props.attributes.source,
    );
  }

  registerBlockType("generate/mermaid", {
    edit: Edit,
    save: Save,
  });
})(window.wp);
