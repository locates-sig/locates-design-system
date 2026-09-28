# DropdownMenu

Menu suspenso a partir de um gatilho, com ícones, atalhos, item selecionado e item destrutivo.

Controlado por `open`/`onOpenChange` ou autônomo. Hover `lilac-50`, teclado `lilac-highlight`, destrutivo com `destructive-soft` + `destructive-text`.

| Prop | Tipo | Obrigatória | Descrição |
| --- | --- | --- | --- |
| `trigger` | `React.ReactNode` | sim | Trigger element that toggles the dropdown |
| `items` | `DropdownMenuItemData[]` | não | Array of menu items (alternative to compound children) |
| `open` | `boolean` | não | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | não | Callback fired when open state changes |
| `align` | `"start" ∣ "center" ∣ "end"` | não | Alignment of the popover menu relative to trigger |
| `width` | `"auto" ∣ "trigger" ∣ "sm" ∣ "md" ∣ "lg"` | não | Width mode of the menu |
| `className` | `string` | não | Optional custom class name for the menu container |
| `children` | `React.ReactNode` | não | Custom content rendered inside the dropdown popover |

Código-fonte: `uxpilot/src/components/ui/DropdownMenu.tsx` (gerado no UX Pilot, design system "Locates"). Exportado como `LocatesApp.DropdownMenu`.
