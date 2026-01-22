---
description: visualizar-local
---

# Instruções

O usuário quer visualizar a página no navegador localmente.

## Sua Tarefa

Use a skill `local-server` para iniciar o servidor de desenvolvimento e obter a URL correta.

A skill cuida de:
- Verificar se já existe um servidor rodando
- Encontrar uma porta disponível se necessário
- Iniciar o Netlify Dev
- Fornecer o link correto

## Importante

- O servidor precisa estar rodando para o CDN de imagens funcionar (`/.netlify/images`)
- Se houver erro de porta em uso, a skill tentará outra porta
- Verifique se está na pasta correta do projeto

## Ao Finalizar

Após fornecer o link:

1. Aguarde o usuário visualizar
2. **PARE COMPLETAMENTE E AGUARDE**

## IMPORTANTE: Regras de Comportamento

- NUNCA continue para outras etapas automaticamente
- NUNCA comece a fazer alterações sem solicitação
- Apenas forneça o link e aguarde instrução do usuário
