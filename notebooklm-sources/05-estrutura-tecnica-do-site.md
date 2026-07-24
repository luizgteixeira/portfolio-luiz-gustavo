# Ficha técnica do site — portfolio-luiz-gustavo

Este documento descreve como o próprio site (luizgustavodev.com) foi construído — útil para explicar decisões técnicas em entrevistas ou para documentação do projeto.

## Natureza do projeto

Site estático, sem etapa de build obrigatória, feito em HTML, CSS e JavaScript puros (sem framework de front-end). Pode ser aberto diretamente no navegador ou servido com uma extensão como Live Server no VS Code.

## Estrutura de pastas

```text
portfolio-luiz-gustavo/
├── index.html        (Início)
├── servicos.html      (Serviços)
├── projetos.html       (Projetos)
├── contato.html         (Contato / formulário)
├── css/
│   ├── global.css
│   ├── menu.css
│   ├── index.css
│   ├── servicos.css
│   ├── projetos.css
│   ├── contato.css
│   └── typography.css
├── js/
│   └── script.js
├── data/
│   └── contact.json      (WhatsApp, telefone e e-mail centralizados)
├── img/                    (logos, fotos, previews de projetos)
├── video/                   (vídeos de demonstração dos projetos)
├── fonts/                    (Geist, Plus Jakarta Sans)
├── robots.txt
└── sitemap.xml
```

## Páginas principais

- `index.html` — apresentação principal, resumo de serviços, tecnologias, projetos em destaque e chamada para contato.
- `servicos.html` — descrição dos serviços oferecidos e processo de trabalho.
- `projetos.html` — projetos em destaque (Vinc, Fauny, De La Flor).
- `contato.html` — formulário, WhatsApp e informações de contato.

## Recursos e boas práticas implementadas

- HTML semântico
- Responsividade para desktop, tablet e mobile
- Navegação mobile com menu acessível (`menu-toggle`, `aria-controls`, `aria-expanded`)
- Foco visível para navegação por teclado
- `skip-link` para pular direto ao conteúdo principal
- Suporte a `prefers-reduced-motion`
- SEO: meta tags de título/descrição por página, `link rel="canonical"`
- Open Graph e Twitter Card configurados por página
- Dados estruturados **JSON-LD** (schema.org) com os tipos `ProfessionalService`, `Person`, `WebSite`, `BreadcrumbList`, `CollectionPage`, `Service` e `ContactPage`, conectando as páginas entre si via `@id`
- `robots.txt` e `sitemap.xml`
- Versionamento de assets (CSS/JS) via query string (ex.: `?v=20260723-1`) para invalidar cache após deploys
- Botão flutuante de WhatsApp fixo em todas as páginas

## Dados estruturados (JSON-LD) — resumo

O bloco `@graph` presente em todas as páginas identifica:

- **ProfessionalService** (`#business`): "Luiz Gustavo Dev", e-mail `contato@luizgustavodev.com`, telefone `+55 31 99260-9970`, endereço em Belo Horizonte/MG/BR, área de atuação nacional (BR).
- **Person** (`#person`): Luiz Gustavo Barbosa Teixeira, cargo "Desenvolvedor Full-Stack e Mobile", com `knowsAbout`: HTML5, CSS3, JavaScript, Flutter, Dart, Node.js, TypeScript, Prisma, PostgreSQL.
- **WebSite** (`#website`): idioma `pt-BR`.

## Publicação

O site pode ser publicado em qualquer hospedagem estática: Hostinger, GitHub Pages, Netlify, Vercel, ou hospedagem tradicional via FTP/gerenciador de arquivos.

Checklist antes de publicar:

- caminhos de imagens e vídeos corretos;
- `robots.txt` apontando para o domínio correto;
- `sitemap.xml` atualizado;
- arquivos CSS e JS com a versão de cache mais recente.

## Licença

O código pode ser usado como referência de estrutura, organização e apresentação, mas textos, identidade visual, imagens, vídeos e dados pessoais não devem ser reutilizados sem autorização.
