<?php
require_once('../../conexao.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === "POST") {
    // Variáveis recuperadas pelo $_POST
    $FiltrosSaidas = $_POST['FiltrosSaidasArray'];
    $PeriodoSaidas = $_POST['PeriodoSaidas'];

    if(is_array($FiltrosSaidas)){
        $FiltrosSaidas = array_filter($FiltrosSaidas);
        $result_filtros_saidas = implode(', ', $FiltrosSaidas);
    }

    // Query de Seleção de Entradas 
    $query_selecao_relatorio_saidas = 
    "
    SELECT sp.id_saida, sp.produto, $result_filtros_saidas FROM tb_saidaprodutos sp
    ";

    // Verificação dos Períodos de Entradas 
    if ($PeriodoSaidas == 0) {
        $query_selecao_relatorio_saidas .= " INNER JOIN tb_usuario u ON sp.id_usuario_fk = u.id_usuario WHERE DATE(sp.data_saida) = CURDATE() ORDER BY sp.id_saida";
    }
    if ($PeriodoSaidas == 1) {
        $query_selecao_relatorio_saidas .= " INNER JOIN tb_usuario u ON sp.id_usuario_fk = u.id_usuario WHERE sp.data_saida >= NOW() - INTERVAL 7 DAY AND sp.data_saida < NOW() ORDER BY sp.id_saida";
    }
    if ($PeriodoSaidas == 2) {
        $query_selecao_relatorio_saidas .= " INNER JOIN tb_usuario u ON sp.id_usuario_fk = u.id_usuario WHERE MONTH(sp.data_saida) = MONTH(CURDATE()) AND YEAR(sp.data_saida) = YEAR(CURDATE()) ORDER BY sp.id_saida";
    }
    if ($PeriodoSaidas == 3) {
        $query_selecao_relatorio_saidas .= " INNER JOIN tb_usuario u ON sp.id_usuario_fk = u.id_usuario WHERE sp.data_saida >= DATE_SUB(CURDATE(), INTERVAL 2 MONTH) AND sp.data_saida <= NOW() ORDER BY sp.id_saida";    }

    // Resultado da query
    $result = $conexao_mysql->query($query_selecao_relatorio_saidas);

    // Se houver dados, retorna como JSON
    $saidas_produtos_periodos = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $saidas_produtos_periodos[] = $row;
        }
        echo json_encode(value: $saidas_produtos_periodos);
    }  
    else {
        echo json_encode(["mensagem" => "sem registro"]);
    } 
}