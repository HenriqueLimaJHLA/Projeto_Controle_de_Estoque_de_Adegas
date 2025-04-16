function saidaCodigo() {
    const produto = document.getElementById('produto');
    const gramaLitro = document.getElementById('gramaLitro');
    const marca = document.getElementById('marca');
    const valorUnidade = document.getElementById('valorUnidade');
    const quantidade = document.getElementById('quantidade');
    var valorTotal = parseFloat(valorUnidade) * parseFloat(quantidade);
    
    // Envia os valores para o servidor usando AJAX
    const dados = {
        produto: produto.value,
        especificacao: gramaLitro.value,
        marca: marca.value,
        valorUnidade: valorUnidade.value,
        quantidade: quantidade.value,
        valorTotal: valorTotal
    };

    $.ajax({
        url: "./functions/registrarSaida.php",
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
                    title: "Saída registrada com sucesso no sistema da Adega Moreira's!"
                    });
            }
            if(data.mensagem == "2"){
                produto.value = "";
                marca.value = "";
                gramaLitro.value = "";
                valorUnidade.value = "";
                quantidade.value = "";

                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 4000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.onmouseenter = Swal.stopTimer;
                        toast.onmouseleave = Swal.resumeTimer;
                    }
                    });
                    Toast.fire({
                    icon: "success",
                    title: "Registro de Saída inserido com sucesso! \n \n AVISO: Atualmente, o estoque do produto está zerado. Recomendamos realizar uma reposição o mais breve possível"
                    });
            } 
            if(data.mensagem == "3"){  
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
                    title: "Quantidade no Estoque é menor que a quantidade de saída do produto!"
                    });
            }
            if(data.mensagem == "4"){
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
                    title: "O produto que vc tentou efetuar uma saída é inexistente no sistema da Adega Moreiras!!"
                    });
            }
        },
        error: function(xhr, status, error) {
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
                title: `Erro ao registrar saída: " + ${xhr.responseText}`
                });
        }
    });
}