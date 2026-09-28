# Checkbox

Caixa de seleção de 16px com label e descrição opcionais, estados marcado, indeterminado e erro.

| Prop | Tipo | Obrigatória | Descrição |
| --- | --- | --- | --- |
| `checked` | `boolean` | não | Checked state when controlled |
| `defaultChecked` | `boolean` | não | Initial checked state when uncontrolled |
| `onCheckedChange` | `(checked: boolean) => void` | não | Callback fired when checked state changes |
| `indeterminate` | `boolean` | não | Indeterminate state for parent multi-select options |
| `label` | `React.ReactNode` | não | Clickable label text or custom node |
| `description` | `React.ReactNode` | não | Supporting description text displayed below the label |
| `error` | `boolean` | não | Highlights border in red for validation errors |

Código-fonte: `uxpilot/src/components/ui/Checkbox.tsx` (gerado no UX Pilot, design system "Locates"). Exportado como `LocatesApp.Checkbox`.
