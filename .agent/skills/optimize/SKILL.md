---
name: optimize
description: Use when the user wants to optimize performance, improve PageSpeed score, check if the site is optimized, or before deploying to production. Covers loading (images, CSS, fonts, scripts, resource hints) AND runtime (animations, RAF, scroll). Sections ordered from most common to most specific.
---

# Skill: Optimize

Referência rápida para otimizações de performance.

**Metas:**
- PageSpeed: **90+**
- Runtime: **60 FPS**
- CLS: **< 0.1**
- TBT: **< 200ms**

Para instruções detalhadas, use o workflow `/otimizar`.

---

# AUDITORIA PRIMEIRO (OBRIGATÓRIO)

**NUNCA corrija antes de auditar.** Leia TODOS os arquivos e liste TODOS os problemas.

## Checklist de Auditoria

Para CADA `<img>`:
- [ ] Usa CDN? width numérico? height numérico? loading correto?

Para CADA `<script>`:
- [ ] Tem defer/async? É minificado? Pode ser removido?

Para CADA biblioteca:
- [ ] CSS E JS podem ser removidos? (ambos, não só um)

Hero/LCP:
- [ ] opacity:0? data-aos? animação entrada?

Fonts:
- [ ] Quantos weights? (máx 3) display=swap?

Runtime (se houver animações):
- [ ] Quantos RAF loops? (deve ser 1) Throttle no scroll?

Three.js (se houver):
- [ ] GLB > 500KB? Usa Draco? .min.js? Luzes? (máx 3)

**Apresente relatório completo antes de corrigir.**

---

# REGRAS DE CORREÇÃO

1. **Exaustivo**: Corrigir TODAS as imagens, não apenas algumas
2. **Completo**: Remover biblioteca = remover CSS + JS + código dependente
3. **Numérico**: width/height SEMPRE números (NUNCA "auto" ou "100%")
4. **Verificar**: Após corrigir categoria, confirmar que TODOS itens foram feitos

---

# ESSENCIAL (Toda Landing Page)

## 1. Imagens

```html
<!-- ERRADO -->
<img src="..." width="600" height="auto">

<!-- CORRETO -->
<img
  src="/.netlify/images?url=/images/foto.jpg&w=600&q=80"
  width="600"
  height="400"
  loading="lazy"
>
```

- [ ] Netlify CDN com `q=80`
- [ ] **width + height NUMÉRICOS**
- [ ] Hero: `loading="eager"` + `fetchpriority="high"`
- [ ] Demais: `loading="lazy"`
- [ ] Imagens grandes com `srcset`

## 2. Resource Hints

```html
<head>
  <!-- Preconnect críticos -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

  <!-- DNS Prefetch secundários -->
  <link rel="dns-prefetch" href="//www.google-analytics.com">

  <!-- Preload LCP -->
  <link rel="preload" href="/.netlify/images?url=/images/hero.jpg&w=1200&q=80" as="image">
</head>
```

- [ ] Preconnect para fonts
- [ ] DNS-prefetch para analytics
- [ ] Preload do hero image

## 3. Fontes

```html
<!-- CORRETO -->
<link href="...?family=Font:wght@400;700&display=swap">
```

- [ ] **Max 2-3 weights**
- [ ] `display=swap`
- [ ] Preconnect

## 4. CSS

```html
<!-- Async loading -->
<link rel="stylesheet" href="/style.css" media="print" onload="this.media='all'">
```

- [ ] Critical CSS inline
- [ ] CSS externo async
- [ ] Remover CSS não usado

## 5. Hero (LCP)

- [ ] Sem animação de ENTRADA
- [ ] Sem `opacity: 0` inicial
- [ ] Sem `data-aos`

## 6. Scripts

```html
<script src="/script.js" defer></script>
```

| Biblioteca | Substituto |
|------------|------------|
| jQuery | Vanilla JS |
| Swiper | CSS puro |
| Moment.js | Intl API |

- [ ] Scripts com `defer`
- [ ] Bibliotecas mínimas

## 7. Third-Party (Analytics, Pixels)

```javascript
// Carregar após interação ou 4s
['scroll', 'click'].forEach(e =>
  addEventListener(e, loadAnalytics, { once: true })
);
setTimeout(loadAnalytics, 4000);
```

- [ ] Delay de 4s ou interação
- [ ] DNS-prefetch

## 8. Vídeos

```html
<video poster="poster.jpg" preload="none">
  <source src="video.webm" type="video/webm">
</video>
```

