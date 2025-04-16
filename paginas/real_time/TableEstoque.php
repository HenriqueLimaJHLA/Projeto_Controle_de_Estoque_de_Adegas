<?php
require("../../conexao.php");
header('Content-Type: application/json'); // Definir o tipo de resposta como JSON

if ($_SERVER['REQUEST_METHOD'] === "POST") {
    // Pesquisa e Tabela de Estoque de Produtos - Exibição e Pesquisa 
    if (isset($_POST['btn_estoque']) && $_POST['btn_estoque'] === 'estoque') {
        // Recuperar variável do servidor com método POST
        $input_search_estoque_product = $_POST['input_search_estoque_product'] ?? '';

        // Consulta SQL para buscar os Produtos do Estoque
        $query_produtos_estoque = "
        SELECT 
        e.id_produto_estoque,
        e.produto,
        e.quantidade_restante,
        e.especificacao,
        e.marca,
        e.valor_ultima_entrada,
        e.valor_ultima_saida,
        e.valor_total_estoque
        FROM tb_estoque e
    ";

        if (!empty($input_search_estoque_product)) {
            $query_produtos_estoque .= " WHERE e.produto LIKE '%" . $conexao_mysql->real_escape_string($input_search_estoque_product) . "%' ORDER BY e.id_produto_estoque ASC";
        } else {
            $query_produtos_estoque .= "ORDER BY e.id_produto_estoque ASC";
        }

        $result = $conexao_mysql->query($query_produtos_estoque);

        // Se houver dados, retorna como JSON
        $produtos_estoque = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $produtos_estoque[] = $row;
            }
            echo json_encode($produtos_estoque);
        } else {
            echo json_encode(["error" => "Nenhum produto no estoque foi encontrado!"]);
        }
    }

    // Excluir Produto do Estoque - Entradas, Saídas e Estoque
    if (isset($_POST['btnConfirmDeleteProduto']) && $_POST['btnConfirmDeleteProduto'] === 'true') {
        $id_produto_delete = $_POST['id_produto'];
        $produto_delete = $_POST['produto'];
        $especificacao_produto_delete = $_POST['especificacao_produto'];
        $marca_produto_delete = $_POST['marca_produto'];

        $query_disabled_fks = "SET FOREIGN_KEY_CHECKS = 0";
        $result_disabled_fk = $conexao_mysql->query($query_disabled_fks);

        if ($result_disabled_fk) {
            // SQL Query para verificar se existe saídas do produto - SELECT - SAÍDA PRODUTOS
            $query_verify_saidas = "SELECT COUNT(*) AS contar_produtos FROM tb_saidaprodutos WHERE id_produto_estoque_fk = ?";
            $prepare_query_verify_saidas = mysqli_prepare($conexao_mysql, $query_verify_saidas);
            mysqli_stmt_bind_param($prepare_query_verify_saidas, 'i', $id_produto_delete);
            mysqli_stmt_execute($prepare_query_verify_saidas);
            $result_query = mysqli_stmt_get_result($prepare_query_verify_saidas);
            $linha = mysqli_fetch_assoc($result_query);

            $contar_produtos_saidas = $linha['contar_produtos']; // Contagem de Produtos da Tabela de Saídas

            if ($contar_produtos_saidas > 0) {
                // Query Oficial para deletar o produto - Se existir Saída desse produto
                $query_delete_produto_estoque = "
                DELETE e, ep, sp FROM tb_estoque e 
                INNER JOIN tb_entradaprodutos ep ON ep.id_produto_estoque_fk = e.id_produto_estoque 
                INNER JOIN tb_saidaprodutos sp ON sp.id_produto_estoque_fk = e.id_produto_estoque 
                WHERE e.id_produto_estoque = ?";
            } else {
                // Query Oficial para deletar o produto - Se não existir Saída desse produto
                $query_delete_produto_estoque = "
                DELETE e, ep FROM tb_estoque e 
                INNER JOIN tb_entradaprodutos ep ON ep.id_produto_estoque_fk = e.id_produto_estoque
                WHERE id_produto_estoque = ?";
            }

            $prepare_query_delete_produto_estoque = mysqli_prepare($conexao_mysql, $query_delete_produto_estoque);
            mysqli_stmt_bind_param($prepare_query_delete_produto_estoque, 'i', $id_produto_delete);
            $execute_query = mysqli_stmt_execute($prepare_query_delete_produto_estoque);

            if ($execute_query) {
                $query_enabled_fks = "SET FOREIGN_KEY_CHECKS = 1";
                $result_enabled_fk = $conexao_mysql->query($query_enabled_fks);
                echo json_encode(['status' => 'success']);
            } else {
                $query_enabled_fks = "SET FOREIGN_KEY_CHECKS = 1";
                $result_enabled_fk = $conexao_mysql->query($query_enabled_fks);
                echo json_encode(['status' => 'error']);
            }
        }
    }
 
    // Editar Produto do Estoque - Entradas e Saídas
    if (isset($_POST['validacao']) && $_POST['validacao'] === "true") {
        // Recuperando variáveis através do Método POST
        $IDprodutoEditar = $_POST['idProdutoEditar'];
        $produtoEditar = $_POST['produtoEditar'];
        $produtoEspecificacaoEditar = $_POST['produtoEspecificacaoEditar'];
        $produtoMarcaEditar = $_POST['produtoMarcaEditar'];

        // SQL Query - Verificar se existem produtos com os dados da postagem  
        $queryContarProdutos = "SELECT COUNT(*) AS contar_produtos FROM tb_estoque WHERE produto = ? AND especificacao = ? AND marca = ? AND id_produto_estoque <> ?";
        $prepare_query_verify_produto = mysqli_prepare($conexao_mysql, $queryContarProdutos);
        mysqli_stmt_bind_param($prepare_query_verify_produto, 'sssi', $produtoEditar, $produtoEspecificacaoEditar, $produtoMarcaEditar, $IDprodutoEditar);
        mysqli_stmt_execute($prepare_query_verify_produto);
        $result_query_verify_produto = mysqli_stmt_get_result($prepare_query_verify_produto);
        $linha = mysqli_fetch_assoc($result_query_verify_produto);

        $result_count_produtos = $linha['contar_produtos']; // Linha de Contagem dos Produtos da Query SQL

        if ($result_count_produtos === 0) {
            // Atualizar dados do Produto na Tabela Estoque - UPDATE
            $query_update_produto_editar = "UPDATE tb_estoque SET produto = ?, especificacao = ?, marca = ? WHERE id_produto_estoque = ?";
            $prepare_query_update_produto = mysqli_prepare($conexao_mysql, $query_update_produto_editar);
            mysqli_stmt_bind_param($prepare_query_update_produto, 'sssi', $produtoEditar, $produtoEspecificacaoEditar, $produtoMarcaEditar, $IDprodutoEditar);
            mysqli_stmt_execute($prepare_query_update_produto);

            // Atualizar dados do Produto na Tabela Entradas - UPDATE
            $query_update_produto_editar_entradas = "UPDATE tb_entradaprodutos SET produto = ?, especificacao = ?, marca = ? WHERE id_produto_estoque_fk = ?";
            $prepare_query_update_produto_entradas = mysqli_prepare($conexao_mysql, $query_update_produto_editar_entradas);
            mysqli_stmt_bind_param($prepare_query_update_produto_entradas, 'sssi', $produtoEditar, $produtoEspecificacaoEditar, $produtoMarcaEditar, $IDprodutoEditar);
            mysqli_stmt_execute($prepare_query_update_produto_entradas);

            // Atualizar dados do Produto na Tabela Saídas - UPDATE
            $query_update_produto_editar_saidas = "UPDATE tb_saidaprodutos SET produto = ?, especificacao = ?, marca = ? WHERE id_produto_estoque_fk = ?";
            $prepare_query_update_produto_saidas = mysqli_prepare($conexao_mysql, $query_update_produto_editar_saidas);
            mysqli_stmt_bind_param($prepare_query_update_produto_saidas, 'sssi', $produtoEditar, $produtoEspecificacaoEditar, $produtoMarcaEditar, $IDprodutoEditar);
            mysqli_stmt_execute($prepare_query_update_produto_saidas);

            // Verificar se alguma linha foi afetada de uma das Três queries SQL 
            if (mysqli_stmt_affected_rows($prepare_query_update_produto) >= 0 && mysqli_stmt_affected_rows($prepare_query_update_produto_entradas) >= 0 && mysqli_stmt_affected_rows($prepare_query_update_produto_saidas) >= 0) {
                echo json_encode(['status' => 'success']);
            }
        } else {
            echo json_encode(['status' => 'error']);
        }
    }
}
if ($_SERVER['REQUEST_METHOD'] === "GET") {
    // Consulta SQL para buscar os produtos do estoque
    $query_estoque_produtos_get = "
    SELECT 
    e.id_produto_estoque,
    e.produto,
    e.especificacao,
    e.marca        
    FROM tb_estoque e  
    ORDER BY e.produto ASC
    LIMIT 40
";

    $result = $conexao_mysql->query($query_estoque_produtos_get);

    // Se houver dados, retorna como JSON
    $estoque_produtos_get = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $estoque_produtos_get[] = $row;
        }
        echo json_encode($estoque_produtos_get);
    } else {
        echo json_encode(["error" => "Não foi encontrado nenhum produto no estoque!"]);
    }
}
