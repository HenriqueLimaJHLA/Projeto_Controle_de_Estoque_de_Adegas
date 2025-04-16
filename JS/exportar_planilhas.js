// Imagem Logo - Requisição GET
var ImgAdegaMoreiras;
var requestImgLogo = new XMLHttpRequest();
requestImgLogo.open("GET", "./../media/logo.json");
requestImgLogo.responseType = "text";
requestImgLogo.send();

// Pegar Imagem através do JSON (base 64 image)
requestImgLogo.onload = function () {
  let requestImgLogoText = requestImgLogo.response;
  let requestImgLogoTextJson = JSON.parse(requestImgLogoText);
  let ImgFinal = requestImgLogoTextJson.logo.source;
  ImgAdegaMoreiras = ImgFinal;
}

document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("click", function (event) {
    if (document.getElementById("btn-exportar-planilha")) {
      document.querySelector(".btn-exportar-planilha").addEventListener('click', function (e) {
        var tipo = e.currentTarget.getAttribute('data-tipo');
        ExportarPlanilha(tipo);
      })
    }
    // Função para fechar os modais 
    if (document.getElementById('close_pop_up_exportar')) {
      document.getElementById('close_pop_up_exportar').addEventListener('click', (e) => {
        document.getElementById('ContainerExportarPlanilha').innerHTML = '';
        document.body.style.overflow = "auto";
      })
        ;
    }
  })
})

