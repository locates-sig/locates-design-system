# Input

Campo de texto com borda para formulários densos da aplicação, com ícones opcionais e estado de erro.

Nas telas de autenticação use `FloatingInput`, não este.

| Prop | Tipo | Obrigatória | Descrição |
| --- | --- | --- | --- |
| `size` | `"sm" ∣ "default" ∣ "lg"` | não | Size scale for dense vs relaxed form layouts |
| `leftIcon` | `React.ReactNode` | não | Icon or visual element rendered inside the left edge |
| `rightIcon` | `React.ReactNode` | não | Icon or visual element rendered inside the right edge |
| `error` | `boolean ∣ string` | não | Set true or pass error message to apply red error styling |

Código-fonte: `uxpilot/src/components/ui/Input.tsx` (gerado no UX Pilot, design system "Locates"). Exportado como `LocatesApp.Input`.
