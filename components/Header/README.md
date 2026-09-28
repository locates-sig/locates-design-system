# Header

Topbar de 72px com logo, navegação principal, ações e bloco do usuário.

| Prop | Tipo | Obrigatória | Descrição |
| --- | --- | --- | --- |
| `logo` | `React.ReactNode` | não | Logo slot or custom element rendered on the left |
| `navItems` | `HeaderNavItem[]` | não | Navigation links rendered in the center section |
| `activeId` | `string` | não | Controlled active navigation item ID |
| `onNavSelect` | `(item: HeaderNavItem) => void` | não | Callback fired when a navigation link is clicked |
| `actions` | `React.ReactNode` | não | Action elements rendered on the right side before user menu |
| `user` | `{` | não | User menu slot or user profile details |
| `className` | `string` | não | Additional container styling |

Código-fonte: `uxpilot/src/components/ui/Header.tsx` (gerado no UX Pilot, design system "Locates"). Exportado como `LocatesApp.Header`.
