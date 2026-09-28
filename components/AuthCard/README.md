# AuthCard

Layout das telas de login e cadastro: painel institucional à esquerda (≥lg) e card de formulário à direita.

Diferenças em relação ao login em produção: o UX Pilot alinha o título à esquerda, em negrito (o app centraliza, em semibold) e escurece a imagem com um degradê `navy-950`. Ajuste por `className` se precisar da paridade exata.

| Prop | Tipo | Obrigatória | Descrição |
| --- | --- | --- | --- |
| `logo` | `React.ReactNode` | não | Optional logo element or image rendered above the form title |
| `title` | `React.ReactNode` | não | Card title heading (e.g., "Seja bem-vindo(a)") |
| `subtitle` | `React.ReactNode` | não | Card subtitle text (e.g., "Insira suas informações de acesso") |
| `imageSrc` | `string` | não | Hero image URL for the branded left panel on large displays |
| `imageQuote` | `React.ReactNode` | não | Institutional quote or text shown on the branded left panel |
| `footer` | `React.ReactNode` | não | Footer content displayed below the card main form body |
| `containerClassName` | `string` | não | Optional custom class for the outer split container |
| `imagePanelClassName` | `string` | não | Optional custom class for the left branded image panel |

Código-fonte: `uxpilot/src/components/ui/AuthCard.tsx` (gerado no UX Pilot, design system "Locates"). Exportado como `LocatesApp.AuthCard`.
