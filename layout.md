# Layout Specification - The Oscars 2026

## Linguagem Visual

### Cores
- **Primária (Gold)**: `#a98f37` (Base), `#8c7325` (Dark), `#cfb26f` (Light)
- **Background Dark**: `#171010` (Main Dark), `#1f1818` (Soft Dark), `#301617` (Deep Red/Brown nuance for gradients)
- **Background Light**: `#fcfbf9` (Off-white), `#f2efe9` (Cream)
- **Texto**: `#171010` (Main on Light), `#595555` (Muted), `#ffffff` (On Dark), `rgba(255, 255, 255, 0.7)` (Muted on Dark)

### Tipografia
- **Headline (Display)**: `Bodoni Moda`, pesos 400-900. Uso para títulos principais.
- **Accent (Italic)**: `Instrument Serif`, Italic. Uso para pausas visuais e destaques elegantes.
- **Body**: `Inter`, pesos 400, 500, 600. Uso para textos corridos, meta-data e UI.

### Espaçamentos e Grid
- **Container**: Max-width `1200px`.
- **Padding Seção (Desktop)**: `8rem` (128px) a `10rem` (160px).
- **Padding Seção (Mobile)**: `4rem` (64px) a `6rem` (96px).
- **Grid Gap Padrão**: `2rem` (32px).

### Tom de Animação
- **Style**: Elegante, cinematográfico, "slow-reveal".
- **Easing**: `cubic-bezier(0.25, 0.1, 0.25, 1)` (suave e premium).
- **Scroll**: Parallax suave e elementos que respondem ao scroll (scrubbing).

---

## Seção 1: Hero

### Conteúdo
- **Data**: "Domingo, 15 de Março de 2026"
- **Headline**: "A 98ª Cerimônia" (Linha 1), "do Oscar" (Linha 2, Italic)
- **Subheadline**: "Honrando os melhores filmes de 2025. Ao vivo do Dolby Theatre no Ovation Hollywood."
- **CTA**: "Ver os Indicados"
- **Indicador Scroll**: "Explore" + Linha

### Layout
- **Estrutura**: Full-screen (`100vh`, min-height `800px`). Conteúdo centralizado verticalmente e horizontalmente.
- **Estilo**: Dark Mode imersivo.

### Elementos Visuais Especiais (Solicitados)
1.  **Parallax de Fundo**:
    - O background (`.hero-bg`) deve se mover mais lentamente que o scroll da página (`speed: 0.5`).
    - O conteúdo de texto deve ter um leve deslocamento negativo ao scrolar (`speed: 1.2`) para criar profundidade.
2.  **Estatueta Giratória**:
    - **Elemento**: Um modelo 3D (ou sequência de imagens) da estatueta do Oscar.
    - **Posicionamento**: Centralizado no fundo, atrás do texto, tamanho grande (ocupando 80% da altura da viewport).
    - **Comportamento**: Inicialmente estática ou girando muito lentamente.
    - **Scroll Interaction**: Ao descer o scroll, a estatueta deve girar no eixo Y e escalar ligeiramente (zoom in). A rotação deve ser sincronizada com o scroll (scrub: true).
    - **Opacidade**: Deve ter opacidade reduzida (`0.2` a `0.3`) para não brigar com o texto, integrando-se ao background.

### Tipografia Específica
- **Data**: Inter, 0.8rem, Uppercase, Tracking `0.2em`, Gold (`#a98f37`).
- **Headline Linha 1**: Bodoni Moda, `5rem` (desktop) / `2.5rem` (mobile), Uppercase, Branco.
- **Headline Linha 2**: Instrument Serif Italic, `9rem` (desktop) / `4rem` (mobile), Gold Light (`#cfb26f`).
- **Subheadline**: Inter, 1.1rem, Light (`300`), Branco com transparência (`0.7`).

### Interatividade & Animações
- **Entrada (Load)**:
    - Background e Estatueta: Fade in suave (2s).
    - Data: Fade in + Slide up ligeiro.
    - Título: Revelação máscara (clip-path) ou slide up linha por linha. Delay escalonado.
    - CTA: Fade in por último.
- **Scroll Down**:
    - Texto faz fade-out suave e sobe mais rápido que o scroll.
    - Estatueta gira e continua visível até a próxima seção cobrir completamente.

---

## Seção 2: Introdução

### Conteúdo
- **Label**: "O Evento"
- **Título**: "Uma Celebração" (Linha 1), "Histórica" (Linha 2, Italic)
- **Texto 1**: "Apresentada pelo lendário **Conan O'Brien** pelo segundo ano consecutivo, a 98ª edição do Oscar retorna para celebrar a excelência cinematográfica."
- **Texto 2**: "Produzida por *Raj Kapoor, Katy Mullan, Jeff Ross e Mike Sweeney*, a cerimônia deste ano promete ser um tributo visualmente deslumbrante à arte de fazer cinema, honrando filmes lançados em 2025."
- **CTA Link**: "Saiba mais sobre a cerimônia"
- **Imagem**: Foto artística/abstrata relacionada a cinema/luz.

### Layout
- **Grid**: 2 Colunas (Texto à Esquerda, Imagem à Direita). 50% / 50%.
- **Background**: Light (`#fcfbf9`).
- **Imagem**: Dentro de um "Visual Frame" com bordas finas douradas deslocadas (efeito offset).

### Tipografia
- **Título**: Bodoni Moda, `3.5rem`, Dark (`#171010`). Palavra "Histórica" em Instrument Serif, Gold Dark.
- **Texto**: Inter, `1.1rem`, Leading `1.7`, Cinza Muted (`#595555`). Destaques em Bold ou Italic na cor Dark ou Gold Dark.

