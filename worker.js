onmessage = function (e) {
  const nums = e.data;
  let suma = 0;
  for (let n of nums) {
    suma += n;
  }
  //postMessage(suma);
  setTimeout(() => {
    postMessage(suma);
  }, Math.random() * 10000);
};
