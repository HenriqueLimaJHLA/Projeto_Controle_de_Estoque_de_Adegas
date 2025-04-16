<?php
require_once('../../conexao.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === "POST") {

    // Variáveis recuperadas do Módulo de Saída
    $produto_saida = $_POST['produto'];
    $especificacao_saida = $_POST['especificacao'];
    $marca_saida = $_POST['marca'];
    $valor_unidade_saida = $_POST['valorUnidade'];
    $quantidade_saida = $_POST['quantidade'];
    
    // Saída = Venda = Faturamento = Positivo 
    $valor_total_saida = $valor_unidade_saida * $quantidade_saida; // Valor Positivo

    $data_saida = date($format_default_date_time);
    $id_usuario_saida_fk = $_SESSION['id_user_login']; // Id Usuário da Sessão

    // Selecionar ID do Produto na Tabela Estoque 
    $query_select_id_estoque = "SELECT id_produto_estoque, quantidade_restante FROM tb_estoque WHERE produto = ? AND especificacao = ? AND marca = ? LIMIT 1";
    $prepare_query_select_id_estoque = mysqli_prepare($conexao_mysql, $query_select_id_estoque);
    mysqli_stmt_bind_param($prepare_query_select_id_estoque, 'sss', $produto_saida, $especificacao_saida, $marca_saida);
    mysqli_stmt_execute($prepare_query_select_id_estoque);
    $result_query_select_id_estoque = mysqli_stmt_get_result($prepare_query_select_id_estoque);
    $linha_estoque_produto = mysqli_fetch_assoc($result_query_select_id_estoque);

    if (isset($linha_estoque_produto['id_produto_estoque'])) {
        $id_produto_estoque_saida = $linha_estoque_produto['id_produto_estoque'];
        $quantidade_restante_estoque_db = $linha_estoque_produto['quantidade_restante'];

        if ($quantidade_restante_estoque_db < $quantidade_saida) {
            echo json_encode(array("mensagem" => "3"));
        } else {
            // Query Inserir na Tabela de Saída
            $query_inserir_saida = "INSERT INTO tb_saidaprodutos (produto, especificacao, marca, valor_unidade, quantidade, data_saida, valor_total_saida, id_usuario_fk, id_produto_estoque_fk) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $prepare_query_inserir_saida = mysqli_prepare($conexao_mysql, $query_inserir_saida);
            mysqli_stmt_bind_param($prepare_query_inserir_saida, 'sssiissii', $produto_saida, $especificacao_saida, $marca_saida, $valor_unidade_saida, $quantidade_saida, $data_saida, $valor_total_saida, $id_usuario_saida_fk, $id_produto_estoque_saida);
            $result_query_inserir_entrada = mysqli_stmt_execute($prepare_query_inserir_saida);

            if ($result_query_inserir_entrada) {
                // Atualizar a Quantidade Restante (Saída)
                $query_att_estoque_restante_saida = "UPDATE tb_estoque SET quantidade_restante = quantidade_restante - ?, valor_ultima_saida = ?, valor_total_estoque =  valor_total_estoque + ? WHERE id_produto_estoque = ?";
                $prepare_query_att_estoque_saida = mysqli_prepare($conexao_mysql, $query_att_estoque_restante_saida);
                mysqli_stmt_bind_param($prepare_query_att_estoque_saida, 'issi', $quantidade_saida, $valor_unidade_saida, $valor_total_saida, $id_produto_estoque_saida);
                $execute_query_estoque_saida = mysqli_stmt_execute($prepare_query_att_estoque_saida);

                if ($execute_query_estoque_saida) {
                    // Query Atualizar quantidade de Saídas do Usuário
                    $id_usuario_saidas = $_SESSION['id_user_login'];
                    $query_att_qtd_saida_user = "UPDATE tb_usuario SET qtd_saidas = qtd_saidas + 1 WHERE id_usuario = ?";
                    $prepare_query_att_qtd_saidas = mysqli_prepare($conexao_mysql, $query_att_qtd_saida_user);
                    mysqli_stmt_bind_param($prepare_query_att_qtd_saidas, 'i', $id_usuario_saidas);
                    $execute_query_att_saidas = mysqli_stmt_execute($prepare_query_att_qtd_saidas);

                    // Query para verificar se a quantidade do produto é igual a 0
                    $query_verificar_produto_estoque = "SELECT quantidade_restante FROM tb_estoque WHERE produto = ?";
                    $prepare_query_verificar_produto_estoque = mysqli_prepare($conexao_mysql, $query_verificar_produto_estoque);
                    mysqli_stmt_bind_param($prepare_query_verificar_produto_estoque, 's', $produto_saida);
                    mysqli_stmt_execute($prepare_query_verificar_produto_estoque);
                    $result_query_vpe = mysqli_stmt_get_result($prepare_query_verificar_produto_estoque);

                    $linha_quantidade_restante_produto = mysqli_fetch_assoc($result_query_vpe);
                    $qtd_restante_produto_estoque = $linha_quantidade_restante_produto['quantidade_restante'];

                    if ($qtd_restante_produto_estoque == 0) {
                        echo json_encode(array("mensagem" => "2"));
                    } else {
                        echo json_encode(array("mensagem" => "1"));
                    }
                } else {
                    echo json_encode(array("mensagem" => "Nenhuma atualização de saída foi feita."));
                }
            }
        }
    } else {
        echo json_encode(array("mensagem" => "4"));
    }
}
