const niveis = [
    {
        titulo: "NÍVEL 1: AGRUPE POR ANIMAL",
        grupos: [
            { id: 'gato', emoji: '🐱', quantidade: 3 },
            { id: 'cachorro', emoji: '🐶', quantidade: 2 }
        ]
    },
    {
        titulo: "NÍVEL 2: AGRUPE POR FRUTA",
        grupos: [
            { id: 'maca', emoji: '🍎', quantidade: 4 },
            { id: 'banana', emoji: '🍌', quantidade: 3 },
            { id: 'uva', emoji: '🍇', quantidade: 2 }
        ]
    },
    {
        titulo: "NÍVEL 3: AGRUPE POR VEÍCULO",
        grupos: [
            { id: 'carro', emoji: '🚗', quantidade: 5 },
            { id: 'aviao', emoji: '✈️', quantidade: 2 },
            { id: 'foguete', emoji: '🚀', quantidade: 3 }
        ]
    }
];

let nivelAtual = 0;
let segundosDecorridos = 0;
let cronometroIntervalo;

const containerItens = document.getElementById('container-itens');
const containerZonas = document.getElementById('container-zonas');
const tituloNivel = document.getElementById('titulo-nivel');
const displayCronometro = document.getElementById('cronometro');

const btnVerificar = document.getElementById('btn-verificar');
const btnProximo = document.getElementById('btn-proximo');
const btnReiniciar = document.getElementById('btn-reiniciar');

function iniciarCronometro() {
    clearInterval(cronometroIntervalo);
    cronometroIntervalo = setInterval(() => {
        segundosDecorridos++;
        const minutos = String(Math.floor(segundosDecorridos / 60)).padStart(2, '0');
        const segundos = String(segundosDecorridos % 60).padStart(2, '0');
        displayCronometro.innerText = `⏱️ ${minutos}:${segundos}`;
    }, 1000);
}

function pararCronometro() {
    clearInterval(cronometroIntervalo);
}

function embaralharArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

function carregarNivel() {
    containerItens.innerHTML = '';
    containerZonas.innerHTML = '';
    btnVerificar.classList.remove('hidden');
    btnProximo.classList.add('hidden');
    btnReiniciar.classList.add('hidden');
    
    if (nivelAtual >= niveis.length) {
        pararCronometro();
        tituloNivel.innerText = "PARABÉNS! VOCÊ COMPLETOU TUDO";
        containerZonas.innerHTML = `<h2>Tempo Total: ${displayCronometro.innerText.replace('⏱️ ', '')}</h2>`;
        btnVerificar.classList.add('hidden');
        return;
    }

    const dadosNivel = niveis[nivelAtual];
    tituloNivel.innerText = dadosNivel.titulo;

    let todosOsItens = [];

    dadosNivel.grupos.forEach(grupo => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('zone-wrapper');
        
        wrapper.innerHTML = `
            <div class="drop-zone" data-tipo="${grupo.id}" data-bg="${grupo.emoji}" id="zona-${grupo.id}"></div>
            <input type="number" class="number-input" id="input-${grupo.id}" min="0" placeholder="?">
        `;
        containerZonas.appendChild(wrapper);

        for (let i = 0; i < grupo.quantidade; i++) {
            todosOsItens.push({ id: grupo.id, emoji: grupo.emoji });
        }
    });

    todosOsItens = embaralharArray(todosOsItens);
    todosOsItens.forEach((item, index) => {
        const divItem = document.createElement('div');
        divItem.classList.add('draggable-item');
        divItem.setAttribute('draggable', 'true');
        divItem.id = `item-${item.id}-${index}`;
        divItem.setAttribute('data-tipo', item.id);
        divItem.innerText = item.emoji;
        containerItens.appendChild(divItem);
    });

    configurarEventosDeArrastar();
}

function verificarResposta() {
    const dadosNivel = niveis[nivelAtual];
    let todasAsRegrasAtendidas = true;

    dadosNivel.grupos.forEach(grupo => {
        const zona = document.getElementById(`zona-${grupo.id}`);
        const input = document.getElementById(`input-${grupo.id}`);
        
        const valorDigitado = parseInt(input.value);
        const numeroCorreto = (valorDigitado === grupo.quantidade);

        const itensNaZona = Array.from(zona.children);
        const quantidadeFisicaCorreta = (itensNaZona.length === grupo.quantidade);
        
        const semIntrusos = itensNaZona.every(item => item.getAttribute('data-tipo') === grupo.id);

        if (!numeroCorreto || !quantidadeFisicaCorreta || !semIntrusos) {
            todasAsRegrasAtendidas = false;
            input.style.borderColor = "#e74c3c";
            zona.style.borderColor = "#e74c3c";
        } else {
            input.style.borderColor = "#2ecc71";
            zona.style.borderColor = "#2ecc71";
            input.disabled = true;
        }
    });

    btnVerificar.classList.add('hidden');
    if (todasAsRegrasAtendidas) {
        btnProximo.classList.remove('hidden');
    } else {
        btnReiniciar.classList.remove('hidden');
    }
}

function configurarEventosDeArrastar() {
    const itens = document.querySelectorAll('.draggable-item');

    const zonasDeSoltura = document.querySelectorAll('.drop-zone, .scattered-container');

    itens.forEach(item => {
        item.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text/plain', e.target.id);
            setTimeout(() => e.target.style.opacity = '0.5', 0);
        });
        item.addEventListener('dragend', e => e.target.style.opacity = '1');
    });

    zonasDeSoltura.forEach(zona => {
        zona.addEventListener('dragover', e => e.preventDefault());
        
        zona.addEventListener('drop', e => {
            e.preventDefault();
            const idItem = e.dataTransfer.getData('text/plain');
            const elementoArrastado = document.getElementById(idItem);
            
            if (elementoArrastado) {
                zona.appendChild(elementoArrastado);
            }
        });
    });
}

btnVerificar.addEventListener('click', verificarResposta);

btnProximo.addEventListener('click', () => {
    nivelAtual++;
    carregarNivel();
});

btnReiniciar.addEventListener('click', () => {
    carregarNivel();
});

iniciarCronometro();
carregarNivel();