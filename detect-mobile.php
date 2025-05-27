<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
?>

<?php

function isMobileDevice() {
    $userAgent = $_SERVER['HTTP_USER_AGENT'];
    $mobileKeywords = ['Android', 'iPhone', 'iPad', 'iPod', 'BlackBerry', 'Windows Phone'];

    foreach ($mobileKeywords as $keyword) {
        if (stripos($userAgent, $keyword) !== false) {
            return true;
        }
    }
    return false;
}

if (isMobileDevice()) {
    http_response_code(501);
    include __DIR__ . '/mobile-error.php';
    exit;
}
?>