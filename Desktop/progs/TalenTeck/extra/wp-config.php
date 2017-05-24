<?php
/**
 * The base configurations of the WordPress.
 *
 * This file has the following configurations: MySQL settings, Table Prefix,
 * Secret Keys, WordPress Language, and ABSPATH. You can find more information
 * by visiting {@link http://codex.wordpress.org/Editing_wp-config.php Editing
 * wp-config.php} Codex page. You can get the MySQL settings from your web host.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web site, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'WordpressTalenteck');

/** MySQL database username */
define('DB_USER', 'fmr2112');

/** MySQL database password */
define('DB_PASSWORD', 'Ec7oFrynt*');

/** MySQL hostname */
define('DB_HOST', 'talenteck.com');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         '{*Gc|fO+.fC*cYeyM.9s6,||Li%iNBX~!%#tAQ.A#6?qQ7SSB9`$[bs6z$GN<p9X');
define('SECURE_AUTH_KEY',  'P9:_Neo*lR[9<$)ZVqD+.fM;JE,l`<#)is|v)rKpB)>UK4r=?Z0}PLN[+17$3&~g');
define('LOGGED_IN_KEY',    'W|I<gY86Ew-IqamX/57D!2_/SryP&f}FQ6>UAW~!-+&%+-`}v2`$8~~a^^K5!m8E');
define('NONCE_KEY',        'sqs1n.nU2}fB6~*[d};K+{g`=-5%5NzJ^.iQi+|?hjHRf8gj#--V2UTB7|IZkr1j');
define('AUTH_SALT',        ',P%C0a)qo+w[r8u9dQ!&/%Vj(p<O<6=9>4_e`xIkf|E6dU>9ZhM+{tgFX3<qqPHo');
define('SECURE_AUTH_SALT', '9?+-;BRl&|XrOUjq|z8<P-tV|J-W|uR=cQYN@>ss<yls`c%T:sm=OVlPc)|F!d^4');
define('LOGGED_IN_SALT',   'lwK-:[pcCyR|6:7&aFM@K(@!_;l@tOkD2P2?oYs|]2(KR&~).[oo|HTXod@wP_[`');
define('NONCE_SALT',       'N->$e^iXr]Ed2*:cr-+gY]rzaHBA?j8@`oJA]C&J,!x|<8y,7-E|BhsWvCZEiWod');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * WordPress Localized Language, defaults to English.
 *
 * Change this to localize WordPress. A corresponding MO file for the chosen
 * language must be installed to wp-content/languages. For example, install
 * de_DE.mo to wp-content/languages and set WPLANG to 'de_DE' to enable German
 * language support.
 */
define('WPLANG', '');

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
