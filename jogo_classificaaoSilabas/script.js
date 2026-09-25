const niveis = [
    { emoji: '☀️', palavra: 'SOL', silabas: 1, classificacao: 'Monossílaba' },
    { emoji: '🦆', palavra: 'PATO', silabas: 2, classificacao: 'Dissílaba' },
    { emoji: '🍌', palavra: 'BANANA', silabas: 3, classificacao: 'Trissílaba' },
    { emoji: '🐘', palavra: 'ELEFANTE', silabas: 4, classificacao: 'Polissílaba' },
    { emoji: '🏠', palavra: 'CASA', silabas: 2, classificacao: 'Dissílaba' }
];

const classificacoes = ['Monossílaba', 'Dissílaba', 'Trissílaba', 'Polissílaba'];

let faseAtual = 0;
let tempo = 0;
let cronometroInterval;
let contagemPalmas = 0;

window.onload = () => {
    document.getElementById('btn-normal').addEventListener('click', () => configurarVisao('normal'));
    document.getElementById('btn-grande').addEventListener('click', () => configurarVisao('grande'));
    document.getElementById('btn-iniciar').addEventListener('click', iniciarJogo);
    document.getElementById('btn-proximo').addEventListener('click', proximoNivel);
    document.getElementById('btn-reiniciar').addEventListener('click', reiniciarJogo);
};

function configurarVisao(tipo) {
    if (tipo === 'grande') {
        document.body.classList.add('fonte-grande');
    } else {
        document.body.classList.remove('fonte-grande');
    }
    document.getElementById('tela-acessibilidade').classList.add('hidden');
    document.getElementById('tela-inicio').classList.remove('hidden');
}

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
    iniciarCronometro();
    carregarFase();
}

function carregarFase() {
    const nivel = niveis[faseAtual];
    contagemPalmas = 0;
    
    document.getElementById('titulo-fase').innerText = `Fase ${faseAtual + 1}`;
    document.getElementById('btn-proximo').classList.add('hidden');
    document.getElementById('container-opcoes').classList.add('hidden');

    const containerConta = document.getElementById('container-conta');
    
    containerConta.innerHTML = `
        <div class="imagem-emoji">${nivel.emoji}</div>
        <div class="palavra-destaque">${nivel.palavra}</div>
        <div class="container-palmas" id="area-palmas">
            <div class="instrucao">Bate palmas para contar as sílabas!</div>
            <button class="btn-palma" onclick="adicionarPalma()">👏</button>
            <div class="palmas-dadas" id="display-palmas"></div>
            <button class="btn-confirmar" onclick="confirmarPalmas()">Confirmar Palmas</button>
        </div>
    `;

    const containerOpcoes = document.getElementById('container-opcoes');
    containerOpcoes.innerHTML = '';
    
    classificacoes.forEach(opcao => {
        const btn = document.createElement('button');
        btn.classList.add('option-btn');
        btn.innerText = opcao;
        btn.onclick = (e) => verificarResposta(e.target, opcao, nivel.classificacao);
        containerOpcoes.appendChild(btn);
    });
}

function adicionarPalma() {
    contagemPalmas++;
    const display = document.getElementById('display-palmas');
    display.innerText = '👏'.repeat(contagemPalmas);
}

function confirmarPalmas() {
    const nivel = niveis[faseAtual];
    const areaPalmas = document.getElementById('area-palmas');
    
    if (contagemPalmas === nivel.silabas) {
        areaPalmas.innerHTML = `<div class="instrucao" style="color: #4CAF50; font-weight: bold; font-size: 1.5rem;">Certo! ${contagemPalmas} sílaba(s).<br>Como a classificas?</div>`;
        document.getElementById('container-opcoes').classList.remove('hidden');
    } else {
        const display = document.getElementById('display-palmas');
        display.innerText = '❌ Tenta de novo!';
        setTimeout(() => {
            contagemPalmas = 0;
            display.innerText = '';
        }, 1500);
    }
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
        <div class="mensagem-final">O teu tempo final foi de:</div>
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