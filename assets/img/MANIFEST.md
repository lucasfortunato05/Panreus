# Manifest de imagens — Panréus

As fotos ainda não existem. **Solte cada arquivo nesta pasta com o nome exato abaixo e o site
passa a exibi-lo automaticamente** — todos os `<img>` do `index.html` já apontam para estes caminhos.

Enquanto o arquivo não existe, o site mostra um placeholder elegante (gradiente creme/verde com o
nome do slot).

| Arquivo | Conteúdo esperado | Orientação sugerida | Uso no site |
|---|---|---|---|
| `hero-fachada.jpg` | Fachada do novo espaço ao entardecer, letreiro aceso | Paisagem (≥1920px de largura) | Hero (fundo) |
| `interior-cafe.jpg` | Salão com plantas pendentes, madeira clara e pendentes de luz quente | Paisagem | História / ambiente |
| `vitrine-doces.jpg` | Vitrine de confeitaria: cucas, doces, fatias | Paisagem | Vitrine de produtos |
| `torta-morango.jpg` | Torta de morango com chantilly (produto-destaque) | Retrato ou quadrada | Vitrine de produtos |
| `sanduiche.jpg` | Sanduíche em close, luz natural | Quadrada | Vitrine de produtos |
| `buffet-cafe.jpg` | Mesa do buffet de café da manhã montada | Paisagem | Seção buffet |
| `equipe.jpg` | Equipe no balcão ou na cozinha, clima espontâneo | Paisagem | História / footer |
| `historia-pb.jpg` | Foto antiga da padaria em **preto e branco** | Qualquer | História (transição P&B → cor) |

## Recomendações técnicas

- Formato: JPG com qualidade ~80 (ou WebP com os mesmos nomes, ajustando as extensões no HTML).
- Peso: idealmente < 400 KB por imagem (hero pode chegar a ~700 KB).
- Sem texto embutido nas fotos — todo texto vem do HTML.
