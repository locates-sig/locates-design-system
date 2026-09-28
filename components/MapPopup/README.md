# MapPopup

Balão de clique do mapa com eyebrow, título e pares chave–valor; também nas variantes tooltip, measure e zoning.

Espelha os overrides do Mapbox GL do app: branco, `rounded-md`, 300–379px, `shadow-popup`.

| Prop | Tipo | Obrigatória | Descrição |
| --- | --- | --- | --- |
| `variant` | `"default" ∣ "tooltip" ∣ "measure" ∣ "zoning"` | não | Visual variant type |
| `eyebrow` | `string` | não | Optional micro label displayed above the popup title |
| `title` | `React.ReactNode` | não | Main title heading of the map popup |
| `items` | `KeyValueItem[]` | não | Structured array of key-value metrics |
| `onClose` | `() => void` | não | Optional callback fired when clicking the top-right close icon |
| `tipPosition` | `"bottom" ∣ "top" ∣ "left" ∣ "right" ∣ "none"` | não | Pointer arrow tip position |
| `measureType` | `"area" ∣ "edge"` | não | Sub-type for measure variant |

Código-fonte: `uxpilot/src/components/ui/MapPopup.tsx` (gerado no UX Pilot, design system "Locates"). Exportado como `LocatesApp.MapPopup`.
