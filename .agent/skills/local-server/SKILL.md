---
name: local-server
description: Use when you need to start a local development server, view the site locally, provide a localhost URL, or when the user wants to preview their work. Handles port conflicts automatically.
---

# Skill: Local Server

Servidor de desenvolvimento local usando Netlify Dev.

---

## Configuração de Porta

**IMPORTANTE:** A porta pode variar. Siga este processo:

### 1. Verificar Porta no netlify.toml

```bash
cat netlify.toml | grep -i port
```

Se não encontrar, a porta padrão do Netlify Dev é `8888`.

### 2. Verificar se a Porta Está em Uso

```bash
lsof -i :8888
```

Se retornar algo, a porta está em uso por outro processo.

### 3. Iniciar o Servidor

**Se a porta estiver livre:**

```bash
netlify dev
```

**Se a porta estiver em uso**, use uma porta alternativa:

```bash
netlify dev --port 8889
```

Portas alternativas sugeridas: `8889`, `8890`, `3000`, `3001`, `5000`

---

## Processo Completo

```bash
# 1. Verificar porta configurada
PORT=$(grep -oP 'port\s*=\s*\K\d+' netlify.toml 2>/dev/null || echo "8888")

# 2. Verificar se está em uso
if lsof -i :$PORT > /dev/null 2>&1; then
  echo "Porta $PORT em uso. Tentando alternativa..."
  # Tentar portas alternativas
  for ALT_PORT in 8889 8890 3000 3001 5000; do
    if ! lsof -i :$ALT_PORT > /dev/null 2>&1; then
      PORT=$ALT_PORT
      break
    fi
  done
fi

# 3. Iniciar servidor
netlify dev --port $PORT
```

---

## URL do Servidor

Após iniciar, a URL será:

```
http://localhost:{PORTA}
```

Onde `{PORTA}` é a porta usada (verifique a saída do comando).

---

## Por Que Usar Netlify Dev?

1. **CDN de Imagens** - `/.netlify/images` só funciona com Netlify Dev
2. **Formulários** - Testa integração com Netlify Forms
3. **Redirects** - Simula os redirects do netlify.toml
4. **Environment** - Carrega variáveis de ambiente do .env

---

## Troubleshooting

### "Port already in use"

A porta já está sendo usada. Use uma porta alternativa:

```bash
netlify dev --port 8889
```

Ou mate o processo que está usando a porta:

```bash
# Encontrar o processo
lsof -i :8888

# Matar pelo PID
kill -9 <PID>
```

### "Not a site directory"

Você não está na pasta do projeto. Navegue até a pasta correta:

```bash
cd /caminho/do/projeto
```

### "netlify.toml not found"

Crie um arquivo `netlify.toml` básico na raiz:

```toml
[build]
  publish = "."

[dev]
  port = 8888

[images]
  remote_images = ["https://.*"]
```

### Servidor não atualiza

Pode ser cache do navegador. Faça hard refresh:
- Mac: `Cmd+Shift+R`
- Windows: `Ctrl+Shift+R`

---

## Dica: Servidor em Background

Se quiser manter o servidor rodando enquanto faz outras tarefas:

```bash
netlify dev &
```

Para parar depois:

```bash
pkill -f "netlify dev"
```
