'use client'

import {
  Box,
  Button,
  Container,
  Group,
  LoadingOverlay,
  Text,
  Textarea,
  TextareaProps,
  TextInput,
  TextInputProps,
} from '@mantine/core'
import { FileRejection, FileWithPath } from '@mantine/dropzone'
import { useForm } from '@mantine/form'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useState } from 'react'

import ImageDropzone from '~/components/ImageDropzone/ImageDropzone'
import ImageErrors from '~/components/ImageDropzone/ImageErrors'
import ImageThumbnails from '~/components/ImageDropzone/ImageThumbnails'
import { useArtist } from '~/hooks/useArtist'
import { useFormSubmitStates } from '~/hooks/useFormSubmitStates'
import {
  generateGenericBookingFormSchema,
  GenericBookingField,
  getGenericBookingFormInitialValues,
  MAX_FILES,
  sendArtistBookingEmail,
  TGenericBookingSchema,
} from '~/utils/forms/bookingFormUtils'
import {
  handleImageDrop,
  handleImageReject,
  handleImageRemove,
} from '~/utils/forms/imageHandlingUtils'
import uploadImagesToSanity from '~/utils/images/uploadImagesToSanity'
import { ImageReference } from '~/utils/images/uploadImagesToSanity'

import CustomOverlayLoader from '../CustomOverlayLoader/CustomOverlayLoader'
import DisclaimerAgreement from '../FormAgreements/DisclaimerAgreement/DisclaimerAgreement'
import FormAgreements from '../FormAgreements/FormAgreements'
import PrivacyPolicyAgreement from '../FormAgreements/PrivacyPolicyAgreement/PrivacyPolicyAgreement'
import FormErrorAlert from '../TattooForm/FormErrorAlert/FormErrorAlert'

const inputSharedProps = (
  id: keyof TGenericBookingSchema | string,
  label: string,
  placeholder: string,
  isSubmitting: boolean,
): Partial<TextInputProps & TextareaProps> => ({
  className: 'w-full',
  withAsterisk: true,
  size: 'md' as const,
  id: id as string,
  label: <Text span>{label}</Text>,
  placeholder,
  disabled: isSubmitting,
})

interface IGenericBookingForm {
  onSuccess: () => void
  onFailure: (message?: string) => void
}

