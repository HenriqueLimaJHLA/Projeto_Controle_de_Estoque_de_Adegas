// Função de Logout 
function btnLogoutConfirm() {
    $.ajax({
        url: "./functions/efetuarLogin.php",
        method: "POST",
        data: { btn_logout: "deslogar" },
        dataType: "json",
        success: function (data) {
            if (data.deslogado) {
                window.location.href = "../";
            }
        }
    })
};

document.querySelector('.btn-deslogar').addEventListener('click', function () {
    document.querySelector('.modal-settings').style.display = "none";
    Swal.fire({
        title: "Logout | Adega Moreira's",
        text: `Confirmação: deseja realmente efetuar o logout de sua conta?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "black",
        cancelButtonColor: "red",
        confirmButtonText: "Sim, desejo deslogar!",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            btnLogoutConfirm();
        }
    });
});

const menu = document.getElementById('divMenu');
const menuFechado = document.getElementById('menu');
const categories = document.getElementById('categories');


// Verifique se o dispositivo é mobile ou desktop
function isMobile() {
    return window.innerWidth <= 600;
}

//   // Adicione os eventos de mouseover e mouseout
//   menu.addEventListener('mouseover', function() {
//     if (isMobile()) {
//       menuFechado.style.width = '200px';
//       menu.style.width = '100%'; 
//     } else {
//       menuFechado.style.width = '200px';
//       menu.style.width = '100%'; 
//     }

//     document.querySelector('.sombraMenu').style.display = 'block';
//     document.querySelectorAll('#categories div p').forEach(function(name) {
//       name.style.color = 'white'; 
//       name.style.display = 'block'; 
//     });
//   });

//   menu.addEventListener('mouseout', function() {
//     if (isMobile()) {
//       menuFechado.style.width = '10%'; 
//       menu.style.width = '100%'; 
//     } else {
//       menuFechado.style.width = '5%'; 
//       menu.style.width = '100%'; 
//     }

//     document.querySelector('.sombraMenu').style.display = 'none';
//     document.querySelectorAll('#categories div p').forEach(function(name) {
//       name.style.display = 'none'; 
//     });
//   });
document.querySelectorAll('.item_menu').forEach(function (button) {
    button.addEventListener('click', function (e) {
        var containerCurrentTabela;
        if (e.currentTarget.innerText.includes('exit_to_app')) {
            // SAÍDAS
            document.body.style.overflow = "auto";
            document.querySelector('.modal-settings').style.display = "none";
            document.querySelector('.sub_container').style.cssText = "box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);";
            document.querySelector('.sub_container').innerHTML = `
            <div class="cabecalhoSistema">
                <h2>Registrar Saída</h2>
                <h4>(Venda de Produtos)</h4>
                <form method="POST" id="FormSaida">
                    <div class="form-group">
                        <input id="produto" list="DataListInputSaida" placeholder="Produto" required autocomplete="off">
                        <datalist id="DataListInputSaida"></datalist>
                        <input id="gramaLitro" type="text" placeholder="Especificação" required autocomplete="off">
                        <input id="marca" type="text" placeholder="Marca" required autocomplete="off">
                        <input id="valorUnidade" type="number" placeholder="Valor unidade (R$)" min="1" required autocomplete="off">
                        <input id="quantidade" type="number" placeholder="Quantidade" min="1" required autocomplete="off">
                    </div>
                    <br>
                    <div class="form-group">
                        <button type="submit" class="btns-entrada-saida global-btns">Registrar Saída</button>
                    </div>
                </form>
            </div>
            <br><br>
            <div class="border-top"></div>
            <div class="titulo">
                <h1>Registro de Saídas - (Semestre Atual)</h1>
                <div class="divOrganizarButtonsTable">
                    <button class="btn-pesquisar-planilha" id="btn-pesquisar-planilha">
                        <span class="material-symbols-outlined">
                            search
                        </span>
                    </button>
                    <button data-tipo="saida" id="btn-exportar-planilha" class="btn-exportar-planilha">
                        <span class="material-symbols-outlined">
                            download
                        </span>
                    </button>
                </div>
            </div>
               <div id="input_product" class="input-search-global"></div>
               <br>
            <div class="tabela" id="tabelaSaida">
            
            </div> 
            <div class="secoes-navegacao">
                <button class="secoes-prev" id="secoes-prev" style="display:none;"></button>
                <button class="secoes-next" id="secoes-next">2</button>
            </div>
            `;

            // Cancelar Submit padrão do Formulário de Saída 
            document.getElementById('FormSaida').addEventListener('submit', (e) => {
                e.preventDefault();
                saidaCodigo();
            });

            // AJAX para busca da Saída dos Produtos 
            function buscarSaidaProdutos() {
                const tabelaSaidaProdutos = document.getElementById("tabelaSaida");
                if (tabelaSaidaProdutos) {
                    const dados = {
                        btn_saida_produtos: 'saida',
                        input_search_saida_product: $('#InputSearchSaida').val(),
                        input_search_date_saida_product: $('#inputDataSaida').val()
                    }
                    $.ajax({
                        url: "./real_time/TableSaidas.php",
                        method: "POST",
                        data: dados,
                        dataType: "json",
                        success: function (data) {
                            if (data.length > 0) {
                                atualizarTabelaSaidaProdutos(tabelaSaidaProdutos, data);
                            } else {
                                tabelaSaidaProdutos.innerHTML = `
                                    <h3>Nenhuma Saída de produto foi encontrada!</h3>`;
                            }
                        }, error(xhr, responseText) {
                            console.log(xhr.responseText)
                        }
                    });
                }
            }
            function atualizarTabelaSaidaProdutos(tabela, dados) {
                const secoes = [];
                let secaoAtual = 0;
                let contadorLinhas = 0;

                dados.forEach((produto) => {
                    if (contadorLinhas >= 15) {
                        secaoAtual++;
                        contadorLinhas = 0;
                    }

                    if (!secoes[secaoAtual]) {
                        secoes[secaoAtual] = [];
                    }

                    secoes[secaoAtual].unshift(produto);
                    contadorLinhas++;
                });
                secoes.reverse();


                tabela.innerHTML = '';

                const secoesContainer = document.createElement("div");
                secoesContainer.classList.add("secoes-container");

                secoes.forEach((secao, indice) => {
                    // Criando a seção
                    const secaoElement = document.createElement("div");
                    secaoElement.classList.add("secao");

                    // Criando e já colocando o titulo da sessão na sessão
                    const tituloSecao = document.createElement("h2");
                    tituloSecao.textContent = `Página ${indice + 1}`;
                    secaoElement.appendChild(tituloSecao);

                    // Criando a div para responsividade
                    const divTableResponsive = document.createElement("div");
                    divTableResponsive.classList.add("table-responsive");

                    // Criando a tabela
                    const tabelaSecao = document.createElement("table");
                    tabelaSecao.classList.add("stockTable");

                    const thead = document.createElement("thead");
                    const tr = document.createElement("tr");

                    const th1 = document.createElement("th");
                    th1.textContent = "ID Saída";
                    tr.appendChild(th1);

                    const th2 = document.createElement("th");
                    th2.textContent = "Produto";
                    tr.appendChild(th2);

                    const th3 = document.createElement("th");
                    th3.textContent = "Especificação";
                    tr.appendChild(th3);

                    const th4 = document.createElement("th");
                    th4.textContent = "Marca";
                    tr.appendChild(th4);

                    const th5 = document.createElement("th");
                    th5.textContent = "Valor Unidade";
                    tr.appendChild(th5);

                    const th6 = document.createElement("th");
                    th6.textContent = "Quantidade";
                    tr.appendChild(th6);

                    const th7 = document.createElement("th");
                    th7.textContent = "Valor T. Saída";
                    tr.appendChild(th7);

                    const th8 = document.createElement("th");
                    th8.textContent = "Usuário";
                    tr.appendChild(th8);

                    const th9 = document.createElement("th");
                    th9.textContent = "Data da Saída";
                    tr.appendChild(th9);

                    thead.appendChild(tr);
                    tabelaSecao.appendChild(thead);

                    const corpoTabelaSecao = document.createElement("tbody");
                    tabelaSecao.appendChild(corpoTabelaSecao);

                    // Adicionando a tabela dentro da div responsiva
                    divTableResponsive.appendChild(tabelaSecao);

                    // Adicionando a div responsiva na seção
                    secaoElement.appendChild(divTableResponsive);

                    // Adicionando a seção no container principal
                    secoesContainer.appendChild(secaoElement);

                    secao.forEach((produto) => {
                        const linha = document.createElement("tr");
                        linha.innerHTML = `
                     <tr>
                            <td>${produto.id_saida}</td>
                            <td>${produto.produto}</td>
                            <td>${produto.especificacao}</td>
                            <td>${produto.marca}</td>
                            <td>R$ ${produto.valor_unidade}.00</td>
                            <td>${produto.quantidade} unidade(s)</td>
                            <td>R$ ${produto.valor_total_saida}.00</td>
                            <td>${produto.nome_usuario}</td>
                            <td>${produto.data_saida_formatada}</td>
                        </tr>`;

                        corpoTabelaSecao.appendChild(linha);
                    });

                    tabela.appendChild(secoesContainer);

                });
                containerCurrentTabela = secoesContainer;

                // Atualizar a seção atual inicialmente
                const secoes1 = secoesContainer.children;
                atualizarSecao(secaoAtualUser, secoes1);
            }

            // Buttons
            const secoesPrev = document.getElementById('secoes-prev');
            const secoesNext = document.getElementById('secoes-next');
            secaoAtualUser = 0;
            secoesPrev.addEventListener('click', function () {
                if (containerCurrentTabela) {
                    const secoes = containerCurrentTabela.children;
                    if (secoes) {
                        irParaSecaoAnterior(secoesPrev, secoesNext, secaoAtualUser , secoes);
                    } 
                } 
            });
            
            secoesNext.addEventListener('click', function () {
                if (containerCurrentTabela) {
                    const secoes = containerCurrentTabela.children;
                    if (secoes) {
                        irParaSecaoProxima(secoesPrev, secoesNext, secaoAtualUser , secoes);
                    } 
                } 
            });
            
            setInterval(buscarSaidaProdutos, 30000);

            // Busca saída de produtos inicialmente
            buscarSaidaProdutos();

            // Busca os produtos do estoque para colocar no datalist do produto
            function ObterDataListSaida() {
                const DataListProdutosSaida = document.getElementById('DataListInputSaida');
                if (DataListProdutosSaida) {
                    const CreateOptionsProduto = document.createElement('option');

                    $.ajax({
                        url: "./real_time/TableEstoque.php",
                        method: "GET",
                        success: function (data) {
                            const existingOptions = new Set(Array.from(DataListProdutosSaida.options).map(option => option.value));
                            let i = 0;

                            while (i < data.length) {
                                const produtoEstoque = data[i].produto;
                                const produtoEspecificacao = data[i].especificacao;
                                const produtoMarca = data[i].marca;

                                if (!existingOptions.has(produtoEstoque)) {
                                    DataListProdutosSaida.appendChild(CreateOptionsProduto);
                                    CreateOptionsProduto.value = produtoEstoque;
                                    CreateOptionsProduto.setAttribute('data-especificacao_produto', produtoEspecificacao);
                                    CreateOptionsProduto.setAttribute('data-marca_produto', produtoMarca);
                                }
                                i++;
                            }
                        },
                        error(xhr, responseText) {
                            console.log(xhr.responseText)
                        }
                    });
                }

            }

            setInterval(ObterDataListSaida, 1000);
            ObterDataListSaida();

            // Inserir Atributos dos Campos de Espeficação e Marca nos Inputs ao selecionar Produto - Saída
            const inputProduto = document.querySelector('input[list="DataListInputSaida"]');
            const inputEspecificacao = document.getElementById('gramaLitro');
            const inputMarca = document.getElementById('marca');

            inputProduto.addEventListener('input', (e) => {
                const valorSelecionado = e.currentTarget.value;
                if (valorSelecionado === '') {
                    inputEspecificacao.value = '';
                    inputMarca.value = '';
                }

                const optionSelecionada = document.querySelector(`option[value="${valorSelecionado}"]`);
                if (optionSelecionada) {
                    inputEspecificacao.value = optionSelecionada.getAttribute('data-especificacao_produto');
                    inputMarca.value = optionSelecionada.getAttribute('data-marca_produto');
                }
            });

            // Criar Input de Pesquisa de Produto - Saída 
            if (document.getElementById('btn-pesquisar-planilha')) {
                document.getElementById('btn-pesquisar-planilha').addEventListener('click', () => {
                    if ($('#InputSearchSaida')) {
                        $('#InputSearchSaida').val('');
                        $('#inputDataSaida').val('');
                        buscarSaidaProdutos();
                    }

                    const DivInputSaida = document.getElementById('input_product');

                    if (!DivInputSaida.innerHTML) {
                        DivInputSaida.innerHTML = `
                                <input type="text" class="input-estoque InputSearchSaida" id="InputSearchSaida" placeholder="Pesquisar por Produto" autocomplete="off">
                                <input type="date" class="input-estoque" id="inputDataSaida" placeholder="Pesquisar Data de Saída">
                                <button class="btns-search" type="button" id="btn_reset_search_saida"><span class="material-symbols-outlined">restart_alt</span></button>
                                `;

                        //Inputs
                        const inputSearchSaida = $('#InputSearchSaida');
                        const inputDataSaida = $('#inputDataSaida');
                        const btnResetSearchSaida = document.getElementById('btn_reset_search_saida');

                        // Evento para resetar a busca do produto na Saída 
                        btnResetSearchSaida.addEventListener('click', () => {
                            inputSearchSaida.val('');
                            inputDataSaida.val('');
                            buscarSaidaProdutos();
                        });
                        // Evento para buscar produto da Saída ao digitar
                        if (inputSearchSaida.length) {
                            inputSearchSaida.on('input', function () {
                                buscarSaidaProdutos();
                            });
                        }
                        if (inputDataSaida.length) {
                            inputDataSaida.on('input', function () {
                                buscarSaidaProdutos();
                            });
                        }
                    }
                    else {
                        DivInputSaida.innerHTML = '';
                    }
                });
            };
        }
        else if (e.currentTarget.innerText.includes('place_item')) {
            // ENTRADAS
            document.querySelector('.modal-settings').style.display = "none";
            document.body.style.overflow = "auto";
            document.querySelector('.sub_container').style.cssText = "box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);";
            document.querySelector('.sub_container').innerHTML = `
            
            <div class="cabecalhoSistema">
                <h2>Registrar Entrada</h2>
                <h4>(Compra de Produtos)</h4>
                <form method="POST" id="FormEntrada">
                    <div class="form-group">
                        <input id="produto" list="DataListInputEntrada" placeholder="Produto" required autocomplete="off">
                        <datalist id="DataListInputEntrada"></datalist>
                        <input id="gramaLitro" type="text" placeholder="Especificação" required autocomplete="off">
                        <input id="marca" type="text" placeholder="Marca" required autocomplete="off">
                        <input id="valorUnidade" type="number" placeholder="Valor unidade (R$)" min="1" required autocomplete="off">
                        <input id="quantidade" type="number" placeholder="Quantidade" min="1" required autocomplete="off">
                    </div>
                    <br>
                    <div class="form-group">
                        <button type="submit" class="btns-entrada-saida global-btns" id="btn_registrarEntrada">Registrar Entrada</button>
                    </div>
                </form>
            </div>
            <br><br>
        
            <div class="border-top"></div>
            <div class="titulo">
                <h1>Registro de Entradas - (Semestre Atual)</h1>
                <div class="divOrganizarButtonsTable">
                    <button class="btn-pesquisar-planilha" id="btn-pesquisar-planilha" data-tipo="entrada">
                        <span class="material-symbols-outlined">
                            search
                        </span>
                    </button>
                    <button data-tipo="entrada" id="btn-exportar-planilha" class="btn-exportar-planilha entradas"><span class="material-symbols-outlined">
                        download
                    </span>
                </button>
                </div>
                </div>
              <div id="input_product" class="input-search-global"></div>
              <br>

            <div class="tabela" id="tabelaEntrada">
                
            </div> 
            <div class="secoes-navegacao">
                <button class="secoes-prev" id="secoes-prev" style="display:none;"></button>
                <button class="secoes-next" id="secoes-next">2</button>
            </div>
            
            `;

            // Cancelar Submit padrão do Formulário de Entradas 
            document.getElementById('FormEntrada').addEventListener('submit', (e) => {
                e.preventDefault();
                entradaCodigo();
            });

            // AJAX para busca da Entrada dos Produtos 
            function buscarEntradaProdutos() {
                const tabelaEntradaProdutos = document.getElementById("tabelaEntrada");
                if (tabelaEntradaProdutos) {
                    const dados = {
                        btn_entrada_produtos: 'entrada',
                        input_search_entrada_product: $('#InputSearchEntrada').val(),
                        input_search_date_entrada_product: $('#InputDataEntrada').val()
                    }
                    $.ajax({
                        url: "./real_time/TableEntradas.php",
                        method: "POST",
                        data: dados,
                        dataType: "json",
                        success: function (data) {
                            if (data.length > 0) {
                                atualizarTabelaEntradaProdutos(tabelaEntradaProdutos, data);
                            } else {
                                tabelaEntradaProdutos.innerHTML = `
                                    <h3>
                                        Nenhuma Entrada de produto foi encontrada!
                                    </h3>`;
                            }
                        }, error(xhr, responseText) {
                            console.log(xhr.responseText)
                        }
                    });
                }
            }

            // Função para atualizar a tabela de entradas - Produtos
            function atualizarTabelaEntradaProdutos(tabela, dados) {
                const secoes = [];
                let secaoAtual = 0;
                let contadorLinhas = 0;

                dados.forEach((produto) => {
                    if (contadorLinhas >= 15) {
                        secaoAtual++;
                        contadorLinhas = 0;
                    }

                    if (!secoes[secaoAtual]) {
                        secoes[secaoAtual] = [];
                    }

                    secoes[secaoAtual].unshift(produto);
                    contadorLinhas++;
                });
                secoes.reverse();

                tabela.innerHTML = '';

                const secoesContainer = document.createElement("div");
                secoesContainer.classList.add("secoes-container");

                secoes.forEach((secao, indice) => {
                    // Criando a seção
                    const secaoElement = document.createElement("div");
                    secaoElement.classList.add("secao");

                    // Criando e já colocando o titulo da sessão na sessão
                    const tituloSecao = document.createElement("h2");
                    tituloSecao.textContent = `Página ${indice + 1}`;
                    secaoElement.appendChild(tituloSecao);

                    // Criando a div para responsividade
                    const divTableResponsive = document.createElement("div");
                    divTableResponsive.classList.add("table-responsive");

                    // Criando a tabela
                    const tabelaSecao = document.createElement("table");
                    tabelaSecao.classList.add("stockTable");

                    const thead = document.createElement("thead");
                    const tr = document.createElement("tr");

                    const th1 = document.createElement("th");
                    th1.textContent = "ID Entrada";
                    tr.appendChild(th1);

                    const th2 = document.createElement("th");
                    th2.textContent = "Produto";
                    tr.appendChild(th2);

                    const th3 = document.createElement("th");
                    th3.textContent = "Especificação";
                    tr.appendChild(th3);

                    const th4 = document.createElement("th");
                    th4.textContent = "Marca";
                    tr.appendChild(th4);

                    const th5 = document.createElement("th");
                    th5.textContent = "Valor Unidade";
                    tr.appendChild(th5);

                    const th6 = document.createElement("th");
                    th6.textContent = "Quantidade";
                    tr.appendChild(th6);

                    const th7 = document.createElement("th");
                    th7.textContent = "Valor Total (R$)";
                    tr.appendChild(th7);

                    const th8 = document.createElement("th");
                    th8.textContent = "Usuário";
                    tr.appendChild(th8);

                    const th9 = document.createElement("th");
                    th9.textContent = "Data da Entrada";
                    tr.appendChild(th9);

                    thead.appendChild(tr);
                    tabelaSecao.appendChild(thead);

                    const corpoTabelaSecao = document.createElement("tbody");
                    tabelaSecao.appendChild(corpoTabelaSecao);

                    // Adicionando a tabela dentro da div responsiva
                    divTableResponsive.appendChild(tabelaSecao);

                    // Adicionando a div responsiva na seção
                    secaoElement.appendChild(divTableResponsive);

                    // Adicionando a seção no container principal
                    secoesContainer.appendChild(secaoElement);

                    secao.forEach((produto) => {
                        const linha = document.createElement("tr");
                        linha.innerHTML = `
                     <tr>
                            <td>${produto.id_entrada}</td>
                            <td>${produto.produto}</td>
                            <td>${produto.especificacao}</td>
                            <td>${produto.marca}</td>
                            <td>R$ ${produto.valor_unidade}.00</td>
                            <td>${produto.quantidade} unidade(s)</td>
                            <td>R$ ${produto.valor_total_entrada * (-1)}.00</td>
                            <td>${produto.nome_usuario}</td>
                            <td>${produto.data_entrada_formatada}</td>
                        </tr>`;

                        corpoTabelaSecao.appendChild(linha);
                    });

                    tabela.appendChild(secoesContainer);

                });
                containerCurrentTabela = secoesContainer;

                // Atualizar a seção atual inicialmente
                const secoes1 = secoesContainer.children;
                atualizarSecao(secaoAtualUser, secoes1);
            }

            // Buttons
            const secoesPrev = document.getElementById('secoes-prev');
            const secoesNext = document.getElementById('secoes-next');
            secaoAtualUser = 0;
            secoesPrev.addEventListener('click', function () {
                if(containerCurrentTabela){
                    const secoes = containerCurrentTabela.children;
                    irParaSecaoAnterior(secoesPrev, secoesNext, secaoAtualUser, secoes);
                }
        
            });
            secoesNext.addEventListener('click', function () {
                if(containerCurrentTabela){
                    const secoes = containerCurrentTabela.children;
                    irParaSecaoProxima(secoesPrev, secoesNext, secaoAtualUser, secoes);
                }
            });
            
            setInterval(buscarEntradaProdutos, 30000);

            // Busca entrada de produtos inicialmente
            buscarEntradaProdutos();

            // Busca os produtos do estoque para colocar no datalist do produto
            function ObterDataListEntrada() {
                const DataListProdutosEntrada = document.getElementById('DataListInputEntrada');
                if (DataListProdutosEntrada) {
                    const CreateOptionsProduto = document.createElement('option');

                    $.ajax({
                        url: "./real_time/TableEstoque.php",
                        method: "GET",
                        success: function (data) {
                            const existingOptions = new Set(Array.from(DataListProdutosEntrada.options).map(option => option.value));
                            let i = 0;

                            while (i < data.length) {
                                const produtoEstoque = data[i].produto;

                                if (!existingOptions.has(produtoEstoque)) {
                                    CreateOptionsProduto.value = produtoEstoque;
                                    DataListProdutosEntrada.appendChild(CreateOptionsProduto);
                                }
                                i++;
                            }
                        },
                        error(xhr, responseText) {
                            console.log(xhr.responseText)
                        }
                    });
                }
            }

            setInterval(ObterDataListEntrada, 1000);
            ObterDataListEntrada();

            // Criar Input de Pesquisa de Produto - Entradas 
            if (document.getElementById('btn-pesquisar-planilha')) {
                document.getElementById('btn-pesquisar-planilha').addEventListener('click', () => {
                    if ($('#InputSearchEntrada')) {
                        $('#InputSearchEntrada').val('');
                        $('#InputDataEntrada').val('');
                        buscarEntradaProdutos();
                    }
                    const DivInputEntrada = document.getElementById('input_product');

                    if (!DivInputEntrada.innerHTML) {
                        DivInputEntrada.innerHTML = `
                        <input type="text" class="input-estoque" id="InputSearchEntrada" placeholder="Pesquisar por Produto" autocomplete="off">
                        <input type="date" class="input-estoque" id="InputDataEntrada" placeholder="Pesquisar Data de Entrada">
                        <button class="btns-search" type="button" id="btn_reset_search_entrada" value="true"><span class="material-symbols-outlined">restart_alt</span></button>
                        `;
                        // Evento para resetar a busca do produto na Entrada 
                        const InputSearchEntrada = $('#InputSearchEntrada');
                        const InputDataEntrada = $('#InputDataEntrada');
                        const btnResetSearchEntrada = document.getElementById('btn_reset_search_entrada');

                        btnResetSearchEntrada.addEventListener('click', () => {
                            InputSearchEntrada.val('');
                            InputDataEntrada.val('');
                            buscarEntradaProdutos();
                        });

                        // Evento para buscar produto da Entrada ao digitar
                        if (InputSearchEntrada.length) {
                            InputSearchEntrada.on('input', function () {
                                buscarEntradaProdutos();
                            });
                        }
                        if (InputDataEntrada.length) {
                            InputDataEntrada.on('input', function () {
                                buscarEntradaProdutos();
                            });
                        }
                    }
                    else {
                        DivInputEntrada.innerHTML = '';
                    }
                });
            };
        }
        else if (e.currentTarget.innerText.includes('inventory_2')) {
            // ESTOQUE       
            document.body.style.overflow = "auto";
            document.querySelector('.modal-settings').style.display = "none";
            document.querySelector('.sub_container').style.cssText = "box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);";
            document.querySelector('.sub_container').innerHTML = `
            <div class="cabecalhoSistema">
                <h1>Estoque Geral</h1>
                <h4>(Verificar Produtos Disponíveis)</h4>
                <div class="FormSearchClass">
                    <input type="text" id="SearchProductStock" placeholder="Pesquisar Produto" class="input-estoque" autocomplete="off">
                    <button class="btns-search" type="button" id="btn_reset_search_stock" value="true"><span class="material-symbols-outlined">restart_alt</span></button>
                    <button class="btn-exportar-planilha" style="display: inline;padding: 8px!important;position:relative!important;" id="btn-exportar-planilha" data-tipo="estoque">
                        <span class="material-symbols-outlined">
                        download
                        </span>
                    </button>
                </div>
            </div>
            <br><br>
            <div class="border-top"></div>
            <br
            <div id="mudanca">
            </div>
             <div class="tabela" id="tabelaEstoque">
            </div> 
            <div class="secoes-navegacao">
                <button class="secoes-prev" id="secoes-prev" style="display:none;"></button>
                <button class="secoes-next" id="secoes-next">2</button>
            </div>
            `;

            // AJAX para busca dos Produtos no Estoque  
            function buscarProdutos() {
                const tabelaProdutos = document.getElementById("tabelaEstoque");
                if (tabelaProdutos) {
                    const dados = {
                        btn_estoque: 'estoque',
                        input_search_estoque_product: $('#SearchProductStock').val()
                    }
                    $.ajax({
                        url: "./real_time/TableEstoque.php",
                        method: "POST",
                        data: dados,
                        dataType: "json",
                        success: function (data) {

                            if (data.length > 0) {
                                atualizarTabela(tabelaProdutos, data);
                            } else {
                                tabelaProdutos.innerHTML = `
                                    <h3>
                                        Nenhum produto foi encontrado no Estoque!
                                    </h3>`;
                            }
                        }
                    });
                }
            }

            function atualizarTabela(tabela, dados) {
                const secoes = [];
                let secaoAtual = 0;
                let contadorLinhas = 0;

                dados.forEach((produto) => {
                    if (contadorLinhas >= 50) {
                        secaoAtual++;
                        contadorLinhas = 0;
                    }

                    if (!secoes[secaoAtual]) {
                        secoes[secaoAtual] = [];
                    }

                    secoes[secaoAtual].unshift(produto);
                    contadorLinhas++;
                });
                secoes.reverse();
                tabela.innerHTML = '';

                const secoesContainer = document.createElement("div");
                secoesContainer.classList.add("secoes-container");

                secoes.forEach((secao, indice) => {
                    // Criando a seção
                    const secaoElement = document.createElement("div");
                    secaoElement.classList.add("secao");

                    // Criando e já colocando o titulo da sessão na sessão
                    const tituloSecao = document.createElement("h2");
                    tituloSecao.textContent = `Página ${indice + 1}`;
                    secaoElement.appendChild(tituloSecao);

                    // Criando a div para responsividade
                    const divTableResponsive = document.createElement("div");
                    divTableResponsive.classList.add("table-responsive");

                    // Criando a tabela
                    const tabelaSecao = document.createElement("table");
                    tabelaSecao.classList.add("stockTable");

                    const thead = document.createElement("thead");
                    const tr = document.createElement("tr");

                    const th1 = document.createElement("th");
                    th1.textContent = "ID Produto";
                    tr.appendChild(th1);

                    const th2 = document.createElement("th");
                    th2.textContent = "Produto";
                    tr.appendChild(th2);

                    const th3 = document.createElement("th");
                    th3.textContent = "Especificação";
                    tr.appendChild(th3);

                    const th4 = document.createElement("th");
                    th4.textContent = "Marca";
                    tr.appendChild(th4);

                    const th5 = document.createElement("th");
                    th5.textContent = "Quantidade Restante";
                    tr.appendChild(th5);

                    const th6 = document.createElement("th");
                    th6.textContent = "Valor da Última Entrada";
                    tr.appendChild(th6);

                    const th7 = document.createElement("th");
                    th7.textContent = "Valor da Última Venda";
                    tr.appendChild(th7);

                    const th8 = document.createElement("th");
                    th8.textContent = "Controle de Fluxo";
                    tr.appendChild(th8);

                    const th9 = document.createElement("th");
                    tr.appendChild(th9);

                    const th10 = document.createElement("th");
                    tr.appendChild(th10);

                    thead.appendChild(tr);
                    tabelaSecao.appendChild(thead);

                    const corpoTabelaSecao = document.createElement("tbody");
                    tabelaSecao.appendChild(corpoTabelaSecao);

                    // Adicionando a tabela dentro da div responsiva
                    divTableResponsive.appendChild(tabelaSecao);

                    // Adicionando a div responsiva na seção
                    secaoElement.appendChild(divTableResponsive);

                    // Adicionando a seção no container principal
                    secoesContainer.appendChild(secaoElement);

                    secao.forEach((produto) => {
                        const linha = document.createElement("tr");
                        linha.innerHTML = `
                        <td>${produto.id_produto_estoque}</td>
                        <td>${produto.produto}</td>
                        <td>${produto.especificacao}</td>
                        <td>${produto.marca}</td>
                        <td>${produto.quantidade_restante} unidade(s)</td>
                        <td>R$ ${produto.valor_ultima_entrada}.00</td>
                        <td>${produto.valor_ultima_saida ? ('R$ ' + produto.valor_ultima_saida + '.00') : 'Nenhuma Venda'}</td>            
                        <td>R$ ${produto.valor_total_estoque}.00</td>            
                        <td><div id="produtoEstoque${produto.id_produto_estoque}" class="controleDeFluxoCor"></div></td>            
                        <td><span class="material-symbols-outlined excluir-produto" data-id_produto="${produto.id_produto_estoque}" data-produto="${produto.produto}" data-produto_marca="${produto.marca}" data-produto_especificacao="${produto.especificacao}">delete</span></td>            
                        <td><span class="material-symbols-outlined editar-produto" data-id_produto="${produto.id_produto_estoque}" data-produto="${produto.produto}" data-produto_marca="${produto.marca}" data-produto_especificacao="${produto.especificacao}">edit</span></td>            
                    `;

                        corpoTabelaSecao.appendChild(linha); 

                        const controleDeFluxoCor = linha.querySelector(`#produtoEstoque${produto.id_produto_estoque}`);
                        if (controleDeFluxoCor) {
                            var SinalNumero = Number(produto.valor_total_estoque);
                            if (SinalNumero > 0) {
                                controleDeFluxoCor.style.backgroundColor = "green";
                            }
                            else if (SinalNumero < 0) {
                                controleDeFluxoCor.style.backgroundColor = "red";
                            }
                            else {
                                controleDeFluxoCor.style.backgroundColor = "gray";

                            }
                        }
                    });


                    tabela.appendChild(secoesContainer);
                });
                containerCurrentTabela = secoesContainer;

                // Atualizar a seção atual inicialmente
                const secoes1 = secoesContainer.children;
                atualizarSecao(secaoAtualUser, secoes1);
            }

            // Buttons
            const secoesPrev = document.getElementById('secoes-prev');
            const secoesNext = document.getElementById('secoes-next');
            secaoAtualUser = 0;
            secoesPrev.addEventListener('click', function () {
                if (containerCurrentTabela && containerCurrentTabela.children) {
                    const secoes = containerCurrentTabela.children;
                    irParaSecaoAnterior(secoesPrev, secoesNext, secaoAtualUser , secoes);
                }
            });
            
            secoesNext.addEventListener('click', function () {
                if (containerCurrentTabela && containerCurrentTabela.children) {
                    const secoes = containerCurrentTabela.children;
                    irParaSecaoProxima(secoesPrev, secoesNext, secaoAtualUser , secoes);
                }
            });


            setInterval(buscarProdutos, 30000);

            // Busca usuários inicialmente
            buscarProdutos();

            // Evento para resetar a busca do produto no estoque 
            document.getElementById('btn_reset_search_stock').addEventListener('click', () => {
                $('#SearchProductStock').val('');
                buscarProdutos();
            });

            // Evento para buscar produto do estoque ao digitar
            $('#SearchProductStock').on('input', function () {
                buscarProdutos();
            });

            // Excluir Produto do Sistema da Adega Moreira's
            const containerProduto = document.getElementById('tabelaEstoque');

            const dataTipoUser = document.getElementById('ContainerEditarProduto').getAttribute('data-tipo_user');

            containerProduto.addEventListener('click', (event) => {
                if (event.target.classList.contains('excluir-produto')) {
                    const idProduto = event.target.getAttribute('data-id_produto');
                    const produto = event.target.getAttribute('data-produto');
                    const especificacao = event.target.getAttribute('data-produto_especificacao');
                    const marcaProduto = event.target.getAttribute('data-produto_marca');

                    if(dataTipoUser !== 'SuperAdmin'){
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
                            title: "Você não possui permissão para excluir produtos no sistema!"
                            });
                    }
                    else {
                        Swal.fire({
                            title: "Exclusão de Produto | Estoque",
                            text: `Você realmente deseja excluir o produto ${produto} da marca ${marcaProduto} e com especificação ${especificacao} permanentemente??`,
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "Sim, desejo excluir!",
                            cancelButtonText: "Cancelar"
                        }).then((resultProduto) => {
                            if (resultProduto.isConfirmed) {
                                const dados = {
                                    btnConfirmDeleteProduto: "true",
                                    id_produto: idProduto, 
                                    produto: produto, 
                                    especificacao_produto: especificacao, 
                                    marca_produto: marcaProduto, 
                                }
                                $.ajax({
                                    url: "./real_time/TableEstoque.php",
                                    method: "POST",
                                    data: dados,
                                    dataType: "json",
                                    success: function (data) {
                                        if (data.status == 'success') {
                                            const Toast = Swal.mixin({
                                                toast: true,
                                                position: "top-end",
                                                showConfirmButton: false,
                                                timer: 2000,
                                                timerProgressBar: true,
                                                didOpen: (toast) => {
                                                    toast.onmouseenter = Swal.stopTimer;
                                                    toast.onmouseleave = Swal.resumeTimer;
                                                }
                                            });
                                            Toast.fire({
                                                icon: "success",
                                                title: "O produto foi excluído com sucesso do sistema da Adega Moreira's, juntamente com suas Entradas e Saídas!!"
                                            });
                                        }
                                    },error(xhr){
                                        console.log(xhr.responseText)
                                    }
                                });
                            }
                        });   
                    }
                }
            });

                   // Editar Produto do Sistema da Adega Moreira's
                   containerProduto.addEventListener('click', (event) => {
                       if (event.target.classList.contains('editar-produto')) {
                           let idProdutoEditar = event.target.getAttribute('data-id_produto');
                           let produto = event.target.getAttribute('data-produto');
                           let especificacao = event.target.getAttribute('data-produto_especificacao');
                           let marcaProduto = event.target.getAttribute('data-produto_marca');
                           const ContainerEditarProduto = document.getElementById('ContainerEditarProduto');
                           const dataTipoUser = document.getElementById('ContainerEditarProduto').getAttribute('data-tipo_user');
                           ContainerEditarProduto.innerHTML = '';

                           // Bloqueio a privilegios
                           if (dataTipoUser !== 'SuperAdmin') {
                                ContainerEditarProduto.innerHTML = '';
                                event.target.style.opacity = "0.4";
                                
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
                                title: "Você não possui permissão para editar produtos no sistema!"
                                });
                           }
                           else {
                               ContainerEditarProduto.innerHTML = `
                               <div class="modal-editar-produto" style="display: flex;">
                                <div class="modal">
                                    <span class="material-symbols-outlined close-editar-perfil" id="closeModalEditarProduto">
                                    close
                                    </span> 
                                        <span class="material-symbols-outlined btn-edit-enabled" id="btnEditEnabled">
                                    edit
                                    </span>  
                                    <form class="form-editar-produto" id="formEditarProduto">
                                        <h2>Editar Produto </h2>
                                        <label>Produto:</label>
                                        <input id="produtoEditar" type="text" value="${produto}" required autocomplete="off" disabled>
                                        <label>Especificação:</label>
                                        <input id="produtoEspecificacaoEditar" type="text" value="${especificacao}" required autocomplete="off" disabled>
                                        <label>Marca:</label>
                                        <input id="produtoMarcaEditar" type="text" value="${marcaProduto}" required autocomplete="off" disabled>
                                        <br>
                                        <button id="btnValoresDefaultProduto" type="button" disabled>Retornar Valores Iniciais</button>
                                        <button id="btnEditarProduto" type="submit" disabled>Editar Produto</button>
                                    </form>
                                </div>
                               </div>
                               `;
                                document.body.style.overflow = "hidden";
                           }

                            // Fechar Modal de Editar o Produto 
                            const btnCloseModalEditarProduto = document.getElementById('closeModalEditarProduto');
                            if(btnCloseModalEditarProduto){
                                btnCloseModalEditarProduto.addEventListener('click', () => {
                                    ContainerEditarProduto.innerHTML = '';
                                    document.body.style.overflow = "auto";
                                });
                            };

                            // Formulário Editar Produto - Retirar Padrão de Envio
                            const formEditarProduto = document.getElementById('formEditarProduto');
                            if(formEditarProduto){
                                formEditarProduto.addEventListener('submit', (e) => { 
                                    e.preventDefault();
                                    
                                    const dados = {
                                        idProdutoEditar: idProdutoEditar,
                                        produtoEditar: $('#produtoEditar').val(),
                                        produtoEspecificacaoEditar: $('#produtoEspecificacaoEditar').val(),
                                        produtoMarcaEditar: $('#produtoMarcaEditar').val(),
                                        validacao: "true"
                                    }
                                    
                                    $.ajax({
                                        url: "./real_time/TableEstoque.php",
                                        method: "POST",
                                        data: dados,
                                        dataType: "json",
                                        success: function (data) {
                                            // Setar datas com os novos valores adicionados pelo usuário no Produto
                                            produto = $('#produtoEditar').val();
                                            especificacao = $('#produtoEspecificacaoEditar').val();
                                            marcaProduto = $('#produtoMarcaEditar').val();

                                            // Voltar tudo padrão - Inputs e Buttons 
                                            $('#produtoEditar').prop('disabled', true);
                                            $('#produtoMarcaEditar').prop('disabled', true);
                                            $('#produtoEspecificacaoEditar').prop('disabled', true);
                                            $('#btnValoresDefaultProduto').prop('disabled', true);
                                            $('#btnEditarProduto').prop('disabled', true);
                                            $('#btnEditEnabled').css('opacity', 1);                                            
                                            
                                            // Verificar se o status é success ou error - Caso produto já tenha essas informações e caso não
                                            if(data.status === 'success'){
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
                                                    title: "Atualização das informações do produto foram realizadas com sucesso no sistema da Adega Moreira's!"
                                                    });
                                            }
                                            else {
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
                                                    title: "ERRO: já existe um produto com este nome, especificação e marca na Tabela de Estoque!"
                                                    });
                                            }
                                        },error(xhr){
                                            console.log(xhr.responseText)
                                        }
                                    });
                                });
                            }

                            // Buttons e Inputs - Desabilitar e Habilitar 
                            const btnEditEnabled = document.getElementById('btnEditEnabled');
                            const btnValoresDefaultProduto = document.getElementById('btnValoresDefaultProduto');
                            const btnEditarProduto = document.getElementById('btnEditarProduto');
                            const produtoEditar = document.getElementById('produtoEditar');
                            const produtoEspecificacaoEditar = document.getElementById('produtoEspecificacaoEditar');
                            const produtoMarcaEditar = document.getElementById('produtoMarcaEditar');

                            if(btnEditEnabled){
                                btnEditEnabled.addEventListener('click', () => {
                                    if(btnEditarProduto.disabled){
                                        btnEditEnabled.style.opacity = 0.7;
                                        btnValoresDefaultProduto.disabled = false;
                                        btnEditarProduto.disabled = false;
                                        produtoEditar.disabled = false;
                                        produtoEspecificacaoEditar.disabled = false;
                                        produtoMarcaEditar.disabled = false;
                                    }
                                    else {
                                        btnEditEnabled.style.opacity = 1;
                                        btnValoresDefaultProduto.disabled = true;
                                        btnEditarProduto.disabled = true;
                                        produtoEditar.disabled = true;
                                        produtoEspecificacaoEditar.disabled = true;
                                        produtoMarcaEditar.disabled = true; 
                                    }
                                });
                            }

                        // Botão para Retornar os valores padrões dos inputs
                        if(btnValoresDefaultProduto){
                            btnValoresDefaultProduto.addEventListener('click', () => {
                                produtoEditar.value = produto
                                produtoEspecificacaoEditar.value = especificacao
                                produtoMarcaEditar.value = marcaProduto
                            });
                        }
                       }
                   });
        }
        else if (e.currentTarget.innerText.includes('person_add')) {
            document.body.style.overflow = "auto";
            document.querySelector('.modal-settings').style.display = "none";
            document.querySelector('.sub_container').style.cssText = "box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);";
            document.querySelector('.sub_container').innerHTML = `
                <h1>Cadastro de Usuários</h1>
                <div class="form-group" style="gap: 20px;">
                    <form method="POST" id="FormUsuario">
                        <input type="text" id="nome_usuario" class="inputs_usuarios" placeholder="Nome do Usuário" required autocomplete="off">
                        <input type="email" id="email_usuario" class="inputs_usuarios" placeholder="Email do Usuário" required autocomplete="off">
                        <input type="password" id="senha_usuario" class="inputs_usuarios" placeholder="Senha do Usuário" required minlength="8" autocomplete="off">
                        <select id="tipo_usuario" class="selectTipo inputs_usuarios" required>
                            <option value="">Tipo de Usuário</option>
                            <option value="Admin">Admin</option>
                            <option value="Comum">Comum</option>
                        </select>
                        <br><br>
                        <button type="submit" class="global-btns">Criar Usuário</button>
                    </form>
        
                    <br><br>
        
                    <div class="border-top"></div>
    
                    <h1>Tabela de Usuários</h1>
        
                    <div class="tabela">
                        <form method="POST" class="form-search" id="FormUsuarioSearch">
                        <div class="input-search-global">    
                            <input class="inputs_search" id="input_usuario_search" type="text" placeholder="Pesquisar Usuários" required autocomplete="off">
                            <select id="tipo_usuario_search" class="selectTipo" required>
                                <option value="">Tipo de Usuário</option>
                                <option value="Admin">Admin</option>
                                <option value="Comum">Comum</option>
                            </select>
                            <button class="btns-search" type="button" id="btn_reset_search" value="true"><span class="material-symbols-outlined">restart_alt</span></button>
                        </div>
                            </form>
                        <br><br>
                        <div id="tableUsers">
                            <table id="usuariosTabela" class="usuariosTabela">
                                <thead>
                                    <tr>
                                        <th>ID Usuário</th>
                                        <th>Nome do Usuário</th>
                                        <th>Email</th>
                                        <th>Tipo</th>
                                        <th>Qtd. Entradas</th>
                                        <th>Qtd. Saídas</th>
                                        <th>Data de Criação</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;

            if (document.getElementById("usuariosTabela")) {
                // Função para buscar usuários
                function buscarUsuarios() {
                    const tabelaUsuarios = document.getElementById("usuariosTabela");
                    if (tabelaUsuarios) {
                        const dados = {
                            btn_requision: 'true',
                            input_email_usuario_search: $('#input_usuario_search').val(),
                            input_tipo_usuario_search: $('#tipo_usuario_search').val()
                        }
                        $.ajax({
                            url: "./real_time/TableUsuarios.php",
                            method: "POST",
                            data: dados,
                            dataType: "json",
                            success: function (data) {
                                if(!data.mensagem){
                                    if (data.length > 0) {
                                        atualizarTabela(tabelaUsuarios.querySelector("tbody"), data);
                                    } else {
                                        tabelaUsuarios.querySelector("tbody").innerHTML = `
                                            <tr>
                                                <td colspan="7">Nenhum usuário encontrado.</td>
                                            </tr>`;
                                    }
                                } else {
                                    const Toast = Swal.mixin({
                                        toast: true,
                                        position: "bottom-right",
                                        showConfirmButton: false,
                                        timer: 3000,
                                        timerProgressBar: true,
                                        didOpen: (toast) => {
                                          toast.onmouseenter = Swal.stopTimer;
                                          toast.onmouseleave = Swal.resumeTimer;
                                        }
                                      });
                                      
                                      Toast.fire({
                                        icon: "error",
                                        title: "Você não tem permissão para entrar!"
                                      }).then(() => {
                                        window.location.href = "../";
                                      });
                                }
                            }
                        });
                    }
                }

                // Função para atualizar a tabela de usuários
                function atualizarTabela(tabela, dados) {
                    if (tabela.rows.length > 0) {
                        tabela.innerHTML = '';
                    }

                    dados.forEach(function (usuario) {
                        if (usuario.tipo_usuario !== "SuperAdmin") {
                            tabela.innerHTML += `
                            <tr>
                                <td>${usuario.id_usuario}</td>
                                <td>${usuario.nome_usuario}</td>
                                <td>${usuario.email_usuario}</td>
                                <td>${usuario.tipo_usuario}</td>
                                <td>${usuario.qtd_entradas}</td>
                                <td>${usuario.qtd_saidas}</td>
                                <td>${usuario.data_criacao}</td>
                                <td style="border: none; color: red; background: transparent !important;"><span class="material-symbols-outlined excluir-usuario" style="cursor: pointer;" data-id_usuario="${usuario.id_usuario}" data-nome_usuario="${usuario.nome_usuario}">delete</span></td>
                            </tr>`;
                        } 
                    });
                }

                // Evento para resetar a busca
                document.getElementById('btn_reset_search').addEventListener('click', () => {
                    $('#input_usuario_search').val('');
                    $('#tipo_usuario_search').val('');
                    buscarUsuarios();
                });

                // Evento para buscar usuários ao digitar
                $('#input_usuario_search, #tipo_usuario_search').on('input change', function () {
                    buscarUsuarios();
                });


                setInterval(buscarUsuarios, 30000);

                // Busca usuários inicialmente
                buscarUsuarios();

                // Evento para excluir usuário
                const container = document.getElementById('usuariosTabela');

                container.addEventListener('click', (event) => {
                    if (event.target.classList.contains('excluir-usuario')) {
                        const id_usuario = event.target.getAttribute('data-id_usuario');
                        const nome_usuario = event.target.getAttribute('data-nome_usuario');

                        Swal.fire({
                            title: "Exclusão",
                            text: `Você realmente deseja excluir o usuário ${nome_usuario} com id: ${id_usuario} permanentemente??`,
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "Sim, desejo excluir!",
                            cancelButtonText: "Cancelar"
                        }).then((result) => {
                            if (result.isConfirmed) {
                                const dados = {
                                    btn_excluir_usuario: 'true',
                                    id_usuario_post: id_usuario,
                                }
                                $.ajax({
                                    url: "./real_time/TableUsuarios.php",
                                    method: "POST",
                                    data: dados,
                                    dataType: "json",
                                    success: function (data) {
                                        if (data) {
                                            const Toast = Swal.mixin({
                                                toast: true,
                                                position: "top-end",
                                                showConfirmButton: false,
                                                timer: 2000,
                                                timerProgressBar: true,
                                                didOpen: (toast) => {
                                                    toast.onmouseenter = Swal.stopTimer;
                                                    toast.onmouseleave = Swal.resumeTimer;
                                                }
                                            });
                                            Toast.fire({
                                                icon: "success",
                                                title: "Usuário excluído com sucesso."
                                            });
                                        }
                                    }
                                });
                            }
                        });
                    }
                });

                const FormCriarUsuariosSearch = document.getElementById("FormUsuarioSearch");
                if (FormCriarUsuariosSearch) {
                    FormCriarUsuariosSearch.addEventListener('submit', (send) => {
                        send.preventDefault();
                    });
                }
                const FormCriarUsuario = document.getElementById("FormUsuario");
                FormCriarUsuario.addEventListener('submit', (e) => {

                    e.preventDefault();

                    const dados = {
                        nome_usuario: $('#nome_usuario').val(),
                        email_usuario: $('#email_usuario').val(),
                        senha_usuario: $('#senha_usuario').val(),
                        tipo_usuario: $('#tipo_usuario').val(),
                        btn_criar_usuarios: 'true'
                    }

                    $.ajax({
                        url: "./real_time/TableUsuarios.php",
                        method: "POST",
                        data: dados,
                        dataType: "json",
                        success: function (data) {
                            if (data.status === 'success') {
                                const Toast = Swal.mixin({
                                    toast: true,
                                    position: "top-start",
                                    showConfirmButton: false,
                                    timer: 2000,
                                    timerProgressBar: true,
                                    didOpen: (toast) => {
                                        toast.onmouseenter = Swal.stopTimer;
                                        toast.onmouseleave = Swal.resumeTimer;
                                    }
                                });
                                Toast.fire({
                                    icon: "success",
                                    title: "Usuário criado com sucesso no sistema da Adega Moreira's!"
                                });
                                $('#nome_usuario').val('');
                                $('#email_usuario').val(''),
                                    $('#senha_usuario').val('');
                                $('#tipo_usuario').val('');
                            } else {
                                const Toast = Swal.mixin({
                                    toast: true,
                                    position: "top-start",
                                    showConfirmButton: false,
                                    timer: 4000,
                                    timerProgressBar: true,
                                    didOpen: (toast) => {
                                        toast.onmouseenter = Swal.stopTimer;
                                        toast.onmouseleave = Swal.resumeTimer;
                                    }
                                });
                                Toast.fire({
                                    icon: "error",
                                    title: "Um usuário já está cadastrado com esse email, por favor, tente novamente!"
                                });
                                $('#email_usuario').val('')

                            }
                        },error(xhr){
                            console.log(xhr.responseText)
                        }
                    });
                })
            }

        }
    });
});

var secaoAtualUser = 0;
function atualizarSecao(secaoAtualUser0, secoes) {
    for (let i = 0; i < secoes.length; i++) {
        secoes[i].style.display = 'none';
    }

    // Mudar Estilo para privilégio
    if(document.getElementById('ContainerEditarProduto').getAttribute('data-tipo_user') !== "SuperAdmin"){
        document.querySelectorAll(".editar-produto").forEach(function (edit){
            edit.style.opacity = "0.4";
            edit.style.color = "gray";
        });
        document.querySelectorAll(".excluir-produto").forEach(function (excluir){
            excluir.style.opacity = "0.4";
            excluir.style.color = "gray";
        });

    }
    if (secoes.length === 1) {
        document.getElementById('secoes-next').style.display = "none";
    }
    if (secaoAtualUser >= 0 && secaoAtualUser <= secoes.length - 1) {
        secoes[secaoAtualUser].style.display = 'block';
    }
}

function irParaSecaoAnterior(secoesPrev, secoesNext, secaoAtualUser0, secoes) {
    if (secaoAtualUser >= 1) {
        secaoAtualUser = secaoAtualUser - 1;
        secoesPrev.innerText = secaoAtualUser;
        secoesNext.innerText = secaoAtualUser + 2;
        atualizarSecao(secaoAtualUser, secoes);

    }
    if (secaoAtualUser === 0) {
        secoesPrev.style.display = "none";
        secoesNext.style.display = "block";
        secoesNext.innerText = secaoAtualUser + 2;
        atualizarSecao(secaoAtualUser, secoes);
    }
    else {
        secoesPrev.style.display = "block";
        secoesNext.style.display = "block";
    }
}

function irParaSecaoProxima(secoesPrev, secoesNext, secaoAtualUser0, secoes) {
    if (secaoAtualUser <= secoes.length - 2) {
        secaoAtualUser = secaoAtualUser + 1;
        secoesPrev.innerText = secaoAtualUser;
        secoesNext.innerText = secaoAtualUser + 2;
        atualizarSecao(secaoAtualUser, secoes);
    }

    if (secaoAtualUser < secoes.length - 1) {
        secoesNext.style.display = "block";
        secoesPrev.style.display = "block";
    }
    else {
        secoesPrev.style.display = "block";
        secoesPrev.innerText = secaoAtualUser;
        secoesNext.style.display = "none";
    }
}


// Botão de Configurações no Menu 
document.getElementById("div_settings").addEventListener('click', function (e) {
    document.querySelector('.modal-settings').style.display = "flex";
    document.body.style.overflow = "hidden";
    document.getElementById("menu_config").innerHTML = configModal('Conta');
    if (document.querySelector('#editPerfil')) {
        $.ajax({
            url: "./real_time/TableUsuarios.php",
            method: "GET",
            success: function (data) {
                $("#contaUserID").val(data[0].id_usuario);
                $("#contaUserName").val(data[0].nome_usuario);
                $("#contaUserEmail").val(data[0].email_usuario);
                $("#contaUserPassword").val(data.senha_usuario);
                $("#contaUserTU").val(data[0].tipo_usuario);

            },
            error(xhr, responseText) {
                console.error(xhr.responseText)
            }
        });
    };

    // Ativar Inputs para a edição de perfil do usuário
    const btnEditarPerfilAtivar = document.querySelector('#editPerfil');
    const btnEditarPerfil = document.querySelector('#btnEditarPerfil');
    const FormEditarPerfil = document.querySelector('#FormEditarPerfil');
    const btnVisiblePassword = document.querySelector('#visibility_password');

    if (btnEditarPerfilAtivar) {
        btnEditarPerfilAtivar.addEventListener('click', () => {
            if (btnEditarPerfil.disabled) {
                // Habilitar
                btnEditarPerfilAtivar.style.opacity = 0.5;
                btnVisiblePassword.style.cssText = "pointer-events: all;";
                btnEditarPerfil.disabled = false;
                $("#contaUserName").prop("disabled", false);
                $("#contaUserPassword").prop("disabled", false);
            }
            else {
                // Desabilitar
                btnEditarPerfilAtivar.style.opacity = 1;
                btnVisiblePassword.style.cssText = "pointer-events: none;";
                btnEditarPerfil.disabled = true;
                $("#contaUserName").prop("disabled", true);
                $("#contaUserPassword").prop("disabled", true);
            }
        });

        // Envio do Formulário - Tirar envio padrão
        FormEditarPerfil.addEventListener('submit', (e) => {
            e.preventDefault();

            // Verificação Burlamento 
            if ($("#contaUserID").prop("disabled") === false || $("#contaUserEmail").prop("disabled") === false || $("#contaUserTU").prop("disabled") === false) {
                Swal.fire({
                    title: "Aviso | Envio do Formulário de Edição de Perfil",
                    text: "O Usuário tentou burlar o sistema tentando alterar um dos campos proibidos ID | Email | Tipo Usuário!!",
                    icon: "error"
                });
                // $("#contaUserID").prop("disabled", true);
                // $("#contaUserEmail").prop("disabled", true);
                // $("#contaUserTU").prop("disabled", true);
            }
            else {
                const dados = {
                    idUsuarioEdit: $("#contaUserID").val(),
                    UserUsuarioEdit: $("#contaUserName").val(),
                    SenhaUsuarioEdit: $("#contaUserPassword").val(),
                    dadosSend: 'true'
                };

                $.ajax({
                    url: "./real_time/TableUsuarios.php",
                    method: "POST",
                    data: dados,
                    dataType: 'json',
                    success: function (data) {
                        if (data.mensagem === 'existing_user') {
                            $("#contaUserName").toggleClass('animacao-inputs-error');

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
                                icon: "error",
                                title: "Já existe um usuário cadastrado com esse User no sistema da Adega Moreira's!!"
                            });

                            setTimeout(function () {
                                $("#contaUserName").removeClass('animacao-inputs-error');
                            }, 2500);
                        }
                        else if (data.mensagem === 'same_password') {
                            $("#contaUserPassword").toggleClass('animacao-inputs-error');

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
                                icon: "error",
                                title: "A senha atualizada é igual a senha anterior! Por favor, insira uma senha nova, que seja diferente da atual!!"
                            });

                            setTimeout(function () {
                                $("#contaUserPassword").removeClass('animacao-inputs-error');
                            }, 2500);
                        }
                        else if (data.mensagem === 'user_scammed') {
                            $("#contaUserID").toggleClass('animacao-inputs-error');

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
                                icon: "error",
                                title: "ID postado é diferente do seu User!!!"
                            });

                            setTimeout(function () {
                                $("#contaUserID").removeClass('animacao-inputs-error');
                            }, 2500);
                        }
                        else {
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
                                title: "Os dados Cadastrais do Usuário foram atualizados com sucesso!!"
                            });

                            // Troca de Dados do Usuário - Reverter 
                            btnEditarPerfilAtivar.style.opacity = 1;
                            btnVisiblePassword.style.cssText = "pointer-events: none;";
                            btnVisiblePassword.innerHTML = 'visibility_off';
                            btnEditarPerfil.disabled = true;
                            $("#contaUserName").prop("disabled", true);
                            $("#contaUserPassword").prop("disabled", true);
                            $('#contaUserPassword').attr('type', 'password');
                        }
                    },
                    error(xhr, responseText) {
                        console.error(xhr.responseText)
                    }
                });
            }

        });

        // Tornar Senha visível e não visível 
        if (btnVisiblePassword) {
            btnVisiblePassword.addEventListener('click', (e) => {
                if (e.target.innerHTML === 'visibility_off') {
                    e.target.innerHTML = 'visibility';
                    $('#contaUserPassword').attr('type', 'text');
                }
                else {
                    e.target.innerHTML = 'visibility_off';
                    $('#contaUserPassword').attr('type', 'password');
                }
            })
        }
    }
});

// Botão Close do Modal de configurações
const closeButton = document.getElementById('close_button');
closeButton.addEventListener('click', () => {
    document.querySelector('.modal-settings').style.display = 'none';
    document.body.style.overflow = "auto";
})

// Menu Configurações Itens
document.querySelectorAll('.menu-configuracoes li').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
        document.getElementById("menu_config").innerHTML = configModal(e.currentTarget.innerText)
        if(e.currentTarget.innerText === "Conta") {
            $.ajax({
                url: "./real_time/TableUsuarios.php",
                method: "GET",
                success: function (data) {
                    $("#contaUserID").val(data[0].id_usuario);
                    $("#contaUserName").val(data[0].nome_usuario);
                    $("#contaUserEmail").val(data[0].email_usuario);
                    $("#contaUserPassword").val(data.senha_usuario);
                    $("#contaUserTU").val(data[0].tipo_usuario);
    
                },
                error(xhr, responseText) {
                    console.error(xhr.responseText)
                }
            });
    
        // Ativar Inputs para a edição de perfil do usuário
        const btnEditarPerfilAtivar = document.querySelector('#editPerfil');
        const btnEditarPerfil = document.querySelector('#btnEditarPerfil');
        const FormEditarPerfil = document.querySelector('#FormEditarPerfil');
        const btnVisiblePassword = document.querySelector('#visibility_password');
    
        btnEditarPerfilAtivar.addEventListener('click', () => {
            if (btnEditarPerfil.disabled) {
                // Habilitar
                btnEditarPerfilAtivar.style.opacity = 0.5;
                btnVisiblePassword.style.cssText = "pointer-events: all;";
                btnEditarPerfil.disabled = false;
                $("#contaUserName").prop("disabled", false);
                $("#contaUserPassword").prop("disabled", false);
            }
            else {
                // Desabilitar
                btnEditarPerfilAtivar.style.opacity = 1;
                btnVisiblePassword.style.cssText = "pointer-events: none;";
                btnEditarPerfil.disabled = true;
                $("#contaUserName").prop("disabled", true);
                $("#contaUserPassword").prop("disabled", true);
            }
        });

        // Envio do Formulário - Tirar envio padrão
        FormEditarPerfil.addEventListener('submit', (e) => {
            e.preventDefault();

            // Verificação Burlamento 
            if ($("#contaUserID").prop("disabled") === false || $("#contaUserEmail").prop("disabled") === false || $("#contaUserTU").prop("disabled") === false) {
                Swal.fire({
                    title: "Aviso | Envio do Formulário de Edição de Perfil",
                    text: "O Usuário tentou burlar o sistema tentando alterar um dos campos proibidos ID | Email | Tipo Usuário!!",
                    icon: "error"
                });
                // $("#contaUserID").prop("disabled", true);
                // $("#contaUserEmail").prop("disabled", true);
                // $("#contaUserTU").prop("disabled", true);
            }
            else {
                const dados = {
                    idUsuarioEdit: $("#contaUserID").val(),
                    UserUsuarioEdit: $("#contaUserName").val(),
                    SenhaUsuarioEdit: $("#contaUserPassword").val(),
                    dadosSend: 'true'
                };

                $.ajax({
                    url: "./real_time/TableUsuarios.php",
                    method: "POST",
                    data: dados,
                    dataType: 'json',
                    success: function (data) {
                        if (data.mensagem === 'existing_user') {
                            $("#contaUserName").toggleClass('animacao-inputs-error');

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
                                icon: "error",
                                title: "Já existe um usuário cadastrado com esse User no sistema da Adega Moreira's!!"
                            });

                            setTimeout(function () {
                                $("#contaUserName").removeClass('animacao-inputs-error');
                            }, 2500);
                        }
                        else if (data.mensagem === 'same_password') {
                            $("#contaUserPassword").toggleClass('animacao-inputs-error');

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
                                icon: "error",
                                title: "A senha atualizada é igual a senha anterior! Por favor, insira uma senha nova, que seja diferente da atual!!"
                            });

                            setTimeout(function () {
                                $("#contaUserPassword").removeClass('animacao-inputs-error');
                            }, 2500);
                        }
                        else if (data.mensagem === 'user_scammed') {
                            $("#contaUserID").toggleClass('animacao-inputs-error');

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
                                icon: "error",
                                title: "ID postado é diferente do seu User!!!"
                            });

                            setTimeout(function () {
                                $("#contaUserID").removeClass('animacao-inputs-error');
                            }, 2500);
                        }
                        else {
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
                                title: "Os dados Cadastrais do Usuário foram atualizados com sucesso!!"
                            });

                            // Troca de Dados do Usuário - Reverter 
                            btnEditarPerfilAtivar.style.opacity = 1;
                            btnVisiblePassword.style.cssText = "pointer-events: none;";
                            btnVisiblePassword.innerHTML = 'visibility_off';
                            btnEditarPerfil.disabled = true;
                            $("#contaUserName").prop("disabled", true);
                            $("#contaUserPassword").prop("disabled", true);
                            $('#contaUserPassword').attr('type', 'password');
                        }
                    },
                    error(xhr, responseText) {
                        console.error(xhr.responseText)
                    }
                });
            }
    
        });

        // Tornar Senha visível e não visível 
        if (btnVisiblePassword) {
            btnVisiblePassword.addEventListener('click', (e) => {
                if (e.target.innerHTML === 'visibility_off') {
                    e.target.innerHTML = 'visibility';
                    $('#contaUserPassword').attr('type', 'text');
                }
                else {
                    e.target.innerHTML = 'visibility_off';
                    $('#contaUserPassword').attr('type', 'password');
                }
            })
        }
        }
        if (e.currentTarget.innerText === "Funcionamento") {
            function GetPopUpValue() {
                $.ajax({
                    url: "./real_time/horarioFuncionamento.php",
                    method: "GET",
                    success: function (data) {
                        if (data === null) {
                        // INFORMAR QUE NÃO EXISTE HORÁRIOS DEFINIDOS PARA USERS
                        }
                        else {
                        // INFORMAR HORÁRIOS DEFINIDOS PARA USERS
                        localStorage.setItem("horario-funcionamento",data)
                        console.log(JSON.parse(data))
                        document.querySelectorAll('.config_funcionamento_dias input').forEach(function (checkbox){
                            console.log(checkbox.getAttribute('data-value'))
                            if(data.includes(checkbox.getAttribute('data-value'))){
                                checkbox.checked = true;
                                let label = checkbox.nextElementSibling;  // Pega a label correspondente ao checkbox
                                    
                                    // Cria a nova div com os campos de horário
                                    let divHorarios = document.createElement('div');
                                    divHorarios.classList.add('divHorariosFuncionamento');

                                    divHorarios.innerHTML = `
                                        <label>Inicio:</label>
                                        <input type="time" name="tempo_inicial" id="tempo_inicial" data-dia="${checkbox.id}" required>
                                        <label>Final:</label>
                                        <input type="time" name="tempo_final" id="tempo_final" data-dia="${checkbox.id}" required>
                                    `;

                                    // Insere a nova div logo após o checkbox
                                    label.insertAdjacentElement('afterend', divHorarios);



                            } else{
                                console.log("ola")
                            }
                        })
                        }
                    }
                })

                

                }
                GetPopUpValue();



            // Puxar o clique de algum checkbox
            document.querySelectorAll('.config_funcionamento_dias input').forEach(function (inputs) {
                inputs.addEventListener('change', function (e) {
                    const container = inputs.parentNode;
                    const divHorariosFuncionamento = container.querySelector('.divHorariosFuncionamento');
                    // Elimina os valores antigos
                    if (divHorariosFuncionamento) {
                        divHorariosFuncionamento.remove();
                    }
                    // Criar os campos de valores do checkbox
                    if (inputs.checked) {
                        const div = document.createElement('div');
                        div.classList = "divHorariosFuncionamento";

                        const inputHorarioInicial = document.createElement('input');
                        inputHorarioInicial.type = 'time';
                        inputHorarioInicial.name = 'tempo_inicial';
                        inputHorarioInicial.id = 'tempo_inicial';
                        inputHorarioInicial.dataset.dia = e.target.id;
                        inputHorarioInicial.required = true;

                        const inputHorarioFinal = document.createElement('input');
                        inputHorarioFinal.type = 'time';
                        inputHorarioFinal.name = 'tempo_final';
                        inputHorarioFinal.id = 'tempo_final';
                        inputHorarioFinal.dataset.dia = e.target.id;
                        inputHorarioFinal.required = true;

                        const labelHorarioInicial = document.createElement('label');
                        labelHorarioInicial.textContent = 'Inicio:';

                        const labelHorarioFinal = document.createElement('label');
                        labelHorarioFinal.textContent = 'Final:';

                        container.appendChild(div);

                        div.appendChild(labelHorarioInicial);
                        div.appendChild(inputHorarioInicial);
                        div.appendChild(labelHorarioFinal);
                        div.appendChild(inputHorarioFinal);
                    }
                });
            });

            // Envio dos Horários
            document.getElementById("btn_alterar").addEventListener("click", function(e){
                const dias = document.querySelectorAll('.config_funcionamento_dias');
                const horarios = {};
    
                // Verificações dos dias selecionados
                dias.forEach((dia) => {
                    const checkbox = dia.querySelector('input[type="checkbox"]');
                    const label = dia.querySelector('label');
                    const horarioInicial = dia.querySelector('input[name="tempo_inicial"]');
                    const horarioFinal = dia.querySelector('input[name="tempo_final"]');

                    // Organização da array
                    if (checkbox.checked && horarioInicial && horarioFinal) {
                        const diaAbreviado = label.textContent.substring(0, 3).toLowerCase();
                        if(horarioInicial.value && horarioFinal.value) {
                            // if(horarioInicial.value < horarioFinal.value){
                                horarios[diaAbreviado] = `${horarioInicial.value}-${horarioFinal.value}`;
                            // } else {
                            //     horarios[diaAbreviado] = null;
                            //     const Toast = Swal.mixin({
                            //         toast: true,
                            //         position: "bottom-right",
                            //         showConfirmButton: false,
                            //         timer: 3000,
                            //         timerProgressBar: true,
                            //         didOpen: (toast) => {
                            //             toast.onmouseenter = Swal.stopTimer;
                            //             toast.onmouseleave = Swal.resumeTimer;
                            //         }
                            //     });
                            //     Toast.fire({
                            //         icon: "error",
                            //         title: "Algum de seus horários foi definido de forma errada, o Horário Final deve ser maior que o Horário Inicial!"
                            //     });
                    
                            // }
                        }else {
                            horarios[diaAbreviado] = null;
                        }
                    }
                });

                // Caso a array estiver vazia
                if (!Object.keys(horarios).length) {
                    const Toast = Swal.mixin({
                        toast: true,
                        position: "bottom-right",
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.onmouseenter = Swal.stopTimer;
                            toast.onmouseleave = Swal.resumeTimer;
                        }
                    });
                    Toast.fire({
                        icon: "error",
                        title: "Nenhum horário de funcionamento foi selecionado, não houve alterações!"
                    });
                } 
                // Caso a array conter algum valor null, significa que em algum dia não foi selecionado os horarios corretamente
                else if (Object.values(horarios).includes(null)) {
                    console.log("Erro: Horários obrigatórios não preenchidos");
                    const Toast = Swal.mixin({
                        toast: true,
                        position: "bottom-right",
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.onmouseenter = Swal.stopTimer;
                            toast.onmouseleave = Swal.resumeTimer;
                        }
                    });
                    Toast.fire({
                        icon: "error",
                        title: "Horários obrigatórios não preenchidos corretamente, não houve alterações!"
                    });
                }
                // Caso a array não esteja vazia e não contenha valores null, passou corretamente
                else {
                    // Esquema de envio:
                    console.log(horarios)
                    const dados = {
                        horarios:  JSON.stringify(horarios),
                        btnEnviarHorarios: "true"
                    }   
                    $.ajax({
                        url: "./real_time/horarioFuncionamento.php",
                        method: "POST",
                        data: dados,
                        dataType: 'json',
                        success: function (data) {
                            
                            // Ok
                            if(data.status === 'success'){
                                const Toast = Swal.mixin({
                                    toast: true,
                                    position: "bottom-right",
                                    showConfirmButton: false,
                                    timer: 3000,
                                    timerProgressBar: true,
                                    didOpen: (toast) => {
                                        toast.onmouseenter = Swal.stopTimer;
                                        toast.onmouseleave = Swal.resumeTimer;
                                    }
                                });
                                Toast.fire({
                                    icon: "success",
                                    title: "O Horário de funcionamento da Adega Moreira's foi alterado com sucesso!"
                                });
                                
                            } else {
                                const Toast = Swal.mixin({
                                    toast: true,
                                    position: "bottom-right",
                                    showConfirmButton: false,
                                    timer: 3000,
                                    timerProgressBar: true,
                                    didOpen: (toast) => {
                                        toast.onmouseenter = Swal.stopTimer;
                                        toast.onmouseleave = Swal.resumeTimer;
                                    }
                                });
                                Toast.fire({
                                    icon: "error",
                                    title: "Você não tem permissão para alterar!"
                                });
                                //CONTINUAR
                            }
                        },
                        error(xhr) {
                            console.log(xhr.responseText);
                        }
                    });
                };
            });
            
        };
    })
});

// Função dos Itens nas Configurações
function configModal(element) {
    document.getElementById('menu_config').innerHTML = '';
    if (element === 'Conta') {
        return `<div id="menu_config_conta"> 
                    <div class="div_config_conta">
                        <button id="editPerfil" class="edit-perfil">
                            <span class="material-symbols-outlined">edit</span> 
                        </button>
                        <form id="FormEditarPerfil" class="form-editar-perfil"> 
                        <label style="font-weight: bold;">Id Usuário:</label>
                        <input type="text" id="contaUserID" required disabled autocomplete="off"> 
                        <label style="font-weight: bold;">Usuário:</label>
                        <input type="text" id="contaUserName" required disabled autocomplete="off">
                        <label style="font-weight: bold;">Email do Usuário:</label>
                        <input type="email" id="contaUserEmail" required disabled autocomplete="off">
                        <label style="font-weight: bold;">Senha do Usuário:</label>
                        <div class="div-password-user">
                            <input type="password" id="contaUserPassword" required disabled autocomplete="off">
                            <span id="visibility_password" class="material-symbols-outlined visibility-password">visibility_off</span>
                        </div>
                        <label style="font-weight: bold;">Tipo de Usuário:</label>
                        <input type="text" id="contaUserTU" required disabled autocomplete="off"> 
                        <br>
                        <button id="btnEditarPerfil" class="btnEditarPerfil" type="submit" disabled>Editar Perfil</button>
                        </form>
                    </div>
                </div>`;
    }
    else if (element === 'Visual') {
        return `<div id="menu_config_visual">
                    <h3>Tema:</h3>
                    <div class="config_visual_buttons">
                        <button class="alterarTema" id="visual_normal" data-tema="0">Normal</button> 
                        <button class="alterarTema" id="visual_dark" data-tema="1">Dark</button> 
                    </div>
                </div>
            `;    
    }
    // <button class="alterarTema" id="visual_light" data-tema="Light">Light</button>    
    else if (element === 'Funcionamento') {
        return `<div id="menu_config_funcionamento">
                    <h3>Quais dias da semana funciona, e quais horários de cada dia?</h3>
                    <div class="div_config_funcionamento">
                        <div class="config_funcionamento_dias">
                            <input type="checkbox" id="domingo" data-value="dom" name="dia-domingo"></input>
                            <label for="dia-domingo">Domingo</label>
                        </div>
                        <div class="config_funcionamento_dias">
                            <input type="checkbox" id="segunda-feira" data-value="seg" name="dia-segunda-feira"></input>
                            <label for="dia-segunda-feira">Segunda-feira</label>
                        </div>
                        <div class="config_funcionamento_dias">
                            <input type="checkbox" id="terca-feira" data-value="ter" name="dia-terca-feira"></input>
                            <label for="dia-terca-feira">Terça-feira</label>
                        </div>
                        <div class="config_funcionamento_dias">
                            <input type="checkbox" id="quarta-feira" data-value="quar" name="dia-quarta-feira"></input>
                            <label for="dia-quarta-feira">Quarta-feira</label>
                        </div>
                        <div class="config_funcionamento_dias">
                            <input type="checkbox" id="quinta-feira" data-value="quin" name="dia-quinta-feira"></input>
                            <label for="dia-quinta-feira">Quinta-feira</label>
                        </div>
                        <div class="config_funcionamento_dias">
                            <input type="checkbox" id="sexta-feira" data-value="sex" name="dia-sexta-feira"></input>
                            <label for="dia-sexta-feira">Sexta-feira</label>
                        </div>
                        <div class="config_funcionamento_dias">
                            <input type="checkbox" id="sabado" data-value="sab" name="dia-sabado"></input>
                            <label for="dia-sabado">Sábado</label>
                        </div>
                    </div>
                    <br>
                    <button type="button" class="btn_alterar" id="btn_alterar">Alterar</button>
                </div>`;
    }
    else if (element === 'Exportações de Arquivos') {
        return `<div class="div_config_exports"> 
                    <h3>Escolha para qual tipo de aquivo irá exportar seus dados:</h3>
                    <div>
                        <select id="select_export" class="selectTipo">
                            <option value="0">PDF - (.pdf)</option>
                            <option value="1">Excel - (.xlsx)</option>
                        </select>
                        <button class="btn_salvar" id="btn_salvar">Salvar</button>
                    </div>
                </div>`;
    };
};

var travaExportacao = false;
document.addEventListener("DOMContentLoaded", function () {
    var temaAtual = localStorage.getItem("dark-light") === "0" ? "0" : "1";
    aplicarTema(temaAtual);

    var exportacaoAtual = localStorage.getItem("Exportacao") || 0;
    localStorage.setItem('Exportacao', exportacaoAtual)
    document.addEventListener("click", function (event) {
        // Visual
        if (event.target.classList.contains("alterarTema")) {
            temaAtual = event.target.getAttribute("data-tema");
            localStorage.setItem("dark-light", temaAtual);

            aplicarTemaBotoes(temaAtual);
            aplicarTema(temaAtual);
        };
        // Exportações
        if (document.querySelector("#select_export")) {
            let select = document.querySelector("#select_export")
            let exportacaoSelecionada = localStorage.getItem('Exportacao');
            if (!travaExportacao) {
                select.value = exportacaoSelecionada
            }
        };
        if (event.target.classList.contains("btn_salvar")) {
            alterarFormatoExportacao();
        }
    });
    let observer = new MutationObserver(() => {
        // Visual 
        if (document.querySelectorAll(".alterarTema")) {
            aplicarTemaBotoes(temaAtual);
        }

        // Exportacoes de arquivo
        if (document.querySelector("#select_export")) {
            let select = document.querySelector("#select_export")
            let exportacaoSelecionada = localStorage.getItem('Exportacao');
            document.querySelector("#select_export").addEventListener("change", function (event) {
                travaExportacao = true;
            })
            if (!travaExportacao) {
                select.value = exportacaoSelecionada
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
});
function aplicarTemaBotoes(event) {
    let botoesVisual = document.querySelectorAll(".alterarTema")
    if (botoesVisual) {
        botoesVisual.forEach(function (item) {
            item.style.backgroundColor = "#000";
            if (item.getAttribute('data-tema') === event) {
                switch (event) {
                    case "0":
                        item.style.backgroundColor = "var(--cores-normal_corLogo)";
                        break;
                    case "1":
                        item.style.backgroundColor = "var(--cores-dark_corLogo)";
                        break;
                    // case "Light":
                    //     item.style.backgroundColor = "var(--cores-light_corLogo)";
                    //     break;
                }
            }
        })
    }
}

function aplicarTema(tema) {
    switch (tema) {
        case "0":
            document.documentElement.style.setProperty("--cores-utilizavel_corLogo", "var(--cores-normal_corLogo)");
            document.documentElement.style.setProperty("--cores-utilizavel_corLogo1", "var(--cores-normal_corLogo1)");
            document.documentElement.style.setProperty("--cores-utilizavel_corLogo2", "var(--cores-normal_corLogo2)");
            document.documentElement.style.setProperty("--cores-utilizavel_corLogo3", "var(--cores-normal_corLogo3)");

            document.documentElement.style.setProperty("--cores-utilizavel_menu", "var(--cores-normal_menu)"); //bom
            document.documentElement.style.setProperty("--cores-utilizavel_background", "var(--cores-normal_background)"); //bom
            document.documentElement.style.setProperty("--cores-utilizavel_background1", "var(--cores-normal_background1)");
            document.documentElement.style.setProperty("--cores-utilizavel_background2", "var(--cores-normal_background2)");

            document.documentElement.style.setProperty("--cores-utilizavel_fonte", "var(--cores-normal_fonte)");
            document.documentElement.style.setProperty("--cores-utilizavel_fonte1", "var(--cores-normal_fonte1)");
            document.documentElement.style.setProperty("--cores-utilizavel_fonte2", "var(--cores-normal_fonte2)");

            document.documentElement.style.setProperty("--cores-utilizavel_hover", "var(--cores-normal_hover)");
            document.documentElement.style.setProperty("--cores-utilizavel_hover1", "var(--cores-normal_hover1)");


            //Organizados por elemento:
            //   Inputs:
            document.documentElement.style.setProperty("--cores-utilizavel_inputs", "var(--cores-padrao_inputs)"); //Background
            document.documentElement.style.setProperty("--cores-utilizavel_inputs_fonte", "var(--cores-padrao_inputs_fonte)"); //Fonte
            document.documentElement.style.setProperty("--cores-utilizavel_inputs_focus", "var(--cores-padrao_inputs_focus)"); //Focus/Box-shadow 
            document.documentElement.style.setProperty("--cores-utilizavel_inputs_placeholder", "var(--cores-padrao_inputs_placeholder)"); // Placeholder
            document.documentElement.style.setProperty("--cores-utilizavel_inputs_border", "var(--cores-padrao_inputs_border)"); //Borda

            //   Buttons: 
            document.documentElement.style.setProperty("--cores-utilizavel_buttons", "var(--cores-padrao_buttons)"); //Background
            document.documentElement.style.setProperty("--cores-utilizavel_buttons_fonte", "var(--cores-padrao_buttons_fonte)"); //Fonte
            document.documentElement.style.setProperty("--cores-utilizavel_buttons_hover_background", "var(--cores-padrao_buttons_hover_background)"); //Hover-Background
            document.documentElement.style.setProperty("--cores-utilizavel_buttons_hover_color", "var(--cores-padrao_buttons_hover_color)"); //Hover-Color 
            document.documentElement.style.setProperty("--cores-utilizavel_buttons_border", "var(--cores-padrao_buttons_border)"); //Borda
            document.documentElement.style.setProperty("--cores-utilizavel_buttons_opacity", "var(--cores-padrao_buttons_opacity)"); //Opacity
            
            //   Select:
            document.documentElement.style.setProperty("--cores-utilizavel_select", "var(--cores-padrao_select)"); //Background
            document.documentElement.style.setProperty("--cores-utilizavel_select_fonte", "var(--cores-padrao_select_fonte)"); //Fonte
            document.documentElement.style.setProperty("--cores-utilizavel_select_selected_background", "var(--cores-padrao_select_selected_background)"); //Selected Background
            document.documentElement.style.setProperty("--cores-utilizavel_select_selcted_fonte", "var(--cores-padrao_select_selected_fonte)"); //Selected Fonte

            break;
        case "1":
            document.documentElement.style.setProperty("--cores-utilizavel_corLogo", "var(--cores-dark_corLogo)");
            document.documentElement.style.setProperty("--cores-utilizavel_corLogo1", "var(--cores-dark_corLogo1)");
            document.documentElement.style.setProperty("--cores-utilizavel_corLogo2", "var(--cores-dark_corLogo2)");
            document.documentElement.style.setProperty("--cores-utilizavel_corLogo3", "var(--cores-dark_corLogo3)");

            document.documentElement.style.setProperty("--cores-utilizavel_menu", "var(--cores-dark_menu)");
            document.documentElement.style.setProperty("--cores-utilizavel_background", "var(--cores-dark_background)");
            document.documentElement.style.setProperty("--cores-utilizavel_background1", "var(--cores-dark_background1)");
            document.documentElement.style.setProperty("--cores-utilizavel_background2", "var(--cores-dark_background2)");

            document.documentElement.style.setProperty("--cores-utilizavel_fonte", "var(--cores-dark_fonte)");
            document.documentElement.style.setProperty("--cores-utilizavel_fonte1", "var(--cores-dark_fonte1)");
            document.documentElement.style.setProperty("--cores-utilizavel_fonte2", "var(--cores-dark_fonte2)");

            document.documentElement.style.setProperty("--cores-utilizavel_hover", "var(--cores-dark_hover)");
            document.documentElement.style.setProperty("--cores-utilizavel_hover1", "var(--cores-dark_hover1)");
            
            
            //   Buttons: 
            document.documentElement.style.setProperty("--cores-utilizavel_buttons", "var(--cores-dark_buttons)"); //Background
            document.documentElement.style.setProperty("--cores-utilizavel_buttons_fonte", "var(--cores-dark_buttons_fonte)"); //Fonte
            document.documentElement.style.setProperty("--cores-utilizavel_buttons_hover_background", "var(--cores-dark_buttons_hover_background)"); //Hover-Background
            document.documentElement.style.setProperty("--cores-utilizavel_buttons_hover_color", "var(--cores-dark_buttons_hover_color)"); //Hover-Color 
            document.documentElement.style.setProperty("--cores-utilizavel_buttons_border", "var(--cores-dark_buttons_border)"); //Borda
            document.documentElement.style.setProperty("--cores-utilizavel_buttons_opacity", "var(--cores-dark_buttons_opacity)"); //Opacity
            
            // Organizados por elemento:
            //   Inputs:
            document.documentElement.style.setProperty("--cores-utilizavel_inputs", "var(--cores-dark_inputs)"); // Background
            document.documentElement.style.setProperty("--cores-utilizavel_inputs_fonte", "var(--cores-dark_inputs_fonte)"); //Fonte
            document.documentElement.style.setProperty("--cores-utilizavel_inputs_focus", "var(--cores-dark_inputs_focus)"); //Focus/Box-shadow 
            document.documentElement.style.setProperty("--cores-utilizavel_inputs_placeholder", "var(--cores-dark_inputs_placeholder)"); // Placeholder
            document.documentElement.style.setProperty("--cores-utilizavel_inputs_border", "var(--cores-dark_inputs_border)"); //Borda

            //   Select:
            document.documentElement.style.setProperty("--cores-utilizavel_select", "var(--cores-dark_select)"); //Background
            document.documentElement.style.setProperty("--cores-utilizavel_select_fonte", "var(--cores-dark_select_fonte)"); //Fonte
            document.documentElement.style.setProperty("--cores-utilizavel_select_selected_background", "var(--cores-dark_select_selected_background)"); //Selected Background
            document.documentElement.style.setProperty("--cores-utilizavel_select_selcted_fonte", "var(--cores-dark_select_selected_fonte)"); //Selected Fonte
            break;
        // case "Light":
        //     document.documentElement.style.setProperty("--cores-utilizavel_corLogo", "var(--cores-light_corLogo)");
        //     document.documentElement.style.setProperty("--cores-utilizavel_corLogo1", "var(--cores-light_corLogo1)");
        //     document.documentElement.style.setProperty("--cores-utilizavel_corLogo2", "var(--cores-light_corLogo2)");
        //     document.documentElement.style.setProperty("--cores-utilizavel_corLogo3", "var(--cores-light_corLogo3)");

        //     document.documentElement.style.setProperty("--cores-utilizavel_menu", "var(--cores-light_menu)");
        //     document.documentElement.style.setProperty("--cores-utilizavel_background", "var(--cores-light_background)");
        //     document.documentElement.style.setProperty("--cores-utilizavel_background1", "var(--cores-light_background1)");
        //     document.documentElement.style.setProperty("--cores-utilizavel_background2", "var(--cores-light_background2)");

        //     document.documentElement.style.setProperty("--cores-utilizavel_fonte", "var(--cores-light_fonte)");
        //     document.documentElement.style.setProperty("--cores-utilizavel_fonte1", "var(--cores-light_fonte1)");
        //     document.documentElement.style.setProperty("--cores-utilizavel_fonte2", "var(--cores-light_fonte2)");

        //     document.documentElement.style.setProperty("--cores-utilizavel_hover", "var(--cores-light_hover)");
        //     document.documentElement.style.setProperty("--cores-utilizavel_hover1", "var(--cores-light_hover1)");
        //     break;
        default:
            console.error("Tema não encontrado");
    }
}

function alterarFormatoExportacao() {
    var formatoEscolhido = $('#select_export :selected').val();
    localStorage.setItem('Exportacao', formatoEscolhido)
    Swal.fire({
        title: "Alterado com sucesso!",
        icon: "success"
    });
    travaExportacao = false;
}