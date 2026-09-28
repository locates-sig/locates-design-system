# IconButton

Botão só de ícone, quadrado ou circular, com rótulo acessível obrigatório (`label`).

Use nos controles flutuantes do mapa (zoom, camadas, medir). `label` vira `aria-label` e o texto do tooltip nativo.

| Prop | Tipo | Obrigatória | Descrição |
| --- | --- | --- | --- |
| `label` | `string` | sim | Accessible label for screen readers |
| `icon` | `React.ReactNode` | não | The icon component or element to render |
| `size` | `"xs" ∣ "sm" ∣ "default" ∣ "lg"` | não | Size scale corresponding to square dimensions |
| `shape` | `"square" ∣ "circle"` | não | Shape variant |

Código-fonte: `uxpilot/src/components/ui/IconButton.tsx` (gerado no UX Pilot, design system "Locates"). Exportado como `LocatesApp.IconButton`.
