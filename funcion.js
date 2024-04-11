// script.js
let matrizAsociada = [];

let agente = {
    x: 0, // Coordenada x inicialmente no definida
    y: 0, // Coordenada y inicialmente no definida
    url: 'Agente.jpg' // URL de la imagen del agente
};

document.addEventListener('DOMContentLoaded', function() {
    generarTablero();
});

document.addEventListener('DOMContentLoaded',function(){
    document.getElementById('btnInicio').addEventListener('click', function() {
        //alert("El botón fue presionado!");
        let intervalId = setInterval(moverImagen, 1000);
        setTimeout(() => clearInterval(intervalId), 30000); 
        //moverImagen()
    });    
});

function colocarImagen(celda) {
    const fila = celda.dataset.fila;
    const columna = celda.dataset.columna;
    //const opcionSeleccionada = document.querySelector('input[name="imagen"]:checked').value;

    if (!matrizAsociada[fila][columna]) {
        const opcionSeleccionada = document.querySelector('input[name="imagen"]:checked').value;
        
        if (opcionSeleccionada === agente.url) {
            // Actualiza la posición del agente
            agente.x = parseInt(fila, 10);
            agente.y = parseInt(columna, 10);
        }

        celda.style.backgroundImage = `url('${opcionSeleccionada}')`;
        celda.style.backgroundSize = 'cover';
        celda.style.backgroundRepeat = 'no-repeat';

        matrizAsociada[fila][columna] = opcionSeleccionada;
    }
}

function generarTablero() {
    const tablero = document.getElementById('tablero');
    tablero.innerHTML = '';
    const fila = 10; // Tamaño fijo del tablero
    const columna = 18;
    matrizAsociada = new Array(fila).fill(0).map(() => new Array(columna).fill(null));

    tablero.style.gridTemplateColumns = `repeat(${columna}, 1fr)`;
    tablero.style.gridTemplateRows = `repeat(${fila}, 1fr)`;

    for(let i = 0; i < fila; i++) {
        for(let j = 0; j < columna; j++) {
            const celda = document.createElement('div');
            celda.classList.add('celda');
            celda.dataset.fila = i;
            celda.dataset.columna = j;
            celda.addEventListener('click', function() { colocarImagen(this); });
            tablero.appendChild(celda);
        }
    }
}

function obtenerNuevaPosicionAleatoria() {
    const movimientos = [
        { x: -1, y: 0 }, // Movimiento hacia la izquierda
        { x: 1, y: 0 },  // Movimiento hacia la derecha
        { x: 0, y: -1 }, // Movimiento hacia arriba
        { x: 0, y: 1 }   // Movimiento hacia abajo
    ];

    let posicionX, posicionY, intentos = 0;
    do {
        // Asegúrate de no entrar en un bucle infinito
        if (intentos++ > 100) {
            console.error("No se encontró una nueva posición válida después de 100 intentos.");
            return { posicionX: agente.x, posicionY: agente.y }; // Devuelve la posición actual
        }

        const movimientoAleatorio = movimientos[Math.floor(Math.random() * movimientos.length)];
        posicionX = agente.x + movimientoAleatorio.x;
        posicionY = agente.y + movimientoAleatorio.y;
    } while (posicionX < 0 || posicionX >= matrizAsociada.length || posicionY < 0 || posicionY >= matrizAsociada[posicionX].length);



    return { posicionX, posicionY };
}

//
function moverImagen() {
    let nuevaPosicion = obtenerNuevaPosicionAleatoria();

    if (posicionValida(nuevaPosicion)) {
        // Limpia la celda antigua
        actualizarCelda(agente.x, agente.y, null);

        // Actualiza la matriz con la nueva posición del agente
        agente.x = nuevaPosicion.posicionX;
        agente.y = nuevaPosicion.posicionY;
        matrizAsociada[agente.x][agente.y] = agente.url;

        // Actualiza la celda nueva
        actualizarCelda(agente.x, agente.y, agente.url);

        console.log("Posición X:" + agente.x + " Posición Y:" + agente.y);
    } else {
        console.error('La posición del agente no está definida, es inválida, o no se ha movido:', agente);
    }
}

function posicionValida({ posicionX, posicionY }) {
    return posicionX >= 0 && posicionX < matrizAsociada.length &&
           posicionY >= 0 && posicionY < matrizAsociada[posicionX].length;
}

function actualizarCelda(x, y, imagenUrl) {
    const celda = document.querySelector(`.celda[data-fila="${x}"][data-columna="${y}"]`);
    if (celda) {
        celda.style.backgroundImage = imagenUrl ? `url('${imagenUrl}')` : 'none';
    }
}
