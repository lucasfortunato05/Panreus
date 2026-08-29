# PANRÉUS — Site institucional one-page

Contexto permanente do projeto. Leia antes de qualquer alteração.

## O negócio

- **Panréus | Padaria e Cafeteria** — mais de 30 anos de história em Cachoeirinha/RS.
- Acabou de inaugurar um espaço novo (jul/2026): **"nova fase, mesma essência"**.
- Narrativa central: *"madrugadas, muito trabalho, fé e o sonho de oferecer mais do que pão: um lugar onde as pessoas se sintam em casa"*.
- Endereço: **Rua Monteiro Lobato, 407 — Parque da Matriz, Cachoeirinha/RS**.
- Horário: **segunda a sábado, 07h às 20h, sem fechar ao meio-dia** (domingo fechado).
- WhatsApp: `https://wa.me/555121605528` — exibir como **(51) 2160-5528**.
- iFood: `https://www.ifood.com.br/delivery/cachoeirinha-rs/pan-reus-parque-da-matriz` — CTA **"Peça no iFood"**.
- Instagram: **@panreus_**.
- Produtos: pães artesanais, confeitaria (cucas, doces), tortas (**morango com chantilly é destaque**), fatias, sanduíches, café, buffet de café da manhã.
- CTAs principais do site: **WhatsApp E iFood, sempre em par**.

## Identidade visual (derivada da marca real)

- Logo: badge circular com script "Panreus" verde-sálvia sobre creme. O cliente fornecerá o arquivo; **usar placeholder tipográfico por enquanto**.
- Paleta (custom properties em `css/style.css`):
  - `--verde-panreus: #6B7A5E` — sálvia escuro, cor da marca
  - `--verde-profundo: #3E4A36` — fundos escuros, footer
  - `--creme: #F7F3EA` — fundo claro
  - `--crosta: #C98F4E` — dourado de pão assado, acentos
  - `--carvao: #211E1A` — texto
  - `--neon: #FFFDF6` — branco quente, para o efeito neon do hero
  - Derivados (definidos no CSS): `--creme-escuro: #E9E4D5` (gradiente de placeholders), `--crosta-texto: #8F6430` (texto dourado acessível sobre creme) e variações translúcidas (`--carvao-60`, `--neon-80`, `--neon-22` — tubo de neon apagado, `--verde-panreus-15`, `--verde-profundo-40`, `--verde-profundo-92` — fundo do header rolado)
- Referência do espaço físico: madeira clara, plantas pendentes, luz quente, **letreiro NEON branco cursivo "Panreus" na parede** (o neon inspira o hero).
- Tom: **acolhedor, artesanal, orgulhoso da tradição** — nunca corporativo, nunca clichê de padaria (**proibido clipart de trigo**).

## Tipografia (decidida na fundação — não trocar sem motivo)

- **Display (títulos):** Fraunces — serifada variável, títulos sempre em `opsz` alto (o navegador resolve via `font-optical-sizing: auto`), eixos SOFT/WONK **desligados** (não carregados). Itálico 600 para destaques como *"mesma essência"*.
- **Corpo:** Alegreya Sans — humanista de raiz caligráfica (Huerta Tipográfica), 400 corpo / 500 rótulos / 700 CTAs, corpo 16–18px com line-height ~1.6.
- **Script (só momentos "neon"/assinatura):** Sacramento — monolinear conectada, traço único como tubo de neon. **Regras:** usar só no hero e em 1–2 apartes, sempre ≥40px, em `--neon` com text-shadow em camadas (classe `.script-neon`), sobre fundos escuros (`--carvao`/`--verde-profundo`). Nunca em navegação, botões ou caixa-alta contínua. **Exceção definida na etapa 3:** assinatura discreta em seção clara (`.historia__assinatura`) — sem glow, `--verde-panreus`, ≥32px (texto grande, 4.17:1 passa AA).
- Carregadas via Google Fonts no `<head>`. Tokens: `--font-display`, `--font-body`, `--font-script`.
- Proibido substituir por Playfair Display ou Inter.

## Stack e restrições

- Site **100% estático**: `index.html` + `css/` + `js/` + `assets/` — vai para `public_html` da Hostinger via upload, **SEM build step**. Nada de npm, bundler ou framework.
- **GSAP 3 + ScrollTrigger + Lenis** (smooth scroll) via CDN, já incluídos no `index.html`.
- **Mobile-first**, acessível: focus visível, `prefers-reduced-motion` respeitado (JS e CSS).
- **Português do Brasil** em todo o copy.

