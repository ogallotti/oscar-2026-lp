---
description: otimizar
---

# Workflow: Otimizar Performance

Meta: **Score 90+ no PageSpeed** e **60 FPS constantes**.

---

# FASE 1: AUDITORIA (OBRIGATÓRIA)

**NUNCA corrija antes de completar a auditoria.**

## Passo 1: Ler Todos os Arquivos

Leia COMPLETAMENTE: `index.html`, `style.css`, `script.js` e qualquer CSS/JS linkado.

## Passo 2: Identificar TODOS os Problemas

### 2.1 Imagens (verificar TODAS)

Para CADA `<img>`:
- [ ] Usa Netlify CDN? (`/.netlify/images?url=...&w=X&q=80`)
- [ ] `width` numérico? (NUNCA "auto")
- [ ] `height` numérico? (NUNCA "auto")
- [ ] `loading` correto? (eager hero, lazy resto)

### 2.2 CSS

- [ ] CSS externo blocante? (sem `media="print" onload`)
- [ ] Bibliotecas CSS não usadas? (Swiper, Bootstrap)
- [ ] Falta critical CSS inline?

### 2.3 Scripts

Para CADA `<script>`:
- [ ] Tem `defer`/`async`?
- [ ] Biblioteca removível?
- [ ] Versão minificada? (.min.js)

### 2.4 Hero/LCP

- [ ] `opacity: 0` inicial?
- [ ] `data-aos`?
- [ ] Animação de entrada CSS?

### 2.5 Resource Hints

- [ ] Falta preconnect fonts?
- [ ] Falta dns-prefetch analytics?
- [ ] Falta preload hero image?

### 2.6 Fontes

- [ ] Weights > 3?
- [ ] Tem `display=swap`?

### 2.7 Third-Party

- [ ] Analytics carrega imediatamente?

### 2.8 JS Runtime (se animações)

- [ ] Múltiplos RAF loops? (deve ser 1)
- [ ] Scroll sem throttle?
- [ ] Não pausa off-screen/tab inativa?

### 2.9 CSS Animations

- [ ] `will-change` permanente?
- [ ] `filter: grayscale()` hover?

### 2.10 Canvas (se houver)

- [ ] `shadowBlur`?
- [ ] Partículas > 40?

### 2.11 Three.js (se houver)

- [ ] GLB > 500KB sem Draco?
- [ ] Three.js não minificado?
- [ ] Luzes > 3?
- [ ] Antialias on mobile?

### 2.12 Vídeos/Iframes

- [ ] Vídeos sem `poster`/`preload="none"`?
- [ ] Iframes sem `loading="lazy"`?

## Passo 3: Apresentar Relatório

1. **Resumo**: X problemas
2. **Lista** por categoria com impacto:
   - CRÍTICO: LCP/TBT (imagens, CSS blocante, scripts)
   - ALTO: Métricas secundárias (hero animação, fonts)
   - MÉDIO: Runtime/FPS (RAF, will-change)
   - BAIXO: Incrementais (preconnect)

**Aguarde aprovação antes de corrigir.**

---

# FASE 2: CORREÇÕES

## Regras Críticas

1. **Exaustivo**: Corrigir TODAS as imagens, não algumas
2. **Completo**: Remover biblioteca = CSS + JS + código dependente + classes HTML
3. **Numérico**: width/height = NÚMEROS (nunca "auto", "100%")
4. **Verificar**: Após cada categoria, confirmar que TODOS itens foram corrigidos

---

## 1. Imagens

```html
<!-- CORRETO -->
<img src="/.netlify/images?url=/images/foto.jpg&w=600&q=80"
     width="600" height="400" loading="lazy">

<!-- Hero -->
<img ... loading="eager" fetchpriority="high">
```

Srcset para imagens grandes:
```html
srcset="/.netlify/images?url=/img.jpg&w=400&q=80 400w,
        /.netlify/images?url=/img.jpg&w=800&q=80 800w"
sizes="(max-width: 768px) 100vw, 50vw"
```

## 2. Resource Hints

```html
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="dns-prefetch" href="//www.google-analytics.com">
  <link rel="preload" href="/.netlify/images?url=/images/hero.jpg&w=1200&q=80" as="image">
</head>
```

## 3. Fontes

```html
<!-- Max 2-3 weights, sempre display=swap -->
<link href="...?family=Font:wght@400;700&display=swap">
```

## 4. CSS

```html
<!-- Async loading -->
<link rel="stylesheet" href="/style.css" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="/style.css"></noscript>
```

Critical CSS inline no `<head>` para hero.

## 5. Hero (LCP)

Remover do hero:
- `opacity: 0` inicial
- `data-aos`
- Animações de entrada

## 6. Scripts

```html
<script src="/script.js" defer></script>
```

Substituir: jQuery → Vanilla, Swiper → CSS, Moment → Intl API

## 7. Third-Party

```javascript
let loaded = false;
function loadScripts() {
  if (loaded) return;
  loaded = true;
  // Analytics, pixels, etc
}
['scroll','click','touchstart'].forEach(e =>
  addEventListener(e, loadScripts, { once: true, passive: true })
);
setTimeout(loadScripts, 4000);
```

## 8. Vídeos

```html
<video poster="poster.jpg" preload="none">
  <source src="video.webm" type="video/webm">
</video>
```

## 9. Iframes

```html
<iframe src="..." loading="lazy"></iframe>
```

## 10. Content-Visibility

```css
.section-below-fold {
  content-visibility: auto;
  contain-intrinsic-size: 0 500px;
}
```

## 11. Acessibilidade

```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; }
}
```

---

## 12. JS Runtime (se animações)

```javascript
// Throttle scroll
let scheduled = false;
addEventListener('scroll', () => {
  if (!scheduled) {
    requestAnimationFrame(() => { update(); scheduled = false; });
    scheduled = true;
  }
}, { passive: true });

// Pausar off-screen
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => e.isIntersecting ? start() : stop());
});

// Pausar tab inativa
document.addEventListener('visibilitychange', () => {
  document.hidden ? pause() : resume();
});
```

## 13. CSS Animations

```css
/* will-change APENAS em animações contínuas */
.ticker { will-change: transform; }

/* Evitar filter: grayscale() hover */
```

## 14. Canvas

```javascript
// Sem shadowBlur, max 40 partículas (25 mobile)
const count = isMobile ? 25 : 40;
```

## 15. Three.js

```javascript
// Draco para GLB > 500KB
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
loader.setDRACOLoader(dracoLoader);

// Renderer mobile
renderer = new THREE.WebGLRenderer({ antialias: !isMobile });
renderer.setPixelRatio(isMobile ? 1 : 2);
```

Three.js minificado: `three.module.min.js`. Max 3 luzes.

---

# FASE 3: VALIDAÇÃO

1. Para cada problema da auditoria, confirmar correção
2. Relatório: CORRIGIDO vs NÃO CORRIGIDO (com motivo)
3. Link para teste (skill `local-server`)
4. Instruir PageSpeed: https://pagespeed.web.dev/
5. **PARAR E AGUARDAR**

---

# REGRAS

- **NUNCA** corrija sem auditoria completa
- **NUNCA** corrija parcialmente
- **NUNCA** deploy automático
- Aguarde comando explícito
