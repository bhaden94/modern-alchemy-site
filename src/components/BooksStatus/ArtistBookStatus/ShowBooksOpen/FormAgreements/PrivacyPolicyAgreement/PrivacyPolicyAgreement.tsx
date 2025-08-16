import { Anchor, Checkbox, Text } from '@mantine/core'
import Link from 'next/link'

import { NavigationPages } from '~/utils/navigation'

const PrivacyPolicyAgreement = () => {
  const label = (
    <Text>
      I accept the{' '}
      <Anchor
        component={Link}
        href={NavigationPages.PrivacyPolicy}
        underline="hover"
        target="_blank"
        c="primary"
      >
        privacy policy
      </Anchor>
      .
    </Text>
  )

  return (
    <Checkbox
      key={'privacyPolicy'}
      label={label}
      value={'privacyPolicy'}
      error={false}
    />
  )
}

export default PrivacyPolicyAgreement