// Função para exposrtar relatórios
function ExportarPlanilha(tipo) {
  const ContainerExportarPlanilha = document.getElementById('ContainerExportarPlanilha');
  var TipoArquivo = localStorage.getItem('Exportacao'); 

  if (!TipoArquivo) {
    TipoArquivo = 0;
  }

  ContainerExportarPlanilha.innerHTML = '';

  if (tipo === 'entrada') {
    ContainerExportarPlanilha.innerHTML += `    
        <div class="modal-pop-up-planilha" style="display: flex;">
              <form method="POST" id="FormEntradaExportarPlanilha">
              <div class="modal">
                 <span class="material-symbols-outlined" id="close_pop_up_exportar">
                    close
                </span> 
                <h2>Exportar Relatório | Entradas</h2>
              <select class="selectTipo" id="SelectPeriodoEntrada" required>
                <option value="">Selecione um Período</option>
                <option value="0">Dia Atual</option>
                <option value="1">Semana</option>
                <option value="2">Mês</option>
                <option value="3">2 Meses</option>
              </select> 
              <br><br>
              <h3>Filtros</h3>
              <div class="inputs-checkbox">
              <div>
                <input type="checkbox" class="checkbox-pop-up-entrada" data-array="Especificação" value="ep.especificacao"><label for="">Especificação</label>
              </div>
              <div>
                <input type="checkbox" class="checkbox-pop-up-entrada" data-array="Marca" value="ep.marca"><label for="">Marca</label>
              </div>
              <div>
                <input type="checkbox" class="checkbox-pop-up-entrada" data-array="Valor Unidade" value="ep.valor_unidade"><label for="">Valor Unidade</label>
              </div>
              <div>
                <input type="checkbox" class="checkbox-pop-up-entrada" data-array="Quantidade" value="ep.quantidade"><label for="">Quantidade</label>
              </div>
              <div>
                <input type="checkbox" class="checkbox-pop-up-entrada" data-array="Valor T. Entrada" value="ep.valor_total_entrada"><label for="">Valor T. Entrada</label>
              </div>
              <div>
                <input type="checkbox" class="checkbox-pop-up-entrada" data-array="Nome Usuário" value="u.nome_usuario"><label for="">Usuário</label>
              </div>
              <div>
                <input type="checkbox" class="checkbox-pop-up-entrada" data-array="Data da Entrada" value="ep.data_entrada"><label for="">Data da Entrada</label>
              </div>
              <br><br>
            </div>
            <br><br>
            <button type="submit">Gerar Relatório</button>
          </form>
        </div>
      </div>
        `;
    document.body.style.overflow = "hidden";

    let selectPeriodoEntradas = document.getElementById('SelectPeriodoEntrada');
    let valorSelecionado;
    let FiltrosEntradas = [];
    let ArrayHeadersTableEntradas = ['ID', 'Produto'];

    const FormEntradaExportarPlanilha = document.getElementById('FormEntradaExportarPlanilha');

    if (FormEntradaExportarPlanilha) {
      FormEntradaExportarPlanilha.addEventListener('submit', (envioentrada) => {
        envioentrada.preventDefault();

        if (!FiltrosEntradas.length) {
          Swal.fire({
            title: "Erro: Seleção de Filtros | Entradas",
            text: "Nenhum Filtro selecionado! É necessário ao menos um para fazer download de sua planilha da Tabela de Entradas!",
            icon: "error",
          });
        }
        else {
          const dados = {
            FiltrosEntradasArray: FiltrosEntradas,
            PeriodoEntradas: valorSelecionado
          }

          $.ajax({
            url: "./functions/relatorioEntradas.php",
            method: "POST",
            data: dados,
            dataType: "json",
            success: function (data) {
              // Pegar Data Atual
              const DataCurrent = new Date();
              var dia = DataCurrent.getDate().toString().padStart(2, '0');
              var mes = (DataCurrent.getMonth() + 1).toString().padStart(2, '0');
              var ano = DataCurrent.getFullYear();

              var horas = DataCurrent.getHours().toString().padStart(2, '0');
              var minutos = DataCurrent.getMinutes().toString().padStart(2, '0');
              var segundos = DataCurrent.getSeconds().toString().padStart(2, '0');

              // Datas 
              let diaAtual = dia;
              let mesAtual = mes;
              let anoAtual = ano;

              // Datas Importantes 
              const DataCompleta = `${dia}/${mes}/${ano} - ${horas}:${minutos}:${segundos}`;
              const DataRelatorio = `${dia}/${mes}/${ano}`;
              var DataPeriodo;

              if(TipoArquivo == 0){
                    // Função de Gerar PDF - 0 - Entradas
              function gerarEntradasPDF() {
                const pdfSaida = new jsPDF({
                  format: 'a4',
                  orientation: 'portrait',
                  unit: 'mm'
                });

                // Th da Tabela do PDF 
                var i = 0
                var headersOrdem = ['ID', 'Produto', 'Especificação', 'Marca', 'Valor Unidade', 'Quantidade', 'Valor T. Entrada', 'Nome Usuário', 'Data da Entrada'];

                // Colocar na Ordem Correta, verificando se está incluso
                headersOrdem.forEach(function (e) {
                  if (!headersOrdem.includes(ArrayHeadersTableEntradas[i])) {
                    headersOrdem = headersOrdem.filter(item_attribute => ArrayHeadersTableEntradas.includes(item_attribute));
                  }
                  i++
                });

                var campos = {
                  'ID': 'id_entrada',
                  'Produto': 'produto',
                  'Especificação': 'especificacao',
                  'Marca': 'marca',
                  'Valor Unidade': 'valor_unidade',
                  'Quantidade': 'quantidade',
                  'Valor T. Entrada': 'valor_total_entrada',
                  'Nome Usuário': 'nome_usuario',
                  'Data da Entrada': 'data_entrada'
                };

                const headersTh = headersOrdem;

                // Cabeçalho do Relatório - Imagem e Título
                pdfSaida.addImage(ImgAdegaMoreiras, 'JPEG', 5, 3, 20, 20);
                pdfSaida.text(`Relatório de Entradas de Produtos | Adega Moreira's`, 45, 20);
                pdfSaida.line(11, 25, 200, 25);

                // Período Seção
                if (valorSelecionado == 0) {
                  DataPeriodo = `${diaAtual}/${mesAtual}/${anoAtual}`;
                } else if (valorSelecionado == 1) {
                  diaAtual -= 7;
                  if (diaAtual < 1) {
                    mesAtual -= 1;
                    if (mesAtual < 1) {
                      mesAtual = 12;
                      anoAtual -= 1;
                    }
                    diaAtual = new Date(anoAtual, mesAtual, diaAtual).getDate();
                  }
                  DataPeriodo = `${diaAtual}/0${mesAtual}/${anoAtual}`;
                } else if (valorSelecionado == 2) {
                  mesAtual -= 1;
                  if (mesAtual < 1) {
                    mesAtual = 12;
                    anoAtual -= 1;
                  }
                  DataPeriodo = `${diaAtual}/0${mesAtual}/${anoAtual}`;
                } else if (valorSelecionado == 3) {
                  mesAtual -= 2;
                  if (mesAtual < 1) {
                    mesAtual = 12 - (2 - mesAtual);
                    anoAtual -= 1;
                  }
                  DataPeriodo = `${diaAtual}/0${mesAtual}/${anoAtual}`;
                }

                // Texto do Período Exportado
                pdfSaida.setFontSize(12);
                pdfSaida.text(`Período Exportado: ${DataPeriodo} - ${DataRelatorio}`, 60, 32);

                // Função para verificar se o data está sem registros
                function verifyData(data) {
                  if (data.mensagem === "sem registro") {
                    return [[{ content: "Não foram encontrados registros de entradas de produtos para os filtros e/ou período selecionados!", colSpan: headersOrdem.length, styles: { halign: 'center' } }]];
                  }
                  else {
                    return data.map((item) => {
                      return headersOrdem.map((header) => {
                        if (campos[header] === 'valor_unidade') {
                          return 'R$ ' + item[campos[header]] + '.00';
                        } else if (campos[header] === 'valor_total_entrada') {
                          return 'R$ ' + item[campos[header]] * (-1) + '.00';
                        } else if (campos[header] === 'quantidade') {
                          return item[campos[header]] + ' unidade(s)';
                        } else {
                          return item[campos[header]];

                        }
                      });
                    })
                  }
                };
          
                const tableData = verifyData(data);

                if (tableData.length === 1) {
                  pdfSaida.autoTable({
                    head: [headersTh],
                    styles: { halign: 'center' },
                    headStyles: {
                      fillColor: [0, 0, 0],
                      textColor: [255, 255, 255]
                    },
                    body: tableData,
                    startY: 35
                  });
                }
                else {
                  pdfSaida.autoTable({
                    head: [headersTh],
                    styles: { halign: 'center' },
                    headStyles: {
                      fillColor: [0, 0, 0],
                      textColor: [255, 255, 255]
                    },
                    body: tableData,
                    startY: 35
                  });
                }

                // Rodapé do Relatório - PDF
                pdfSaida.line(11, 300, 200, 300);
                pdfSaida.setFontSize(12);
                pdfSaida.text(`Relatório Solicitado em: ${DataCompleta}`, 110, 290);
                pdfSaida.text(`Sistema de Controle Adega Moreira's`, 10, 280);
                pdfSaida.text(`LPITech, São Paulo - SP`, 10, 290);

                pdfSaida.save(`Relatório Entrada de Produtos - Adega Moreira's - ${dia}.${mes}.${ano}.pdf`);

              };
              // Gerar PDF FINAL
              ContainerExportarPlanilha.innerHTML = '';
              document.body.style.overflow = "auto";
              gerarEntradasPDF();
              } else {
                console.log('excel', TipoArquivo);
                const ExcelJS = require('exceljs');

                // Crie um novo arquivo Excel
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Relatório');
                
                // Adicione dados ao arquivo Excel
                worksheet.addRow(['ID', 'Produto', 'Especificação', 'Marca', 'Quantidade', 'Valor Ult. Entrada', 'Valor Ult. Saída', 'Valor T. Estoque']);
                worksheet.addRow([1, 'Produto 1', 'Especificação 1', 'Marca 1', 10, 100, 50, 500]);
                worksheet.addRow([2, 'Produto 2', 'Especificação 2', 'Marca 2', 20, 200, 100, 1000]);
                
                // Salve o arquivo Excel
                workbook.xlsx.writeBuffer().then((buffer) => {
                  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'relatorio.xlsx';
                  a.click();
                });
              }
          
            },
            error(xhr, responseText) {
              console.log(xhr.responseText)
            }
          });
        }
      });
    };

    document.querySelectorAll('.checkbox-pop-up-entrada').forEach((checkentrada) => {
      checkentrada.addEventListener('click', (event) => {
        const checkBoxClicked = event.target;
        const value = checkBoxClicked.value;
        let AtributoHeadersEntradas = checkBoxClicked.getAttribute('data-array');

        if (checkBoxClicked.checked) {
          if (!FiltrosEntradas.includes(value)) {
            FiltrosEntradas.push(value);
            ArrayHeadersTableEntradas.push(AtributoHeadersEntradas);
          }
        } else {
          FiltrosEntradas = FiltrosEntradas.filter(item => item !== value);
          ArrayHeadersTableEntradas = ArrayHeadersTableEntradas.filter(item_attribute => item_attribute !== AtributoHeadersEntradas);
        }
      });
    });

    selectPeriodoEntradas.addEventListener('change', (selecao) => {
      valorSelecionado = selecao.currentTarget.value;
    });

  }
  else if (tipo === 'saida') {
    ContainerExportarPlanilha.innerHTML += `    
        <div class="modal-pop-up-planilha" style="display: flex;">
              <form method="POST" id="FormSaidaExportarPlanilha">
              <div class="modal">
               <span class="material-symbols-outlined" id="close_pop_up_exportar">
                    close
                </span>
                <h2>Exportar Relatório | Saídas</h2>
              <select class="selectTipo" id="SelectPeriodoSaida" required>
                <option value="">Selecione um Período</option>
                <option value="0">Dia Atual</option>
                <option value="1">Semana</option>
                <option value="2">Mês</option>
                <option value="3">2 Meses</option>
              </select> 
              <br><br>
              <h3>Filtros</h3>
              <div class="inputs-checkbox">
              <div>
                <input type="checkbox" class="checkbox-pop-up-saida" data-array="Especificação" value="sp.especificacao"><label for="">Especificação</label>
              </div>
              <div>
                <input type="checkbox" class="checkbox-pop-up-saida" data-array="Marca" value="sp.marca"><label for="">Marca</label>
              </div>
              <div>
                <input type="checkbox" class="checkbox-pop-up-saida" data-array="Valor Unidade" value="sp.valor_unidade"><label for="">Valor Unidade</label>
              </div>
              <div>
                <input type="checkbox" class="checkbox-pop-up-saida" data-array="Quantidade" value="sp.quantidade"><label for="">Quantidade</label>
              </div>
              <div>
                <input type="checkbox" class="checkbox-pop-up-saida" data-array="Valor T. Saída" value="sp.valor_total_saida"><label for="">Valor T. Saída</label>
              </div>
              <div>
                <input type="checkbox" class="checkbox-pop-up-saida" data-array="Nome Usuário" value="u.nome_usuario"><label for="">Usuário</label>
              </div>
              <div>
                <input type="checkbox" class="checkbox-pop-up-saida" data-array="Data da Saída" value="sp.data_saida"><label for="">Data da Saída</label>
              </div>
              <br><br>
            </div>
            <br><br>
            <button type="submit">Gerar Relatório</button>
          </form>
        </div>
      </div>
        `;
    document.body.style.overflow = "hidden";
    let selectPeriodoSaidas = document.getElementById('SelectPeriodoSaida');
    let valorSelecionado;
    let FiltrosSaidas = [];
    let ArrayHeadersTableSaidas = ['ID', 'Produto'];

    const FormSaidaExportarPlanilha = document.getElementById('FormSaidaExportarPlanilha');
    if (FormSaidaExportarPlanilha) {
      FormSaidaExportarPlanilha.addEventListener('submit', (enviosaida) => {
        enviosaida.preventDefault();

        if (!FiltrosSaidas.length) {
          Swal.fire({
            title: "Erro: Seleção de Filtros | Saídas",
            text: "Nenhum Filtro selecionado! É necessário ao menos um para fazer download de sua planilha da Tabela de Saídas!",
            icon: "error",
          });
        }
        else {
          const dados = {
            FiltrosSaidasArray: FiltrosSaidas,
            PeriodoSaidas: valorSelecionado
          }
          $.ajax({
            url: "../paginas/functions/relatorioSaidas.php",
            method: "POST",
            data: dados,
            dataType: "json",
            success: function (data) {
              // Pegar Data Atual
              const DataCurrent = new Date();
              var dia = DataCurrent.getDate().toString().padStart(2, '0');
              var mes = (DataCurrent.getMonth() + 1).toString().padStart(2, '0');
              var ano = DataCurrent.getFullYear();

              var horas = DataCurrent.getHours().toString().padStart(2, '0');
              var minutos = DataCurrent.getMinutes().toString().padStart(2, '0');
              var segundos = DataCurrent.getSeconds().toString().padStart(2, '0');

              // Datas 
              let diaAtual = dia;
              let mesAtual = mes;
              let anoAtual = ano;

              // Datas Importantes 
              const DataCompleta = `${dia}/${mes}/${ano} - ${horas}:${minutos}:${segundos}`;
              const DataRelatorio = `${dia}/${mes}/${ano}`;
              var DataPeriodo;

              // Tipo do Arquivo
              if (TipoArquivo == 0) {
                // Função de Gerar PDF - 0 - Saídas  
                function gerarSaidasPDF() {
                  const pdfSaida = new jsPDF({
                    format: 'a4',
                    orientation: 'portrait',
                    unit: 'mm'
                  });

                  // Th da Tabela do PDF 
                  var i = 0
                  var headersOrdem = ['ID', 'Produto', 'Especificação', 'Marca', 'Valor Unidade', 'Quantidade', 'Valor T. Saída', 'Nome Usuário', 'Data da Saída'];

                  // Colocar na Ordem Correta, verificando se está incluso
                  headersOrdem.forEach(function (e) {
                    if (!headersOrdem.includes(ArrayHeadersTableSaidas[i])) {
                      headersOrdem = headersOrdem.filter(item_attribute => ArrayHeadersTableSaidas.includes(item_attribute));
                    }
                    i++
                  });

                  var campos = {
                    'ID': 'id_saida',
                    'Produto': 'produto',
                    'Especificação': 'especificacao',
                    'Marca': 'marca',
                    'Valor Unidade': 'valor_unidade',
                    'Quantidade': 'quantidade',
                    'Valor T. Saída': 'valor_total_saida',
                    'Nome Usuário': 'nome_usuario',
                    'Data da Saída': 'data_saida'
                  };

                  const headersTh = headersOrdem;

                  // Cabeçalho do Relatório - Imagem e Título
                  pdfSaida.addImage(ImgAdegaMoreiras, 'JPEG', 5, 3, 20, 20);
                  pdfSaida.text(`Relatório de Saídas de Produtos | Adega Moreira's`, 45, 20);
                  pdfSaida.line(11, 25, 200, 25);

                  // Período Seção
                  if (valorSelecionado == 0) {
                    DataPeriodo = `${diaAtual}/${mesAtual}/${anoAtual}`;
                  } else if (valorSelecionado == 1) {
                    diaAtual -= 7;
                    if (diaAtual < 1) {
                      mesAtual -= 1;
                      if (mesAtual < 1) {
                        mesAtual = 12;
                        anoAtual -= 1;
                      }
                      diaAtual = new Date(anoAtual, mesAtual, diaAtual).getDate();
                    }
                    DataPeriodo = `${diaAtual}/0${mesAtual}/${anoAtual}`;
                  } else if (valorSelecionado == 2) {
                    mesAtual -= 1;
                    if (mesAtual < 1) {
                      mesAtual = 12;
                      anoAtual -= 1;
                    }
                    DataPeriodo = `${diaAtual}/0${mesAtual}/${anoAtual}`;
                  } else if (valorSelecionado == 3) {
                    mesAtual -= 2;
                    if (mesAtual < 1) {
                      mesAtual = 12 - (2 - mesAtual);
                      anoAtual -= 1;
                    }
                    DataPeriodo = `${diaAtual}/0${mesAtual}/${anoAtual}`;
                  }

                  // Texto do Período Exportado
                  pdfSaida.setFontSize(12);
                  pdfSaida.text(`Período Exportado: ${DataPeriodo} - ${DataRelatorio}`, 60, 32);

                  // Função para verificar se o data está sem registros
                  function verifyData(data) {
                    if (data.mensagem === "sem registro") {
                      return [[{ content: "Não foram encontrados registros de saídas de produtos para os filtros e/ou período selecionados!", colSpan: headersOrdem.length, styles: { halign: 'center' } }]];
                    }
                    else {
                      return data.map((item) => {
                        return headersOrdem.map((header) => {
                          if (campos[header] === 'valor_total_saida' || campos[header] === 'valor_unidade' ) {
                            return 'R$ ' + item[campos[header]] + '.00';
                          } else if(campos[header] === 'quantidade'){
                            return item[campos[header]] + ' unidade(s)';
                          } else {
                            return item[campos[header]];
                          }
                        });
                      });
                    }
                  };

                  const tableData = verifyData(data);

                  if (tableData.length === 1) {
                    pdfSaida.autoTable({
                      head: [headersTh],
                      styles: { halign: 'center' },
                      headStyles: {
                        fillColor: [0, 0, 0],
                        textColor: [255, 255, 255]
                      },
                      body: tableData,
                      startY: 35
                    });
                  }
                  else {
                    pdfSaida.autoTable({
                      head: [headersTh],
                      styles: { halign: 'center' },
                      headStyles: {
                        fillColor: [0, 0, 0],
                        textColor: [255, 255, 255]
                      },
                      body: tableData,
                      startY: 35
                    });
                  }

                  // Rodapé do Relatório - PDF
                  pdfSaida.line(11, 300, 200, 300);
                  pdfSaida.setFontSize(12);
                  pdfSaida.text(`Relatório Solicitado em: ${DataCompleta}`, 110, 290);
                  pdfSaida.text(`Sistema de Controle Adega Moreira's`, 10, 280);
                  pdfSaida.text(`LPITech, São Paulo - SP`, 10, 290);

                  pdfSaida.save(`Relatório Saída de Produtos - Adega Moreira's - ${dia}.${mes}.${ano}.pdf`);

                };
                // Gerar PDF FINAL
                ContainerExportarPlanilha.innerHTML = '';
                document.body.style.overflow = "auto";
                gerarSaidasPDF();
              }
              else {
                console.log('excel', TipoArquivo);
                const ExcelJS = require('exceljs');

                // Crie um novo arquivo Excel
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Relatório');
                
                // Adicione dados ao arquivo Excel
                worksheet.addRow(['ID', 'Produto', 'Especificação', 'Marca', 'Quantidade', 'Valor Ult. Entrada', 'Valor Ult. Saída', 'Valor T. Estoque']);
                worksheet.addRow([1, 'Produto 1', 'Especificação 1', 'Marca 1', 10, 100, 50, 500]);
                worksheet.addRow([2, 'Produto 2', 'Especificação 2', 'Marca 2', 20, 200, 100, 1000]);
                
                // Salve o arquivo Excel
                workbook.xlsx.writeBuffer().then((buffer) => {
                  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'relatorio.xlsx';
                  a.click();
                });
              }


            },
            error(xhr, responseText) {
              console.log(xhr.responseText)
            }
          });
        }
      });
    };

    // Selecionar filtros do relatório de Saídas  
    document.querySelectorAll('.checkbox-pop-up-saida').forEach((checksaida) => {
      checksaida.addEventListener('click', (event) => {
        const checkBoxClicked = event.target;
        const value = checkBoxClicked.value;
        let AtributoHeaders = checkBoxClicked.getAttribute('data-array');

        if (checkBoxClicked.checked) {
          if (!FiltrosSaidas.includes(value)) {
            FiltrosSaidas.push(value);
            ArrayHeadersTableSaidas.push(AtributoHeaders);
          }
        } else {
          FiltrosSaidas = FiltrosSaidas.filter(item => item !== value);
          ArrayHeadersTableSaidas = ArrayHeadersTableSaidas.filter(item_attribute => item_attribute !== AtributoHeaders);
        }
      });
    });

    selectPeriodoSaidas.addEventListener('change', (selecao) => {
      valorSelecionado = selecao.currentTarget.value;
    });
  }
  else {
    ContainerExportarPlanilha.innerHTML += `    
          <div class="modal-pop-up-planilha" style="display: flex;">
              <form method="POST" id="FormEstoqueExportarPlanilha">
              <div class="modal">
               <span class="material-symbols-outlined" id="close_pop_up_exportar">
                    close
                </span>
                <h2>Exportar Relatório | Estoque</h2>
              <select class="selectTipo" id="SelectPeriodoEstoque" required>
                <option value="">Selecione um Período</option>
                <option value="0">Dia Atual</option>
                <option value="1">Semana</option>
                <option value="2">Mês</option>
                <option value="3">2 Meses</option>
              </select> 
              <br><br>
              <h3>Filtros</h3>
              <div class="inputs-checkbox">
                <div> 
                  <input type="checkbox" class="checkbox-pop-up-estoque" data-array="Especificação" value="e.especificacao"><label for="">Especificação</label>
                </div>
                <div> 
                  <input type="checkbox" class="checkbox-pop-up-estoque" data-array="Marca" value="e.marca"><label for="">Marca</label>
                </div>
                <div> 
                  <input type="checkbox" class="checkbox-pop-up-estoque" data-array="Quantidade Restante" value="e.quantidade_restante"><label for="">Quantidade</label>
                </div>
                <div> 
                  <input type="checkbox" class="checkbox-pop-up-estoque" data-array="Valor Ult. Entrada" value="e.valor_ultima_entrada"><label for="">Valor Ult. Entrada</label>
                </div>
                <div> 
                  <input type="checkbox" class="checkbox-pop-up-estoque" data-array="Valor Ult. Saída" value="e.valor_ultima_saida"><label for="">Valor Ult. Saída</label>
                </div>
                <div>
                  <input type="checkbox" class="checkbox-pop-up-estoque" data-array="Fluxo do Produto" value="e.valor_total_estoque"><label for="">Fluxo do Produto</label>
                </div>
              </div>
              <br><br>
              <button type="submit">Gerar Relatório</button>
              </form>
              </div>
      </div>
        `;
    document.body.style.overflow = "hidden";
    let SelectPeriodoEstoque = document.getElementById('SelectPeriodoEstoque');
    let valorSelecionado;
    let FiltrosEstoque = [];
    let ArrayHeadersTableEstoque = ['ID', 'Produto'];
    const FormEstoqueExportarPlanilha = document.getElementById('FormEstoqueExportarPlanilha');

    if (FormEstoqueExportarPlanilha) {
      FormEstoqueExportarPlanilha.addEventListener('submit', (envioestoque) => {
        envioestoque.preventDefault();

        if (!FiltrosEstoque.length) {
          Swal.fire({
            title: "Erro: Seleção de Filtros | Estoque",
            text: "Nenhum Filtro selecionado! É necessário ao menos um para fazer download de sua planilha da Tabela de Estoque!",
            icon: "error",
          });

        }
        else {
          const dados = {
            FiltrosEstoqueArray: FiltrosEstoque,
            PeriodoEstoque: valorSelecionado
          }
          // console.log(dados) Ok
          $.ajax({
            url: "./functions/relatorioEstoque.php",
            method: "POST",
            data: dados,
            dataType: "json",
            success: function (data) {
              ContainerExportarPlanilha.innerHTML = '';
              document.body.style.overflow = "auto";
              // console.log(data); OK 

                 // Pegar Data Atual
                 const DataCurrent = new Date();
                 var dia = DataCurrent.getDate().toString().padStart(2, '0');
                 var mes = (DataCurrent.getMonth() + 1).toString().padStart(2, '0');
                 var ano = DataCurrent.getFullYear();
   
                 var horas = DataCurrent.getHours().toString().padStart(2, '0');
                 var minutos = DataCurrent.getMinutes().toString().padStart(2, '0');
                 var segundos = DataCurrent.getSeconds().toString().padStart(2, '0');
   
                 // Datas 
                 let diaAtual = dia;
                 let mesAtual = mes;
                 let anoAtual = ano;
   
                 // Datas Importantes 
                 const DataCompleta = `${dia}/${mes}/${ano} - ${horas}:${minutos}:${segundos}`;
                 const DataRelatorio = `${dia}/${mes}/${ano}`;
                 var DataPeriodo;
   
                 // Tipo do Arquivo
                 if (TipoArquivo == 0) {
                   // Função de Gerar PDF - 0 - Saídas  
                   function gerarSaidasPDF() {
                     const pdfSaida = new jsPDF({
                       format: 'a4',
                       orientation: 'portrait',
                       unit: 'mm'
                     });
   
                     // Th da Tabela do PDF 
                     var i = 0
                     var headersOrdem = ['ID', 'Produto', 'Especificação', 'Marca', 'Quantidade Restante', 'Valor Ult. Entrada', 'Valor Ult. Saída', 'Fluxo do Produto'];
   
                     // Colocar na Ordem Correta, verificando se está incluso
                     headersOrdem.forEach(function (e) {
                       if (!headersOrdem.includes(ArrayHeadersTableEstoque[i])) {
                         headersOrdem = headersOrdem.filter(item_attribute => ArrayHeadersTableEstoque.includes(item_attribute));
                       }
                       i++
                        
                     });
   
                     var campos = {
                       'ID': 'id_produto_estoque',
                       'Produto': 'produto',
                       'Especificação': 'especificacao',
                       'Marca': 'marca',
                       'Quantidade Restante': 'quantidade_restante',
                       'Valor Ult. Entrada': 'valor_ultima_entrada',
                       'Valor Ult. Saída': 'valor_ultima_saida',
                       'Fluxo do Produto': 'valor_total_estoque'
                     };
   
                     const headersTh = headersOrdem;
   
                     // Cabeçalho do Relatório - Imagem e Título
                     pdfSaida.addImage(ImgAdegaMoreiras, 'JPEG', 5, 3, 20, 20);
                     pdfSaida.text(`Relatório de Produtos do Estoque | Adega Moreira's`, 45, 20);
                     pdfSaida.line(11, 25, 200, 25);
   
                     // Período Seção
                     if (valorSelecionado == 0) {
                       DataPeriodo = `${diaAtual}/${mesAtual}/${anoAtual}`;
                     } else if (valorSelecionado == 1) {
                       diaAtual -= 7;
                       if (diaAtual < 1) {
                         mesAtual -= 1;
                         if (mesAtual < 1) {
                           mesAtual = 12;
                           anoAtual -= 1;
                         }
                         diaAtual = new Date(anoAtual, mesAtual, diaAtual).getDate();
                       }
                       DataPeriodo = `${diaAtual}/0${mesAtual}/${anoAtual}`;
                     } else if (valorSelecionado == 2) {
                       mesAtual -= 1;
                       if (mesAtual < 1) {
                         mesAtual = 12;
                         anoAtual -= 1;
                       }
                       DataPeriodo = `${diaAtual}/0${mesAtual}/${anoAtual}`;
                     } else if (valorSelecionado == 3) {
                       mesAtual -= 2;
                       if (mesAtual < 1) {
                         mesAtual = 12 - (2 - mesAtual);
                         anoAtual -= 1;
                       }
                       DataPeriodo = `${diaAtual}/0${mesAtual}/${anoAtual}`;
                     }
   
                     // Texto do Período Exportado
                     pdfSaida.setFontSize(12);
                     pdfSaida.text(`Período Exportado: ${DataPeriodo} - ${DataRelatorio}`, 60, 32);
   
                     // Função para verificar se o data está sem registros
                     function verifyData(data) {
                       if (data.mensagem === "sem registro") {
                         return [[{ content: "Não foram encontrados registros de produtos no estoque para os filtros e/ou período selecionados!", colSpan: headersOrdem.length, styles: { halign: 'center' } }]];
                       }
                       else {
                         return data.map((item) => {
                           return headersOrdem.map((header) => {
                             if (campos[header] === 'valor_ultima_entrada' || campos[header] === 'valor_ultima_saida' || campos[header] === 'valor_total_estoque') {
                               return 'R$ ' + item[campos[header]] + '.00';
                             } else if(campos[header] === 'quantidade_restante'){
                               return item[campos[header]] + ' unidade(s)';
                             } else {
                               return item[campos[header]];
                             }
                           });
                         });
                       }
                     };
   
                     const tableData = verifyData(data);
   
                     if (tableData.length === 1) {
                       pdfSaida.autoTable({
                         head: [headersTh],
                         styles: { halign: 'center' },
                         headStyles: {
                           fillColor: [0, 0, 0],
                           textColor: [255, 255, 255]
                         },
                         body: tableData,
                         startY: 35
                       });
                     }
                     else {
                       pdfSaida.autoTable({
                         head: [headersTh],
                         styles: { halign: 'center' },
                         headStyles: {
                           fillColor: [0, 0, 0],
                           textColor: [255, 255, 255]
                         },
                         body: tableData,
                         startY: 35
                       });
                     }
   
                     // Rodapé do Relatório - PDF
                     pdfSaida.line(11, 300, 200, 300);
                     pdfSaida.setFontSize(12);
                     pdfSaida.text(`Relatório Solicitado em: ${DataCompleta}`, 110, 290);
                     pdfSaida.text(`Sistema de Controle Adega Moreira's`, 10, 280);
                     pdfSaida.text(`LPITech, São Paulo - SP`, 10, 290);
   
                     pdfSaida.save(`Relatório Estoque de Produtos - Adega Moreira's - ${dia}.${mes}.${ano}.pdf`);
   
                   };
                   // Gerar PDF FINAL
                   ContainerExportarPlanilha.innerHTML = '';
                   document.body.style.overflow = "auto";
                   gerarSaidasPDF();
                 }
                 else {
                   console.log('excel', TipoArquivo);

                  // Crie um novo arquivo Excel
                  const workbook = new ExcelJS.Workbook();
                  const worksheet = workbook.addWorksheet('Relatório');

                  // Adicione dados ao arquivo Excel
                  worksheet.columns = [
                    { header: 'Id', key: 'id', width: 10, align: 'center', border: true, fill: { fgColor: { rgb: 'FFC107' } } },
                    { header: 'Produto', key: 'produto', width: 20, align: 'center', border: true, fill: { fgColor: { rgb: 'FFC107' } } },
                    { header: 'Especificação', key: 'especificação', width: 20, outlineLevel: 1, align: 'center', border: true, fill: { fgColor: { rgb: 'FFC107' } } },
                    { header: 'Marca', key: 'marca', width: 10, align: 'center', border: true, fill: { fgColor: { rgb: 'FFC107' } } },
                    { header: 'Quantidade', key: 'quantidade', width: 10, align: 'center', border: true, fill: { fgColor: { rgb: 'FFC107' } } },
                    { header: 'Valor Ult. Entrada', key: 'valorUltEntrada', width: 15, align: 'center', border: true, fill: { fgColor: { rgb: 'FFC107' } } },
                    { header: 'Valor Ult. Saída', key: 'valorUltSaida', width: 15, align: 'center', border: true, fill: { fgColor: { rgb: 'FFC107' } } },
                    { header: 'Valor T. Estoque', key: 'valorTEstoque', width: 15, align: 'center', border: true, fill: { fgColor: { rgb: 'FFC107' } } }
                  ];

                  worksheet.addRow([1, 'Produto 1', 'Especificação 1', 'Marca 1', 10, 100, 50, 500]);
                  worksheet.addRow([2, 'Produto 2', 'Especificação 2', 'Marca 2', 20, 200, 100, 1000]);

                  // Adicione filtro às colunas
                  worksheet.autoFilter = {
                    from: 'A1',
                    to: 'H2',
                    filters: [
                      { column: 1, criteria: 'contains', value: 'Produto' },
                      { column: 2, criteria: 'contains', value: 'Especificação' },
                      { column: 3, criteria: 'contains', value: 'Marca' },
                      { column: 4, criteria: 'contains', value: 'Quantidade' },
                      { column: 5, criteria: 'contains', value: 'Valor Ult. Entrada' },
                      { column: 6, criteria: 'contains', value: 'Valor Ult. Saída' },
                      { column: 7, criteria: 'contains', value: 'Valor T. Estoque' }
                    ]
                  };

                  // Salve o arquivo Excel
                  workbook.xlsx.writeBuffer().then((buffer) => {
                    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'Relatório Estoque.xlsx';
                    a.click();
                  });   
                 }
            },
            error(xhr, responseText) {
              console.log(xhr.responseText)
            }
          });
        }
      });
    };

    // Selecionar Filtros - Estoque 
    document.querySelectorAll('.checkbox-pop-up-estoque').forEach((checkestoque) => {
      checkestoque.addEventListener('click', (event) => {
        const checkBoxClicked = event.target;
        const value = checkBoxClicked.value;
        let AtributoHeadersEstoque = checkBoxClicked.getAttribute('data-array');

        if (checkBoxClicked.checked) {
          if (!FiltrosEstoque.includes(value)) {
            FiltrosEstoque.push(value);
            ArrayHeadersTableEstoque.push(AtributoHeadersEstoque);
          }
        } else {
          FiltrosEstoque = FiltrosEstoque.filter(item => item !== value);
          ArrayHeadersTableEstoque = ArrayHeadersTableEstoque.filter(item_attribute => item_attribute !== AtributoHeadersEstoque);
        }
      });
    });

    // Período Selecionado - Estoque 
    SelectPeriodoEstoque.addEventListener('change', (selecao) => {
      valorSelecionado = selecao.currentTarget.value;
    });

  }
};


