let entries = [];
    let exits = [];

    function addEntry() {
      const product = document.getElementById("product").value;
      const value = parseFloat(document.getElementById("value").value).toFixed(2);
      const quantity = parseInt(document.getElementById("quantity").value);

      if (product && value && quantity) {
        const newEntry = { id: entries.length + 1, product, value, quantity };
        entries.push(newEntry);
        updateTables();
      }
    }

    function addExit() {
      const product = document.getElementById("product").value;
      const value = parseFloat(document.getElementById("value").value).toFixed(2);
      const quantity = parseInt(document.getElementById("quantity").value);

      const valorFinal = document.getElementById('qntFinal').innerText
      const entry = entries.find(e => e.product === product);
    //   const item = ;
      if (entry && entry.quantity >= quantity && Number(valorFinal) != 0) {
        const newExit = { id: exits.length + 1, product, value, quantity};
        exits.push(newExit);
        updateTables();
      } else {
        alert("Quantidade insuficiente ou produto inexistente no depósito selecionado.");
      }
    }

    function calculateStock() {
      const stock = {};

      entries.forEach(entry => {
        const key = `${entry.product}-${entry.storage}`;
        if (!stock[key]) {
          stock[key] = { product: entry.product, storage: entry.storage, quantity: 0 };
        }
        stock[key].quantity += entry.quantity;
      });

      exits.forEach(exit => {
        const key = `${exit.product}-${exit.storage}`;
        if (stock[key]) {
          stock[key].quantity -= exit.quantity;
        }
      });

      return Object.values(stock);
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
          <td>${entry.value}</td>
          <td>${entry.quantity}</td>
        </tr>`;
      });

      exitTable.innerHTML = "";
      exits.forEach(exit => {
        exitTable.innerHTML += `<tr>
          <td>${exit.id}</td>
          <td>${exit.product}</td>
          <td>${exit.value}</td>
          <td>${exit.quantity}</td>
        </tr>`;
      });

      stockTable.innerHTML = "";
      const stock = calculateStock();
      var num = 0;
      stock.forEach(item => {
        stockTable.innerHTML += `<tr>
          <td>${item.length}</td>
          <td>${item.product}</td>
          <td>${item.storage}</td>
          <td id="qntFinal">${item.quantity}</td>
        </tr>`;
        num++;
      });
    }