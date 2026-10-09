// Suma dos números después de esperar 2 segundos.
// Nunca rechaza: siempre resuelve, sin validar los valores de entrada.
function sumarLento(a, b) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(a + b); // se cumple la promesa con el resultado
        }, 2000)
        
    })
}

// Suma dos números, pero valida que sean positivos.
// Si no lo son, rechaza de inmediato; si sí, espera 1 segundo y resuelve.
function sumarRapido(a, b) {
    return new Promise((resolve, reject) => {
        if (a < 0 || b < 0) {
            reject('Los números deben ser positivos');
            return; // corta la ejecución para no seguir al setTimeout
        }
    
    setTimeout(() => {
        resolve(a + b);
    }, 1000)
    
    })
}

// Misma idea que sumarRapido, pero como función flecha (arrow function)
// y con un tiempo de espera aún menor (800 ms)
let SolicitarsumarRapido = (a, b) => {
    return new Promise ((resolve, reject)  => {
        if (a < 0 || b < 0) {
            reject('Los números deben ser positivos');
            return;
        }
        
    setTimeout(() => {
        resolve(a + b);
    }, 800)    
    
})

}