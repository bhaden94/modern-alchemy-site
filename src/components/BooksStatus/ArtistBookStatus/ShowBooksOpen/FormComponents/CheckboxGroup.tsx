import {
  Checkbox,
  CheckboxGroupProps,
  CheckboxProps,
  Group,
  Stack,
} from '@mantine/core'
import { UseFormReturnType } from '@mantine/form'

interface ICheckboxGroup<TValues extends Record<string, any>> {
  id: string
  values: { value: string; label: string }[]
  form: UseFormReturnType<TValues>
  additionalGroupProps?: Partial<CheckboxGroupProps>
  additionalCheckboxProps?: Partial<CheckboxProps>
  direction?: 'vertical' | 'horizontal'
}

function CheckboxGroup<TValues extends Record<string, any>>({
  id,
  values,
  form,
  additionalGroupProps,
  additionalCheckboxProps,
  direction = 'horizontal',
}: ICheckboxGroup<TValues>) {
  const renderInner = () => {
    if (direction === 'vertical') {
      return (
        <Stack mt="xs" gap="xs">
          {values.map(({ value, label }) => (
            <Checkbox
              key={value}
              value={value}
              label={label}
              {...additionalCheckboxProps}
            />
          ))}
        </Stack>
      )
    }

    return (
      <Group mt="xs">
        {values.map(({ value, label }) => (
          <Checkbox
            key={value}
            value={value}
            label={label}
            {...additionalCheckboxProps}
          />
        ))}
      </Group>
    )
  }

  return (
    <Checkbox.Group {...additionalGroupProps} {...form.getInputProps(id)}>
      {renderInner()}
    </Checkbox.Group>
  )
}

export default CheckboxGroup
