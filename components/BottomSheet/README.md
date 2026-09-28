# BottomSheet

Folha inferior do mobile, com overlay, alça, pontos de parada (sm, md, lg, auto, full) e sombra para cima.

Usa `position: fixed`; na prévia ocupa o quadro inteiro. Respeita `env(safe-area-inset-bottom)`.

| Prop | Tipo | Obrigatória | Descrição |
| --- | --- | --- | --- |
| `isOpen` | `boolean` | não | Controls visibility open state |
| `onClose` | `() => void` | não | Callback fired when closing sheet or clicking backdrop |
| `showOverlay` | `boolean` | não | Show dark backdrop overlay behind bottom sheet |
| `closeOnOverlayClick` | `boolean` | não | Whether clicking the backdrop overlay triggers onClose |
| `snapPoint` | `"sm" ∣ "md" ∣ "lg" ∣ "auto" ∣ "full"` | não | Height / Snap point preset |

Código-fonte: `uxpilot/src/components/ui/BottomSheet.tsx` (gerado no UX Pilot, design system "Locates"). Exportado como `LocatesApp.BottomSheet`.
