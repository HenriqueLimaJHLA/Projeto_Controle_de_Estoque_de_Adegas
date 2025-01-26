let entries = [];
let valorc = [];
let valorv = [];
let exits = [];
let stock = {}; 

function addEntry() {
  const product = document.getElementById("product").value;
  const especification = document.getElementById("grama_litro").value;
  let value = parseFloat(document.getElementById("value").value)
  //Valor de compra do produto
  if (!valorc[product]) {
    valorc[product] = 0;
  }
  valorc[product] = value;


  value = value.toFixed(2);
  const quantity = parseInt(document.getElementById("quantity").value);

  if (product && value && quantity) {
    const newEntry = { id: entries.length + 1, product, especification, value, quantity };
    entries.push(newEntry);

    //Quantidade no estoque
    if (!stock[product]) {
      stock[product] = 0;
    }
    stock[product] += quantity;

    updateTables();
  }
}

function addExit() {
  const product = document.getElementById("product").value;
  const especification = document.getElementById("grama_litro").value;
  const quantity = parseInt(document.getElementById("quantity").value);
  
  //Se existe no estoque
  if (stock[product] !== undefined) {

    //Quantidade no estoque
    if (stock[product] >= quantity) {
      stock[product] -= quantity;

      let value = parseFloat(document.getElementById("value").value)
      //Valor de venda do produto
      valorv[product] = value;
      
      value = value.toFixed(2);
      const newExit = { id: exits.length + 1, product, especification, value, quantity };
      exits.push(newExit);
      updateTables();
    } else {
      alert("Quantidade Insuficiente No Estoque.");
    }
  } else {
    alert("Produto Inexistente No Estoque.");
  }
}

function calculateStock() {
  return Object.keys(stock).map(product => ({
    product,
    quantity: stock[product],
    vc: valorc[product],
    vv: valorv[product]
  }));
}

function updateTables() {
  const entryTable = document.getElementById("entryTable").querySelector("tbody");
  const exitTable = document.getElementById("exitTable").querySelector("tbody");
  const stockTable = document.getElementById("stockTable").querySelector("tbody");

  entryTable.innerHTML = "";
  entries.forEach(entry => {
    entryTable.innerHTML += `<tr>
      <td>${entry.id}</td>
      <td>${entry.product}</td>
      <td>${entry.especification}</td>
      <td>${'R$ '+ (entry.value * entry.quantity).toFixed(2)}</td>
      <td>${entry.quantity}</td>
    </tr>`;
  });

  exitTable.innerHTML = "";
  exits.forEach(exit => {
    exitTable.innerHTML += `<tr>
      <td>${exit.id}</td>
      <td>${exit.product}</td>
      <td>${exit.especification}</td>
      <td>${'R$ '+ (exit.value * exit.quantity).toFixed(2)}</td>
      <td>${exit.quantity}</td>
    </tr>`;
  });

  stockTable.innerHTML = "";
  const stockData = calculateStock();
  stockData.forEach((item, index) => {
    stockTable.innerHTML += `<tr>
      <td>${index + 1}</td>
      <td>${item.product}</td>
      <td>${item.quantity}</td>
      <td>${'R$ '+ item.vc.toFixed(2)}</td>
      <td>${item.vv === undefined ? "Nenhuma venda" : 'R$ '+item.vv.toFixed(2)}</td>
      <td>${item.vv === undefined ? "Necessário 1º venda" : 'R$ '+(item.vv * item.quantity).toFixed(2)}</td>
    </tr>`;
  });
}


function isOpen(interval) {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes(); // Convertendo a hora atual para minutos

  // Convertendo o intervalo de tempo para minutos
  const [start, end] = interval.split('-').map(time => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
  });

  // Verificando se o horário atual está dentro do intervalo
  return currentTime >= start && currentTime <= end;
}

// Definindo o intervalo de horário
const interval = "08:00:00-20:00"; // Intervalo de funcionamento

// Executando a verificação ao carregar a página
function att_status() {
  if (isOpen(interval)) {
    document.querySelector(".span_badge").textContent = "Aberto";
    document.querySelector(".span_badge").classList.add('aberto');
    document.querySelector(".span_badge").classList.remove('fechado');
  } else {
    document.querySelector(".span_badge").textContent = "Fechado";
    document.querySelector(".span_badge").classList.add('fechado');
    document.querySelector(".span_badge").classList.remove('aberto');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  att_status();
  setInterval(att_status, 10000);
});