// ===== MENU CELULAR =====
const menuBtn = document.querySelector('.menu-btn');
const menu = document.querySelector('#menu');

function fecharMenu() {
  menu.classList.remove('menu--aberto');
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.setAttribute('aria-label', 'Abrir menu');
}
menuBtn.addEventListener('click', () => {
  const aberto = menu.classList.toggle('menu--aberto');
  menuBtn.setAttribute('aria-expanded', aberto);
  menuBtn.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', fecharMenu));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && menu.classList.contains('menu--aberto')) { fecharMenu(); menuBtn.focus(); }
});

// ===== PALAVRA ROTATIVA =====
const palavra = document.querySelector('.palavra');
const lista = (typeof PALAVRAS_HERO !== 'undefined' && PALAVRAS_HERO.length) ? PALAVRAS_HERO : ['respeito'];
const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (palavra && lista.length > 1 && !semMovimento) {
  let i = 0;
  setInterval(() => {
    palavra.classList.add('troca');
    setTimeout(() => {
      i = (i + 1) % lista.length;
      palavra.textContent = lista[i];
      palavra.classList.remove('troca');
    }, 380);
  }, 2800);
}

// ===== FOTOS DA SEMANA (condicional) =====
const fotos = (typeof FOTOS_DA_SEMANA !== 'undefined' && FOTOS_DA_SEMANA.fotos) || [];

if (fotos.length) {
  document.querySelector('#fotos').hidden = false;
  document.querySelectorAll('[data-requer="fotos"]').forEach(el => el.hidden = false);

  const rotulo = document.querySelector('.fotos__semana');
  if (FOTOS_DA_SEMANA.semana) { rotulo.textContent = FOTOS_DA_SEMANA.semana; rotulo.hidden = false; }

  const grade = document.querySelector('.fotos__grade');
  const visor = document.querySelector('.visor');
  const visorImg = visor.querySelector('img');
  const visorLegenda = visor.querySelector('figcaption');
  let atual = 0;

  const mostrar = i => {
    atual = (i + fotos.length) % fotos.length;
    visorImg.src = fotos[atual].arquivo;
    visorImg.alt = fotos[atual].alt;
    visorLegenda.textContent = fotos[atual].legenda || '';
  };

  fotos.forEach((f, i) => {
    const li = document.createElement('li');
    const botao = document.createElement('button');
    botao.className = 'fotos__item';
    botao.setAttribute('aria-label', `Ampliar foto: ${f.alt}`);
    const img = document.createElement('img');
    Object.assign(img, { src: f.arquivo, alt: f.alt, loading: 'lazy', decoding: 'async' });
    botao.appendChild(img);
    botao.addEventListener('click', () => { mostrar(i); visor.showModal(); });
    li.appendChild(botao);
    grade.appendChild(li);
  });

  visor.querySelector('.visor__fechar').addEventListener('click', () => visor.close());
  visor.querySelector('.visor__nav--ant').addEventListener('click', () => mostrar(atual - 1));
  visor.querySelector('.visor__nav--prox').addEventListener('click', () => mostrar(atual + 1));
  visor.addEventListener('click', e => { if (e.target === visor) visor.close(); });
  visor.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') mostrar(atual - 1);
    if (e.key === 'ArrowRight') mostrar(atual + 1);
  });
  visor.querySelectorAll('.visor__nav').forEach(b => b.hidden = fotos.length === 1);
}

// ===== EVENTOS (condicional) =====
const eventos = (typeof EVENTOS !== 'undefined' && EVENTOS) || [];

if (eventos.length) {
  document.querySelector('#eventos').hidden = false;
  const listaEv = document.querySelector('.eventos__lista');

  eventos.forEach(ev => {
    const card = document.createElement('article');
    card.className = 'evento revela';

    if (ev.imagem) {
      const img = document.createElement('img');
      Object.assign(img, { src: ev.imagem, alt: ev.alt || '', loading: 'lazy' });
      card.appendChild(img);
    }
    const corpo = document.createElement('div');
    corpo.className = 'evento__corpo';

    const add = (tag, cls, txt) => {
      if (!txt) return;
      const el = document.createElement(tag);
      if (cls) el.className = cls;
      el.textContent = txt;
      corpo.appendChild(el);
    };
    add('span', 'evento__data', ev.data);
    add('h3', '', ev.titulo);
    add('p', '', ev.descricao);

    if (ev.contribuicao && ev.contribuicao.url) {
      const a = document.createElement('a');
      Object.assign(a, { className: 'btn btn--azul', href: ev.contribuicao.url, target: '_blank', rel: 'noopener', textContent: ev.contribuicao.texto || 'Contribuir' });
      corpo.appendChild(a);
    }
    card.appendChild(corpo);
    listaEv.appendChild(card);
  });
}

// ===== REVELAR AO ROLAR =====
if ('IntersectionObserver' in window) {
  const obs = new IntersectionObserver(entradas => {
    entradas.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visivel'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.revela').forEach(el => obs.observe(el));
} else {
  document.documentElement.classList.add('sem-io');
}

// ===== MENU ATIVO + SOMBRA NO CABEÇALHO =====
const header = document.querySelector('.header');
const links = [...menu.querySelectorAll('a[href^="#"]')];
const secoes = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

window.addEventListener('scroll', () => {
  header.classList.toggle('header--rolado', window.scrollY > 20);
  const pos = window.scrollY + window.innerHeight / 3;
  let ativa = null;
  secoes.forEach(s => { if (!s.hidden && s.offsetTop <= pos) ativa = s.id; });
  links.forEach(a => a.classList.toggle('ativo', a.getAttribute('href') === '#' + ativa));
}, { passive: true });
