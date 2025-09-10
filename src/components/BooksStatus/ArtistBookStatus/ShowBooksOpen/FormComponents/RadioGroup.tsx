import { Group, Radio, RadioGroupProps, Stack } from '@mantine/core'
import { UseFormReturnType } from '@mantine/form'

interface IRadioGroup<TValues extends Record<string, any>> {
  id: string
  values: { value: string; label: string }[]
  form: UseFormReturnType<TValues>
  additionalProps?: Partial<RadioGroupProps>
  direction?: 'vertical' | 'horizontal'
}

function RadioGroup<TValues extends Record<string, any>>({
  id,
  values,
  form,
  additionalProps,
  direction = 'horizontal',
}: IRadioGroup<TValues>) {
  const renderInner = () => {
    if (direction === 'vertical') {
      return (
        <Stack mt="xs" gap="xs">
          {values.map(({ value, label }) => (
            <Radio key={value} value={value} label={label} />
          ))}
        </Stack>
      )
    }

    return (
      <Group mt="xs">
        {values.map(({ value, label }) => (
          <Radio key={value} value={value} label={label} />
        ))}
      </Group>
    )
  }

  return (
    <Radio.Group {...additionalProps} {...form.getInputProps(id as string)}>
      {renderInner()}
    </Radio.Group>
  )
}

export default RadioGroup
