<?php
/*
Plugin Name: Meow Gallery
Plugin URI: https://meowapps.com
Description: Gallery system built for photographers.
Version: 0.1.6
Author: Jordy Meow
Author URI: https://meowapps.com
Text Domain: meow-gallery
Domain Path: /languages

Dual licensed under the MIT and GPL licenses:
http://www.opensource.org/licenses/mit-license.php
http://www.gnu.org/licenses/gpl.html

Originally developed for two of my websites:
- Jordy Meow (http://offbeatjapan.org)
- Haikyo (http://haikyo.org)
*/

global $mgl_version;
$mgl_version = '0.1.6';

// Admin
include "mgl_admin.php";
$mgl_admin = new Meow_MGL_Admin( 'mgl', __FILE__, 'meow-gallery' );

// Core
include "mgl_core.php";
$mgl_core = new Meow_Gallery_Core( $mgl_admin );

?>
