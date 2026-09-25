const niveis = [
    { emoji: '⛵', raiz: 'BA', opcoes: ['RCO', 'TATA', 'LA'], resposta: 'RCO' },
    { emoji: '🥔', raiz: 'BA', opcoes: ['TATA', 'RCO', 'LA'], resposta: 'TATA' },
    { emoji: '🍬', raiz: 'BA', opcoes: ['LA', 'RCO', 'TATA'], resposta: 'LA' },
    { emoji: '🐒', raiz: 'MA', opcoes: ['CACO', 'LA', 'TO'], resposta: 'CACO' },
    { emoji: '🧳', raiz: 'MA', opcoes: ['TO', 'CACO', 'LA'], resposta: 'LA' }
];

let faseAtual = 0;
let tempo = 0;
let cronometroInterval;

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
    
    document.getElementById('titulo-fase').innerText = `Fase ${faseAtual + 1}`;
    document.getElementById('btn-proximo').classList.add('hidden');

    const containerConta = document.getElementById('container-conta');
    
    let estruturaArvore = `
        <div class="imagem-emoji">${nivel.emoji}</div>
        <div class="arvore-container">
            <div class="silaba-raiz">${nivel.raiz}</div>
            <div class="ramificacoes" id="container-ramificacoes"></div>
        </div>
    `;
    
    containerConta.innerHTML = estruturaArvore;

    const containerRamificacoes = document.getElementById('container-ramificacoes');
    
    let opcoesEmbaralhadas = [...nivel.opcoes].sort(() => Math.random() - 0.5);
    
    opcoesEmbaralhadas.forEach(opcao => {
        const btn = document.createElement('button');
        btn.classList.add('option-btn');
        btn.innerText = opcao;
        btn.onclick = (e) => verificarResposta(e.target, opcao, nivel.resposta);
        containerRamificacoes.appendChild(btn);
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