## Imagens

- Ainda **não temos as fotos**. `assets/img/` existe com placeholders elegantes (blocos com gradiente creme/verde e label do nome do arquivo — classe `.img-ph` no CSS).
- Slots definidos em `assets/img/MANIFEST.md`: `hero-fachada.jpg`, `interior-cafe.jpg`, `vitrine-doces.jpg`, `torta-morango.jpg`, `sanduiche.jpg`, `buffet-cafe.jpg`, `equipe.jpg`, `historia-pb.jpg`.
- **Todo `<img>` já deve apontar para esses caminhos finais**, com `alt` descritivo, para que ao soltar as fotos na pasta tudo funcione sem tocar no código.

## Estrutura da página (ordem fixa das seções)

1. `#hero` — efeito neon do letreiro + fachada
2. `#produtos-marquee` — faixa marquee de produtos
3. `#historia` — 30 anos, transição preto&branco → cor
4. `#vitrine` — vitrine de produtos por categoria
5. `#buffet` — buffet de café da manhã (destaque)
6. `#depoimentos` — depoimentos reais de clientes
7. `#localizacao` — endereço + horários + mapa
8. `#footer` — contatos

## Convenções do código

- Reveal-on-scroll: adicionar `data-reveal` ao elemento (variações: `data-reveal="up|left|right|fade"`, `data-reveal-delay="0.2"`). O helper em `js/main.js` cuida do resto e respeita `prefers-reduced-motion`.
- Imagens: envolver todo `<img>` em `<figure class="img-ph" data-label="nome-do-arquivo.jpg">`. Se o arquivo ainda não existir, o JS marca o wrapper e o CSS mostra o placeholder com gradiente + label; quando a foto for adicionada, ela aparece sem tocar no código.
- Container/section: usar as utilitárias `.container` e `.section` do design system.
- Cores, espaçamentos e tamanhos de fonte: **sempre via custom properties** — nunca hardcode de hex ou px soltos.
- Contraste (WCAG AA): `--crosta` reprova como texto pequeno sobre creme (2.52:1) — usar só em acentos não-textuais e texto grande sobre fundo escuro. Para texto dourado pequeno sobre creme, usar `--crosta-texto` (#8F6430, 4.7:1). Em `.section--dark`, o `.eyebrow` já vira creme automaticamente.
- Seções vazias usam `aria-label`; **ao construir cada seção**, dar ao `<h2>` o id `X-titulo` (ex.: `historia-titulo`) e trocar o `aria-label` por `aria-labelledby="X-titulo"`.
- Open Graph: `og:image`/`og:url` usam o placeholder `SEU-DOMINIO.com.br` — substituir quando o cliente confirmar o domínio (marcado com `TODO(domínio)` no `index.html`).
- Header/menu: header fixo (`.site-header`, ganha fundo via ScrollTrigger em `is-scrolled`); painel mobile `#menu-mobile` é **irmão** do header (não filho — o `backdrop-filter` do header viraria containing block do `position: fixed`). Scroll travado via `html.menu-aberto` + `lenis.stop()`.
- Hero/neon: letreiro em duas camadas de texto sobrepostas — `.hero__letreiro-tubo` (apagado, sempre visível) + `.hero__letreiro-neon` (acesa, com glow). O flicker anima **só opacity** da camada acesa. `html.js` (classe adicionada por script inline no `<head>`) apaga o neon no primeiro paint; sem JS/CDN ele nasce aceso.
- Marquee: fita decorativa (`aria-hidden` no wrapper `.marquee__fita`), loop GSAP `xPercent: -50` com conteúdo em dobro (grupos terminam em `·&nbsp;` para a emenda ficar invisível); contraste verde-profundo/crosta (3.36:1) é exceção consciente por ser textura. Botão "Pausar animação" fora da subárvore `aria-hidden` (WCAG 2.2.2), oculto sem JS e em `prefers-reduced-motion` (fita já estática).
- História: transição P&B→cor via `clip-path` com scrub (desktop: moldura sticky, curso = coluna de texto; mobile: trigger na própria moldura). Foto colorida visível por padrão sem JS (`html.js` esconde); legenda troca aos 55% do progresso.
- Estado atual: **etapa 3 concluída — hero, header, marquee e História prontos. Faltam: vitrine, buffet, depoimentos, localização e footer.**
