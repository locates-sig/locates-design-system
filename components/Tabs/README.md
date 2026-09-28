# Tabs

Abas em três estilos: `line` (sublinhado), `pill` e `segmented` (trilho cinza), com ícone e badge por aba.

| Prop | Tipo | Obrigatória | Descrição |
| --- | --- | --- | --- |
| `items` | `TabItem[]` | não | List of tab items (alternative to compound components) |
| `value` | `string` | não | Controlled active tab value |
| `defaultValue` | `string` | não | Default active tab value when uncontrolled |
| `onValueChange` | `(value: string) => void` | não | Callback fired when selected tab changes |
| `variant` | `"line" ∣ "pill" ∣ "segmented"` | não | Visual presentation style |
| `size` | `"sm" ∣ "default" ∣ "lg"` | não | Size scale for tab triggers |
| `fullWidth` | `boolean` | não | Stretches tabs to fill container width |
| `className` | `string` | não | Additional container classes |
| `children` | `React.ReactNode` | não | Custom compound children (TabsList, TabsContent) |

Código-fonte: `uxpilot/src/components/ui/Tabs.tsx` (gerado no UX Pilot, design system "Locates"). Exportado como `LocatesApp.Tabs`.
