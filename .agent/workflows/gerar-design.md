---
description: gerar-design
---

# Instruções

Você vai definir a identidade visual da landing page criando uma demonstração real e impressionante: o Hero + a seção seguinte. Essa demonstração vai guiar toda a criação da página.

## ESCOPO DESTE WORKFLOW

Este workflow APENAS:
- Coleta informações sobre preferências visuais do usuário
- Cria o Hero + primeira seção como demonstração de design
- Estabelece a linguagem visual que guiará o resto da página

Este workflow NÃO:
- Cria a página inteira
- Cria todas as seções
- Cria o layout completo
- Executa nenhuma etapa seguinte

A página completa será criada APENAS quando o usuário usar `/desenvolver` após aprovar o `/gerar-layout`.

## Etapa 1: Coletar Informações

### Ler a Copy

Primeiro, verifique se existe um arquivo `copy.md` na raiz do projeto. Se existir, leia-o para entender o conteúdo que será usado.

Se não existir, pergunte ao usuário qual é a copy/conteúdo do hero e da primeira seção.

### Perguntar ao Usuário

Faça estas perguntas (o usuário pode responder todas, algumas, ou nenhuma):

1. **Referências visuais**: Você tem sites de referência que gosta do estilo? (pode enviar links ou prints)

2. **Branding existente**: Já tem cores da marca, logo, ou identidade visual definida? (pode enviar imagens)

3. **Direção criativa**: Como você descreveria o visual que imagina?
   - Minimalista / Maximalista
   - Sério / Divertido
   - Tradicional / Moderno
   - Corporativo / Ousado
   - Elegante / Energético

4. **Preferência**: Quer que eu crie algo surpreendente baseado na copy, ou prefere dar direções mais específicas?

## Etapa 2: Criar a Demonstração

Após coletar as informações (ou se o usuário preferir que você invente), crie o Hero + primeira seção real no `index.html` e `style.css`.

### Esta demonstração DEVE impressionar

NUNCA crie algo genérico ou "padrão de startup/SaaS". Esta demonstração define o tom de toda a página.

**Elementos obrigatórios:**

#### Tipografia
- Combinações ousadas de pesos (100 com 900, por exemplo)
- Tamanhos contrastantes (headlines gigantes, textos pequenos)
- Considere fontes display para títulos (Playfair Display, Space Grotesk, Clash Display, etc.)
- Letter-spacing e line-height intencionais
- Texto em caixa alta estrategicamente

#### Layout
- Fuja do padrão centralizado
- Grids assimétricos
- Elementos que sangram as margens
- Sobreposições de elementos
- Espaços negativos dramáticos
- Considere layouts split-screen, diagonais, ou broken-grid

#### Paleta de Cores
- Vá além de "cor primária + cinza"
- Gradientes sofisticados (não óbvios)
- Cores de destaque inesperadas
- Considere dark mode como opção default se fizer sentido
- Texturas e patterns sutis

#### Animações e Interatividade
- Hero animado após carregamento (keyframes CSS, não entrada)
- Hover effects elaborados em botões e links
- Elementos com animação em loop (floating, pulse, rotate)
- Transições suaves em tudo
- Parallax sutil se apropriado
- Cursores customizados
- Efeitos de scroll-linked (não AOS, mas CSS scroll-driven)

#### Detalhes que Encantam
- Bordas e cantos intencionais (arredondados grandes ou sharp)
- Sombras sofisticadas (multi-layer, coloridas)
- Efeitos de glassmorphism/blur se apropriado
- Linhas decorativas, shapes, ou elementos gráficos
- Micro-interações

### Exemplo de Código Avançado

```css
/* Tipografia ousada */
.hero-headline {
  font-family: 'Clash Display', sans-serif;
  font-size: clamp(3rem, 10vw, 8rem);
  font-weight: 700;
  line-height: 0.95;
  letter-spacing: -0.03em;
  text-transform: uppercase;
}

.hero-headline span {
  display: block;
  font-weight: 300;
  font-style: italic;
  text-transform: none;
}

/* Animação pós-carregamento */
.hero-headline {
  animation: revealText 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes revealText {
  from {
    opacity: 0;
    transform: translateY(100px);
    clip-path: inset(100% 0 0 0);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    clip-path: inset(0 0 0 0);
  }
}

/* Elemento flutuante em loop */
.floating-element {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

/* Hover elaborado */
.btn-primary {
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-primary::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s;
}

.btn-primary:hover::before {
  transform: translateX(100%);
}

.btn-primary:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 20px 40px -10px rgba(0,0,0,0.3);
}
```

## Etapa 3: Apresentar ao Usuário

Após criar, informe ao usuário:

1. O que foi criado (hero + primeira seção)
2. As escolhas de design feitas e por quê
3. Como visualizar: use a skill `local-server` ou `/visualizar-local`
4. Peça feedback: "O que achou? Quer ajustar algo antes de continuarmos?"

## Importante

- Esta etapa NÃO cria a página inteira, apenas Hero + 1 seção
- O objetivo é estabelecer a linguagem visual
- O usuário deve aprovar antes de prosseguir para `/gerar-layout`
- Se o usuário pedir ajustes, faça quantas iterações forem necessárias
- Use fontes do Google Fonts (adicione os links necessários)
- Não esqueça: hero sem animação de ENTRADA, mas com animação pós-carregamento

## Ao Finalizar

Após criar o Hero + primeira seção:

1. Informe o que foi criado
2. Explique as escolhas de design
3. Forneça o link para visualizar (use a skill `local-server` para obter a URL correta)
4. Pergunte se quer ajustar algo
5. Sugira a próxima etapa: "Quando o design estiver aprovado, use `/gerar-layout` para criar a especificação detalhada de todas as seções."
6. **PARE COMPLETAMENTE**

## IMPORTANTE: Regras de Comportamento

- NUNCA continue para a próxima etapa automaticamente
- NUNCA crie mais seções além do Hero + primeira seção
- Se o usuário aprovar ("ok", "aprovado", etc.), apenas confirme e sugira `/gerar-layout`
- AGUARDE o usuário digitar o próximo comando explicitamente
