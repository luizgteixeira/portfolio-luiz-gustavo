# Luiz Gustavo Dev

Portfólio profissional e site institucional de **Luiz Gustavo Dev**, desenvolvido com `HTML5`, `CSS3` e `JavaScript` puro.

O projeto está em produção como vitrine comercial para apresentação de serviços, diferenciais, projetos entregues e canais de contato. A proposta é unir uma interface visualmente premium com navegação objetiva, boa responsividade e interações leves, sem depender de frameworks ou etapa de build.

## Visão Geral

Este repositório reúne as páginas principais do portfólio:

- `index.html` — apresentação inicial, proposta de valor, chamadas para contato e vídeo demonstrativo
- `servicos.html` — serviços oferecidos e estrutura de entrega
- `skills.html` — diferenciais técnicos e estratégicos
- `projetos.html` — projetos, cases e demonstrações visuais
- `contato.html` — formulário de contato e canais diretos

O site foi pensado para:

- apresentar serviços de desenvolvimento web com clareza
- transmitir confiança para visitantes e possíveis clientes
- funcionar bem em desktop, tablet e celular
- manter boa leitura, hierarquia visual e chamadas de ação
- usar interações em JavaScript apenas onde elas melhoram a experiência

## Destaques Técnicos

- Layout responsivo com CSS modular por página
- Menu mobile acessível com controle de `aria-expanded`
- Animações progressivas com `IntersectionObserver`
- Respeito à preferência de movimento reduzido com `prefers-reduced-motion`
- Barra de progresso de rolagem criada via JavaScript
- Estado visual do cabeçalho conforme a rolagem da página
- Efeito de partículas em `canvas` no hero, ativado apenas em telas maiores
- Cursor animado no destaque inicial
- Formulário de contato com validação nativa e geração de `mailto`
- Módulos JavaScript reutilizáveis para galeria, preço, quantidade e busca em páginas de produto
- Estrutura básica de SEO com metatags, favicon, `robots.txt` e `sitemap.xml`

## JavaScript

Embora o projeto seja estático, o arquivo [`js/script.js`](js/script.js) concentra várias interações de interface usando **Vanilla JavaScript**:

- `initRevealObserver()` controla as animações de entrada dos elementos
- `initScrollProgress()` cria a barra superior de progresso da página
- `initHeaderState()` altera o cabeçalho após o início da rolagem
- `initMobileMenu()` gerencia abertura, fechamento, links, clique externo e tecla `Escape`
- `initContactForm()` monta a mensagem de e-mail a partir do formulário
- `initHeroParticles()` desenha e anima partículas no `canvas`
- `initKickerBlink()` adiciona o cursor visual no texto inicial
- `initProductGallery()`, `initProductPricing()`, `initProductQuantity()` e `initProductSearch()` deixam prontos módulos de produto reutilizáveis

A escolha por JavaScript puro foi intencional: manter o site leve, fácil de auditar no GitHub e sem dependências desnecessárias para uma landing page/portfólio institucional.

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
|   `-- skills.css
|-- img/
|-- js/
|   `-- script.js
|-- video/
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
- Google Fonts
- Imagens e vídeos locais

## Como Executar Localmente

Como o projeto é estático, basta abrir o arquivo `index.html` no navegador.

Se preferir rodar com servidor local, use uma extensão como Live Server no VS Code ou qualquer servidor estático simples.

Exemplo com Python:

```bash
python -m http.server 5500
```

Depois, acesse:

```text
http://localhost:5500
```

## SEO e Publicação

O projeto já inclui arquivos e configurações úteis para publicação:

- metatags de título e descrição por página
- favicon
- `robots.txt`
- `sitemap.xml`
- assets locais para imagens e vídeos
- estrutura compatível com hospedagem estática

Pode ser publicado em serviços como:

- GitHub Pages
- Vercel
- Netlify
- Cloudflare Pages

## Observação Sobre as Linguagens no GitHub

O GitHub calcula a porcentagem de linguagens principalmente pelo tamanho dos arquivos do repositório. Como este projeto tem uma camada visual forte, é natural que `CSS` apareça com participação maior que `JavaScript`.

Isso não significa ausência de lógica: as interações principais estão centralizadas em `js/script.js`, usando JavaScript puro e com foco em experiência, acessibilidade e manutenção simples.

## Objetivo

Este repositório funciona como base pública do portfólio de Luiz Gustavo, reforçando presença profissional, clareza de oferta e geração de contatos comerciais por meio de um site rápido, responsivo e direto ao ponto.
