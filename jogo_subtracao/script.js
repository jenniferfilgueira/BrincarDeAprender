const niveis = [
    { id: 1, item: "🍎", total: 4, remover: 1, opcoes: [2, 3, 4], resposta: 3 },
    { id: 2, item: "🚗", total: 5, remover: 2, opcoes: [1, 2, 3], resposta: 3 },
    { id: 3, item: "⭐", total: 6, remover: 4, opcoes: [2, 3, 5], resposta: 2 },
    { id: 4, item: "🐶", total: 3, remover: 2, opcoes: [1, 2, 3], resposta: 1 },
    { id: 5, item: "⚽", total: 7, remover: 3, opcoes: [3, 4, 5], resposta: 4 }
];

let nivelAtual = 0;
let timerInterval;
let segundos = 0;

const tituloNivel = document.getElementById('titulo-nivel');
const containerConta = document.getElementById('container-conta');
const containerOpcoes = document.getElementById('container-opcoes');
const btnProximo = document.getElementById('btn-proximo');
const btnReiniciar = document.getElementById('btn-reiniciar');
const displayCronometro = document.getElementById('cronometro');

function iniciarCronometro() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        segundos++;
        const min = String(Math.floor(segundos / 60)).padStart(2, '0');
        const seg = String(segundos % 60).padStart(2, '0');
        displayCronometro.innerText = `⏱️ ${min}:${seg}`;
    }, 1000);
}

function carregarNivel() {
    btnProximo.classList.add('hidden');
    btnReiniciar.classList.add('hidden');
    
    if (nivelAtual >= niveis.length) {
        finalizarJogo();
        return;
    }

    const nivel = niveis[nivelAtual];
<<<<<<< HEAD
    tituloNivel.innerText = `NÍVEL ${nivel.id}: SUBTRAIA OS GRUPOS`;

    const elementoItem = `<div class="math-item">${nivel.item}</div>`;
    
=======
    tituloNivel.innerText = `NÍVEL ${nivel.id}: SUBTRAÇÃO`;

    const elementoItem = `<span class="math-item">${nivel.item}</span>`;
>>>>>>> b6f4f1e40d399dc23d1c058772a3d318ef9f31f6
    const grupoTotal = `<div class="image-group">${elementoItem.repeat(nivel.total)}</div>`;
    const grupoRemover = `<div class="image-group">${elementoItem.repeat(nivel.remover)}</div>`;
    
    containerConta.innerHTML = `
        ${grupoTotal}
<<<<<<< HEAD
        <div class="operator">-</div>
        ${grupoRemover}
        <div class="operator">=</div>
        <div class="operator">?</div>
=======
        <span class="operator">-</span>
        ${grupoRemover}
        <span class="operator">=</span>
        <span class="operator">?</span>
>>>>>>> b6f4f1e40d399dc23d1c058772a3d318ef9f31f6
    `;

    containerOpcoes.innerHTML = '';
    nivel.opcoes.forEach(opcao => {
        const btn = document.createElement('button');
        btn.classList.add('option-btn');
        btn.innerText = opcao;
        
        btn.onclick = () => verificarResposta(opcao, btn);
        containerOpcoes.appendChild(btn);
    });
}

function verificarResposta(selecionada, botaoClicado) {
    const nivel = niveis[nivelAtual];
    const botoes = document.querySelectorAll('.option-btn');
    
    if (selecionada === nivel.resposta) {
        botaoClicado.classList.add('correct');
        
        botoes.forEach(b => {
            b.classList.add('disabled');
            b.onclick = null;
        });
        
        btnProximo.classList.remove('hidden'); 
    } else {
        botaoClicado.classList.add('wrong');
        botaoClicado.classList.add('disabled');
        botaoClicado.onclick = null;
    }
}

btnProximo.addEventListener('click', () => {
    nivelAtual++;
    carregarNivel();
});

btnReiniciar.addEventListener('click', () => {
    nivelAtual = 0;
    segundos = 0;
    displayCronometro.innerText = `⏱️ 00:00`;
    iniciarCronometro();
    carregarNivel();
});

function finalizarJogo() {
    clearInterval(timerInterval);
    tituloNivel.innerText = `PARABÉNS! VOCÊ COMPLETOU TUDO!`;
    
    containerConta.innerHTML = `
<<<<<<< HEAD
        <div style="font-size: 26px; color: #3A2489; text-align: center; font-weight: bold;">
            Seu tempo final foi de: <br> 
            <span style="color: #4CAF50; font-size: 45px;">${displayCronometro.innerText.replace('⏱️ ', '')}</span>
=======
        <div style="font-size: 30px; text-align: center;">
            Seu tempo final foi de: <br> 
            <span style="color: #4CAF50; font-size: 50px;">${displayCronometro.innerText.replace('⏱️ ', '')}</span>
>>>>>>> b6f4f1e40d399dc23d1c058772a3d318ef9f31f6
        </div>
    `;
    
    containerOpcoes.innerHTML = '';
    btnReiniciar.classList.remove('hidden');
}

window.onload = () => {
    iniciarCronometro();
    carregarNivel();
};