<?php

// Entrada = Compra - Gastando - Custo = Deve = Negativo

require_once '../../conexao.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === "POST") {
    // Variáveis da Entrada Produtos - POST
    $produto = $_POST['produto'];
    $especificacao = $_POST['gramaLitro'];
    $marca = $_POST['marca'];
    $valor_unidade = $_POST['valorUnidade'];
    $quantidade = $_POST['quantidade'];

    $data_entrada = date($format_default_date_time);

    $valor_total_entrada = $quantidade * $valor_unidade; // Valor Total Entrada 
    $valor_total_entrada *= -1;  // Negativar Valor da Entrada 

    $id_usuario_fk = $_SESSION['id_user_login'];

    // Verificar se o produto já existe na Tabela Estoque
    $query_verificar_produto = "SELECT COUNT(*) AS contar_produto_estoque FROM tb_estoque WHERE produto = ? AND especificacao = ? AND marca = ? LIMIT 1";
    $prepare_query_verificar_produto = mysqli_prepare($conexao_mysql, $query_verificar_produto);
    mysqli_stmt_bind_param($prepare_query_verificar_produto, 'sss', $produto, $especificacao, $marca);
    mysqli_stmt_execute($prepare_query_verificar_produto);
    $result_query_vp = mysqli_stmt_get_result($prepare_query_verificar_produto);
    $row_produto = mysqli_fetch_assoc($result_query_vp);

    if ($row_produto['contar_produto_estoque'] > 0) {
        // SQL Query - SELECT
        $query_pegar_id_produto = "SELECT id_produto_estoque FROM tb_estoque WHERE produto = ? AND especificacao = ? AND marca = ? LIMIT 1";
        $prepare_query_pegar_id_produto = mysqli_prepare($conexao_mysql, $query_pegar_id_produto);
        mysqli_stmt_bind_param($prepare_query_pegar_id_produto, 'sss', $produto, $especificacao, $marca);
        mysqli_stmt_execute($prepare_query_pegar_id_produto);
        $resultQuery = mysqli_stmt_get_result($prepare_query_pegar_id_produto);
        $linhaProduto = mysqli_fetch_assoc($resultQuery);

        // Atualizar Produto - Entradas 
        $id_produto_estoque = $linhaProduto['id_produto_estoque'];

        // SQL Query - INSERT 
        $query_inserir_entrada = "INSERT INTO tb_entradaprodutos (produto, especificacao, marca, valor_unidade, quantidade, data_entrada, valor_total_entrada, id_usuario_fk, id_produto_estoque_fk) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $prepare_query = mysqli_prepare($conexao_mysql, $query_inserir_entrada);
        mysqli_stmt_bind_param($prepare_query, 'sssssssii', $produto, $especificacao, $marca, $valor_unidade, $quantidade, $data_entrada, $valor_total_entrada, $id_usuario_fk, $id_produto_estoque);
        mysqli_stmt_execute($prepare_query);

        // Selecionar ID Entrada na Tabela de Entrada de Produtos
        $query_ultima_entrada = "SELECT id_entrada FROM tb_entradaprodutos WHERE data_entrada <= ? ORDER BY data_entrada DESC LIMIT 1";
        $prepare_query_ultima_entrada = mysqli_prepare($conexao_mysql, $query_ultima_entrada);
        mysqli_stmt_bind_param($prepare_query_ultima_entrada, 's', $data_entrada);
        mysqli_stmt_execute($prepare_query_ultima_entrada);
        $result_query_ultima_entrada = mysqli_stmt_get_result($prepare_query_ultima_entrada);
        $rows = mysqli_fetch_assoc($result_query_ultima_entrada);
        $id_ultima_entrada = $rows['id_entrada'];

        // Atualizar a quantidade restante
        $query_att_estoque_restante = "UPDATE tb_estoque SET quantidade_restante = quantidade_restante + ?, valor_ultima_entrada = ?, valor_total_estoque = valor_total_estoque + (?) , id_entrada_fk = ? WHERE id_produto_estoque = ?";
        $prepare_query_att_estoque = mysqli_prepare($conexao_mysql, $query_att_estoque_restante);
        mysqli_stmt_bind_param($prepare_query_att_estoque, 'sssss', $quantidade, $valor_unidade, $valor_total_entrada, $id_ultima_entrada, $id_produto_estoque);
        $execute_query = mysqli_stmt_execute($prepare_query_att_estoque);

        if ($execute_query) {
            $id_usuario_entradas = $_SESSION['id_user_login']; // ID Usuário Add

            // Query Atualizar quantidade de Entradas do Usuário
            $query_att_qtd_entrada_user = "UPDATE tb_usuario SET qtd_entradas = qtd_entradas + 1 WHERE id_usuario = ?";
            $prepare_query_att_qtd_entradas = mysqli_prepare($conexao_mysql, $query_att_qtd_entrada_user);
            mysqli_stmt_bind_param($prepare_query_att_qtd_entradas, 'i', $id_usuario_entradas);
            mysqli_stmt_execute($prepare_query_att_qtd_entradas);

            echo json_encode(array("mensagem" => "2"));
        } else {
            echo json_encode(array("mensagem" => "Nenhuma atualização foi feita."));
        }
    } else {
        // Novo Produto - Estoque 
        $query_ultima_entrada = "SELECT id_entrada FROM tb_entradaprodutos WHERE data_entrada <= ? ORDER BY data_entrada DESC LIMIT 1";
        $prepare_query_ultima_entrada = mysqli_prepare($conexao_mysql, $query_ultima_entrada);
        mysqli_stmt_bind_param($prepare_query_ultima_entrada, 's', $data_entrada);
        mysqli_stmt_execute($prepare_query_ultima_entrada);
        $result_query_ultima_entrada = mysqli_stmt_get_result($prepare_query_ultima_entrada);
        $rows = mysqli_fetch_assoc($result_query_ultima_entrada);

        if ($rows) {
            $id_ultima_entrada = $rows['id_entrada'];
        } else {
            $id_ultima_entrada = 0;
        }

        $query_disabled_fks = "SET FOREIGN_KEY_CHECKS = 0";
        $result_disabled_fk = $conexao_mysql->query($query_disabled_fks);

        // Inserir um Novo Registro
        $query_novo_registro_estoque = "INSERT INTO tb_estoque (produto, quantidade_restante, especificacao, marca, valor_ultima_entrada, valor_total_estoque, id_entrada_fk) VALUES (?, ?, ?, ?, ?, ?, ?)";
        $prepare_query_novo_registro = mysqli_prepare($conexao_mysql, $query_novo_registro_estoque);
        mysqli_stmt_bind_param($prepare_query_novo_registro, 'sssssss', $produto, $quantidade, $especificacao, $marca, $valor_unidade, $valor_total_entrada, $id_ultima_entrada);
        mysqli_stmt_execute($prepare_query_novo_registro);

        $id_produto_estoque = mysqli_insert_id($conexao_mysql);

        // SQL Query - INSERT 
        $query_inserir_entrada = "INSERT INTO tb_entradaprodutos (produto, especificacao, marca, valor_unidade, quantidade, data_entrada, valor_total_entrada, id_usuario_fk, id_produto_estoque_fk) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $prepare_query = mysqli_prepare($conexao_mysql, $query_inserir_entrada);
        mysqli_stmt_bind_param($prepare_query, 'sssssssii', $produto, $especificacao, $marca, $valor_unidade, $quantidade, $data_entrada, $valor_total_entrada, $id_usuario_fk, $id_produto_estoque);
        $queryExecute = mysqli_stmt_execute($prepare_query);

        // Obter o ID da nova entrada
        $id_nova_entrada = mysqli_insert_id($conexao_mysql);

        // Atualizar o ID da entrada no registro do estoque
        $query_atualizar_id_entrada = "UPDATE tb_estoque SET id_entrada_fk = ? WHERE id_produto_estoque = ?";
        $prepare_query_atualizar_id_entrada = mysqli_prepare($conexao_mysql, $query_atualizar_id_entrada);
        mysqli_stmt_bind_param($prepare_query_atualizar_id_entrada, 'ii', $id_nova_entrada, $id_produto_estoque);
        $executeQuery = mysqli_stmt_execute($prepare_query_atualizar_id_entrada);

        if ($executeQuery) {
            // Ativar FKs novamente
            $query_ativar_fks = "SET FOREIGN_KEY_CHECKS = 1";
            $result_ativar_fk = $conexao_mysql->query($query_ativar_fks);

            $id_usuario_entradas = $_SESSION['id_user_login']; // ID Usuário Add

            // Query Atualizar quantidade de Entradas do Usuário
            $query_att_qtd_entrada_user = "UPDATE tb_usuario SET qtd_entradas = qtd_entradas + 1 WHERE id_usuario = ?";
            $prepare_query_att_qtd_entradas = mysqli_prepare($conexao_mysql, $query_att_qtd_entrada_user);
            mysqli_stmt_bind_param($prepare_query_att_qtd_entradas, 'i', $id_usuario_entradas);
            mysqli_stmt_execute($prepare_query_att_qtd_entradas);

            echo json_encode(array("mensagem" => "1"));
        } else {
            echo json_encode(array("mensagem" => "Erro ao registrar a entrada: " . mysqli_error($conexao_mysql)));
        }
    }
}
