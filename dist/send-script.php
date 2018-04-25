<?php
$mailToSend = 'kartofelek007@gmail.com';
if ( $_SERVER['REQUEST_METHOD'] === 'POST' ) {
    sleep(2);

    $name       = $_POST['name'];
    $email      = $_POST['email'];
    $message    = $_POST['message'];

    $errors     = Array();
    $return     = Array();
    if ( empty( $name ) ) {
        array_push( $errors, 'name' );
    }
    if ( ! filter_var( $email, FILTER_VALIDATE_EMAIL ) ) {
        array_push( $errors, 'email' );
    }
    if ( empty( $message ) ) {
        array_push( $errors, 'message' );
    }

    if ( count( $errors ) > 0 ) {
        $return['errors'] = $errors;
    } else {
        $headers = 'MIME-Version: 1.0' . "\r\n";
        $headers .= 'Content-type: text/html; charset=UTF-8' . "\r\n";
        $headers .= 'From: ' . $email . "\r\n";
        $headers .= 'Reply-to: ' . $email;
        $message = "
            <h1>Wiadomość ze strony:</h1>
            <div style=\"padding:30px; border:2px solid #ddd; background:#eee\">
                <div>
                    Autor: <strong>$name</strong>
                </div>
                <div>
                    Email: <a href=\"mailto:$email\">$email</a>
                </div>
                <div>
                    Wiadomość:<br>
                    <strong>$message</strong>
                </div>
            </div>
        ";

        if ( mail( $mailToSend, 'Wiadomość ze strony - ' . date( "d-m-Y" ), $message, $headers ) ) {
            $return['status'] = 'ok';
        } else {
            $return['status'] = 'error';
        }
    }

    header( 'Content-Type: application/json' );
    echo json_encode( $return );
}