// Hacer un metodo SolicitarNombre(nombre)
function SolicitarNombre(nombre) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!nombre) {
                reject('El nombre es requerido');
                return;
            }
            resolve(`Nombre: ${nombre}`);
        }, 2000);
    });
}

// Hacer un metodo SolicitarSaludos (saludo)
function SolicitarSaludo(saludo) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!saludo) {
                reject('El saludo es requerido');
                return;
            }
            resolve(`Saludo: ${saludo}`);
        }, 800);
    });
}
    
// que se resuelva en 800ms
// Las dos peticiones se tiene que hacer al mismo tiempo
Promise.all([
    SolicitarNombre('David'),
    SolicitarSaludo('Hola')
])
.then(([nombre, saludo]) => {
    console.log(nombre);
    console.log(saludo);
})
.catch(error => {
    console.log(error);
});
