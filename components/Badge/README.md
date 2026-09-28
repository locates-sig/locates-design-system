# Badge

Etiqueta curta de status ou categoria, em sete variantes, com ponto indicador e ícones opcionais.

A cor carrega significado: `positive` = alta/ok, `warning` = atenção, `destructive` = problema. Não use para decorar.

| Prop | Tipo | Obrigatória | Descrição |
| --- | --- | --- | --- |
| `size` | `"sm" ∣ "default" ∣ "lg"` | não | Size scale |
| `dot` | `boolean` | não | Optional status indicator dot before label |
| `leftIcon` | `React.ReactNode` | não | Element rendered before the badge content |
| `rightIcon` | `React.ReactNode` | não | Element rendered after the badge content |

Código-fonte: `uxpilot/src/components/ui/Badge.tsx` (gerado no UX Pilot, design system "Locates"). Exportado como `LocatesApp.Badge`.
