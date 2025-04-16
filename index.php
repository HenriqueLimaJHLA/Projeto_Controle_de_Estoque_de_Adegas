<?php
include("./conexao.php"); 

if (isset($_COOKIE['autenticacao']) && $_COOKIE['autenticacao'] == '1') {
    // Voltando a Sessão Logada
    $_SESSION['id_user_login'] = $_COOKIE['id_user_login'];
    $_SESSION['user_login'] = $_COOKIE['user_login'];
    $_SESSION['email_usuario'] = $_COOKIE['email_user_login'];
    $_SESSION['user_password'] = $_COOKIE['password_user_login'];
    $_SESSION['autenticacao'] = $_COOKIE['autenticacao'];
    $_SESSION['tipo_usuario'] = $_COOKIE['tipo_usuario'];
    $_SESSION['funcionamento'] = $_COOKIE['funcionamento'];
    
    header('Location: ./paginas/home.php');
}

if(isset($_SESSION['autenticacao']) && $_SESSION['autenticacao'] === true){
    header('Location: ./paginas/home.php');
};
  
?>

<!DOCTYPE html> 
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login | Adega Moreiras's</title>
    <link rel="stylesheet" href="./CSS/index.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200">
    <link rel="shortcut icon" href="./media/Adega_Moreiras_Branco.jpg" type="image/x-icon">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>
<body>
    <span class="material-symbols-outlined dark-light" id="dark_light"></span>
    <form class="form-login" id="FormLogin">    
        <h1>Login <div style="color: var(--cores-principais);">Adega Moreira's</div></h1>
        <img class="img-logo img-adega" id="img_adega_moreiras" alt="Imagem Adega Moreira's">
        <input type="email" id="user_login" placeholder="Insira seu Usuário ou Email" required autocomplete="off">
        <input type="hidden" id="<?= uniqid()?>">
        <input type="password" class="input-login" id="user_password" minlength="8" placeholder="Insira a sua Senha" required autocomplete="off">
        <button type="submit" class="btn-login">Login</button>
        <div class="separation"></div>
        <p class="direitos"></p>
    </form>

    <script src="./JS/functions/login.js"></script>
</body>
</html>