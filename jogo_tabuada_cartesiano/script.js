const niveis = [
    { mult1: 2, mult2: 3, resposta: 6, opcoes: [4, 5, 6, 8] },
    { mult1: 3, mult2: 3, resposta: 9, opcoes: [6, 7, 9, 12] },
    { mult1: 4, mult2: 2, resposta: 8, opcoes: [6, 8, 10, 12] },
    { mult1: 5, mult2: 4, resposta: 20, opcoes: [16, 18, 20, 25] },
    { mult1: 5, mult2: 5, resposta: 25, opcoes: [15, 20, 25, 30] }
];

let faseAtual = 0;
let tempo = 0;
let cronometroInterval;
let linhaSelecionada = null;
let colunaSelecionada = null;

window.onload = () => {
    document.getElementById('btn-iniciar').addEventListener('click', iniciarJogo);
    document.getElementById('btn-proximo').addEventListener('click', proximoNivel);
    document.getElementById('btn-reiniciar').addEventListener('click', reiniciarJogo);
};

function iniciarCronometro() {
    clearInterval(cronometroInterval);
    cronometroInterval = setInterval(() => {
        tempo++;
        const minutos = String(Math.floor(tempo / 60)).padStart(2, '0');
        const segundos = String(tempo % 60).padStart(2, '0');
        document.getElementById('cronometro').innerText = `⏱️ ${minutos}:${segundos}`;
    }, 1000);
}

function iniciarJogo() {
    document.getElementById('tela-inicio').classList.add('hidden');
    document.getElementById('tela-jogo').classList.remove('hidden');
    iniciarCronometro();
    carregarFase();
}

function carregarFase() {
    const nivel = niveis[faseAtual];
    linhaSelecionada = null;
    colunaSelecionada = null;
    
    document.getElementById('titulo-fase').innerText = `Fase ${faseAtual + 1}`;
    document.getElementById('btn-proximo').classList.add('hidden');
    document.getElementById('container-opcoes').classList.remove('hidden');

    const containerConta = document.getElementById('container-conta');
    containerConta.innerHTML = `
        <div class="expressao">${nivel.mult1} x ${nivel.mult2} = ?</div>
        <div class="instrucao">Selecione os números na tabela e clique na resposta!</div>
        <div class="tabuada-cartesiana" id="tabuada"></div>
    `;

    const tabuada = document.getElementById('tabuada');
    
    for (let l = 0; l <= 5; l++) {
        for (let c = 0; c <= 5; c++) {
            const celula = document.createElement('div');
            celula.classList.add('grid-cell');
            
            if (l === 0 && c === 0) {
                celula.classList.add('grid-corner');
                celula.innerText = 'X';
            } else if (l === 0) {
                celula.classList.add('grid-header');
                celula.innerText = c;
                celula.dataset.tipo = 'coluna';
                celula.dataset.valor = c;
                celula.onclick = () => selecionarColuna(c);
            } else if (c === 0) {
                celula.classList.add('grid-header');
                celula.innerText = l;
                celula.dataset.tipo = 'linha';
                celula.dataset.valor = l;
                celula.onclick = () => selecionarLinha(l);
            } else {
                celula.classList.add('grid-inner');
                celula.dataset.linha = l;
                celula.dataset.coluna = c;
            }
            tabuada.appendChild(celula);
        }
    }

    const containerOpcoes = document.getElementById('container-opcoes');
    containerOpcoes.innerHTML = '';
    
    nivel.opcoes.forEach(opcao => {
        const btn = document.createElement('button');
        btn.classList.add('option-btn');
        btn.innerText = opcao;
        btn.onclick = (e) => verificarResposta(e.target, opcao, nivel);
        containerOpcoes.appendChild(btn);
    });
}

function selecionarLinha(l) {
    linhaSelecionada = l;
    atualizarGrid();
}

function selecionarColuna(c) {
    colunaSelecionada = c;
    atualizarGrid();
}

function atualizarGrid() {
    const headers = document.querySelectorAll('.grid-header');
    headers.forEach(h => {
        h.classList.remove('header-selected');
        if (h.dataset.tipo === 'linha' && parseInt(h.dataset.valor) === linhaSelecionada) {
            h.classList.add('header-selected');
        }
        if (h.dataset.tipo === 'coluna' && parseInt(h.dataset.valor) === colunaSelecionada) {
            h.classList.add('header-selected');
        }
    });

    const inners = document.querySelectorAll('.grid-inner');
    inners.forEach(inner => {
        const l = parseInt(inner.dataset.linha);
        const c = parseInt(inner.dataset.coluna);
        
        if (linhaSelecionada !== null && colunaSelecionada !== null && l <= linhaSelecionada && c <= colunaSelecionada) {
            inner.classList.add('cell-filled');
        } else {
            inner.classList.remove('cell-filled');
        }
    });
}

function verificarResposta(botao, valorEscolhido, nivel) {
    const cartesianCorreto = (linhaSelecionada === nivel.mult1 && colunaSelecionada === nivel.mult2) ||
                             (linhaSelecionada === nivel.mult2 && colunaSelecionada === nivel.mult1);

    if (!cartesianCorreto) {
        botao.classList.add('wrong');
        setTimeout(() => {
            botao.classList.remove('wrong');
        }, 800);
        return; 
    }

    const todosBotoes = document.querySelectorAll('.option-btn');
    
    if (valorEscolhido === nivel.resposta) {
        botao.classList.add('correct');
        todosBotoes.forEach(b => {
            if (b !== botao) {
                b.classList.add('disabled');
            }
        });
        document.getElementById('btn-proximo').classList.remove('hidden');
    } else {
        botao.classList.add('wrong');
        botao.classList.add('disabled');
    }
}

function proximoNivel() {
    faseAtual++;
    if (faseAtual < niveis.length) {
        carregarFase();
    } else {
        mostrarTelaFinal();
    }
}

function mostrarTelaFinal() {
    clearInterval(cronometroInterval);
    
    const minutos = String(Math.floor(tempo / 60)).padStart(2, '0');
    const segundos = String(tempo % 60).padStart(2, '0');
    
    document.getElementById('titulo-fase').innerText = "Parabéns!";
    
    document.getElementById('container-conta').innerHTML = `
        <div class="mensagem-final">Seu tempo final foi de:</div>
        <div class="tempo-final">${minutos}:${segundos}</div>
    `;
    
    document.getElementById('container-opcoes').classList.add('hidden');
    document.getElementById('btn-proximo').classList.add('hidden');
    document.getElementById('btn-reiniciar').classList.remove('hidden');
}

function reiniciarJogo() {
    faseAtual = 0;
    tempo = 0;
    document.getElementById('cronometro').innerText = `⏱️ 00:00`;
    document.getElementById('btn-reiniciar').classList.add('hidden');
    iniciarCronometro();
    carregarFase();
}