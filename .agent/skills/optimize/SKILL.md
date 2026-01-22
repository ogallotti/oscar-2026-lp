---
name: optimize
description: Use when the user wants to optimize performance, improve PageSpeed score, check if the site is optimized, or before deploying to production. Covers images via CDN, critical CSS, defer, lazy loading, hero without animation, and Core Web Vitals.
---

# Skill: Optimize

Referência rápida para otimizações de performance. Meta: **Score 90+ no PageSpeed**.

Para instruções detalhadas, use o workflow `/otimizar`.

---

## Checklist Rápido

### Imagens (Maior Impacto)

```html
<!-- Hero (alta prioridade) -->
<img
  src="/.netlify/images?url=/images/hero.jpg&w=1200&q=80"
  width="1200" height="800"
  alt="Descrição"
  loading="eager"
  fetchpriority="high"
>

<!-- Demais (lazy) -->
<img
  src="/.netlify/images?url=/images/foto.jpg&w=800&q=80"
  width="800" height="600"
  alt="Descrição"
  loading="lazy"
>
```

- [ ] TODAS usando Netlify CDN com `q=80`
- [ ] Todas com `width` e `height`
- [ ] Hero: `loading="eager"` + `fetchpriority="high"`
- [ ] Demais: `loading="lazy"`
- [ ] Imagens críticas com `aspect-ratio` no CSS

### Hero (LCP)

- [ ] Sem animação de ENTRADA (sem AOS, sem fade, sem opacity:0)
- [ ] Sem `data-aos` no hero
- [ ] Sem `transform: translateY()` inicial
- [ ] Renderiza instantaneamente
- [ ] Animações pós-load são permitidas

### CSS Crítico

```html
<head>
  <style>
    /* Estilos do hero inline - COMPLETO */
    .hero { ... }
    .hero-title { ... }
    .cta-button { ... }
    .logo { filter: drop-shadow(...); } /* incluir se existir */
    .floating-icons { ... } /* se visíveis no hero */
  </style>

  <!-- CSS restante com carregamento async -->
  <link rel="stylesheet" href="/style.css" media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="/style.css"></noscript>
</head>
```

- [ ] Critical CSS inline no head (TUDO acima da dobra)
- [ ] drop-shadow da logo no critical CSS
- [ ] CSS restante com carregamento async

### JavaScript

```html
<!-- Antes de </body> -->
<script src="/script.js" defer></script>
<script src="https://unpkg.com/@phosphor-icons/web" defer></script>
```

- [ ] Scripts no final do body
- [ ] Scripts não-críticos com `defer`

### Preconnects e DNS

```html
<head>
  <!-- Críticos: preconnect -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://unpkg.com">

  <!-- Não-críticos: dns-prefetch (NÃO preconnect) -->
  <link rel="dns-prefetch" href="//connect.facebook.net">
  <link rel="dns-prefetch" href="//www.facebook.com">
</head>
```

### Fontes

- [ ] Google Fonts com `display=swap`
- [ ] Preload da fonte principal (geralmente 700)

### Main Thread

```css
/* Seções below-fold */
.benefits, .testimonials, .faq, footer {
  content-visibility: auto;
  contain-intrinsic-size: 0 500px;
}

section {
  contain: layout style;
}
```

- [ ] `content-visibility: auto` em seções below-fold
- [ ] `contain: layout style` em sections
- [ ] `contain-intrinsic-size` definido

---

## Preload de Recursos Críticos

```html
<head>
  <!-- Logo -->
  <link rel="preload" href="/images/logo.svg" as="image" fetchpriority="high">

  <!-- Imagem hero com srcset -->
  <link rel="preload" as="image"
    href="/.netlify/images?url=/images/hero.jpg&w=1200&q=80"
    imagesrcset="
      /.netlify/images?url=/images/hero.jpg&w=640&q=80 640w,
      /.netlify/images?url=/images/hero.jpg&w=1200&q=80 1200w"
    imagesizes="(max-width: 768px) 100vw, 50vw">

  <!-- Fonte principal -->
  <link rel="preload" href="URL_DA_FONTE.woff2" as="font" type="font/woff2" crossorigin>
</head>
```

---

## Facebook Pixel Otimizado

```javascript
// Carregar apenas na interação ou após 4s
(function() {
  var loaded = false;
  function load() {
    if (loaded) return;
    loaded = true;
    // código do pixel aqui
  }

  ['scroll', 'click', 'touchstart'].forEach(e =>
    window.addEventListener(e, load, { once: true, passive: true })
  );

  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => setTimeout(load, 4000));
  } else {
    setTimeout(load, 4000);
  }
})();
```

---

## Problemas Comuns

| Problema | Causa | Solução |
|----------|-------|---------|
| LCP alto | Imagem hero grande ou sem CDN | Usar CDN com `w=` e `q=80` |
| CLS alto | Imagens sem dimensões | Adicionar `width` e `height` |
| Render blocking | CSS/JS no head | Mover para body ou usar `defer` |
| Fonts piscando | Falta display=swap | Adicionar `&display=swap` na URL |
| Hero lento | Animação de entrada | Remover AOS/fade do hero |

---

## Testando

1. **PageSpeed Insights**: https://pagespeed.web.dev/
2. **Meta**: 90+ em Performance
3. **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
