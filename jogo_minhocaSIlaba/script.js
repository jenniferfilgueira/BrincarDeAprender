const niveis = [
    { emoji: '☀️', palavra: 'SOL', alfabeto: 'ABCDEFGHIJLMNOPRTUVXZ' },
    { emoji: '🏠', palavra: 'CASA', alfabeto: 'BDEFGHJLMOPRTUVXZ' },
    { emoji: '🦆', palavra: 'PATO', alfabeto: 'BCDEFGHIJLMNRSUVXZ' },
    { emoji: '🐱', palavra: 'GATO', alfabeto: 'BCDEFHIJLMNQRSUVXZ' },
    { emoji: '🍌', palavra: 'BANANA', alfabeto: 'CDEFHIJLMOPQRSTUVXZ' }
];

let faseAtual = 0;
let tempo = 0;
let cronometroInterval;

const tamanhoGrid = 8;
let cobrinha = [];
let macasNoGrid = [];
let indiceLetraAtual = 0;

window.onload = () => {
    document.getElementById('btn-normal').addEventListener('click', () => configurarVisao('normal'));
    document.getElementById('btn-grande').addEventListener('click', () => configurarVisao('grande'));
    document.getElementById('btn-iniciar').addEventListener('click', iniciarJogo);
    document.getElementById('btn-proximo').addEventListener('click', proximoNivel);
    document.getElementById('btn-reiniciar').addEventListener('click', reiniciarJogo);

    document.addEventListener('keydown', (e) => {
        if (document.getElementById('tela-jogo').classList.contains('hidden') || 
            !document.getElementById('btn-proximo').classList.contains('hidden')) return;
        
        if (['ArrowUp', 'w', 'W'].includes(e.key)) moverCobrinha(0, -1);
        if (['ArrowDown', 's', 'S'].includes(e.key)) moverCobrinha(0, 1);
        if (['ArrowLeft', 'a', 'A'].includes(e.key)) moverCobrinha(-1, 0);
        if (['ArrowRight', 'd', 'D'].includes(e.key)) moverCobrinha(1, 0);
    });
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
    cobrinha = [{x: 4, y: 4}]; 
    indiceLetraAtual = 0;
    
    document.getElementById('titulo-fase').innerText = `Fase ${faseAtual + 1}`;
    document.getElementById('btn-proximo').classList.add('hidden');

    const containerConta = document.getElementById('container-conta');
    
    containerConta.innerHTML = `
        <div class="header-jogo">
            <span class="imagem-emoji">${nivel.emoji}</span>
            <div class="palavra-alvo" id="display-palavra"></div>
        </div>
        <div id="campo-relva" class="campo-relva"></div>
        <div class="teclado-dica">Usa as setas do ecrã ou do teu teclado!</div>
        <div class="d-pad">
            <button class="btn-dir btn-up" onclick="moverCobrinha(0, -1)">⬆️</button>
            <button class="btn-dir btn-left" onclick="moverCobrinha(-1, 0)">⬅️</button>
            <button class="btn-dir btn-down" onclick="moverCobrinha(0, 1)">⬇️</button>
            <button class="btn-dir btn-right" onclick="moverCobrinha(1, 0)">➡️</button>
        </div>
    `;

    atualizarDisplayPalavra();
    gerarMacasParaLetraAtual();
    renderizarGrid();
}

function atualizarDisplayPalavra() {
    const nivel = niveis[faseAtual];
    let display = '';
    for(let i = 0; i < nivel.palavra.length; i++) {
        if(i < indiceLetraAtual) {
            display += nivel.palavra[i] + ' ';
        } else {
            display += '_ ';
        }
    }
    document.getElementById('display-palavra').innerText = display.trim();
}

function obterCoordenadaLivre() {
    let x, y, ocupado;
    do {
        x = Math.floor(Math.random() * tamanhoGrid);
        y = Math.floor(Math.random() * tamanhoGrid);
        
        ocupado = cobrinha.some(seg => seg.x === x && seg.y === y) ||
                  macasNoGrid.some(m => m.x === x && m.y === y);
    } while (ocupado);
    return {x, y};
}

function gerarMacasParaLetraAtual() {
    const nivel = niveis[faseAtual];
    macasNoGrid = [];
    
    if (indiceLetraAtual >= nivel.palavra.length) return;
    
    const letraCerta = nivel.palavra[indiceLetraAtual];
    
    const cordCerta = obterCoordenadaLivre();
    macasNoGrid.push({x: cordCerta.x, y: cordCerta.y, char: letraCerta});
    
    let alfabetoMisto = nivel.alfabeto.split('').sort(() => 0.5 - Math.random());
    for(let i = 0; i < 2; i++) {
        const cordErrada = obterCoordenadaLivre();
        macasNoGrid.push({x: cordErrada.x, y: cordErrada.y, char: alfabetoMisto[i]});
    }
}

function renderizarGrid() {
    const grid = document.getElementById('campo-relva');
    grid.innerHTML = '';
    
    for(let y = 0; y < tamanhoGrid; y++) {
        for(let x = 0; x < tamanhoGrid; x++) {
            const celula = document.createElement('div');
            celula.classList.add('celula-campo');
            
            const isCabeca = cobrinha[0].x === x && cobrinha[0].y === y;
            const isCorpo = cobrinha.some((seg, idx) => idx !== 0 && seg.x === x && seg.y === y);
            const macaAqui = macasNoGrid.find(m => m.x === x && m.y === y);
            
            if (isCabeca) {
                const cabecaDiv = document.createElement('div');
                cabecaDiv.classList.add('cabeca-cobra');
                celula.appendChild(cabecaDiv);
            } else if (isCorpo) {
                const corpoDiv = document.createElement('div');
                corpoDiv.classList.add('corpo-cobra');
                celula.appendChild(corpoDiv);
            } else if (macaAqui) {
                const macaDiv = document.createElement('div');
                macaDiv.classList.add('letra-maca');
                macaDiv.innerText = macaAqui.char;
                celula.appendChild(macaDiv);
            }
            
            grid.appendChild(celula);
        }
    }
}

function moverCobrinha(dx, dy) {
    const cabeca = cobrinha[0];
    const nx = cabeca.x + dx;
    const ny = cabeca.y + dy;
    
    if (nx < 0 || nx >= tamanhoGrid || ny < 0 || ny >= tamanhoGrid) return;
    
    if (cobrinha.some(seg => seg.x === nx && seg.y === ny)) return;

    const nivel = niveis[faseAtual];
    const letraAlvo = nivel.palavra[indiceLetraAtual];
    const indexMacaAtingida = macasNoGrid.findIndex(m => m.x === nx && m.y === ny);

    if (indexMacaAtingida !== -1) {
        const macaAtingida = macasNoGrid[indexMacaAtingida];
        if (macaAtingida.char === letraAlvo) {
            cobrinha.unshift({x: nx, y: ny});
            indiceLetraAtual++;
            atualizarDisplayPalavra();
            
            if (indiceLetraAtual === nivel.palavra.length) {
                macasNoGrid = []; 
                document.getElementById('btn-proximo').classList.remove('hidden');
            } else {
                gerarMacasParaLetraAtual();
            }
        } else {
            const gridEl = document.getElementById('campo-relva');
            gridEl.classList.add('erro');
            setTimeout(() => gridEl.classList.remove('erro'), 300);
            return; 
        }
    } else {
        cobrinha.unshift({x: nx, y: ny});
        cobrinha.pop(); 
    }
    
    renderizarGrid();
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