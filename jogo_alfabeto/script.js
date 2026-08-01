const dicionarioAlfabeto = [
    { letra: 'A', img: '✈️' }, { letra: 'B', img: '🍌' }, { letra: 'C', img: '🚗' },
    { letra: 'D', img: '🎲' }, { letra: 'E', img: '🐘' }, { letra: 'F', img: '🌸' },
    { letra: 'G', img: '🐱' }, { letra: 'H', img: '🚁' }, { letra: 'I', img: '🏝️' },
    { letra: 'J', img: '🐊' }, { letra: 'K', img: '🥝' }, { letra: 'L', img: '🦁' },
    { letra: 'M', img: '🐒' }, { letra: 'N', img: '☁️' }, { letra: 'O', img: '🥚' },
    { letra: 'P', img: '🦆' }, { letra: 'Q', img: '🧀' }, { letra: 'R', img: '🤖' },
    { letra: 'S', img: '🐸' }, { letra: 'T', img: '🐢' }, { letra: 'U', img: '🍇' },
    { letra: 'V', img: '🐄' }, { letra: 'W', img: '🧇' }, { letra: 'X', img: '☕' },
    { letra: 'Y', img: '🧘' }, { letra: 'Z', img: '🦓' }
];

const itensPorNivel = 4;
let nivelAtual = 0;
let errosNoNivel = false;
let acertosNoNivel = 0;
let itensNoNivelAtual = 0;

let segundosDecorridos = 0;
let cronometroIntervalo;

const containerImagens = document.getElementById('container-imagens');
const containerLetras = document.getElementById('container-letras');
const tituloNivel = document.getElementById('titulo-nivel');
const btnProximo = document.getElementById('btn-proximo');
const btnReiniciar = document.getElementById('btn-reiniciar');
const displayCronometro = document.getElementById('cronometro');


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
    errosNoNivel = false;
    acertosNoNivel = 0;
    btnProximo.classList.add('hidden');
    btnReiniciar.classList.add('hidden');
    containerImagens.innerHTML = '';
    containerLetras.innerHTML = '';
    
    tituloNivel.innerText = `NÍVEL ${nivelAtual + 1}: ARRASTE A LETRA INICIAL`;

    const indexInicio = nivelAtual * itensPorNivel;
    const indexFim = indexInicio + itensPorNivel;
    const itensDesteNivel = dicionarioAlfabeto.slice(indexInicio, indexFim);
    itensNoNivelAtual = itensDesteNivel.length;

    if (itensNoNivelAtual === 0) {
        finalizarJogo();
        return;
    }

    itensDesteNivel.forEach(item => {
        const divItem = document.createElement('div');
        divItem.classList.add('game-item');
        divItem.innerHTML = `
            <div class="image-box">${item.img}</div> 
            <div class="drop-zone" data-letter="${item.letra}"></div>
        `;
        containerImagens.appendChild(divItem);
    });

    const letrasEmbaralhadas = embaralharArray([...itensDesteNivel]);
    letrasEmbaralhadas.forEach(item => {
        const divLetra = document.createElement('div');
        divLetra.classList.add('draggable-letter');
        divLetra.setAttribute('draggable', 'true');
        divLetra.id = `letra-${item.letra}`;
        divLetra.innerText = item.letra;
        containerLetras.appendChild(divLetra);
    });

    configurarEventosDeArrastar();
}

function verificarFimDoNivel() {
    if (acertosNoNivel === itensNoNivelAtual) {
        if (errosNoNivel) {
            btnReiniciar.classList.remove('hidden');
        } else {
            btnProximo.classList.remove('hidden');
        }
    }
}

function finalizarJogo() {
    pararCronometro();
    tituloNivel.innerText = "🎉 PARABÉNS! VOCÊ COMPLETOU O ALFABETO 🎉";
    containerImagens.innerHTML = `<h1>Tempo Total: ${displayCronometro.innerText.replace('⏱️ ', '')}</h1>`;
}

function configurarEventosDeArrastar() {
    const letras = document.querySelectorAll('.draggable-letter');
    const zonasDeSoltura = document.querySelectorAll('.drop-zone');

    letras.forEach(letra => {
        letra.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text/plain', e.target.id);
            setTimeout(() => e.target.style.opacity = '0.5', 0);
        });
        letra.addEventListener('dragend', e => e.target.style.opacity = '1');
    });

    zonasDeSoltura.forEach(zona => {
        zona.addEventListener('dragover', e => e.preventDefault());
        
        zona.addEventListener('drop', e => {
            e.preventDefault();
            const idLetra = e.dataTransfer.getData('text/plain');
            const elementoArrastado = document.getElementById(idLetra);
            
            if (!elementoArrastado) return;

            const letraEsperada = zona.getAttribute('data-letter');
            const letraArrastada = elementoArrastado.innerText;

            if (letraArrastada === letraEsperada) {
                zona.style.border = "none";
                zona.style.backgroundColor = "transparent";
                zona.appendChild(elementoArrastado);
                
                elementoArrastado.setAttribute('draggable', 'false');
                elementoArrastado.style.cursor = 'default';
                acertosNoNivel++;
            } else {
                errosNoNivel = true;
                zona.style.backgroundColor = "rgba(255, 0, 0, 0.4)";
                setTimeout(() => zona.style.backgroundColor = "rgba(0, 0, 0, 0.2)", 500);
            }
            
            verificarFimDoNivel();
        });
    });
}

btnProximo.addEventListener('click', () => {
    nivelAtual++;
    carregarNivel();
});

btnReiniciar.addEventListener('click', () => {
    carregarNivel();
});

iniciarCronometro();
carregarNivel();