const GenericBookingForm = ({ onSuccess, onFailure }: IGenericBookingForm) => {
  const { artist } = useArtist()
  const {
    setIsUploadingImages,
    setIsSubmittingForm,
    setIsSendingEmail,
    isSubmitting,
    customOverlayLoaderText,
  } = useFormSubmitStates()

  // images state
  const [isCompressingImages, setIsCompressingImages] = useState(false)
  const [imageFiles, setImageFiles] = useState<FileWithPath[]>([])
  const [imageUploadRejections, setImageUploadRejections] = useState<
    FileRejection[]
  >([])

  const [allFormAgreementsAccepted, setAllFormAgreementsAccepted] =
    useState(false)

  const form = useForm<TGenericBookingSchema>({
    initialValues: getGenericBookingFormInitialValues(),
    validate: zodResolver(generateGenericBookingFormSchema()),
  })
  const formHasErrors = Object.keys(form.errors).length > 0

  const onImageReject = (rejections: FileRejection[]) => {
    handleImageReject(rejections, setImageUploadRejections)
  }

  const onImageDrop = async (files: FileWithPath[]) => {
    await handleImageDrop(
      files,
      GenericBookingField.ReferenceImages.id,
      {
        compressSetter: setIsCompressingImages,
        imageRejectionSetter: setImageUploadRejections,
        imageFilesSetter: setImageFiles,
      },
      {
        onFailure,
        clearFieldError: form.clearFieldError,
        setFormValues: form.setValues,
      },
    )
  }

  const onImageRemove = (nameToRemove: string) => {
    handleImageRemove(
      nameToRemove,
      GenericBookingField.ReferenceImages.id,
      imageFiles,
      setImageFiles,
      form.setValues,
    )
  }

  const createGenericBooking = async (
    imageReferences: ImageReference[] | 'GeneralError',
    data: TGenericBookingSchema,
  ) => {
    setIsSubmittingForm(true)
    try {
      const response = await fetch('/api/sanity/booking', {
        method: 'PUT',
        body: JSON.stringify({
          ...data,
          isGeneric: true,
          artist: { _ref: artist._id, _type: 'reference', _weak: true },
          [GenericBookingField.ReferenceImages.id]:
            imageReferences === 'GeneralError' ? [] : imageReferences,
        }),
      })
      return response
    } finally {
      setIsSubmittingForm(false)
    }
  }

  const onSubmit = async (data: TGenericBookingSchema) => {
    /* Upload images start */
    setIsUploadingImages(true)

    const imageReferences = await uploadImagesToSanity(imageFiles, {
      sizeLimit: () => {
        onFailure(
          'Total image size exceeds limit. Please remove some or compress them.',
        )
        setIsUploadingImages(false)
      },
      error: () => {
        onFailure('There was a problem uploading images.')
      },
    })

    if (imageReferences === 'SizeLimitError') {
      return
    }

    setIsUploadingImages(false)
    /* Upload images end */

    /* Submit booking start */
    const response = await createGenericBooking(imageReferences, data)
    /* Submit booking end */

    /* Send email start */
    if (artist.shouldEmailBookings) {
      setIsSendingEmail(true)
      const emailResponse = await sendArtistBookingEmail({
        images: imageFiles,
        emailTextData: data,
        artist,
        isGenericForm: true,
      })
      setIsSendingEmail(false)

      if (!emailResponse.ok) {
        onFailure('Your request was saved, but emailing the artist failed.')
        return
      }
    }
    /* Send email end */

    if (response.ok) {
      form.reset()
      setImageFiles([])
      onSuccess()
    } else {
      onFailure('There was an issue creating your booking. Please try again.')
    }
  }

  return (
    <Container size="sm" py="lg" px={0}>
      <Box pos="relative">
        <LoadingOverlay
          visible={isSubmitting}
          zIndex={150}
          loaderProps={{
            children: <CustomOverlayLoader label={customOverlayLoaderText} />,
          }}
        />
        <form
          onSubmit={form.onSubmit(onSubmit)}
          className="flex flex-col justify-center items-center gap-4"
        >
          <TextInput
            {...inputSharedProps(
              GenericBookingField.Name.id,
              GenericBookingField.Name.label,
              GenericBookingField.Name.placeholder,
              isSubmitting,
            )}
            {...form.getInputProps(GenericBookingField.Name.id)}
          />

          <TextInput
            {...inputSharedProps(
              GenericBookingField.PhoneNumber.id,
              GenericBookingField.PhoneNumber.label,
              GenericBookingField.PhoneNumber.placeholder,
              isSubmitting,
            )}
            {...form.getInputProps(GenericBookingField.PhoneNumber.id)}
            type="tel"
          />

          <TextInput
            {...inputSharedProps(
              GenericBookingField.Email.id,
              GenericBookingField.Email.label,
              GenericBookingField.Email.placeholder,
              isSubmitting,
            )}
            {...form.getInputProps(GenericBookingField.Email.id)}
            type="email"
          />

          <Textarea
            {...inputSharedProps(
              GenericBookingField.Description.id,
              GenericBookingField.Description.label,
              GenericBookingField.Description.placeholder,
              isSubmitting,
            )}
            {...form.getInputProps(GenericBookingField.Description.id)}
            autosize
            minRows={3}
            maxRows={8}
          />

          <Box className="w-full">
            <Text span>{GenericBookingField.ReferenceImages.label}</Text>
            <Text span c="var(--mantine-color-error)">
              &nbsp;*
            </Text>
            <ImageDropzone
              onImageDrop={onImageDrop}
              onImageReject={onImageReject}
              disabled={isSubmitting}
              dropzoneProps={{
                loading: isCompressingImages,
                loaderProps: {
                  children: (
                    <CustomOverlayLoader label={'Compressing images'} />
                  ),
                },
                maxFiles: MAX_FILES,
              }}
              rejectionMessage={`There is a max of ${MAX_FILES} image files allowed.`}
            />
            <ImageThumbnails
              imageFiles={imageFiles}
              onImageRemove={(name) => onImageRemove(name)}
            />
            <ImageErrors
              imageUploadRejections={imageUploadRejections}
              formError={form.errors[
                GenericBookingField.ReferenceImages.id
              ]?.toString()}
            />
          </Box>

          {/* Form Agreements */}
          <FormAgreements
            allAgreementsAccepted={setAllFormAgreementsAccepted}
            otherProps={inputSharedProps(
              'agreementsGroup',
              'Terms and Conditions',
              '',
              isSubmitting,
            )}
          >
            {artist.bookingInstructions && <DisclaimerAgreement />}
            <PrivacyPolicyAgreement />
          </FormAgreements>

          {formHasErrors ? <FormErrorAlert /> : undefined}

          <Group justify="center" mt="xs">
            <Button
              size="lg"
              variant="filled"
              type="submit"
              disabled={isCompressingImages || !allFormAgreementsAccepted}
              loading={isSubmitting}
            >
              Send Request
            </Button>
          </Group>
        </form>
      </Box>
    </Container>
  )
}

export default GenericBookingForm
