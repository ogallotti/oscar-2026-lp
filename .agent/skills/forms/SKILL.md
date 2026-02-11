---
name: forms
description: Use when creating or modifying contact forms, lead capture forms, or any form with a phone field. Includes intl-tel-input with masks, email validation, Netlify Forms integration with AJAX submit, redirect with URL params forwarding, and thank you page.
---

# Skill: Forms

Formularios com Netlify Forms, validacao internacional de telefone, submit via AJAX e redirect com repasse de parametros.

---

## Estrutura HTML Completa

```html
<form
  name="contato"
  method="POST"
  action="/obrigado.html"
  data-netlify="true"
  netlify-honeypot="bot-field"
  data-form
>
  <!-- OBRIGATORIO para AJAX: hidden input com form-name -->
  <input type="hidden" name="form-name" value="contato">

  <!-- Honeypot anti-spam -->
  <p hidden><label>Nao preencha: <input name="bot-field"></label></p>

  <div class="form-group">
    <label class="form-label" for="nome">Nome</label>
    <input type="text" id="nome" name="nome" class="form-input" required autocomplete="name">
  </div>

  <div class="form-group">
    <label class="form-label" for="email">E-mail</label>
    <input type="email" id="email" name="email" class="form-input" required autocomplete="email">
  </div>

  <div class="form-group">
    <label class="form-label" for="telefone">WhatsApp</label>
    <input type="tel" id="telefone" name="telefone" class="form-input" required autocomplete="tel">
  </div>

  <div class="form-feedback"></div>
  <button type="submit" class="btn">Enviar</button>
</form>
```

---

## Atributos Obrigatorios do Form

- `name` = Nome unico → Identificador no dashboard Netlify
- `method` = `POST` → Metodo de envio
- `action` = `/pagina-obrigado.html` → Redirect apos sucesso (com repasse de parametros)
- `data-netlify` = `true` → Ativa Netlify Forms
- `netlify-honeypot` = `bot-field` → Anti-spam
- `data-form` (sem valor) → Seletor para JavaScript

### Hidden Input OBRIGATORIO

```html
<input type="hidden" name="form-name" value="contato">
```

**CRITICO:** O `value` DEVE ser EXATAMENTE igual ao atributo `name` do `<form>`. Sem isso, o submit via AJAX nao funciona.

---

## JavaScript para Submit via AJAX

O script.js do template ja inclui tudo. Abaixo a referencia do que ele faz:

### Validacao de Email

Bloqueia dominios de email temporario:

```javascript
const tempEmailDomains = [
  'tempmail', 'guerrillamail', '10minutemail', 'mailinator',
  'throwaway', 'fakeinbox', 'yopmail', 'trashmail', 'temp-mail',
  'disposable', 'sharklasers'
];
```

### Validacao de Telefone

Usa `window.itiInstance.isValidNumber()` para validar o numero no formato internacional.

### Submit e Redirect

Fluxo apos submit bem-sucedido:

1. Dispara `fbq('track', 'Lead')` se Meta Pixel estiver configurado
2. Se o form tem `action`, redireciona com TODOS os parametros:
   - Repassa parametros da URL atual (utm_source, utm_medium, fbclid, gclid, etc)
   - Adiciona `nome` e `email` do formulario como parametros
3. Se o form NAO tem `action`, mostra mensagem de sucesso in-page

**Exemplo de redirect:**

URL de acesso: `https://site.com/?utm_source=google&fbclid=abc123`
Form preenchido: nome="Joao", email="joao@email.com"
Redirect final: `/obrigado.html?utm_source=google&fbclid=abc123&nome=Joao&email=joao%40email.com`

### Pontos CRITICOS do JavaScript

- URL do fetch → `form.getAttribute('action')` (NUNCA `'/'`)
- Content-Type → `application/x-www-form-urlencoded` (NUNCA `application/json`)
- Body → `new URLSearchParams(formData).toString()` (NUNCA `JSON.stringify`)
- FormData → `new FormData(form)` (NUNCA montar objeto manualmente)
- Capturar nome e email ANTES do fetch (form.reset limpa os campos)

---

## Pagina de Agradecimento

