# Sidebar

Barra lateral recolhível com grupos, ícones, badges, cabeçalho e rodapé.

| Prop | Tipo | Obrigatória | Descrição |
| --- | --- | --- | --- |
| `items` | `SidebarItemData[]` | não | Navigation items list |
| `activeId` | `string` | não | Controlled active item ID |
| `collapsed` | `boolean` | não | Controlled collapsed state |
| `defaultCollapsed` | `boolean` | não | Default collapsed state for uncontrolled use |
| `onCollapseChange` | `(collapsed: boolean) => void` | não | Callback fired when collapsed state changes |
| `header` | `React.ReactNode` | não | Custom header element rendered at top |
| `footer` | `React.ReactNode` | não | Custom footer element rendered at bottom |
| `onSelect` | `(item: SidebarItemData) => void` | não | Callback when an item is selected |
| `className` | `string` | não | Container style overrides |

Código-fonte: `uxpilot/src/components/ui/Sidebar.tsx` (gerado no UX Pilot, design system "Locates"). Exportado como `LocatesApp.Sidebar`.
