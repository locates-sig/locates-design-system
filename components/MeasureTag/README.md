# MeasureTag

Etiqueta da ferramenta de medição: área (roxo 95%) ou aresta (roxo 90%).

| Prop | Tipo | Obrigatória | Descrição |
| --- | --- | --- | --- |
| `value` | `React.ReactNode` | não | The measured metric value (e.g. "1.248 m²" or "42,5 m") |
| `variant` | `"area" ∣ "edge"` | não | Variant type: "area" for surface measurements, "edge" for line distance measurements |
| `size` | `"sm" ∣ "default"` | não | Size scale |
| `icon` | `React.ReactNode` | não | Optional measurement tool icon or prefix |

Código-fonte: `uxpilot/src/components/ui/MeasureTag.tsx` (gerado no UX Pilot, design system "Locates"). Exportado como `LocatesApp.MeasureTag`.