Crie uma pagina separada para o redirect apos sucesso. Os parametros `nome` e `email` ficam disponiveis via URL para personalizacao.

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Obrigado!</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <section class="thank-you">
    <h1>Inscricao Confirmada!</h1>
    <p>Voce sera redirecionado em <span id="countdown">10</span> segundos...</p>
    <a href="https://link-do-grupo" class="btn" id="btn-action">Entrar no Grupo</a>
  </section>

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      // Parametros disponiveis via URL (nome, email, utms, etc)
      const params = new URLSearchParams(window.location.search);
      const nome = params.get('nome');

      // Personalizar saudacao (opcional)
      if (nome) {
        document.querySelector('h1').textContent = nome + ', Inscricao Confirmada!';
      }

      // Countdown e redirect
      let count = 10;
      const countdownEl = document.getElementById('countdown');
      const linkDestino = document.getElementById('btn-action').href;

      const timer = setInterval(() => {
        count--;
        if (countdownEl) countdownEl.textContent = count;
        if (count <= 0) {
          clearInterval(timer);
          window.location.href = linkDestino;
        }
      }, 1000);
    });
  </script>
</body>
</html>
```

---

## intl-tel-input (Telefone Internacional)

Ja configurado no template com:
- Strict mode (mascara obrigatoria por pais)
- Brasil como pais padrao
- Bandeiras no dropdown
- Validacao automatica
- Formato internacional no envio

### CDNs necessarias

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/intl-tel-input@24.6.0/build/css/intlTelInput.css">
<script src="https://cdn.jsdelivr.net/npm/intl-tel-input@24.6.0/build/js/intlTelInput.min.js"></script>
```

### Inicializacao (ja no script.js)

```javascript
window.itiInstance = intlTelInput(input, {
  initialCountry: 'br',
  preferredCountries: ['br', 'us', 'pt'],
  separateDialCode: true,
  strictMode: true,
  loadUtilsOnInit: 'https://cdn.jsdelivr.net/npm/intl-tel-input@24.6.0/build/js/utils.js'
});
```

---

## Tracking (Meta Pixel / GTM)

O `script.js` ja dispara automaticamente no submit bem-sucedido:
- `fbq('track', 'Lead')` - Meta Pixel
- `dataLayer.push({ event: 'generate_lead' })` - GTM

Para configurar os snippets de tracking (GTM e/ou Meta Pixel), use `/configurar-tracking` ou consulte a skill `tracking`.

---

## Dashboard do Netlify

Apos deploy, os envios aparecem em: **Site > Forms > [nome do formulario]**

Configure notificacoes: **Site > Forms > Form notifications** (Email, Slack, Webhook)

---

## Checklist de Verificacao

### HTML
- [ ] `name="nome-unico"` no `<form>`
- [ ] `method="POST"`
- [ ] `data-netlify="true"`
- [ ] `action="/pagina-obrigado.html"`
- [ ] `netlify-honeypot="bot-field"`
- [ ] `<input type="hidden" name="form-name" value="nome-unico">`
- [ ] Campo honeypot dentro de elemento `hidden`

### JavaScript
- [ ] Fetch usa `form.getAttribute('action')` (NAO usa `'/'`)
- [ ] Header `Content-Type: application/x-www-form-urlencoded`
- [ ] Body usa `new URLSearchParams(formData).toString()`
- [ ] FormData criado a partir do form
- [ ] Nome e email capturados ANTES do fetch
- [ ] Redirect repassa parametros da URL + nome + email

### Netlify
- [ ] Form aparece listado apos deploy
- [ ] Submissoes aparecem no painel

---

## Troubleshooting

### Form nao aparece no painel Netlify

1. Verificar `data-netlify="true"` no `<form>`
2. Fazer novo deploy (Clear cache and deploy)
3. Verificar se form detection esta habilitado em Forms > Settings

### Submissoes nao sao registradas

1. Verificar se `form-name` hidden tem valor EXATO do `name` do form
2. Verificar se fetch NAO esta enviando para `'/'` (usar `action`)
3. Verificar console do browser por erros
4. Testar submit nativo (sem JS) para isolar problema

### Redirect apos submit nao funciona

1. Verificar se `action` do form esta com caminho correto
2. Verificar se JavaScript redireciona apos `response.ok`
3. Verificar se nao ha erro antes do redirect

### Parametros nao chegam na pagina de obrigado

1. Verificar se `action` esta definido no form (sem action = sem redirect)
2. Verificar se campos `name="nome"` e `name="email"` existem no form
3. Inspecionar a URL de redirect no DevTools Network

### Telefone nao valida / Bandeiras nao aparecem

1. Verificar se CSS e JS do intl-tel-input v24.6.0 carregaram
2. Verificar console por erros de carregamento
3. Verificar se `loadUtilsOnInit` esta com URL correta
