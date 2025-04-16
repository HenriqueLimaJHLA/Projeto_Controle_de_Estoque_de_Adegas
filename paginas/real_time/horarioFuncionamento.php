<?php
require("../../conexao.php");
header('Content-Type: application/json'); // Definir o tipo de resposta como JSON

// Ok
if($_SERVER['REQUEST_METHOD'] === "POST"){
    if(isset($_POST['btnEnviarHorarios']) && $_POST['btnEnviarHorarios'] === 'true'){
        // Recuperando as variáveis com POST
        $horario_funcionamento = mysqli_real_escape_string($conexao_mysql, $_POST['horarios']);
        
        // Quebrar Array de Horários de Funcionamento 
        // if(is_array($horario_funcionamento)){
        //     $horario_funcionamento = array_filter($horario_funcionamento);
        //     $quebrar_array_horarios =   (', ', $horario_funcionamento);
        // }

        // Consulta SQL
        if($_SESSION['tipo_usuario'] === 'SuperAdmin'){
            $query_update_funcionamento = "UPDATE tb_usuario SET funcionamento = '".$horario_funcionamento."'";       
            $result = $conexao_mysql->query($query_update_funcionamento);
            
            if($result){
                echo json_encode(['status' => 'success']);
            }
            else {
                echo json_encode(['status' => 'error']);
            }
        }
        else {
            echo json_encode(['status' => 'error']);
        }
        
    }
}

if($_SERVER['REQUEST_METHOD'] === "GET") {    
    $id_usuario = $_SESSION['id_user_login'];

    $query_funcionamento = "SELECT funcionamento FROM tb_usuario WHERE id_usuario = ?";
    $prepare_query_funcionamento = mysqli_prepare($conexao_mysql, $query_funcionamento);
    mysqli_stmt_bind_param($prepare_query_funcionamento, 'i', $id_usuario);
    mysqli_stmt_execute($prepare_query_funcionamento);
    $result_query_funcionamento = mysqli_stmt_get_result($prepare_query_funcionamento);
    $row_funcionamento = mysqli_fetch_assoc($result_query_funcionamento);

    $funcionamento_db = $row_funcionamento['funcionamento'];
    
    echo json_encode($funcionamento_db);
}
?>