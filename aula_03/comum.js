(function () {
  const state = { seconds: 0, paused: false, timer: null, font: 18 };
  const $ = (s) => document.querySelector(s);
  window.Brin = {
    state,
    normalize(value) { return (value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z]/g, ''); },
    shuffle(items) { return [...items].sort(() => Math.random() - .5); },
    renderTime() { const m = String(Math.floor(state.seconds / 60)).padStart(2, '0'); const s = String(state.seconds % 60).padStart(2, '0'); $('#timer').textContent = `⏱ ${m}:${s}`; },
    startTimer() { clearInterval(state.timer); state.paused = false; $('#pause').textContent = 'PAUSAR'; state.timer = setInterval(() => { if (!state.paused) { state.seconds++; this.renderTime(); } }, 1000); },
    resetTimer() { state.seconds = 0; this.renderTime(); },
    pause() { state.paused = !state.paused; document.body.classList.toggle('is-paused', state.paused); $('#pause').textContent = state.paused ? 'CONTINUAR' : 'PAUSAR'; },
    sound() { try { const Ctx = window.AudioContext || window.webkitAudioContext; const ctx = new Ctx(); const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.frequency.setValueAtTime(523, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(784, ctx.currentTime + .15); gain.gain.setValueAtTime(.08, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .2); osc.connect(gain).connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + .21); } catch (_) {} },
    celebrate() { this.sound(); try { const Ctx = window.AudioContext || window.webkitAudioContext; const ctx = new Ctx(); [523, 659, 784, 1047].forEach((note, i) => { const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.frequency.value = note; gain.gain.setValueAtTime(.07, ctx.currentTime + i * .16); gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + i * .16 + .25); osc.connect(gain).connect(ctx.destination); osc.start(ctx.currentTime + i * .16); osc.stop(ctx.currentTime + i * .16 + .27); }); } catch (_) {} try { speechSynthesis.speak(new SpeechSynthesisUtterance('Parabéns! Você conseguiu!')); } catch (_) {} },
    praise(text = 'MUITO BEM!') { this.sound(); const el = $('#feedback'); el.textContent = text; el.classList.remove('show'); void el.offsetWidth; el.classList.add('show'); },
    gentleError(el) { if (!el) return; el.classList.remove('soft-error'); void el.offsetWidth; el.classList.add('soft-error'); },
    page(title, content) { $('#game').innerHTML = `<h1 class="title">${title}</h1>${content}`; },
    end(message) { clearInterval(state.timer); this.page('PARABÉNS!', `<div class="success">${message}</div><p class="subtitle">VOCÊ FOI INCRÍVEL!</p>`); this.celebrate(); },
    studentFlow(onReady, withSpeed = false) {
      let turma = null, aluno = null, speed = 'normal';
      const chooseName = () => {
        const base = BRINCAR_ALUNOS[turma];
        this.page('AGORA, QUAL É O SEU NOME?', `<p class="subtitle">TURMA ${base.nome}</p><div class="choices">${base.alunos.map(n => `<button class="choice" data-name="${n}">${n}</button>`).join('')}</div>`);
        document.querySelectorAll('[data-name]').forEach(b => b.onclick = () => start(b.dataset.name));
      };
      const start = (name) => { aluno = this.normalize(name); if (withSpeed) chooseSpeed(); else onReady({ turma, aluno }); };
      const chooseSpeed = () => { this.page('ESCOLHA A VELOCIDADE', `<p class="subtitle">COMO VOCÊ QUER QUE OS BALÕES CAIAM?</p><div class="speed-options"><button class="mode-button selected" data-speed="calma">CALMA</button><button class="mode-button" data-speed="normal">NORMAL</button><button class="mode-button" data-speed="rapida">RÁPIDA</button></div><button class="primary" id="speed-go">COMEÇAR</button>`); document.querySelectorAll('[data-speed]').forEach(b => b.onclick = () => { speed = b.dataset.speed; document.querySelectorAll('[data-speed]').forEach(x => x.classList.toggle('selected', x === b)); }); $('#speed-go').onclick = () => onReady({ turma, aluno, speed }); };
      this.page('VAMOS COMEÇAR?', `<p class="subtitle">PRIMEIRO, ESCOLHA A SUA TURMA</p><div class="choices"><button class="choice" data-class="jatoba">JATOBÁ</button><button class="choice purple" data-class="saoSebastiao">SÃO SEBASTIÃO</button></div>`);
      document.querySelectorAll('[data-class]').forEach(b => b.onclick = () => { turma = b.dataset.class; chooseName(); });
    },
    setup() { this.renderTime(); $('#pause').onclick = () => this.pause(); $('#restart').onclick = () => location.reload(); $('#font-more').onclick = () => { state.font = Math.min(25, state.font + 2); document.documentElement.style.setProperty('--fonte', `${state.font}px`); }; $('#font-less').onclick = () => { state.font = Math.max(14, state.font - 2); document.documentElement.style.setProperty('--fonte', `${state.font}px`); }; }
  };
})();
