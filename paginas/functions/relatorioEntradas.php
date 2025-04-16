<?php
require_once('../../conexao.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === "POST") {
    $FiltrosEntradas = $_POST['FiltrosEntradasArray'];
    $PeriodoEntradas = $_POST['PeriodoEntradas'];

    // Quebrar array dos Filtros para Seleção
    if(is_array($FiltrosEntradas)){
        $FiltrosEntradas = array_filter($FiltrosEntradas);
        $result_filtros_entradas = implode(', ', $FiltrosEntradas);
    }

    // Query de Seleção de Entradas 
    $query_selecao_relatorio_entradas = 
    "
    SELECT ep.id_entrada, ep.produto, $result_filtros_entradas FROM tb_entradaprodutos ep";

    // Verificação dos Períodos de Entradas 
    if ($PeriodoEntradas == 0) {
        $query_selecao_relatorio_entradas .= " INNER JOIN tb_usuario u ON ep.id_usuario_fk = u.id_usuario WHERE DATE(ep.data_entrada) = CURDATE() ORDER BY ep.id_entrada";
    }
    if ($PeriodoEntradas == 1) {
        $query_selecao_relatorio_entradas .= " INNER JOIN tb_usuario u ON ep.id_usuario_fk = u.id_usuario WHERE ep.data_entrada >= NOW() - INTERVAL 7 DAY AND ep.data_entrada < NOW() ORDER BY ep.id_entrada";
    }
    if ($PeriodoEntradas == 2) {
        $query_selecao_relatorio_entradas .= " INNER JOIN tb_usuario u ON ep.id_usuario_fk = u.id_usuario WHERE MONTH(ep.data_entrada) = MONTH(CURDATE()) AND YEAR(ep.data_entrada) = YEAR(CURDATE()) ORDER BY ep.id_entrada";
    }
    if ($PeriodoEntradas == 3) {
        $query_selecao_relatorio_entradas .= " INNER JOIN tb_usuario u ON ep.id_usuario_fk = u.id_usuario WHERE ep.data_entrada >= DATE_SUB(CURDATE(), INTERVAL 2 MONTH) AND ep.data_entrada <= NOW() ORDER BY ep.id_entrada";    }
    }

    // Resultado da query
    $result = $conexao_mysql->query($query_selecao_relatorio_entradas);

    // Se houver dados, retorna como JSON
    $entradas_produtos_periodos = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $entradas_produtos_periodos[] = $row;
        }
        echo json_encode(value: $entradas_produtos_periodos);
    }
    else {
        echo json_encode(["mensagem" => "sem registro"]);        
    }
