# Alert

Faixa de aviso com ícone, título, descrição, ação e botão de fechar, em seis variantes.

Variantes: `info`, `success`, `warning`, `error`, `destructive`, `primary`. O `warning` usa `border-amber-300`, tom que o app não usa: o sistema o define com o valor oficial do Tailwind v4 (#ffd230).

| Prop | Tipo | Obrigatória | Descrição |
| --- | --- | --- | --- |
| `variant` | `AlertVariant` | não | Visual variant theme |
| `title` | `React.ReactNode` | não | Primary title of the alert banner |
| `description` | `React.ReactNode` | não | Detailed message content |
| `icon` | `React.ReactNode ∣ boolean` | não | Custom icon element or boolean flag to toggle default icon |
| `onClose` | `() => void` | não | Callback fired when dismiss button is clicked |
| `action` | `React.ReactNode` | não | Optional action element rendered on the right side |

Código-fonte: `uxpilot/src/components/ui/Alert.tsx` (gerado no UX Pilot, design system "Locates"). Exportado como `LocatesApp.Alert`.
