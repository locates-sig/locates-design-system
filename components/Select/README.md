# Select

Seleção única com lista própria (não usa `<select>` nativo): navegação por teclado, destaque `lilac-highlight` e item selecionado em `primary-light`.

Clique para abrir a lista na prévia.

| Prop | Tipo | Obrigatória | Descrição |
| --- | --- | --- | --- |
| `options` | `SelectOption[]` | sim | Array of selectable option objects |
| `value` | `string` | não | Selected value when controlled |
| `defaultValue` | `string` | não | Initial selected value when uncontrolled |
| `onValueChange` | `(value: string) => void` | não | Callback fired when a new value is selected |
| `placeholder` | `string` | não | Placeholder text when no option is chosen |
| `disabled` | `boolean` | não | Disables the dropdown trigger |
| `error` | `boolean` | não | Displays red error border |
| `size` | `"sm" ∣ "default" ∣ "lg"` | não | Select height scale |
| `className` | `string` | não | Additional container styles |
| `id` | `string` | não | Element ID |

Código-fonte: `uxpilot/src/components/ui/Select.tsx` (gerado no UX Pilot, design system "Locates"). Exportado como `LocatesApp.Select`.
