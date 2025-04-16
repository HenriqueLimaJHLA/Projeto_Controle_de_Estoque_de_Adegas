function entradaCodigo(){
    const produto = document.getElementById('produto');
    const gramaLitro = document.getElementById('gramaLitro');
    const marca = document.getElementById('marca');
    const valorUnidade = document.getElementById('valorUnidade');
    const quantidade = document.getElementById('quantidade');
    var valorTotal = parseFloat(valorUnidade.value) * parseFloat(quantidade.value);
    
    // Envia os valores para o servidor usando AJAX
    const dados = {
        produto: produto.value,
        gramaLitro: gramaLitro.value,
        marca: marca.value,
        valorUnidade: valorUnidade.value,
        quantidade: quantidade.value,
        valorTotal: valorTotal
    };
  
    $.ajax({
        url: "./functions/registrarEntrada.php",
        method: "POST",
        data: dados,
        dataType: "json",
        success: function(data) {
            if(data.mensagem == "1") {
                produto.value = "";
                marca.value = "";
                gramaLitro.value = "";
                valorUnidade.value = "";
                quantidade.value = "";

                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3500,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.onmouseenter = Swal.stopTimer;
                        toast.onmouseleave = Swal.resumeTimer;
                    }
                    });
                    Toast.fire({
                    icon: "success",
                    title: "Entrada registrada com sucesso no sistema da Adega Moreira's!"
                    });
            }
            else if(data.mensagem === "2"){
                produto.value = "";
                marca.value = "";
                gramaLitro.value = "";
                valorUnidade.value = "";
                quantidade.value = "";

                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3500,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.onmouseenter = Swal.stopTimer;
                        toast.onmouseleave = Swal.resumeTimer;
                    }
                    });
                    Toast.fire({
                    icon: "success",
                    title: "Entrada Registrada e quantidade do produto atualizada no Estoque com sucesso no sistema da Adega Moreira's!"
                    });
            } 
        },error(xhr){
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3500,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
                });
                Toast.fire({
                icon: "error",
                title: `Erro ao registrar entrada no sistema da Adega Moreira's: ${xhr.responseText}`
                });
        }
    });
};
