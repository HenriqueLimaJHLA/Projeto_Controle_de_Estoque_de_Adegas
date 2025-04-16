<?php
require_once('../../conexao.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === "POST") {
    $FiltrosEstoque = $_POST['FiltrosEstoqueArray'];
    $PeriodoEstoque = $_POST['PeriodoEstoque'];
  
    if(is_array($FiltrosEstoque)){
        $FiltrosEstoque = array_filter($FiltrosEstoque);
        $result_filtros_estoque = implode(', ', $FiltrosEstoque);
    }

    // Query de Seleção dos Produtos do Estoque 
    $query_selecao_relatorio_estoque = 
    "
    SELECT e.id_produto_estoque, e.produto, $result_filtros_estoque FROM tb_estoque e
    ";
 
    // Verificação dos Períodos do Produto no Estoque 
    if ($PeriodoEstoque == 0) {
        $query_selecao_relatorio_estoque .= " INNER JOIN tb_entradaprodutos ep ON ep.id_entrada = e.id_entrada_fk WHERE DATE(ep.data_entrada) = CURDATE() ORDER BY e.id_produto_estoque";
    }
    if ($PeriodoEstoque == 1) {
        $query_selecao_relatorio_estoque .= " INNER JOIN tb_entradaprodutos ep ON ep.id_entrada = e.id_entrada_fk WHERE ep.data_entrada >= NOW() - INTERVAL 7 DAY AND ep.data_entrada < NOW() ORDER BY e.id_produto_estoque";
    }
    if ($PeriodoEstoque == 2) {
        $query_selecao_relatorio_estoque .= " INNER JOIN tb_entradaprodutos ep ON ep.id_entrada = e.id_entrada_fk WHERE MONTH(ep.data_entrada) = MONTH(CURDATE()) AND YEAR(ep.data_entrada) = YEAR(CURDATE()) ORDER BY e.id_produto_estoque";
    }
    if ($PeriodoEstoque == 3) {
        $query_selecao_relatorio_estoque .= " INNER JOIN tb_entradaprodutos ep ON ep.id_entrada = e.id_entrada_fk WHERE ep.data_entrada >= DATE_SUB(CURDATE(), INTERVAL 2 MONTH) AND ep.data_entrada <= NOW() ORDER BY e.id_produto_estoque";
    }

    // Resultado da query
    $result = $conexao_mysql->query($query_selecao_relatorio_estoque);

        // Se houver dados, retorna como JSON
        $estoque_produtos_array = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $estoque_produtos_array[] = $row;
            }
            echo json_encode(value: $estoque_produtos_array);
        }  
        else {
            echo json_encode(["mensagem" => "sem registro"]);
        }

}
