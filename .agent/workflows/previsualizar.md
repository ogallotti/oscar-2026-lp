---
description: previsualizar
---

# Instruções

O usuário quer criar um Deploy Preview (PR) para testar antes de ir para produção.

## Por Que Usar Preview?

- Commits para `main` = deploy de produção (gasta minutos de build)
- Pull Requests = Deploy Preview (link temporário para testar)

O Deploy Preview é ideal para:
- Testar alterações antes de aprovar
- Mostrar para cliente revisar
- Economizar minutos de build

## Comandos

```bash
# Criar branch para alterações
git checkout -b preview/alteracoes

# Adicionar e commitar
git add .
git commit -m "Descrição das alterações"

# Push da branch
git push -u origin preview/alteracoes

# Criar PR
gh pr create --title "Preview: Descrição" --body "Alterações para revisão"
```

## Após Criar o PR

O Netlify automaticamente cria um Deploy Preview com URL tipo:
`deploy-preview-123--nome-do-site.netlify.app`

Informe ao usuário:
- O PR foi criado
- O Deploy Preview será gerado automaticamente
- Forneça o link do PR no GitHub
- O link do preview aparecerá nos comentários do PR

## Para Aprovar

Depois de testar e aprovar:
```bash
gh pr merge --merge
```

## Ao Finalizar

Após criar o PR:

1. Informe que o PR foi criado
2. Forneça o link do PR
3. Explique que o Deploy Preview aparecerá nos comentários
4. **PARE COMPLETAMENTE E AGUARDE**

## IMPORTANTE: Regras de Comportamento

- Após criar o PR, PARE e aguarde instrução do usuário
- NUNCA faça merge automaticamente
- NUNCA continue para outras etapas automaticamente
