# Button

Ação clicável com seis variantes (default, secondary, outline, ghost, destructive, link) e cinco tamanhos (xs 24px a lg 36px, mais icon 32×32).

O CTA de formulário do app (login) é o `size="lg" fullWidth`. `destructive` usa `bg-destructive-soft` com texto `destructive`, nunca vermelho sólido. `isLoading` troca o ícone esquerdo por um spinner e desabilita o botão.

| Prop | Tipo | Obrigatória | Descrição |
| --- | --- | --- | --- |
| `variant` | `"default" ∣ "secondary" ∣ "outline" ∣ "ghost" ∣ "destructive" ∣ "link"` | não | Visual style variant |
| `size` | `"xs" ∣ "sm" ∣ "default" ∣ "lg" ∣ "icon"` | não | Size scale |
| `fullWidth` | `boolean` | não | Whether the button takes up the full width of its container |
| `isLoading` | `boolean` | não | Shows a spinning loading state and disables interactions |
| `leftIcon` | `React.ReactNode` | não | Optional element rendered before children |
| `rightIcon` | `React.ReactNode` | não | Optional element rendered after children |

Código-fonte: `uxpilot/src/components/ui/Button.tsx` (gerado no UX Pilot, design system "Locates"). Exportado como `LocatesApp.Button`.
