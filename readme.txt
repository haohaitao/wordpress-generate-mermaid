=== Generate Mermaid ===
Contributors: haohaitao
Tags: mermaid, flowchart, diagram, gutenberg, classic editor
Requires at least: 5.8
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later

Render Mermaid diagrams directly in WordPress posts and pages.

== Description ==

Generate Mermaid provides:

* A Gutenberg block named "Mermaid 图表".
* Edit and live preview modes in the block editor.
* A Mermaid insertion button for the Classic Editor.
* A Quicktags button for the Classic Editor text mode.
* A `[mermaid]...[/mermaid]` shortcode.
* Automatic frontend rendering with Mermaid.js.
* Automatic rendering of diagrams inserted through REST API or AJAX requests.
* Strict Mermaid security mode.
* Optional external Mermaid.js URL for OSS/CDN deployments.

== Installation ==

1. Upload the `Generate-mermaid` directory to `/wp-content/plugins/`.
2. Activate "Generate Mermaid" in WordPress.
3. Insert the "Mermaid 图表" block in the block editor.

== Example ==

`flowchart TD`

`    A[开始] --> B{条件判断}`

`    B -->|是| C[执行操作]`

`    B -->|否| D[结束]`

The saved HTML uses this format:

`<pre class="mermaid Generate-mermaid-source">flowchart TD ...</pre>`

== Shortcode ==

`[mermaid]`

`flowchart LR`

`    A --> B`

`[/mermaid]`

== OSS/CDN ==

The plugin includes Mermaid.js 11.15.0 locally.

To load Mermaid.js from OSS/CDN instead, add this before the "That's all, stop
editing" line in `wp-config.php`:

`define( 'BMD_MERMAID_URL', 'https://static.example.com/mermaid/11.15.0/mermaid.min.js' );`

The plugin's small initializer, editor files and CSS continue to load locally.

== JavaScript API ==

Content added dynamically is detected automatically. It can also be rendered
manually:

`window.GenerateMermaidRender(container);`

== Changelog ==

= 1.0.0 =

* Initial release.
