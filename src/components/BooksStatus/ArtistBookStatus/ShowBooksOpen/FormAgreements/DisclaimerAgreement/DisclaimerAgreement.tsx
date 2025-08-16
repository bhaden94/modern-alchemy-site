import { Anchor, Checkbox, Text } from '@mantine/core'

const DisclaimerAgreement = () => {
  const label = (
    <Text>
      I accept the above{' '}
      <Anchor href="#" underline="hover" c="primary">
        tattoo disclaimer
      </Anchor>
      .
    </Text>
  )

  return (
    <Checkbox
      key={'disclaimer'}
      label={label}
      value={'disclaimer'}
      error={false}
    />
  )
}

export default DisclaimerAgreement
