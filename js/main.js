/* =========================================================
   PANRÉUS — main.js
   Lenis (smooth scroll) + GSAP 3 + ScrollTrigger
   Tudo respeita prefers-reduced-motion.
   ========================================================= */

(function () {
  'use strict';

  /* Se algum CDN falhou, degrada para página estática: remove a classe .js
     (o neon nasce aceso via CSS) e não inicializa nada dependente das libs. */
  if (!window.gsap || !window.ScrollTrigger || !window.Lenis) {
    document.documentElement.classList.remove('js');
    return;
  }

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     GSAP + ScrollTrigger
     --------------------------------------------------------- */
  gsap.registerPlugin(ScrollTrigger);

  /* ---------------------------------------------------------
     Lenis — smooth scroll
     Desativado quando o usuário prefere menos movimento.
     --------------------------------------------------------- */
  var lenis = null;

  if (!reduceMotion) {
    lenis = new Lenis({
      duration: 1.1,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true
    });

    // Mantém o ScrollTrigger sincronizado com o scroll do Lenis
    lenis.on('scroll', ScrollTrigger.update);

    // Lenis dirigido pelo ticker do GSAP (um único rAF na página)
    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  /* ---------------------------------------------------------
     Âncoras internas — rolagem suave via Lenis
     (com fallback nativo quando o Lenis está desativado)
     --------------------------------------------------------- */
  document.addEventListener('click', function (e) {
    /* respeita abrir-em-nova-aba (Ctrl/Cmd/Shift/Alt+clique) e cliques já tratados */
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    var link = e.target.closest('a[href^="#"]');
    if (!link) return;

    var target = document.querySelector(link.getAttribute('href'));
    if (!target) return;

    e.preventDefault();

    if (lenis) {
      // A Lenis ignora scroll-margin-top; compensamos via offset
      var margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
      lenis.scrollTo(target, { offset: -margin });
    } else {
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    }

    // Acessibilidade: leva o foco junto com a rolagem
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });

  /* ---------------------------------------------------------
     Helper reutilizável: reveal-on-scroll
     Uso no HTML:
       <div data-reveal>            → sobe + fade (padrão)
       <div data-reveal="left">     → entra da esquerda
       <div data-reveal="right">    → entra da direita
       <div data-reveal="fade">     → só fade
       <div data-reveal data-reveal-delay="0.2"> → atraso em segundos
     Com prefers-reduced-motion, nada é escondido nem animado.
     --------------------------------------------------------- */
  function initReveals() {
    var els = document.querySelectorAll('[data-reveal]');
    if (!els.length || reduceMotion) return;

    els.forEach(function (el) {
      var variant = el.getAttribute('data-reveal') || 'up';
      var delay = parseFloat(el.getAttribute('data-reveal-delay')) || 0;

      var from = { opacity: 0 };
      if (variant === 'up' || variant === '') from.y = 42;
      if (variant === 'left') from.x = -42;
      if (variant === 'right') from.x = 42;
      /* 'fade' → só opacity */

      gsap.from(el, {
        opacity: from.opacity,
        x: from.x || 0,
        y: from.y || 0,
        duration: 0.9,
        delay: delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true
        }
      });
    });
  }

  /* ---------------------------------------------------------
     Placeholders de imagem
     As fotos finais ainda não existem em assets/img/. Quando um
     <img> dentro de .img-ph falha ao carregar, o wrapper ganha
     .img-ph--empty e o CSS exibe o bloco gradiente com o label.
     Ao soltar a foto na pasta, nada precisa mudar no código.
     --------------------------------------------------------- */
  function initImagePlaceholders() {
    document.querySelectorAll('.img-ph img').forEach(function (img) {
      var markEmpty = function () {
        var wrap = img.closest('.img-ph');
        if (wrap) wrap.classList.add('img-ph--empty');
      };

      if (img.complete && img.naturalWidth === 0) {
        markEmpty(); // já falhou antes deste script rodar
      } else {
        img.addEventListener('error', markEmpty, { once: true });
      }
    });
  }

  /* ---------------------------------------------------------
     Header fixo — ganha fundo ao rolar
     --------------------------------------------------------- */
  function initHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    /* Decide pela posição de scroll explícita — isActive do ScrollTrigger tem
       arestas nos extremos (false no fundo exato com end:'max'; true antes do
       start com end numérico, pois clipped negativo passa em !!clipped) */
    function sincronizar(scroll) {
      header.classList.toggle('is-scrolled', scroll >= 32);
    }

    var st = ScrollTrigger.create({
      start: 0,
      end: 999999999,
      onUpdate: function (self) {
        sincronizar(self.scroll());
      }
    });

    /* estado inicial (página aberta já rolada: hash, refresh restaurando posição) */
    sincronizar(st.scroll());
  }

  /* ---------------------------------------------------------
     Menu mobile — abre/fecha com trava de scroll, Esc,
     clique fora e foco circular (toggle + links do painel)
     --------------------------------------------------------- */
  function initMenu() {
    var toggle = document.querySelector('.menu-toggle');
    var panel = document.getElementById('menu-mobile');
    var logo = document.querySelector('.site-header__logo');
    if (!toggle || !panel) return;

    var aberto = false;
    var FOCAVEIS = 'a[href], button:not([disabled])';

    function travarScroll(travar) {
      document.documentElement.classList.toggle('menu-aberto', travar);
      if (lenis) {
        if (travar) { lenis.stop(); } else { lenis.start(); }
      }
      /* painel é modal: fundo sai do foco e da árvore de acessibilidade
         (header fica de fora — logo e botão X continuam operáveis) */
      [document.getElementById('conteudo'), document.getElementById('footer')]
        .forEach(function (el) { if (el) el.inert = travar; });
    }

    function abrir() {
      if (aberto) return;
      aberto = true;
      gsap.killTweensOf(panel); /* mata o fade-out de um fechar() em voo */
      panel.hidden = false;
      toggle.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      travarScroll(true);

      var links = panel.querySelectorAll(FOCAVEIS);
      if (!reduceMotion) {
        /* opacity (não autoAlpha): visibility:hidden impediria o foco imediato */
        gsap.fromTo(panel, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' });
        gsap.fromTo(links,
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, delay: 0.08, ease: 'power3.out', clearProps: 'all' }
        );
      }
      if (links.length) links[0].focus();
    }

    function fechar(devolverFoco) {
      if (!aberto) return;
      aberto = false;
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      travarScroll(false);

      if (!reduceMotion) {
        gsap.killTweensOf(panel); /* mata o fade-in de um abrir() em voo */
        gsap.to(panel, {
          opacity: 0,
          duration: 0.22,
          ease: 'power1.in',
          onComplete: function () {
            panel.hidden = true;
            gsap.set(panel, { clearProps: 'opacity' });
          }
        });
      } else {
        panel.hidden = true;
      }
      if (devolverFoco !== false) toggle.focus();
    }

    /* Logo fica clicável sobre o painel (z-96 > z-95): fecha o menu antes de
       rolar — este listener dispara antes do handler global no document,
       então o Lenis já foi religado quando o scrollTo acontece */
    if (logo) {
      logo.addEventListener('click', function () {
        fechar(false);
      });
    }

    /* Se o viewport cruza o breakpoint desktop com o menu aberto, o CSS some
       com painel e toggle — o estado JS precisa acompanhar (destravar scroll) */
    var mqDesktop = window.matchMedia('(min-width: 64rem)');
    var aoMudarMq = function (e) {
      if (e.matches) fechar(false);
    };
    if (mqDesktop.addEventListener) {
      mqDesktop.addEventListener('change', aoMudarMq);
    } else {
      mqDesktop.addListener(aoMudarMq); /* Safari < 14 */
    }

    toggle.addEventListener('click', function () {
      if (aberto) { fechar(); } else { abrir(); }
    });

    panel.addEventListener('click', function (e) {
      /* clique num link de âncora: fecha e deixa o handler global rolar */
      if (e.target.closest('a[href^="#"]')) {
        fechar(false);
        return;
      }
      /* clique no "vazio" do painel (fora da nav): fecha */
      if (!e.target.closest('.menu-mobile__nav')) fechar();
    });

    document.addEventListener('keydown', function (e) {
      if (!aberto) return;

      if (e.key === 'Escape') {
        fechar();
        return;
      }

      /* foco circular: logo + toggle (botão X) + focáveis do painel —
         o logo entra porque fica visível e clicável sobre o painel */
      if (e.key === 'Tab') {
        var focaveis = (logo ? [logo, toggle] : [toggle]).concat(
          Array.prototype.slice.call(panel.querySelectorAll(FOCAVEIS))
        );
        var primeiro = focaveis[0];
        var ultimo = focaveis[focaveis.length - 1];

        if (e.shiftKey && document.activeElement === primeiro) {
          e.preventDefault();
          ultimo.focus();
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault();
          primeiro.focus();
        }
      }
    });
  }

  /* ---------------------------------------------------------
     Hero — a timeline de ligar o neon
     Camada acesa (.hero__letreiro-neon) anima SÓ opacity:
     3 estalos assimétricos → quase-apagão → acende (~1.4s),
     depois "respira" (±4.5% do glow, ciclo de 4s).
     Com prefers-reduced-motion o CSS já deixa tudo aceso/visível.
     --------------------------------------------------------- */
  function initHero() {
    var neon = document.querySelector('.hero__letreiro-neon');
    if (!neon) return;
    if (reduceMotion) return;

    var entrada = gsap.utils.toArray('[data-hero-entrada]');
    /* autoAlpha (visibility+opacity): CTAs invisíveis não podem ficar tabuláveis */
    gsap.set(entrada, { autoAlpha: 0, y: 24 });

    var tl = gsap.timeline({ delay: 0.35, defaults: { ease: 'none' } });

    tl.set(neon, { opacity: 0 })
      /* estalo 1 */
      .to(neon, { opacity: 0.85, duration: 0.07 })
      .to(neon, { opacity: 0.08, duration: 0.05 }, '+=0.04')
      /* estalo 2 (mais curto) */
      .to(neon, { opacity: 0.65, duration: 0.045 }, '+=0.13')
      .to(neon, { opacity: 0.12, duration: 0.09 }, '+=0.02')
      /* estalo 3 e quase-apagão */
      .to(neon, { opacity: 0.9, duration: 0.06 }, '+=0.12')
      .to(neon, { opacity: 0.05, duration: 0.04 }, '+=0.03')
      /* acende definitivo, glow crescendo */
      .to(neon, { opacity: 1, duration: 0.55, ease: 'power3.out' }, '+=0.15')
      .add('aceso')
      /* conteúdo entra depois do neon, de baixo para cima */
      .to(entrada, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.09, ease: 'power3.out' }, 'aceso-=0.18');

    /* respirar do glow: imperceptível de propósito (a letra fica sólida
       porque o tubo aceso é duplicado por baixo — só o glow varia) */
    tl.call(function () {
      gsap.to(neon, { opacity: 0.955, duration: 2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    }, null, 'aceso');
  }

  /* ---------------------------------------------------------
     Marquee — loop infinito da fita de produtos
     Trilho com o conteúdo em dobro: xPercent 0 → -50 e repete,
     emenda invisível. Sem pausa no hover (é textura).
     --------------------------------------------------------- */
  function initMarquee() {
    var trilho = document.querySelector('[data-marquee-trilho]');
    var botao = document.querySelector('[data-marquee-pausa]');
    if (!trilho) return;
    if (reduceMotion) return; /* fita estática (o CSS esconde o botão) */

    var tween = gsap.to(trilho, {
      xPercent: -50,
      duration: 25,
      ease: 'none',
      repeat: -1
    });

    /* WCAG 2.2.2: movimento automático >5s precisa de pausa acessível */
    if (botao) {
      botao.addEventListener('click', function () {
        var pausar = !tween.paused();
        tween.paused(pausar);
        botao.setAttribute('aria-pressed', String(pausar));
        botao.textContent = pausar ? 'Retomar animação' : 'Pausar animação';
      });
    }
  }

  /* ---------------------------------------------------------
     História — P&B vira cor com o scroll
     A foto colorida se revela por cima da antiga (clip-path,
     de baixo para cima) com scrub; a legenda troca aos 55%.
     Desktop: curso = altura da coluna de texto (moldura sticky).
     Mobile: curso = a própria moldura cruzando o viewport.
     --------------------------------------------------------- */
  function initHistoria() {
    var cor = document.querySelector('.historia__foto--cor');
    var legenda = document.querySelector('[data-historia-legenda]');
    if (!cor) return;

    var antes = legenda ? legenda.querySelector('.historia__legenda-antes') : null;
    var depois = legenda ? legenda.querySelector('.historia__legenda-depois') : null;

    function legendaHoje(hoje) {
      if (!legenda) return;
      legenda.classList.toggle('is-hoje', hoje);
      if (antes) antes.setAttribute('aria-hidden', hoje ? 'true' : 'false');
      if (depois) depois.setAttribute('aria-hidden', hoje ? 'false' : 'true');
    }

    if (reduceMotion) {
      legendaHoje(true); /* o CSS já mostra a foto colorida direto */
      return;
    }

    legendaHoje(false);

    function criarScrub(triggerCfg) {
      function sincronizarLegenda(self) {
        legendaHoje(self.progress > 0.55);
      }

      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerCfg.trigger,
          start: triggerCfg.start,
          end: triggerCfg.end,
          scrub: 1,
          onUpdate: sincronizarLegenda,
          /* onRefresh cobre a criação e a troca de breakpoint no meio do
             scroll (onUpdate só dispara quando o progress MUDA) */
          onRefresh: sincronizarLegenda
        }
      });

      /* opacity sobe nos primeiros ~12% do curso (a camada nunca fica "lavada"
         sobre a P&B); o wipe do clip-path ocupa o curso inteiro */
      tl.fromTo(cor, { opacity: 0 }, { opacity: 1, duration: 0.12, ease: 'none' }, 0)
        .fromTo(cor,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'none' },
          0
        );
    }

    /* matchMedia do GSAP: cria/reverte os triggers ao cruzar o breakpoint */
    var mm = gsap.matchMedia();

    mm.add('(min-width: 64rem)', function () {
      criarScrub({
        trigger: '.historia__texto',
        start: 'top 65%',
        end: 'bottom 70%'
      });
    });

    mm.add('(max-width: 63.999rem)', function () {
      criarScrub({
        trigger: '.historia__moldura',
        start: 'top 80%',
        end: 'bottom 45%'
      });
    });
  }

  /* ---------------------------------------------------------
     Boot
     --------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    document.documentElement.classList.add('js');
    initImagePlaceholders();
    initReveals();
    initHeader();
    initMenu();
    initHero();
    initMarquee();
    initHistoria();
  });
})();
