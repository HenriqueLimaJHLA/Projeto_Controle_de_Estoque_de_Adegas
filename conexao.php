<?php 
if(!isset($_SESSION)){
    session_start();
}

try {

$hostname = "localhost";
$username = "root";
$password = "1234";
$database = "db_adegamoreiras";

$conexao_mysql = mysqli_connect($hostname, $username, $password, $database);
} catch (\Throwable $e) {
    mysqli_error($conexao_mysql);
}

// Padrôes de Data e Hora - São Paulo 
date_default_timezone_set('America/Sao_Paulo');
$format_default_date_time = "Y-m-d H:i:s";

?>