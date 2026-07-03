# Luiz Gustavo Dev

Portfólio profissional e site institucional de **Luiz Gustavo Dev**, criado com `HTML5`, `CSS3` e `JavaScript` puro.

O site funciona como vitrine comercial para apresentar serviços, diferenciais, projetos em destaque e canais de contato. A proposta é entregar uma experiência direta, responsiva e visualmente consistente, sem frameworks, etapa de build ou dependências desnecessárias.

## Visão Geral

Este repositório contém um site estático composto pelas páginas principais:

- `index.html` - apresentação inicial, proposta de valor, tecnologias, projetos e chamada para contato
- `servicos.html` - serviços oferecidos e estrutura de entrega
- `skills.html` - diferenciais técnicos, estratégicos e de experiência do usuário
- `projetos.html` - projetos em destaque com cards, vídeos e links externos
- `contato.html` - formulário de contato e canais diretos

O foco do projeto é:

- comunicar rapidamente quem sou, o que faço e como entrar em contato
- apresentar serviços de desenvolvimento web, apps e sistemas com clareza
- destacar projetos reais, como Vinc, Fauny e De La Flor
- funcionar bem em desktop, tablet e smartphones
- manter boa leitura, SEO básico, acessibilidade e navegação simples

## Destaques Técnicos

- Estrutura estática com HTML semântico
- CSS modular por responsabilidade e por página
- Menu mobile com `aria-expanded`, fechamento por clique externo e tecla `Escape`
- Layout responsivo validado em larguras de `320px`, `360px`, `390px`, `414px`, `768px` e `980px`
- Cards de projetos com vídeos locais usando `object-fit: cover`
- Link externo do projeto De La Flor preservado em nova aba
- Animações progressivas com `IntersectionObserver`
- Suporte a `prefers-reduced-motion`
- Barra de progresso de rolagem em JavaScript
- Cabeçalho com estado visual conforme rolagem
- Botão flutuante do WhatsApp ajustado para mobile e tablet
- Formulário de contato com validação nativa e geração de mensagem via `mailto`
- SEO básico com metatags, favicon, `robots.txt` e `sitemap.xml`

## JavaScript

O projeto usa **Vanilla JavaScript** em [`js/script.js`](js/script.js), sem bibliotecas externas.

Principais interações:

- `initMobileMenu()` gerencia abertura, fechamento, clique externo e `Escape`
- `initRevealObserver()` controla animações de entrada
- `initScrollProgress()` atualiza a barra superior de progresso
- `initHeaderState()` altera o cabeçalho após rolagem
- `initContactForm()` monta a mensagem de contato a partir do formulário
- `initHeroParticles()` desenha partículas no `canvas` do hero em telas maiores
- `initKickerBlink()` aplica o cursor visual no destaque inicial
- módulos de produto reutilizáveis seguem disponíveis para galeria, preço, quantidade e busca

A escolha por JavaScript puro mantém o projeto leve, auditável e fácil de publicar em hospedagens estáticas.

## Estrutura do Projeto

```text
.
|-- css/
|   |-- contato.css
|   |-- global.css
|   |-- index.css
|   |-- menu.css
|   |-- produtos.css
|   |-- projetos.css
|   |-- servicos.css
|   |-- skills.css
|   `-- typography.css
|-- fonts/
|-- img/
|-- js/
|   `-- script.js
|-- video/
|   |-- de-la-flor1.mp4
|   |-- fauny-video.mp4
|   `-- vinc-video.mp4
|-- contato.html
|-- index.html
|-- projetos.html
|-- servicos.html
|-- skills.html
|-- robots.txt
`-- sitemap.xml
```

## Stack

- `HTML5`
- `CSS3`
- `JavaScript` puro
- Fontes locais e Google Fonts
- Imagens e vídeos locais

## Como Executar Localmente

Por ser um site estático, é possível abrir `index.html` diretamente no navegador.

Para testar com servidor local, use Live Server no VS Code ou um servidor estático simples:

```bash
python -m http.server 5500
```

Depois acesse:

```text
http://localhost:5500
```

## Validação Recomendada

Antes de publicar alterações, vale conferir manualmente:

- menu mobile aberto e fechado
- navegação por links internos
- cards e vídeos da página de projetos
- formulário de contato
- botão do WhatsApp
- responsividade em DevTools para mobile, tablet e desktop
- console do navegador sem erros relevantes

## SEO e Publicação

O projeto já inclui itens básicos para publicação:

- `title` e `meta description` por página
- canonical URLs
- Open Graph e Twitter Card
- favicon
- `robots.txt`
- `sitemap.xml`
- textos alternativos em imagens relevantes
- estrutura compatível com hospedagem estática

Pode ser publicado em serviços como GitHub Pages, Vercel, Netlify, Cloudflare Pages ou hospedagem estática tradicional.

## Observação Sobre as Linguagens no GitHub

O GitHub calcula a porcentagem de linguagens principalmente pelo tamanho dos arquivos. Como o projeto tem forte camada visual, é esperado que `CSS` apareça com participação maior.

Isso não significa ausência de lógica: as interações principais ficam centralizadas em `js/script.js`, com foco em experiência, acessibilidade e manutenção simples.

## Objetivo

Este repositório é a base pública do portfólio de Luiz Gustavo. Ele reforça presença profissional, clareza de oferta e geração de contatos comerciais por meio de um site rápido, direto e responsivo.
