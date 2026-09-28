# MetricCard

Card de KPI: rótulo em caixa alta, valor grande com `tabular-nums`, variação com seta e nota de rodapé.

A direção da variação é inferida do sinal do texto (`+`/`-`) quando `trendDirection` não é passado.

| Prop | Tipo | Obrigatória | Descrição |
| --- | --- | --- | --- |
| `label` | `React.ReactNode` | sim | Metric label or title |
| `value` | `React.ReactNode` | sim | Primary metric value formatted with tabular numbers |
| `trend` | `React.ReactNode` | não | Trend value string (e.g. "+6,2%" or "-3,1%") or custom badge element |
| `trendDirection` | `"up" ∣ "down" ∣ "neutral"` | não | Direction of the trend indicator for automated styling and icon rendering |
| `subtitle` | `React.ReactNode` | não | Optional contextual footnote or subtitle below the primary metric |
| `icon` | `React.ReactNode` | não | Optional top-right icon element |
| `badge` | `React.ReactNode` | não | Optional top status or category badge |
| `size` | `"sm" ∣ "default" ∣ "lg"` | não | Size scale affecting card paddings and metric typography |
| `elevated` | `boolean` | não | Whether to render with elevated soft shadow |

Código-fonte: `uxpilot/src/components/ui/MetricCard.tsx` (gerado no UX Pilot, design system "Locates"). Exportado como `LocatesApp.MetricCard`.
