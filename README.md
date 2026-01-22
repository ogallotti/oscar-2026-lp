# Método Zero v16

Framework de landing pages com zero build step. Sem npm, node, webpack. Apenas HTML, CSS e JavaScript puros com infraestrutura 100% Netlify.

---

## Fluxo de Criação

```
/copy → /design → /layout → /build → /main
```

Cada workflow PARA completamente ao finalizar. O usuário deve chamar explicitamente o próximo comando.

### 1. `/copy`
Cria os textos persuasivos da landing page. Gera o arquivo `copy.md` com toda a copy estruturada por seções.

### 2. `/design`
Define a identidade visual criando uma **demonstração real**: Hero + primeira seção. Coleta referências, cores e preferências do usuário.

### 3. `/layout`
Transforma a copy e o design aprovado em uma **especificação exaustiva** de diretor de arte. Gera o arquivo `layout.md` detalhando cada seção.

### 4. `/build`
Constrói a página completa seguindo fielmente a especificação do `layout.md`.

### 5. `/main`
Faz o deploy para produção. Configura Git + GitHub + Netlify com CI/CD automático.

---

## Workflows Opcionais

| Comando | Função |
|---------|--------|
| `/otimizar` | Aplica checklist de performance (PageSpeed 90+) |
| `/preview` | Cria Deploy Preview via Pull Request |
| `/visualizar` | Inicia servidor local (porta 8888) |

---

## Estrutura do Projeto

```
projeto/
├── index.html      # Página principal
├── style.css       # Estilos (mobile-first)
├── script.js       # JavaScript (AOS + Forms)
├── netlify.toml    # Configuração Netlify
├── images/         # Imagens do projeto
├── copy.md         # [gerado] Copy estruturada
└── layout.md       # [gerado] Especificação de layout
```

---

## Regras dos Workflows

1. Cada workflow tem **escopo definido** e não faz mais do que deve
2. Ao finalizar, o workflow **PARA** e aguarda comando explícito
3. Mesmo com aprovação ("ok", "aprovado"), o workflow **não continua automaticamente**
4. O usuário deve digitar o próximo comando explicitamente

---

## Começando

```bash
# Copie o framework para uma nova pasta
cp -r framework-v16 meu-projeto
cd meu-projeto

# Inicie o servidor local
netlify dev

# Comece pelo workflow de copy
# Use: /copy
```
