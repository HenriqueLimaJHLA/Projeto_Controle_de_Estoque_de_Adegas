<?php 
require_once('../../conexao.php');
header('Content-Type: application/json');

// Verificar se o a Requisição do Servidor é do Método POST 
if($_SERVER['REQUEST_METHOD'] === "POST") {
    // Efetuar Login no Sistema da Adega Moreiras
    if(isset($_POST['disparo']) && $_POST['disparo'] === 'true'){
        // CSRF TOKEN AUTENTICATE
        $csrf_token_post = mysqli_real_escape_string($conexao_mysql, $_POST['___csrf_token']);
        
        // Verificar se Token corresponde com o Front End 
        if(isset($csrf_token_post) && !is_null($csrf_token_post) && $csrf_token_post === $_SESSION['csrf_token']) {

        // Recuperando valores das variáveis de Login
        $username_login = mysqli_real_escape_string($conexao_mysql, $_POST['EmailUsuario']);
        $password_login = mysqli_real_escape_string($conexao_mysql,$_POST['SenhaUsuario']);

        $query_login = "SELECT COUNT(*) AS contar_usuarios FROM tb_usuario WHERE email_usuario = ? OR nome_usuario = ?";
        $prepare_query = mysqli_prepare($conexao_mysql, $query_login);
        mysqli_stmt_bind_param($prepare_query, 'ss', $username_login, $username_login);
        mysqli_stmt_execute($prepare_query);
        $result_query = mysqli_stmt_get_result($prepare_query);
        $row_user = mysqli_fetch_assoc($result_query);
    
        if ($row_user['contar_usuarios'] === 0) {
            echo json_encode('not_registred');
        } 
        else {
            $query_password = "SELECT id_usuario, email_usuario, senha_usuario, tipo_usuario, funcionamento FROM tb_usuario WHERE email_usuario = ? OR nome_usuario = ?"; // Query Senha Banco de Dados  
            $prepare_query_password = mysqli_prepare($conexao_mysql, $query_password);
            mysqli_stmt_bind_param($prepare_query_password, 'ss', $username_login, $username_login);
            mysqli_stmt_execute($prepare_query_password);
            $result_query_password = mysqli_stmt_get_result($prepare_query_password);
            $rows = mysqli_fetch_assoc($result_query_password);
            $password_hash = $rows['senha_usuario']; // Senha Hash
            $id_usuario = $rows['id_usuario'];
            $email_usuario = $rows['email_usuario'];
            $tipo_usuario = $rows['tipo_usuario'];
            $funcionamento = $rows['funcionamento'];

            if(password_verify($password_login, $password_hash)){
                $_SESSION['id_user_login'] = $id_usuario;
                $_SESSION['user_login'] = $username_login;
                $_SESSION['email_usuario'] = $email_usuario;
                $_SESSION['user_password'] = $password_login;
                $_SESSION['funcionamento'] = $funcionamento;
                $_SESSION['tipo_usuario'] = $tipo_usuario;

                $_SESSION['autenticacao'] = true; // Usuário Autenticado
                
                // SALVANDO LOGIN EM COOKIES
                setcookie('id_user_login', $id_usuario, time() + 3600, '/');
                setcookie('email_user_login', $email_usuario, time() + 3600, '/');
                setcookie('user_login', $username_login, time() + 3600, '/');
                setcookie('password_user_login', $password_login, time() + 3600, '/'); 
                setcookie('autenticacao', true, time() + 3600, '/'); 
                setcookie('tipo_usuario', $tipo_usuario, time() + 3600, '/'); 
                setcookie('funcionamento', $funcionamento, time() + 3600, '/'); 

                echo json_encode('login_autenticated');
                
            } else {
                echo json_encode('not_autenticated');

                $_SESSION['user_login'] = '';
                $_SESSION['user_password'] = '';
                $_SESSION['autenticacao'] = false;
            }   
        }
    }
    else {
        die('CSRF authentication failed!');
    }
}
// Logout do Usuário no Sistema da Adega Moreiras
if(isset($_POST['btn_logout']) && $_POST['btn_logout'] === "deslogar"){
    $_SESSION['autenticacao'] = false;
    session_destroy(); // Destruir Sessão
    setcookie('id_user_login', '', time() - 3600, '/');
    setcookie('email_user_login', '', time() - 3600, '/');
    setcookie('user_login', '', time() - 3600, '/');
    setcookie('password_user_login', '', time() - 3600, '/');
    setcookie('autenticacao', '', time() - 3600, '/');
    setcookie('tipo_usuario', '', time() - 3600, '/');
    setcookie('funcionamento', '', time() - 3600, '/');
    
    echo json_encode(["deslogado" => true]);
};

// Revalidar Token CSRF ao atualizar a página 
if(isset($_POST['update_session']) && $_POST['update_session'] === "true") {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    $___se4iirfnririi5ri4iWSSSaA = $_SESSION['csrf_token'];
    echo json_encode($___se4iirfnririi5ri4iWSSSaA);
};

// Revalidar Token CSRF ao cair em um usuário que não existe 
if(isset($_POST['user_not_registred']) && $_POST['user_not_registred'] === "true") {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    $___se4iirfnririi5ri4iWSSSaA = $_SESSION['csrf_token'];
    echo json_encode($___se4iirfnririi5ri4iWSSSaA);
};

// Revalidar Token CSRF ao cair em um usuário ou senha incorretos  
if(isset($_POST['not_autenticated_user']) && $_POST['not_autenticated_user'] === "true") {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    $___se4iirfnririi5ri4iWSSSaA = $_SESSION['csrf_token'];
    echo json_encode($___se4iirfnririi5ri4iWSSSaA);
};
};

?>