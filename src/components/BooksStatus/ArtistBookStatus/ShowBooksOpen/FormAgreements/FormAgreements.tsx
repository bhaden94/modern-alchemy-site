'use client'

import { Checkbox, Stack } from '@mantine/core'
import { Children, Dispatch, SetStateAction, useEffect, useState } from 'react'

interface IFormAgreements {
  allAgreementsAccepted: Dispatch<SetStateAction<boolean>>
  otherProps: any
  children?: React.ReactNode
}

const FormAgreements = ({
  allAgreementsAccepted,
  otherProps,
  children,
}: IFormAgreements) => {
  const [formAgreementsAccepted, setFormAgreementsAccepted] = useState<
    string[]
  >([])

  useEffect(() => {
    allAgreementsAccepted(
      // Need to filter out the null values if any children are being conditionally rendered
      Children.toArray(children).filter(Boolean).length !==
        formAgreementsAccepted.length,
    )
  }, [allAgreementsAccepted, formAgreementsAccepted, children])

  return (
    <Checkbox.Group
      {...otherProps}
      value={formAgreementsAccepted}
      onChange={setFormAgreementsAccepted}
    >
      <Stack my="xs">{children}</Stack>
    </Checkbox.Group>
  )
}

export default FormAgreements
