console.time();
const numeros = [];
for (let i = 1; i <= 30000000; i++) numeros.push(i); 

const nWorkers = 10;


function dividirArray(arr, partes) {
  const resultado = [];
  const tamaño = Math.ceil(arr.length / partes);
  for (let i = 0; i < partes; i++) {
    resultado.push(arr.slice(i * tamaño, (i + 1) * tamaño));
  }
  return resultado;
}

const partes = dividirArray(numeros, nWorkers);


const workerCode = `
      onmessage = function(e) {
        const nums = e.data;    
        let suma = 0;
        for(let n of nums) {
          suma += n;
        }
        //postMessage(suma);
          setTimeout(() => {
      postMessage(suma);
    }, Math.random()*10000);
      }
    `;


const blob = new Blob([workerCode], { type: "application/javascript" });
const workerUrl = URL.createObjectURL(blob);

let resultados = [];
let terminados = 0;


for (let i = 0; i < nWorkers; i++) {
  const worker = new Worker(workerUrl);

  worker.onmessage = function (e) {
    console.log(e.data);
    let resWorker = document.createElement("div");
    resWorker.innerText = `resultado hilo ${i + 1} :  ${e.data}`;
    document.getElementById("workers").append(resWorker);
    resultados[i] = e.data;
    terminados++;
    if (terminados === nWorkers) {
      // Todos terminaron, sumar resultados
      const sumaTotal = resultados.reduce((a, b) => a + b, 0);
      document.getElementById("resultado").innerText =
        "Suma total: " + sumaTotal;
    }
    worker.terminate(); // liberar worker
  };
  // Enviar la parte correspondiente al worker
  worker.postMessage(partes[i]);
}
console.timeEnd();
