# Switch

Liga/desliga para camadas e preferências, em `primary` ou `lilac`, com label e descrição.

| Prop | Tipo | Obrigatória | Descrição |
| --- | --- | --- | --- |
| `checked` | `boolean` | não | Checked state when controlled |
| `defaultChecked` | `boolean` | não | Initial checked state when uncontrolled |
| `onCheckedChange` | `(checked: boolean) => void` | não | Callback fired when switch state toggles |
| `size` | `"sm" ∣ "default"` | não | Switch size scale |
| `activeColor` | `"primary" ∣ "lilac"` | não | Track fill style when active: primary purple or soft lilac |
| `label` | `React.ReactNode` | não | Clickable label rendered next to the switch |
| `description` | `React.ReactNode` | não | Supporting text rendered below the label |

Código-fonte: `uxpilot/src/components/ui/Switch.tsx` (gerado no UX Pilot, design system "Locates"). Exportado como `LocatesApp.Switch`.
