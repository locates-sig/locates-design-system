# ButtonGroup

Agrupa botões lado a lado em três estilos: `attached` (colados), `segmented` (trilho cinza com pílula, como o seletor de período) e `spaced`.

| Prop | Tipo | Obrigatória | Descrição |
| --- | --- | --- | --- |
| `variant` | `"attached" ∣ "segmented" ∣ "spaced"` | não | Visual group style variant |
| `orientation` | `"horizontal" ∣ "vertical"` | não | Layout orientation |
| `size` | `"xs" ∣ "sm" ∣ "default" ∣ "lg"` | não | Size passed to buttons inside the group when using context |
| `children` | `React.ReactNode` | sim | Children elements (buttons or custom components) |

Código-fonte: `uxpilot/src/components/ui/ButtonGroup.tsx` (gerado no UX Pilot, design system "Locates"). Exportado como `LocatesApp.ButtonGroup`.