### Animações
- **Ao ver**: Texto sobe suavemente (`fade-up`). Imagem entra com reveal lateral (`width: 0 -> 100%`) e o frame desenha a borda.

---

## Seção 3: Retrospectiva (Carousel - Novo)

### Conteúdo
- **Título Seção**: "Momentos Inesquecíveis"
- **Subtítulo**: "Edições Anteriores"
- **Slides (Imagens de Placeholders)**:
    1.  Foto Vencedores 2025
    2.  Foto Performance Musical
    3.  Foto Red Carpet
    4.  Foto Homenagem
    5.  Foto Bastidores

### Layout
- **Estilo**: Full-width ou Container expandido. Background levemente mais escuro que a Intro (`#f2efe9`).
- **Componente**: Carrossel Infinito (Swiper/Splide).
- **Formato dos Slides**: Cards verticais (Portrait `3:4`) ou Horizontais (`16:9`) dependendo das fotos. Sugestão: `3:4` para elegância poster-like.
- **Quantidade visível**: 3.5 slides (Desktop), 1.2 slides (Mobile). Gap `2rem`.

### Tipografia
- **Título Seção**: Bodoni Moda, `3rem`, Centralizado, Dark.
- **Legendas (Overlay no Hover)**: Nome da edição ou momento. Inter, Branco, pequeno.

### Interatividade
- **Cursor**: Ao passar o mouse sobre o carrossel, cursor muda para "Drag" ou setas customizadas.
- **Scroll**: O carrossel pode mover-se lentamente sozinho (autoplay lento) e acelerar no drag.
- **Hover no Slide**: Imagem escala levemente (`scale: 1.05`), overlay escurece, legenda aparece.

---

## Seção 4: Indicados (Categorias Principais)

### Estrutura Geral
- Esta seção deve ser modular. Cada categoria principal (Filme, Direção, Atores) terá destaque.
- **Background**: Alternando entre Dark (`#171010`) e cores de acento muito sutis ou mantendo Dark para todo o bloco de indicados para dar peso. **Decisão**: Background Dark Texturizado (Noise) para todas as categorias principais para manter a sofisticação.

### Sub-seção 4.1: Melhor Filme (Destaque Máximo)
- **Título**: "Melhor Filme"
- **Layout**: Grid de Posters.
- **Grid**: 2 linhas x 5 colunas (Desktop) ou scroller horizontal (Mobile).
- **Cards**:
    - Poster do filme (Aspect Ratio `2:3`).
    - Título do filme abaixo (Bodoni Moda, Branco).
    - Produtores (Inter, small, Muted).
- **Hover**: Poster brilha/glow dourado nas bordas.

### Sub-seção 4.2: Direção & Atuações
- **Layout**: Lista elegante ou Cards horizontais.
- **Estilo**: Lista com foto circular ou quadrada pequena do indicado + Nome (Grande) + Filme (Itálico, Gold).
- **Separadores**: Linhas finas (`1px solid rgba(255,255,255,0.1)`) entre indicados.

### Sub-seção 4.3: Categorias Técnicas, Roteiro, Internacional, etc.
- **Layout**: Grids compactos (3 colunas).
- **Conteúdo**: Título da Categoria + Lista simples de indicados (Bullet points customizados).

### Tipografia
- **Títulos de Categoria**: Instrument Serif Italic, `3rem`, Gold.
- **Nomes Filmes/Pessoas**: Bodoni Moda, `1.5rem` (Principais) / Inter `1rem` (Secundários).

---

## Seção 5: Governors Awards

### Conteúdo
- **Título**: "Prêmios dos Governadores" e "Prêmio Humanitário Jean Hersholt".
- **Homenageados**: Debbie Allen, Tom Cruise, Wynn Thomas, Dolly Parton.

### Layout
- **Background**: Gold Gradient sutil ou Cream (`#f2efe9`) para diferenciar.
- **Grid**: 4 Colunas.
- **Card**:
    - Foto P&B do homenageado (tinturada de dourado no hover).
    - Nome (Display Font).
    - Descrição curta (Inter).

---

## Seção 6: Regras e Novidades ("Evolução da Academia")

### Conteúdo
- Itens sobre IA, Obrigação de Exibição, Melhor Elenco.

### Layout
- **Estilo**: "News Ticker" ou Lista Accordion.
- **Design**: Minimalista. Título à esquerda, itens à direita.

---

## Footer

### Layout
- Minimalista, centralizado.
- Logo da Academia (SVG simples).
- Links lado a lado.
- Copyright discreto.
- **Cor**: Background Black (`#000`), Texto Cinza escuro.

---

# Resumo da Especificação

Este documento detalha a construção da landing page do Oscar 2026 com foco na experiência visual premium.

**Destaques de Implementação:**
1.  **Hero Imersivo**: Implementação técnica de Scroll-bound animation para a estatueta 3D e efeito parallax complexo.
2.  **Design System V2**: Fidelidade total às cores (`#a98f37`, `#171010`) e tipografia (`Bodoni` + `Instrument Serif`) aprovadas.
3.  **Módulo de Retrospectiva**: Carrossel interativo adicionado conforme solicitado.
4.  **Arquitetura de Informação**: Organização dos indicados em hierarquias visuais (Destaque para Filme/Direção/Atores vs Lista para Técnicos) para não cansar o usuário.

**Próximos Passos:**
- Aprovação deste Layout Spec.
- Execução via comando `/desenvolver`.
