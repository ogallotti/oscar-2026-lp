# Framework v16 - Agent Documentation

Sistema de workflows e skills para criação de landing pages com Netlify.

---

## Fluxo de Trabalho

```
/gerar-copy
    ↓ [Aprovado?] Sim
/gerar-design
    ↓ [Aprovado?] Sim
/gerar-layout
    ↓ [Aprovado?] Sim
/desenvolver
    ↓ [Pronto?] Sim
    ├── /visualizar-local (opcional - para ver o resultado)
    └── /otimizar (opcional - para melhorar performance)
           ↓
/previsualizar (opcional - para testar via PR)
    ↓
/publicar
```

---

## Workflows Disponíveis

| Comando | Descrição |
|---------|-----------|
| `/gerar-copy` | Cria os textos da landing page e salva em `copy.md` |
| `/gerar-design` | Cria o hero + primeira seção como demonstração visual |
| `/gerar-layout` | Cria especificação detalhada de todas as seções em `layout.md` |
| `/desenvolver` | Implementa a página completa seguindo o `layout.md` |
| `/visualizar-local` | Inicia o servidor local para visualização |
| `/otimizar` | Aplica otimizações de performance (meta: 90+ PageSpeed) |
| `/previsualizar` | Cria Deploy Preview via Pull Request |
| `/publicar` | Faz deploy para produção via GitHub + Netlify |

---

## Skills Disponíveis

| Skill | Descrição |
|-------|-----------|
| `local-server` | Gerencia o servidor de desenvolvimento local |
| `optimize` | Referência rápida de otimizações de performance |
| `deploy` | Integração GitHub + Netlify com CI/CD |
| `forms` | Formulários com Netlify Forms e intl-tel-input |

---

## Regras Globais

### Comunicação
- Sempre em Português Brasileiro
- Termos técnicos e código permanecem em inglês
- Sem emojis

### Imagens
- Sempre via Netlify CDN: `/.netlify/images?url=/images/foto.jpg&w=800&q=80`
- Caminhos absolutos com `/`

### Hero
- Sem animação de ENTRADA (sem AOS, fade, opacity:0)
- Renderiza instantaneamente
- Animações pós-carregamento são permitidas

### Comportamento
- Cada workflow tem escopo definido
- PARE ao finalizar e aguarde instrução
- NUNCA proceda automaticamente para próximo passo

---

## Estrutura de Arquivos

```
.agent/
├── README.md              # Esta documentação
├── rules/
│   └── AGENTS.md          # Regras globais do agente
├── workflows/
│   ├── gerar-copy.md      # Workflow de copy
│   ├── gerar-design.md    # Workflow de design
│   ├── gerar-layout.md    # Workflow de layout
│   ├── desenvolver.md     # Workflow de desenvolvimento
│   ├── visualizar-local.md# Workflow de visualização
│   ├── otimizar.md        # Workflow de otimização
│   ├── previsualizar.md   # Workflow de preview (PR)
│   └── publicar.md        # Workflow de deploy
└── skills/
    ├── local-server/
    │   └── SKILL.md       # Servidor de desenvolvimento
    ├── optimize/
    │   └── SKILL.md       # Otimizações de performance
    ├── deploy/
    │   └── SKILL.md       # GitHub + Netlify deploy
    └── forms/
        └── SKILL.md       # Formulários Netlify
```

---

## Dependências Externas (CDN)

O framework usa apenas recursos via CDN, sem build step:

- **Fontes**: Google Fonts
- **Ícones**: Phosphor Icons (`unpkg.com/@phosphor-icons/web`)
- **Animações**: AOS (`unpkg.com/aos@2.3.1`)
- **Telefone**: intl-tel-input (para formulários)

NUNCA rode `npm install`, `node`, ou comandos de build.

---

## Configuração

### netlify.toml

```toml
[build]
  publish = "."

[dev]
  port = 8888  # Pode variar se porta estiver em uso

[images]
  remote_images = ["https://.*"]
```

A skill `local-server` gerencia a porta automaticamente se houver conflito.
