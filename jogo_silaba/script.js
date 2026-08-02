const niveis = [
    {
        titulo: "NÍVEL 1: SÍLABAS SIMPLES",
        palavras: [
            { img: '🐸', silabas: ['SA', 'PO'] },
            { img: '🐱', silabas: ['GA', 'TO'] },
            { img: '🐭', silabas: ['RA', 'TO'] }
        ]
    },
    {
        titulo: "NÍVEL 2: MISTURA DE SÍLABAS",
        palavras: [
            { img: '🐷', silabas: ['POR', 'CO'] },
            { img: '🐮', silabas: ['VA', 'CA'] },
            { img: '🐑', silabas: ['O', 'VE', 'LHA'] }
        ]
    },
    {
        titulo: "NÍVEL 3: PALAVRAS MAIORES",
        palavras: [
            { img: '🐒', silabas: ['MA', 'CA', 'CO'] },
            { img: '🐴', silabas: ['CA', 'VA', 'LO'] },
            { img: '🐊', silabas: ['JA', 'CA', 'RÉ'] }
        ]
    }
];

let nivelAtual = 0;
let segundosDecorridos = 0;
let cronometroIntervalo;

const telaInicial = document.getElementById('tela-inicial');
const telaJogo = document.getElementById('tela-jogo');
const displayCronometro = document.getElementById('cronometro');
const containerPalavras = document.getElementById('container-palavras');
const containerSilabas = document.getElementById('container-silabas');
const tituloNivel = document.getElementById('titulo-nivel');

const btnIniciar = document.getElementById('btn-iniciar');
const btnVerificar = document.getElementById('btn-verificar');
const btnProximo = document.getElementById('btn-proximo');
const btnReiniciar = document.getElementById('btn-reiniciar');

btnIniciar.addEventListener('click', () => {
    telaInicial.classList.add('hidden');
    telaJogo.classList.remove('hidden');
    displayCronometro.classList.remove('hidden');
    iniciarCronometro();
    carregarNivel();
});

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
    containerPalavras.innerHTML = '';
    containerSilabas.innerHTML = '';
    btnVerificar.classList.remove('hidden');
    btnProximo.classList.add('hidden');
    btnReiniciar.classList.add('hidden');

    if (nivelAtual >= niveis.length) {
        pararCronometro();
        tituloNivel.innerText = "PARABÉNS! JOGO CONCLUÍDO";
        containerPalavras.innerHTML = `<h2>Tempo Total: ${displayCronometro.innerText.replace('⏱️ ', '')}</h2>`;
        btnVerificar.classList.add('hidden');
        containerSilabas.classList.add('hidden');
        return;
    }

    const dadosNivel = niveis[nivelAtual];
    tituloNivel.innerText = dadosNivel.titulo;

    let todasAsSilabas = [];

    dadosNivel.palavras.forEach((palavra, indexPalavra) => {
        const coluna = document.createElement('div');
        coluna.classList.add('word-column');

        const divSlots = document.createElement('div');
        divSlots.classList.add('syllables-slots');

        palavra.silabas.forEach((silabaCorreta, indexSilaba) => {
            todasAsSilabas.push({ texto: silabaCorreta, idOriginal: `p${indexPalavra}-s${indexSilaba}` });
            
            const slot = document.createElement('div');
            slot.classList.add('drop-zone');
            slot.setAttribute('data-esperado', silabaCorreta);
            divSlots.appendChild(slot);
        });

        coluna.innerHTML = `<div class="image-box">${palavra.img}</div>`;
        coluna.appendChild(divSlots);
        containerPalavras.appendChild(coluna);
    });

    todasAsSilabas = embaralharArray(todasAsSilabas);
    todasAsSilabas.forEach((silaba, i) => {
        const divSilaba = document.createElement('div');
        divSilaba.classList.add('draggable-item');
        divSilaba.setAttribute('draggable', 'true');
        divSilaba.id = `silaba-${i}`;
        divSilaba.innerText = silaba.texto;
        containerSilabas.appendChild(divSilaba);
    });

    configurarEventosDeArrastar();
}

function verificarResposta() {
    let todasCorretas = true;
    const zonasDeSoltura = document.querySelectorAll('.syllables-slots .drop-zone');

    zonasDeSoltura.forEach(zona => {
        const silabaEsperada = zona.getAttribute('data-esperado');
        
        if (zona.children.length > 0) {
            const silabaColocada = zona.children[0].innerText;
            
            if (silabaColocada === silabaEsperada) {
                zona.style.borderColor = "#2ecc71";
                zona.style.backgroundColor = "rgba(46, 204, 113, 0.2)";
                zona.children[0].setAttribute('draggable', 'false');
            } else {
                todasCorretas = false;
                zona.style.borderColor = "#e74c3c";
                zona.style.backgroundColor = "rgba(231, 76, 60, 0.2)";
            }
        } else {
            todasCorretas = false;
            zona.style.borderColor = "#e74c3c";
        }
    });

    btnVerificar.classList.add('hidden');
    if (todasCorretas) {
        btnProximo.classList.remove('hidden');
    } else {
        btnReiniciar.classList.remove('hidden');
    }
}

function configurarEventosDeArrastar() {
    const itens = document.querySelectorAll('.draggable-item');
    const zonasDeSoltura = document.querySelectorAll('.drop-zone, .scattered-container');

    itens.forEach(item => {
        if (item.getAttribute('draggable') === 'false') return;

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
                if (zona.classList.contains('scattered-container') || zona.children.length === 0) {
                    zona.appendChild(elementoArrastado);
                    
                    if (zona.classList.contains('drop-zone')) {
                        zona.style.borderColor = "#333";
                        zona.style.backgroundColor = "rgba(0, 0, 0, 0.15)";
                    }
                }
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