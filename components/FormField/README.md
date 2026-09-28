# FormField

Envelope de campo: `Label`, marca de obrigatório, texto de ajuda e mensagem de erro em volta de qualquer controle.

| Prop | Tipo | Obrigatória | Descrição |
| --- | --- | --- | --- |
| `label` | `React.ReactNode` | não | Label text rendered above the input control |
| `htmlFor` | `string` | não | HTML id connecting label to control |
| `required` | `boolean` | não | Displays a red required asterisk next to label |
| `labelSize` | `"micro" ∣ "xs" ∣ "sm" ∣ "default" ∣ "lg"` | não | Size scale for the field label |
| `error` | `string` | não | Validation error message rendered below control |
| `helperText` | `React.ReactNode` | não | Helper text rendered below control when error is absent |
| `className` | `string` | não | Additional wrapper classes |
| `children` | `React.ReactNode` | sim | Form control element (Input, Select, Switch, etc.) |

Código-fonte: `uxpilot/src/components/ui/FormField.tsx` (gerado no UX Pilot, design system "Locates"). Exportado como `LocatesApp.FormField`.
