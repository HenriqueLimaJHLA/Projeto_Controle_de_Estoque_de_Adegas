<?php
require("../../conexao.php");
header('Content-Type: application/json'); // Definir o tipo de resposta como JSON

if ($_SERVER['REQUEST_METHOD'] === "POST") {
    if (isset($_POST['btn_requision']) && $_POST['btn_requision'] === 'true') {

            // Recuperando as variáveis com POST
            $input_email_usuario_search = $_POST['input_email_usuario_search'] ?? '';
            $input_tipo_usuario_search = $_POST['input_tipo_usuario_search'] ?? '';

            // Consulta SQL para buscar os usuários
            $query_usuarios = "
                SELECT 
                u.id_usuario, 
                u.nome_usuario, 
                u.email_usuario,
                u.tipo_usuario,
                u.qtd_entradas,
                u.qtd_saidas,
                DATE_FORMAT(u.data_criacao, '%d/%m/%Y') AS data_criacao   
                FROM tb_usuario u
            ";

            if (!empty($input_email_usuario_search)) {
                $query_usuarios .= " WHERE u.nome_usuario LIKE '%" . $conexao_mysql->real_escape_string($input_email_usuario_search) . "%' ORDER BY u.data_criacao DESC";
            }
            if (!empty($input_tipo_usuario_search)) {
                $query_usuarios .= " WHERE u.tipo_usuario LIKE '%" . $conexao_mysql->real_escape_string($input_tipo_usuario_search) . "%'  ORDER BY u.data_criacao DESC";
            }

            $result = $conexao_mysql->query($query_usuarios);

            // Se houver dados, retorna como JSON
            $usuarios = [];
            if ($result && $result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    $usuarios[] = $row;
                }
                // Verificação 
                if ($_SESSION['tipo_usuario'] === 'SuperAdmin') {
                    echo json_encode($usuarios);
                }
                else {
                    echo json_encode(['mensagem' => 'sem permissão']);
                }
            } else {
                echo json_encode(["error" => "Nenhum usuario encontrado."]);
            }
    }

    // Criar Usuários no sistema da Adega Moreira's
    if (isset($_POST['btn_criar_usuarios']) && $_POST['btn_criar_usuarios'] === 'true') {
        // Recuperando dados da requisição POST
        $nome_usuario_post = $_POST['nome_usuario'];
        $email_usuario_post = $_POST['email_usuario'];
        $senha_usuario_post = $_POST['senha_usuario'];
        $tipo_usuario_post = $_POST['tipo_usuario'];

        $query_count_users = "SELECT COUNT(*) AS contar_usuarios FROM tb_usuario WHERE email_usuario = ?";
        $prepare_query = mysqli_prepare($conexao_mysql, $query_count_users);
        mysqli_stmt_bind_param($prepare_query, 's', $email_usuario_post);
        mysqli_stmt_execute($prepare_query);
        $result_query = mysqli_stmt_get_result($prepare_query);
        $row_user = mysqli_fetch_assoc($result_query);

        if ($row_user['contar_usuarios'] > 0) {
            echo json_encode(['status' => 'error']);
        } else {

            $senha_hash_post = password_hash($senha_usuario_post, PASSWORD_DEFAULT); // Senha Criptografada

            // Data e Hora formatadas para América/São Paulo 
            date_default_timezone_set('America/Sao_Paulo');
            $dataHoraAtual = new DateTime();
            $data_atual = $dataHoraAtual->format('Y-m-d H:i:s');

            $nome_usuario_post = mysqli_real_escape_string($conexao_mysql, $nome_usuario_post);
            $email_usuario_post = mysqli_real_escape_string($conexao_mysql, $email_usuario_post);
            $senha_hash_post = mysqli_real_escape_string($conexao_mysql, $senha_hash_post);
            $tipo_usuario_post = mysqli_real_escape_string($conexao_mysql, $tipo_usuario_post);
            $data_atual = mysqli_real_escape_string($conexao_mysql, $data_atual);

            $query_inserir_usuarios = "INSERT INTO tb_usuario 
            (nome_usuario, email_usuario, senha_usuario, tipo_usuario, data_criacao, funcionamento)
        VALUES
            ('$nome_usuario_post', '$email_usuario_post', '$senha_hash_post', '$tipo_usuario_post', '$data_atual', NULL);";

            $result_inserir_usuarios = $conexao_mysql->query($query_inserir_usuarios);

            if ($result_inserir_usuarios) {
                echo json_encode(['status' => 'success']);
            }
        }
    }
    // Editar Dados do Perfil - Usuário 
    if (isset($_POST['dadosSend']) && $_POST['dadosSend'] === 'true') {
        // Recuperando as variáveis com POST
        $idUserSend = intval($_POST['idUsuarioEdit']);
        $id_usuario_session = $_SESSION['id_user_login'];
        // Escape String - SQL INJETCION PROTECTION 
        $UserUsernameSend = mysqli_real_escape_string($conexao_mysql, $_POST['UserUsuarioEdit']);
        $passwordUserSend = mysqli_real_escape_string($conexao_mysql, $_POST['SenhaUsuarioEdit']);
        $passwordUserSendHash = password_hash($passwordUserSend, PASSWORD_DEFAULT);

        // Query de Contagem de Usuários com esse nome de Usuário 
        $query_count_users_update = "SELECT COUNT(*) AS countUserUsuario FROM tb_usuario WHERE nome_usuario = ? AND id_usuario <> ?";
        $prepare_query_count_users_update = mysqli_prepare($conexao_mysql, $query_count_users_update);
        mysqli_stmt_bind_param($prepare_query_count_users_update, 'si', $UserUsernameSend, $id_usuario_session);
        mysqli_stmt_execute($prepare_query_count_users_update);
        $result_query = mysqli_stmt_get_result($prepare_query_count_users_update);
        $row = mysqli_fetch_assoc($result_query);
        $contagemUserUsuarios = $row['countUserUsuario'];

        // Query de Seleção de senha para a verificação se é igual  
        $query_senha_verificar = "SELECT senha_usuario FROM tb_usuario WHERE id_usuario = ?";
        $prepare_query = mysqli_prepare($conexao_mysql, $query_senha_verificar);
        mysqli_stmt_bind_param($prepare_query, 'i', $id_usuario_session);
        mysqli_stmt_execute($prepare_query);
        $result = mysqli_stmt_get_result($prepare_query);
        $rowUser = mysqli_fetch_assoc($result);
        $passwordUserDB = $rowUser['senha_usuario'];

        if ($contagemUserUsuarios > 0) {
            echo json_encode(['mensagem' => 'existing_user']);
        } else if (password_verify($passwordUserSend, $passwordUserDB)) {
            echo json_encode(['mensagem' => 'same_password']);
        } else if ($idUserSend !== $id_usuario_session) {
            echo json_encode(['mensagem' => 'user_scammed: ']);
        } else {
            $query_update_data_user = "UPDATE tb_usuario SET nome_usuario = ?, senha_usuario = ? WHERE id_usuario = ?";
            $prepare_query_update = mysqli_prepare($conexao_mysql, $query_update_data_user);
            mysqli_stmt_bind_param($prepare_query_update, 'ssi', $UserUsernameSend, $passwordUserSendHash, $id_usuario_session);
            mysqli_stmt_execute($prepare_query_update);

            if (mysqli_stmt_affected_rows($prepare_query_update) >= 0) {
                $_SESSION['user_password'] = $passwordUserSend;
                echo json_encode(["mensagem" => "success"]);
            } else {
                echo json_encode(["mensagem" => "error query"]);
            }
        };
    }

    // Excluir Usuários 
    if (isset($_POST['btn_excluir_usuario']) && $_POST['btn_excluir_usuario'] === 'true') {
        $id_usuario_post = $_POST['id_usuario_post'];
        $id_usuario_post_safe = mysqli_real_escape_string($conexao_mysql, $id_usuario_post);

        $query_excluir_usuario = "DELETE FROM tb_usuario WHERE id_usuario = $id_usuario_post_safe";
        $result_excluir_usuario = $conexao_mysql->query($query_excluir_usuario);

        if ($result_excluir_usuario) {
            echo json_encode(true);
        }
    };
}

if ($_SERVER['REQUEST_METHOD'] === "GET") {
    $id_usuario_session = $_SESSION['id_user_login'];

    $query_take_user_datas = "SELECT u.id_usuario, u.nome_usuario, u.email_usuario, u.tipo_usuario FROM tb_usuario u WHERE id_usuario = ?";
    $prepare_query = mysqli_prepare($conexao_mysql, $query_take_user_datas);
    mysqli_stmt_bind_param($prepare_query, 'i', $id_usuario_session);
    mysqli_stmt_execute($prepare_query);
    $result_query = mysqli_stmt_get_result($prepare_query);

    $dadosUsers = [];

    if ($result_query && $result_query->num_rows > 0) {
        while ($row = $result_query->fetch_assoc()) {
            $dadosUsers[] = $row;
        }
        $dadosUsers['senha_usuario'] = $_SESSION['user_password'];
        echo json_encode($dadosUsers);
    }
}
