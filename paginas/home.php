<?php
include("../conexao.php");
if (!isset($_SESSION['autenticacao']) || $_SESSION['autenticacao'] === false) {
  header('Location: ../');
} else {

  if (isset($_SESSION['tipo_usuario']) && $_SESSION['tipo_usuario'] === "Admin") {
    // Restrições para o Usuário Admin
    echo '<script>
      document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".item_menu").forEach(function(button) {
        if(button.className.includes("cadastro-usuarios")){
            document.querySelector(".container").style.height = "unset";
            // Desabilitar clique
            button.style.transition = "none";
            button.style.pointerEvents = "none";
            button.style.opacity = "0.5";
            button.style.filter = "grayscale(100%)";

            // Adicionar evento de clique para evitar ativação
            button.addEventListener("click", function(event) {
                event.stopPropagation();
                event.preventDefault();
            });
        }
    })
});
    </script>';
  } 
  else if(isset($_SESSION['tipo_usuario']) && $_SESSION['tipo_usuario'] === "Comum"){
    // Restrições para o Usuário Comum
    echo '<script>
        document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".item_menu").forEach(function(button) {
        if(button.className.includes("estoque")){
            document.querySelector(".container").style.height = "unset";
            // Desabilitar clique
            button.style.transition = "none";
            button.style.pointerEvents = "none";
            button.style.opacity = "0.5";
            button.style.filter = "grayscale(100%)";

            // Adicionar evento de clique para evitar ativação
            button.addEventListener("click", function(event) {
                event.stopPropagation();
                event.preventDefault();
            });
        }
    })
});

document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".item_menu").forEach(function(button) {
        if(button.className.includes("cadastro-usuarios")){
            document.querySelector(".container").style.height = "unset";
            // Desabilitar clique
            button.style.transition = "none";
            button.style.pointerEvents = "none";
            button.style.opacity = "0.5";
            button.style.filter = "grayscale(100%)";

            // Adicionar evento de clique para evitar ativação
            button.addEventListener("click", function(event) {
                event.stopPropagation();
                event.preventDefault();
            });
        }
    })
});
</script>';
  }
}
?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Controle de Estoque | Projeto Adega</title>
  <link rel="stylesheet" href="../CSS/home.css">
  <link rel="shortcut icon" href="./media/Adega_Moreiras_Branco.jpg" type="image/x-icon">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200">
  <!-- Bibliotecas de Importação -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.6/jspdf.plugin.autotable.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js" integrity="sha512-UnrKxsCMN9hFk7M56t4I4ckB4N/2HHi0w/7+B/1JsXIX3DmyBcsGpT3/BsuZMZf+6mAr0vP81syWtfynHJ69JA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
  <script src="assets/js/jspdf-autotable-custom.js"></script>
  <script src="../JS/functions/entrada.js"></script>   
  <script src="../JS/functions/saida.js"></script>
</head>

<body>
  <header>      
    <div class="div-img-logo">
      <img class="img-logo" src="../media/Adega-Moreiras-Rei.jpg" alt="Imagem Adega">
    </div>
  </header>

  <div class="sombraMenu"></div>
  <nav id="menu">
    <div id="divMenu">
      <div id="div_logout">
        <span class="material-symbols-outlined btn-deslogar">
          logout
        </span>
      </div>
      <div id="categories">
        <div id="saidas" class="item_menu">
          <span class="material-symbols-outlined">
            exit_to_app
          </span>
          <p>Registrar Saída</p>
        </div>
        <div class="item_menu">
          <span class="material-symbols-outlined">
            place_item
          </span>
          <p>Registrar Entrada</p>
        </div>
        <div class="item_menu estoque">
          <span class="material-symbols-outlined">
            inventory_2
          </span>
          <p>Verificar Estoque</p>
        </div>
        <div class="item_menu cadastro-usuarios">
          <span class="material-symbols-outlined">
            person_add
          </span>
          <p>Cadastrar Usuário</p>
        </div>
      </div>
      <div class="div-config" id="div_settings">
        <span class="material-symbols-outlined btn-deslogar btn-settings">
          settings
        </span>
      </div>
    </div>
  </nav>
  <div class="div-badge">
    <div>
      <span class="span-badge" id="span_badge" data-pop_up_hf="<?= $_SESSION['funcionamento'] ?>"></span>
      <div class="espaço" style="height: 5px;"></div>
      <span class="objected_remaining"></span>
      <span class="time_remaining"></span>
    </div>    
    <span id="dia_atual_span"></span>  
  </div>
  
  <div class="container">
    <div class="sub_container">
    </div>
  </div>
  <div class="div-lpitech">
    <h4 class="titulo_corLogo">©2025 LPITech. Todos os direitos reservados.</h4>
  </div>


    <!-- Modal -->
    <div class="modal-config modal-settings" style="display: none;">
      <div class="modal-config-menu" id="modal_config_menu">
        <div class="modal-config-div-close_button">
          <span class="material-symbols-outlined" id="close_button">
            close
          </span>
        </div>  
      
        <div class="menu-configuracoes">
          <h2>Menu de Configurações</h2>
          <div class="border-top"></div>
          <ul>
            <li>Conta</li>
            <li>Visual</li>
            <li>Funcionamento</li>
            <li>Exportações de Arquivos</li>
          </ul>
        </div>
        <div id="menu_config"></div>

        <!-- <div id="dados_menu_config"></div> -->
      
      </div>
    </div>

    <!-- Div dos Pop-Ups dos Relatórios -->
    <div id="ContainerExportarPlanilha"></div>

    <!-- Div Editar Produtos -->
    <div id="ContainerEditarProduto" data-tipo_user="<?= $_SESSION['tipo_usuario'] ?>"></div>

    <!-- Scripts que estão sendo utilizados  -->
    <script type="module" src="../JS/calculos.js"></script>
    <script type="module" src="../JS/menu.js"></script>
    <script type="module" src="../JS/exportar_planilhas.js"></script>
    <!-- <script src="../JS/calculos.js"></script> -->
</body>
</html>