---
description: otimizar
---

# Instruções

Você vai otimizar a performance da landing page para melhorar o score no PageSpeed Insights. Meta: **Score 90+ em Performance**.

## Antes de Começar

Leia o `index.html` e `style.css` atuais para analisar o que precisa ser otimizado.

---

## 1. LCP / Imagens (Maior Impacto)

### Preload de Recursos Críticos

```html
<head>
  <!-- Logo com alta prioridade -->
  <link rel="preload" href="/images/logo.svg" as="image" fetchpriority="high">

  <!-- Foto hero com srcset responsivo -->
  <link rel="preload" as="image"
    href="/.netlify/images?url=/images/hero.jpg&w=1200&q=80"
    imagesrcset="
      /.netlify/images?url=/images/hero.jpg&w=640&q=80 640w,
      /.netlify/images?url=/images/hero.jpg&w=1200&q=80 1200w,
      /.netlify/images?url=/images/hero.jpg&w=1920&q=80 1920w"
    imagesizes="(max-width: 768px) 100vw, 50vw">
</head>
```

### Checklist de Imagens

- [ ] TODAS usando Netlify CDN: `/.netlify/images?url=/images/foto.jpg&w=800&q=80`
- [ ] Qualidade `q=80` (bom equilíbrio entre qualidade e tamanho)
- [ ] Todas com `width` e `height` explícitos
- [ ] Imagens críticas com `aspect-ratio` no CSS
- [ ] Hero: `loading="eager"` e `fetchpriority="high"`
- [ ] Demais: `loading="lazy"`
- [ ] Alt descritivo ou vazio (`alt=""` para decorativas)

### Exemplo de Imagem Hero Otimizada

```html
<img
  src="/.netlify/images?url=/images/hero.jpg&w=1200&q=80"
  srcset="
    /.netlify/images?url=/images/hero.jpg&w=640&q=80 640w,
    /.netlify/images?url=/images/hero.jpg&w=1200&q=80 1200w,
    /.netlify/images?url=/images/hero.jpg&w=1920&q=80 1920w"
  sizes="(max-width: 768px) 100vw, 50vw"
  width="1200"
  height="800"
  alt="Descrição"
  loading="eager"
  fetchpriority="high"
  style="aspect-ratio: 3/2;"
>
```

---

## 2. CSS Crítico

### Inline no Head (Completo)

O CSS crítico deve incluir **TUDO** que aparece acima da dobra:
- Reset básico
- Container
- Hero completo
- Logo (incluindo `filter: drop-shadow` se houver)
- Floating icons (se visíveis no hero)
- Botão CTA
- Cores e tipografia do hero

```html
<head>
  <style>
    /* Reset mínimo */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    /* Container */
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

    /* Hero */
    .hero { min-height: 100vh; display: flex; align-items: center; }
    .hero-content { /* estilos */ }
    .hero-title { /* estilos */ }
    .hero-subtitle { /* estilos */ }

    /* Logo - incluir drop-shadow se existir */
    .logo { filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1)); }

    /* CTA Button */
    .cta-button { /* estilos completos */ }

    /* Floating Icons (se visíveis no hero) */
    .floating-icons { /* estilos */ }
  </style>

  <!-- CSS restante com carregamento async -->
  <link rel="preload" href="/style.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="/style.css"></noscript>
</head>
```

### Carregamento Async do CSS

Técnica com `media="print"`:

```html
<link rel="stylesheet" href="/style.css" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="/style.css"></noscript>
```

### Minificação

- Remover comentários
- Remover espaços em branco desnecessários
- Pode usar ferramentas online como cssnano ou clean-css
- Meta: reduzir ~30% do tamanho

---

## 3. Animações do Hero

### REMOVER Animações de Entrada no Hero

O hero deve renderizar **instantaneamente**. Remova:

- [ ] `fadeInUp` da logo
- [ ] `fadeInUp` do h1
- [ ] `fadeInUp` do p / subtitle
- [ ] `fadeInUp` do cta-button
- [ ] `fadeInUp` das hero-tags
- [ ] `fadeInRight` do hero-image-container
- [ ] Qualquer `opacity: 0` inicial no hero
- [ ] Qualquer `transform: translateY()` inicial
- [ ] Atributos `data-aos` no hero

**Animações PÓS-LOAD são permitidas** (hover, scroll-triggered em outras seções).

---

## 4. Facebook Pixel (se houver)

### Carregamento Otimizado

```html
<script>
// Facebook Pixel com carregamento inteligente
(function() {
  var pixelLoaded = false;

  function loadPixel() {
    if (pixelLoaded) return;
    pixelLoaded = true;

    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;t.defer=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', 'SEU_PIXEL_ID');
    fbq('track', 'PageView');
  }

  // Carregar apenas na interação ou após 4s
  if ('requestIdleCallback' in window) {
    requestIdleCallback(function() {
      setTimeout(loadPixel, 4000);
    });
  } else {
    setTimeout(loadPixel, 4000);
  }

  // Ou na primeira interação
  ['scroll', 'click', 'touchstart'].forEach(function(event) {
    window.addEventListener(event, loadPixel, { once: true, passive: true });
  });
})();
</script>
```