- [ ] `poster` + `preload="none"`
- [ ] WebM primeiro

## 9. Iframes

```html
<iframe src="..." loading="lazy"></iframe>
```

- [ ] `loading="lazy"`
- [ ] Facade pattern para YouTube

## 10. SVGs

- [ ] Inline para ícones < 1KB
- [ ] Arquivo com width/height para maiores
- [ ] Otimizar com SVGO

## 11. Meta Tags

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#ffffff">
```

## 12. DOM

- [ ] < 1500 nós
- [ ] Evitar divs aninhadas
- [ ] Elementos semânticos

## 13. Content-Visibility

```css
.section-below-fold {
  content-visibility: auto;
  contain-intrinsic-size: 0 500px;
}
```

## 14. Acessibilidade

```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; }
}
```

---

# CONDICIONAL (Se Houver)

## 15. Animações JS

```javascript
// Throttle
let scheduled = false;
addEventListener('scroll', () => {
  if (!scheduled) {
    requestAnimationFrame(() => { update(); scheduled = false; });
    scheduled = true;
  }
}, { passive: true });
```

- [ ] Scroll throttle RAF
- [ ] Único RAF loop
- [ ] Pausar off-screen
- [ ] Pausar tab inativa

## 16. Animações CSS

```css
/* ERRADO */
.element { will-change: transform; }

/* CORRETO - apenas contínuas */
.ticker { will-change: transform; }
```

- [ ] Sem `will-change` permanente
- [ ] Sem `filter: grayscale()` hover

## 17. Carrosséis

```css
.ticker-track {
  animation: scroll 30s linear infinite;
  will-change: transform;
}
```

- [ ] CSS puro (sem bibliotecas)

## 18. Canvas

- [ ] Sem `shadowBlur`
- [ ] Max 40 partículas

## 19. Three.js

```javascript
// Draco para GLB > 500KB
loader.setDRACOLoader(dracoLoader);

// Mobile
renderer = new THREE.WebGLRenderer({ antialias: !isMobile });
renderer.setPixelRatio(isMobile ? 1 : 2);
```

- [ ] GLB com Draco (se > 500KB)
- [ ] Three.js .min.js
- [ ] Max 3 luzes
- [ ] Antialias off mobile

---

# CHECKLIST RÁPIDO

## Essencial
- [ ] Imagens: CDN, width/height, lazy
- [ ] Resource hints: preconnect, dns-prefetch, preload
- [ ] Fontes: 2-3 weights, swap
- [ ] CSS: critical inline, async
- [ ] Hero: sem animação entrada
- [ ] Scripts: defer
- [ ] Third-party: delay 4s
- [ ] content-visibility
- [ ] prefers-reduced-motion

## Condicional
- [ ] Vídeos: poster, preload=none
- [ ] Iframes: loading=lazy
- [ ] Animações: throttle, RAF, observers
- [ ] Carrosséis: CSS puro
- [ ] Canvas: sem shadow
- [ ] Three.js: Draco, min.js

---

# PROBLEMAS COMUNS

| Problema | Causa | Solução |
|----------|-------|---------|
| CLS alto | height="auto" | height NUMÉRICO (número, não "auto") |
| LCP alto | imagem sem CDN/preload | preload + Netlify CDN |
| TBT alto | scripts blocking | defer + delay third-party |
| FCP alto | CSS blocking | media="print" onload="this.media='all'" |
| Fonts flash | sem swap | display=swap na URL |
| Biblioteca parcial | removeu JS mas não CSS | remover AMBOS (CSS e JS) |
| Imagens parciais | corrigiu algumas imagens | verificar TODAS as `<img>` no HTML |
| GLB pesado | modelo sem compressão | Draco compression se > 500KB |

---

# ERROS COMUNS DO AGENTE

1. **Corrigir parcialmente**: Verificar apenas algumas imagens, não todas
2. **Remover biblioteca incompleto**: Remover JS mas esquecer CSS
3. **height="auto"**: Usar "auto" mesmo documentação dizendo para não usar
4. **Pular auditoria**: Ir direto para correções sem listar problemas
5. **Ignorar alto impacto**: Focar em detalhes e ignorar problemas maiores (GLB 3MB)

---

# TESTANDO

1. **PageSpeed**: https://pagespeed.web.dev/
2. **DevTools Performance**: gravar 5s scroll
3. **Meta**: 90+ Score, 60 FPS
