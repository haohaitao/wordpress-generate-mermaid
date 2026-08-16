<?php
/**
 * Plugin Name: Generate Mermaid
 * Plugin URI: https://github.com/haohaitao/wordpress-generate-mermaid
 * Description: 给WordPress块编辑器、经典编辑器添加Mermaid图表支持.
 * Version: 1.0.0
 * Author: haohaitao
 * Author URI: https://www.haohaitao.cn
 * Requires at least: 5.8
 * Requires PHP: 7.2
 * License: GPL-2.0-or-later
 * Text Domain: generate-mermaid
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'BMD_VERSION', '1.0.0' );
define( 'BMD_DIR', plugin_dir_path( __FILE__ ) );
define( 'BMD_URL', plugin_dir_url( __FILE__ ) );

function bmd_mermaid_url() {
	if ( defined( 'BMD_MERMAID_URL' ) && BMD_MERMAID_URL ) {
		return BMD_MERMAID_URL;
	}

	return BMD_URL . 'assets/frontend/mermaid.min.js';
}

function bmd_register_assets() {
	wp_register_style(
		'bmd-frontend',
		BMD_URL . 'assets/frontend/generate-mermaid.css',
		array(),
		BMD_VERSION
	);
	wp_register_script(
		'bmd-mermaid',
		bmd_mermaid_url(),
		array(),
		'11.15.0',
		true
	);
	wp_register_script(
		'bmd-frontend',
		BMD_URL . 'assets/frontend/generate-mermaid.js',
		array( 'bmd-mermaid' ),
		BMD_VERSION,
		true
	);
}
add_action( 'init', 'bmd_register_assets', 5 );

function bmd_enqueue_frontend_assets() {
	if ( is_admin() || ! apply_filters( 'bmd_should_enqueue_assets', true ) ) {
		return;
	}

	wp_enqueue_style( 'bmd-frontend' );
	wp_enqueue_script( 'bmd-frontend' );
}
add_action( 'wp_enqueue_scripts', 'bmd_enqueue_frontend_assets' );

function bmd_register_block() {
	register_block_type( BMD_DIR . 'block' );
}
add_action( 'init', 'bmd_register_block' );

function bmd_enqueue_editor_assets() {
	$editor_asset = include BMD_DIR . 'assets/editor/editor.asset.php';

	wp_enqueue_script(
		'bmd-editor',
		BMD_URL . 'assets/editor/editor.js',
		$editor_asset['dependencies'],
		$editor_asset['version'],
		true
	);
	wp_enqueue_style(
		'bmd-editor',
		BMD_URL . 'assets/editor/editor.css',
		array( 'wp-edit-blocks' ),
		BMD_VERSION
	);
}
add_action( 'enqueue_block_editor_assets', 'bmd_enqueue_editor_assets' );

function bmd_add_classic_editor_button( $buttons ) {
	$buttons[] = 'bmd_mermaid';
	return $buttons;
}
add_filter( 'mce_buttons', 'bmd_add_classic_editor_button' );

function bmd_register_classic_editor_plugin( $plugins ) {
	$plugins['bmd_mermaid'] = BMD_URL . 'assets/editor/tinymce-plugin.js';
	return $plugins;
}
add_filter( 'mce_external_plugins', 'bmd_register_classic_editor_plugin' );

function bmd_enqueue_quicktags_button( $hook ) {
	if ( ! in_array( $hook, array( 'post.php', 'post-new.php' ), true ) ) {
		return;
	}

	wp_enqueue_script(
		'bmd-quicktags',
		BMD_URL . 'assets/editor/quicktags.js',
		array( 'quicktags' ),
		BMD_VERSION,
		true
	);
}
add_action( 'admin_enqueue_scripts', 'bmd_enqueue_quicktags_button' );

function bmd_add_classic_editor_style( $stylesheets ) {
	$stylesheet = BMD_URL . 'assets/editor/classic-editor.css?ver=' . rawurlencode( BMD_VERSION );
	return $stylesheets ? $stylesheets . ',' . $stylesheet : $stylesheet;
}
add_filter( 'mce_css', 'bmd_add_classic_editor_style' );

function bmd_shortcode( $attributes, $content = '' ) {
	$content = preg_replace( '/<br\s*\/?>/i', "\n", $content );
	$content = preg_replace( '/<\/p>\s*<p>/i', "\n\n", $content );
	$source = html_entity_decode( wp_strip_all_tags( $content ), ENT_QUOTES, 'UTF-8' );

	return '<pre class="mermaid generate-mermaid-source">' . esc_html( trim( $source ) ) . '</pre>';
}
add_shortcode( 'mermaid', 'bmd_shortcode' );
