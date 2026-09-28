# SidePanel

Painel de insights sobre o mapa, claro ou escuro, com header, conteúdo rolável e rodapé.

`position`: left, right (fixos a 16px da borda), floating ou none (no fluxo). No tema escuro a borda usa `navy-800`, que o app não define: o sistema o mapeia para `navy-900`.

| Prop | Tipo | Obrigatória | Descrição |
| --- | --- | --- | --- |
| `isOpen` | `boolean` | não | Controls open visibility state |
| `onClose` | `() => void` | não | Callback fired when clicking the close button |
| `theme` | `"light" ∣ "dark"` | não | Panel theme mode |
| `position` | `"left" ∣ "right" ∣ "floating" ∣ "none"` | não | Preset positioning on the screen |
| `showCloseButton` | `boolean` | não | Show close button in header |

Código-fonte: `uxpilot/src/components/ui/SidePanel.tsx` (gerado no UX Pilot, design system "Locates"). Exportado como `LocatesApp.SidePanel`.
