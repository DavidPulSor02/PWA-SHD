function multiplicar(numero) {
  // Devuelve una promesa: una "promesa" de que en algún momento
  // tendremos un resultado (o un error)
  return new Promise((resolve, reject) => {
    
    // Si el número es muy grande, rechazamos la promesa de inmediato con un mensaje de error
    // (sin esperar), pasando un mensaje de error
    if (numero >= 10) {
      reject('numero muy grande');
      return; // importante: cortamos la ejecución aquí
    }

    // Si pasó la validación, simulamos una operación asíncrona
    // (como una llamada a una API) con un retraso de 2 segundos
    setTimeout(() => {
      resolve(numero * 2); // resolvemos la promesa con el resultado
    }, 2000);
  });
}

// --- Primer caso: falla ---
multiplicar(20)
  .then(numero => {
    console.log(numero); // no se ejecuta, porque la promesa fue rechazada
  })
  .catch(error => {
    console.log(error); // imprime 'numero muy grande' inmediatamente
  });

// --- Segundo caso: encadenamiento de promesas ---
multiplicar(2)
  .then(numero => {
    // numero = 4 (2 * 2), después de esperar 2 segundos
    return multiplicar(numero); // devolvemos otra promesa (encadenamos)
  })
  .then(numero => {
    // numero = 8 (4 * 2), después de esperar OTROS 2 segundos
    console.log(numero); // imprime 8
  })
  .catch(error => {
    console.log(error); // no se ejecuta en este caso
  });