### DNS Prefetch (não preconnect)

```html
<head>
  <!-- DNS prefetch ao invés de preconnect para Facebook -->
  <link rel="dns-prefetch" href="//connect.facebook.net">
  <link rel="dns-prefetch" href="//www.facebook.com">
</head>
```

---

## 5. Preconnects e DNS Prefetch

### Ordem de Prioridade

```html
<head>
  <!-- Críticos: preconnect (com crossorigin quando necessário) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://unpkg.com">

  <!-- Não-críticos: dns-prefetch -->
  <link rel="dns-prefetch" href="//connect.facebook.net">
  <link rel="dns-prefetch" href="//www.facebook.com">
  <link rel="dns-prefetch" href="//www.googletagmanager.com">
</head>
```

---

## 6. Fontes

### Preload da Fonte Principal

```html
<head>
  <!-- Preload da fonte mais usada (geralmente bold/700) -->
  <link rel="preload"
    href="https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCuM70w-Y3tcoqK5.woff2"
    as="font"
    type="font/woff2"
    crossorigin>

  <!-- Google Fonts com display=swap -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
```

### Como Encontrar a URL da Fonte

1. Abra o DevTools > Network
2. Filtre por "Font"
3. Carregue a página
4. Copie a URL da fonte .woff2 mais usada

---

## 7. Main Thread / Otimizações de Layout

### Content-Visibility para Seções Below-Fold

```css
/* Seções que não aparecem no carregamento inicial */
.benefits,
.testimonials,
.pricing,
.faq,
.contact,
footer {
  content-visibility: auto;
  contain-intrinsic-size: 0 500px; /* altura estimada */
}
```

### CSS Containment

```css
/* Isolar seções para melhor performance de layout */
section {
  contain: layout style;
}

/* Para elementos com tamanho fixo */
.card {
  contain: layout style paint;
}
```

---

## 8. JavaScript

### Scripts no Final do Body

```html
  <!-- Antes de </body> -->

  <!-- Scripts críticos (se houver) -->
  <script src="/script.js" defer></script>

  <!-- Scripts não-críticos -->
  <script src="https://unpkg.com/@phosphor-icons/web" defer></script>

  <!-- AOS (se usado em seções below-fold) -->
  <script src="https://unpkg.com/aos@2.3.1/dist/aos.js" defer></script>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      AOS.init({ once: true, duration: 600 });
    });
  </script>
</body>
```

---

## Checklist Final de Otimização

### LCP (Largest Contentful Paint)
- [ ] Preload da logo
- [ ] Preload da imagem hero com srcset
- [ ] Imagens com q=80
- [ ] width/height em todas imagens
- [ ] aspect-ratio em imagens críticas
- [ ] fetchpriority="high" no hero

### CSS
- [ ] Critical CSS inline completo
- [ ] drop-shadow da logo no critical CSS
- [ ] CSS restante com carregamento async
- [ ] CSS minificado

### Animações
- [ ] Sem fadeInUp na logo
- [ ] Sem fadeInUp no h1, p, cta-button, hero-tags
- [ ] Sem fadeInRight no hero-image-container
- [ ] Sem opacity:0 ou transform inicial no hero

### Tracking (Facebook, etc)
- [ ] Defer com requestIdleCallback
- [ ] Carregamento na interação
- [ ] Fallback de 4s
- [ ] dns-prefetch ao invés de preconnect

### Preconnects
- [ ] preconnect para fonts.googleapis.com
- [ ] preconnect para fonts.gstatic.com
- [ ] preconnect para unpkg.com
- [ ] dns-prefetch para serviços de tracking

### Fontes
- [ ] Preload da fonte principal (700)
- [ ] display=swap

### Main Thread
- [ ] content-visibility: auto em seções below-fold
- [ ] contain: layout style em sections
- [ ] contain-intrinsic-size definido

---

## Sua Tarefa

1. Analise o código atual
2. Identifique problemas de performance usando o checklist acima
3. Aplique as correções necessárias na ordem de impacto:
   - Primeiro: Imagens e LCP
   - Segundo: CSS crítico
   - Terceiro: Animações do hero
   - Quarto: Scripts e tracking
   - Quinto: Content-visibility
4. Liste o que foi otimizado

---

## Ao Finalizar

Após aplicar as otimizações:

1. Liste o que foi otimizado (com detalhes)
2. Forneça o link (use a skill `local-server` para obter a URL correta)
3. Sugira testar no PageSpeed Insights: https://pagespeed.web.dev/
4. Sugira próximo passo: "Quando estiver satisfeito, use `/publicar` para deploy."
5. **PARE COMPLETAMENTE E AGUARDE**

## IMPORTANTE: Regras de Comportamento

- NUNCA faça deploy automaticamente
- NUNCA rode `/publicar` ou `/previsualizar` automaticamente
- Quando o usuário aprovar, apenas confirme e aguarde comando explícito
