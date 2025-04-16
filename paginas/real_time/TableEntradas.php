<?php 
require("../../conexao.php");
header('Content-Type: application/json'); // Definir o tipo de resposta como JSON

if($_SERVER['REQUEST_METHOD'] === "POST"){  
    if(isset($_POST['btn_entrada_produtos']) && $_POST['btn_entrada_produtos'] === 'entrada') {
        // Recuperar variável do servidor com método POST
        $input_search_entrada_product = $_POST['input_search_entrada_product'] ?? '';
        $input_search_date_entrada_product = $_POST['input_search_date_entrada_product'] ?? '';

        // Consulta SQL para buscar as entradas 
        $query_entrada_produtos = "
        SELECT 
        ep.id_entrada,
        ep.produto,
        ep.especificacao,
        ep.marca,
        ep.valor_unidade,
        ep.quantidade,
        ep.valor_total_entrada,
        u.nome_usuario,
        DATE_FORMAT(ep.data_entrada, '%d/%m/%Y - %H:%i') AS data_entrada_formatada        
        FROM tb_entradaprodutos ep
        INNER JOIN tb_usuario u ON u.id_usuario = ep.id_usuario_fk
    ";

    if (!empty($input_search_entrada_product) && empty($input_search_date_entrada_product)) {
        $query_entrada_produtos .= " WHERE ep.produto LIKE '%" . $conexao_mysql->real_escape_string($input_search_entrada_product) . "%' ORDER BY ep.id_entrada ASC";
    } else if(empty($input_search_entrada_product) && !empty($input_search_date_entrada_product)){
        $query_entrada_produtos .= " WHERE ep.data_entrada LIKE '%" . $conexao_mysql->real_escape_string($input_search_date_entrada_product) . "%' ORDER BY ep.id_entrada ASC";
    } else if(!empty($input_search_entrada_product) && !empty($input_search_date_entrada_product)){
        $query_entrada_produtos .= " WHERE ep.produto LIKE '%" . $conexao_mysql->real_escape_string($input_search_entrada_product) . "%' AND ep.data_entrada LIKE '%" . $conexao_mysql->real_escape_string($input_search_date_entrada_product) . "%' ORDER BY ep.id_entrada ASC";
    }
    else {
        $query_entrada_produtos .= "ORDER BY ep.id_entrada ASC";
    }

        $result = $conexao_mysql->query($query_entrada_produtos);

        // Se houver dados, retorna como JSON
        $entrada_produtos = [];


        //LIMITAR PARA O MÊS ATUAL (TABELAS POR COMUM, DEIXAR TAMBÉM SEM O LIMITADOR PARA AS EXPORTAÇÕES)
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $entrada_produtos[] = $row;
            }
            echo json_encode($entrada_produtos);
        } else {
            echo json_encode(["error" => "Nenhuma entrada de produto no estoque foi encontrada!"]);
        }
    } 
}
?>
