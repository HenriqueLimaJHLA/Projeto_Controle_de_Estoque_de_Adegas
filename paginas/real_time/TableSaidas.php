<?php 
require("../../conexao.php");
header('Content-Type: application/json'); // Definir o tipo de resposta como JSON

if($_SERVER['REQUEST_METHOD'] === "POST"){  
    if(isset($_POST['btn_saida_produtos']) && $_POST['btn_saida_produtos'] === 'saida') {
        // Recuperar variável com POST 
        $input_search_saida_product = $_POST['input_search_saida_product'] ?? '';
        $input_search_date_saida_product = $_POST['input_search_date_saida_product'] ?? '';

        // Consulta SQL para buscar as saídas
        $query_saida_produtos = "
        SELECT 
        sp.id_saida,
        sp.produto,
        sp.especificacao,
        sp.marca,
        sp.valor_unidade,
        sp.quantidade,
        sp.valor_total_saida,
        u.nome_usuario,
        DATE_FORMAT(sp.data_saida, '%d/%m/%Y - %H:%i') AS data_saida_formatada
        FROM tb_saidaprodutos sp
        INNER JOIN tb_usuario u ON u.id_usuario = sp.id_usuario_fk 
    ";
        
        if (!empty($input_search_saida_product) && empty($input_search_date_saida_product)) {
            $query_saida_produtos .= " WHERE sp.produto LIKE '%" . $conexao_mysql->real_escape_string($input_search_saida_product) . "%' ORDER BY sp.id_saida ASC";
        } else if(empty($input_search_saida_product) && !empty($input_search_date_saida_product)){
            $query_saida_produtos .= " WHERE sp.data_saida LIKE '%" . $conexao_mysql->real_escape_string($input_search_date_saida_product) . "%' ORDER BY sp.id_saida ASC";
        } else if(!empty($input_search_saida_product) && !empty($input_search_date_saida_product)){
            $query_saida_produtos .= " WHERE sp.produto LIKE '%" . $conexao_mysql->real_escape_string($input_search_saida_product) . "%' AND sp.data_saida LIKE '%" . $conexao_mysql->real_escape_string($input_search_date_saida_product) . "%' ORDER BY sp.id_saida ASC";
        }
        else {
            $query_saida_produtos .= "ORDER BY sp.id_saida ASC";
        }
    
        $result = $conexao_mysql->query($query_saida_produtos);

        // Se houver dados, retorna como JSON
        $saida_produtos = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $saida_produtos[] = $row;
            }
            echo json_encode($saida_produtos);
        } else {
            echo json_encode(["error" => "Nenhuma saída de produtos no estoque foi encontrada!"]);
        }
    } 
}
?>
