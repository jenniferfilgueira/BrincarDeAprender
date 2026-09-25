const niveis = [
    { emoji: '🦆', palavra: ['PA', 'TO'], silabas: ['TO', 'LA', 'PA', 'MA'] },
    { emoji: '🏠', palavra: ['CA', 'SA'], silabas: ['SA', 'CA', 'DA', 'BO'] },
    { emoji: '🍌', palavra: ['BA', 'NA', 'NA'], silabas: ['NA', 'BA', 'MA', 'NA', 'PA'] },
    { emoji: '🐱', palavra: ['GA', 'TO'], silabas: ['TO', 'BA', 'GA', 'CO'] },
    { emoji: '🐸', palavra: ['SA', 'PO'], silabas: ['PO', 'SA', 'LA', 'DO'] }
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
    document.getElementById('container-opcoes').classList.remove('hidden');

    const containerConta = document.getElementById('container-conta');
    containerConta.innerHTML = `
        <div class="imagem-emoji">${nivel.emoji}</div>
        <div class="caixas-container" id="caixas"></div>
    `;

    const caixasContainer = document.getElementById('caixas');
    
    for (let i = 0; i < nivel.palavra.length; i++) {
        const caixa = document.createElement('div');
        caixa.classList.add('caixa-alvo');
        caixa.dataset.index = i;
        caixa.onclick = () => removerSilabaDaCaixa(caixa);
        caixasContainer.appendChild(caixa);
    }

    const containerOpcoes = document.getElementById('container-opcoes');
    containerOpcoes.innerHTML = '';
    
    let silabasEmbaralhadas = [...nivel.silabas].sort(() => Math.random() - 0.5);
    
    silabasEmbaralhadas.forEach((silaba, index) => {
        const btn = document.createElement('button');
        btn.classList.add('option-btn');
        btn.innerText = silaba;
        btn.id = `btn-silaba-${index}`;
        btn.onclick = () => enviarSilabaParaCaixa(btn, silaba);
        containerOpcoes.appendChild(btn);
    });
}

function enviarSilabaParaCaixa(botao, silaba) {
    const caixas = document.querySelectorAll('.caixa-alvo');
    let caixaVazia = null;
    
    for (let i = 0; i < caixas.length; i++) {
        if (!caixas[i].classList.contains('preenchida')) {
            caixaVazia = caixas[i];
            break;
        }
    }
    
    if (caixaVazia) {
        caixaVazia.innerText = silaba;
        caixaVazia.dataset.idBotaoOrigem = botao.id;
        caixaVazia.classList.add('preenchida');
        botao.classList.add('escondido-visualmente');
        
        verificarPreenchimentoCompleto();
    }
}

function removerSilabaDaCaixa(caixa) {
    if (caixa.classList.contains('preenchida')) {
        const idBotaoOrigem = caixa.dataset.idBotaoOrigem;
        const botaoOrigem = document.getElementById(idBotaoOrigem);
        
        if (botaoOrigem) {
            botaoOrigem.classList.remove('escondido-visualmente');
        }
        
        caixa.innerText = '';
        caixa.classList.remove('preenchida');
        caixa.classList.remove('correct');
        caixa.classList.remove('wrong');
        
        const caixas = document.querySelectorAll('.caixa-alvo');
        caixas.forEach(c => {
            c.classList.remove('correct');
            c.classList.remove('wrong');
        });
        
        document.getElementById('btn-proximo').classList.add('hidden');
    }
}

function verificarPreenchimentoCompleto() {
    const caixas = document.querySelectorAll('.caixa-alvo');
    let todasPreenchidas = true;
    let palavraFormada = '';
    
    caixas.forEach(caixa => {
        if (!caixa.classList.contains('preenchida')) {
            todasPreenchidas = false;
        } else {
            palavraFormada += caixa.innerText;
        }
    });
    
    if (todasPreenchidas) {
        const nivel = niveis[faseAtual];
        const palavraCorreta = nivel.palavra.join('');
        
        if (palavraFormada === palavraCorreta) {
            caixas.forEach(caixa => caixa.classList.add('correct'));
            document.getElementById('btn-proximo').classList.remove('hidden');
            
            const botoesOpcoes = document.querySelectorAll('.option-btn');
            botoesOpcoes.forEach(b => {
                if (!b.classList.contains('escondido-visualmente')) {
                    b.classList.add('disabled');
                }
            });
        } else {
            caixas.forEach(caixa => caixa.classList.add('wrong'));
        }
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