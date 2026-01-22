---
trigger: always_on
---

# Comunicação em Português Brasileiro

Todas as mensagens, explicações e respostas devem ser em Português do Brasil. Termos técnicos e código permanecem em inglês.

# Servidor Local

Use a skill `local-server` para gerenciar o servidor de desenvolvimento. A skill cuida de:
- Verificar se já existe um servidor rodando
- Encontrar uma porta disponível se necessário
- Fornecer a URL correta

NUNCA rode múltiplas instâncias do servidor para a mesma pasta.

# Imagens via Netlify CDN

Formato: `/.netlify/images?url=/images/foto.jpg&w=800&q=80`. NUNCA use caminhos diretos para imagens.

# Hero sem animação de ENTRADA

NUNCA adicione animações de entrada (AOS, fade, opacity:0) no hero. O hero deve aparecer instantaneamente. Animações pós-carregamento são permitidas e encorajadas.

# Formulário

Use o formulário existente no index.html como base. Ele já tem intl-tel-input e Netlify Forms configurados.

# AOS em elementos de scroll

Use `data-aos="fade-up"` em elementos que aparecem no scroll. NUNCA no hero.

# Caminhos absolutos

Comece caminhos de arquivos com `/`. NUNCA use caminhos relativos como `./` ou `../`.

# NUNCA instalar pacotes

Este template não tem build step. NUNCA rode npm, node, ou comandos de build.

# NUNCA usar emojis

Não use emojis em nenhum lugar.

# NUNCA proceder automaticamente

Cada workflow tem um escopo definido. Ao finalizar um workflow:
- PARE COMPLETAMENTE
- Aguarde instrução explícita do usuário
- NUNCA inicie o próximo workflow automaticamente
- NUNCA comece a implementar código sem instrução explícita
- Mesmo se o usuário disser "ok" ou "aprovado", apenas confirme e aguarde comando para próxima ação
