const niveis = [
    { mult1: 3, mult2: 2, resposta: 6, opcoes: [5, 6, 7, 8] },
    { mult1: 2, mult2: 4, resposta: 8, opcoes: [6, 8, 9, 10] },
    { mult1: 4, mult2: 3, resposta: 12, opcoes: [10, 11, 12, 14] },
    { mult1: 5, mult2: 2, resposta: 10, opcoes: [8, 10, 12, 15] },
    { mult1: 3, mult2: 3, resposta: 9, opcoes: [6, 8, 9, 12] }
];

let faseAtual = 0;
let tempo = 0;
let cronometroInterval;

window.onload = () => {
    iniciarCronometro();
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
    tempo = 0; 
    carregarFase();
}

function carregarFase() {
    const nivel = niveis[faseAtual];
    let cestasProntas = 0;
    
    document.getElementById('titulo-fase').innerText = `Fase ${faseAtual + 1}`;
    document.getElementById('btn-proximo').classList.add('hidden');
    document.getElementById('container-opcoes').classList.add('hidden');

    const containerConta = document.getElementById('container-conta');
    containerConta.innerHTML = `
        <div class="expressao">${nivel.mult1} x ${nivel.mult2} = ?</div>
        <div class="instrucao">Clique para colocar ${nivel.mult2} maçãs em cada cesta!</div>
        <div class="cestas-container" id="cestas"></div>
    `;

    const cestasContainer = document.getElementById('cestas');
    
    for (let i = 0; i < nivel.mult1; i++) {
        let quantidadeMacas = 0;
        const cesta = document.createElement('div');
        cesta.classList.add('cesta');
        
        cesta.onclick = () => {
            if (quantidadeMacas < nivel.mult2) {
                quantidadeMacas++;
                const maca = document.createElement('span');
                maca.classList.add('maca');
                maca.innerText = '🍎';
                cesta.appendChild(maca);
                
                if (quantidadeMacas === nivel.mult2) {
                    cesta.classList.add('cheia');
                    cestasProntas++;
                    
                    if (cestasProntas === nivel.mult1) {
                        document.getElementById('container-opcoes').classList.remove('hidden');
                    }
                }
            }
        };
        
        cestasContainer.appendChild(cesta);
    }

    const containerOpcoes = document.getElementById('container-opcoes');
    containerOpcoes.innerHTML = '';
    
    nivel.opcoes.forEach(opcao => {
        const btn = document.createElement('button');
        btn.classList.add('option-btn');
        btn.innerText = opcao;
        btn.onclick = (e) => verificarResposta(e.target, opcao, nivel.resposta);
        containerOpcoes.appendChild(btn);
    });
}

function verificarResposta(botao, valorEscolhido, valorCorreto) {
    const todosBotoes = document.querySelectorAll('.option-btn');
    
    if (valorEscolhido === valorCorreto) {
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