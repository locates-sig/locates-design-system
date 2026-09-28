# Card

Superfície genérica com header, título, descrição, conteúdo e rodapé; raio e elevação configuráveis pelos tokens.

`radius`: none, sm, md, lg, 2xl, panel. `elevation`: none, sm, md, lg, xl, soft, popup, float.

| Prop | Tipo | Obrigatória | Descrição |
| --- | --- | --- | --- |
| `radius` | `"none" ∣ "sm" ∣ "md" ∣ "lg" ∣ "2xl" ∣ "panel"` | não | Border radius options matching system shape tokens |
| `elevation` | `"none" ∣ "sm" ∣ "md" ∣ "lg" ∣ "xl" ∣ "soft" ∣ "popup" ∣ "float"` | não | Elevation shadow level |
| `bordered` | `boolean` | não | Whether to show a neutral subtle border around the surface |

Código-fonte: `uxpilot/src/components/ui/Card.tsx` (gerado no UX Pilot, design system "Locates"). Exportado como `LocatesApp.Card`.
