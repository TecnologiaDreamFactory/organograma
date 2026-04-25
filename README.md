# Organograma Dream Factory

Aplicação web estática que exibe o organograma da empresa de forma interativa: expansão a partir do Presidente, diretores, áreas e o painel **Visão da equipe**. Inclui animações (GSAP), tema claro/escuro persistido e layout responsivo.

**Stack:** HTML5, CSS3, JavaScript (sem build obrigatório). Fontes: Google Fonts (IBM Plex Sans). Animação: [GSAP](https://gsap.com/) via CDN (cdnjs).

## Estrutura do repositório

| Arquivo | Descrição |
|--------|------------|
| `index.html` | Estrutura da página, metadados, tema inicial (`localStorage`), link para `styles.css` (com parâmetro de versão), GSAP e `script.js` |
| `styles.css` | Tema `dark` / `light`, variáveis de cor, layout e responsividade |
| `script.js` | `ORG_DATA`, lógica do gráfico, painel lateral e alternância de tema |
| `img/logo.png` | Logo do cabeçalho (opcional; a página trata a ausência) |

## Como abrir o projeto

1. Mantenha `index.html`, `styles.css` e `script.js` na **mesma pasta** (e `img/`, se usar logo).
2. Abra `index.html` no navegador (duplo clique ou *Abrir com* Chrome, Edge, Firefox, etc.).

Na **primeira carga**, o navegador precisa de **rede** para carregar as fontes (Google Fonts) e o GSAP. Sem internet, o layout ainda funciona, mas fontes e animação podem falhar.

Se o estilo parecer desatualizado, use recarregamento forçado: `Ctrl+Shift+R` ou `Ctrl+F5`. O `index.html` referencia `styles.css` com `?v=…`; após editar o CSS, pode **incrementar** esse número (por exemplo de `?v=10` para `?v=11`) para reduzir cache agressivo.

## Como usar a página

1. **Presidente** — clique no nó *Presidente* para abrir ou fechar o círculo de diretores.
2. **Diretores** — clique em um diretor; as **áreas** aparecem ao redor, quando houver.
3. **Áreas** — clique em uma **área** para ver no painel **Visão da equipe** o resumo de pessoas e papéis (em telas largas o painel fica à direita; em telas pequenas, abaixo).
4. **Tema** — botão no canto superior direito alterna claro/escuro. A escolha fica em `localStorage` com a chave `df-org-theme`.

## Editar pessoas e áreas

1. Abra `script.js` no editor.
2. Localize o array **`ORG_DATA`**. Cada item é um **diretor** com `id` (numérico), `name` e `areas`.
3. Cada **área** tem: `id` (único no organograma, ex.: `a0-0`), `name` e `people` — lista de `{ name, role }`.
4. Salve o arquivo e recarregue a página. Mantenha **sintaxe JavaScript** válida (vírgulas, aspas e chaves) ao inserir ou remover blocos.

## Ajustar aparência (opcional)

Edite `styles.css`. As variáveis em `:root` e em `html[data-theme="light"]` controlam fundos, nós, textos e o painel. Após salvar, recarregue; se necessário, aumente a versão em `index.html` no `href` de `styles.css`.

## Servidor local (opcional)

Não é obrigatório, mas se preferir `http://localhost` (extensão Live Server, por exemplo), na pasta do projeto:

```bash
npx --yes serve .
```

Abra a URL exibida no terminal.

## Requisitos

- Navegador moderno (suporte a CSS variáveis, `localStorage` e `flex`/`grid` conforme o layout).
- **Rede** na primeira carga para CDN de fontes e GSAP, a menos que você as hospede localmente.
- **Node.js** só é necessário se usar `npx serve` ou outra ferramenta de servidor; abrir o HTML diretamente costuma ser suficiente.

---

© 2026 Laboratório de Tecnologia Dream Factory (alinhado ao rodapé da página).
