'use client'

import {
  Box,
  Button,
  CheckboxGroupProps,
  Container,
  LoadingOverlay,
  NativeSelectProps,
  NumberInput,
  NumberInputProps,
  RadioGroupProps,
  Select,
  SelectProps,
  Text,
  TextareaProps,
  TextInputProps,
} from '@mantine/core'
import { TextInput } from '@mantine/core'
import { Textarea } from '@mantine/core'
import { FileRejection, FileWithPath } from '@mantine/dropzone'
import { useForm } from '@mantine/form'
import { zodResolver } from 'mantine-form-zod-resolver'
import { SetStateAction, useState } from 'react'

import { useArtist } from '~/hooks/useArtist'
import { useFormSubmitStates } from '~/hooks/useFormSubmitStates'
import {
  BookingField,
  generateBookingFormSchema,
  getArtistAvailableDays,
  getBookingFormInitialValues,
  ImagesBookingField,
  MAX_FILES,
  preferredCommunicationMethodOptions,
  priorTattooOptions,
  sendArtistBookingEmail,
  styleOptions,
  TBookingSchema,
} from '~/utils/forms/bookingFormUtils'
import {
  handleImageDrop,
  handleImageReject,
  handleImageRemove,
} from '~/utils/forms/imageHandlingUtils'
import uploadImagesToSanity from '~/utils/images/uploadImagesToSanity'

import FormErrorAlert from '../../../../FormErrorAlert/FormErrorAlert'
import ImageDropzone from '../../../../ImageDropzone/ImageDropzone'
import ImageErrors from '../../../../ImageDropzone/ImageErrors'
import ImageThumbnails from '../../../../ImageDropzone/ImageThumbnails'
import CustomOverlayLoader from '../CustomOverlayLoader/CustomOverlayLoader'
import DisclaimerAgreement from '../FormAgreements/DisclaimerAgreement/DisclaimerAgreement'
import FormAgreements from '../FormAgreements/FormAgreements'
import PrivacyPolicyAgreement from '../FormAgreements/PrivacyPolicyAgreement/PrivacyPolicyAgreement'
import CheckboxGroup from '../FormComponents/CheckboxGroup'
import RadioGroup from '../FormComponents/RadioGroup'

const inputSharedProps = (
  id: string,
  label: string,
  placeholder: string,
  isDisabled: boolean,
): Partial<
  TextInputProps &
    NumberInputProps &
    NativeSelectProps &
    RadioGroupProps &
    CheckboxGroupProps &
    TextareaProps &
    SelectProps
> => ({
  className: 'w-full',
  withAsterisk: true,
  size: 'md',
  id: id,
  label: <Text span>{label}</Text>,
  placeholder: placeholder,
  disabled: isDisabled,
})

interface ITattooForm {
  onSuccess: () => void
  onFailure: (message?: string) => void
}

/*
Places to update for form changes:
  - TattooForm component (this file)
  - bookingFormUtil generateBookingFormSchema function
  - bookingFormUtil BookingField object
  - booking sanity model schema
  - booking sanity model interface
*/

const TattooForm = ({ onSuccess, onFailure }: ITattooForm) => {
  const { artist } = useArtist()
  const {
    setIsUploadingImages,
    setIsSubmittingForm,
    setIsSendingEmail,
    isSubmitting,
    customOverlayLoaderText,
  } = useFormSubmitStates()

  // Body placement images state
  const [
    isCompressingBodyPlacementImages,
    setIsCompressingBodyPlacementImages,
  ] = useState<boolean>(false)
  const [bodyPlacementImageFiles, setBodyPlacementImageFiles] = useState<
    FileWithPath[]
  >([])
  const [
    bodyPlacementImageUploadRejections,
    setBodyPlacementImageUploadRejections,
  ] = useState<FileRejection[]>([])

  // Reference images state
  const [isCompressingReferenceImages, setIsCompressingReferenceImages] =
    useState<boolean>(false)
  const [referenceImageFiles, setReferenceImageFiles] = useState<
    FileWithPath[]
  >([])
  const [referenceImageUploadRejections, setReferenceImageUploadRejections] =
    useState<FileRejection[]>([])

  // Form boolean states
  const [allFormAgreementsAccepted, setAllFormAgreementsAccepted] =
    useState(false)
  const isCompressingImages =
    isCompressingBodyPlacementImages || isCompressingReferenceImages

  const form = useForm<TBookingSchema>({
    initialValues: getBookingFormInitialValues(),
    validate: zodResolver(generateBookingFormSchema(artist)),
  })
  const formHasErrors = Object.keys(form.errors).length > 0

  const onSuccessfulBooking = () => {
    form.reset()
    setBodyPlacementImageFiles([])
    setReferenceImageFiles([])
    onSuccess()
  }

  const subscribeToMailingList = async (
    email: string,
    name: string,
    phoneNumber: string,
  ): Promise<Response> => {
    return fetch('/api/mailer-lite', {
      method: 'POST',
      body: JSON.stringify({
        email: email,
        name: name,
        phoneNumber,
      }),
    })
  }

  // Form methods
  const onFormSubmit = async (data: TBookingSchema) => {
    /* Upload images start */
    setIsUploadingImages(true)

    const images: File[] = [
      ...data.referenceImages,
      ...data.bodyPlacementImages,
    ]
    const imageReferences = await uploadImagesToSanity(images, {
      sizeLimit: () => {
        // If we get to this point and our request body hits the vercel limit of 4.5MB
        // then we should fail and let the user fix the images
        onFailure(
          'Total image size exceeds limit. Please decrease their size by either removing some or compressing.',
        )
        setIsUploadingImages(false)
      },
      error: () => {
        // Some other error happened
        // and we shouldn't stop the form submission
        onFailure('There was a problem uploading images.')
      },
    })

    if (imageReferences === 'SizeLimitError') {
      return
    }

    setIsUploadingImages(false)
    /* Upload images end */

    /* Submit booking start */
    setIsSubmittingForm(true)

    /* Create booking */
    const response = await fetch('/api/sanity/booking', {
      method: 'PUT',
      body: JSON.stringify({
        ...data,
        isGeneric: false,
        artist: { _ref: artist._id, _type: 'reference', _weak: true },
        [BookingField.ReferenceImages.id]:
          imageReferences === 'GeneralError' ? [] : imageReferences,
      }),
    })

    setIsSubmittingForm(false)
    /* Submit booking end */

    /* Send email start */
    if (artist.shouldEmailBookings) {
      setIsSendingEmail(true)
      const emailResponse = await sendArtistBookingEmail({
        images,
        emailTextData: data,
        artist,
        isGenericForm: false,
      })
      setIsSendingEmail(false)

      if (!emailResponse.ok) {
        onFailure()
        return
      }
    }
    /* Send email end */

    /* Subscribe user to mailing list start */
    await subscribeToMailingList(data.email, data.name, data.phoneNumber)
    /* Subscribe user to mailing list end */

    if (response.ok) {
      onSuccessfulBooking()
    } else {
      onFailure()
    }
  }

  const onImageReject = (
    rejections: FileRejection[],
    imageUploadSetter: (value: SetStateAction<FileRejection[]>) => void,
  ) => {
    handleImageReject(rejections, imageUploadSetter)
  }

  const onImageDrop = async (
    files: FileWithPath[],
    formId: string,
    setters: {
      compressSetter: (value: SetStateAction<boolean>) => void
      imageRejectionSetter: (value: SetStateAction<FileRejection[]>) => void
      imageFilesSetter: (value: SetStateAction<FileWithPath[]>) => void
    },
  ) => {
    await handleImageDrop(files, formId, setters, {
      onFailure,
      clearFieldError: form.clearFieldError,
      setFormValues: form.setValues,
    })
  }

  const onImageRemove = (
    nameToRemove: string,
    formId: string,
    images: FileWithPath[],
    imagesSetter: (value: SetStateAction<FileWithPath[]>) => void,
  ) => {
    handleImageRemove(
      nameToRemove,
      formId,
      images,
      imagesSetter,
      form.setValues,
    )
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
          onSubmit={form.onSubmit(onFormSubmit)}
          className="flex flex-col justify-center items-center gap-4"
        >
          {/* Name */}
          <TextInput
            {...inputSharedProps(
              BookingField.Name.id,
              BookingField.Name.label,
              BookingField.Name.placeholder,
              isSubmitting,
            )}
            {...form.getInputProps(BookingField.Name.id)}
          />

          {/* Phone Number */}
          <TextInput
            {...inputSharedProps(
              BookingField.PhoneNumber.id,
              BookingField.PhoneNumber.label,
              BookingField.PhoneNumber.placeholder,
              isSubmitting,
            )}
            {...form.getInputProps(BookingField.PhoneNumber.id)}
            type="tel"
          />

          {/* Email */}
          <TextInput
            {...inputSharedProps(
              BookingField.Email.id,
              BookingField.Email.label,
              BookingField.Email.placeholder,
              isSubmitting,
            )}
            {...form.getInputProps(BookingField.Email.id)}
            type="email"
          />

          {/* Preferred Communication Method */}
          <RadioGroup
            id={BookingField.PreferredCommunicationMethod.id}
            values={preferredCommunicationMethodOptions}
            form={form}
            additionalProps={inputSharedProps(
              BookingField.PreferredCommunicationMethod.id,
              BookingField.PreferredCommunicationMethod.label,
              '',
              isSubmitting,
            )}
          />

          {/* Instagram Name */}
          <TextInput
            {...inputSharedProps(
              BookingField.InstagramName.id,
              BookingField.InstagramName.label,
              BookingField.InstagramName.placeholder,
              isSubmitting,
            )}
            {...form.getInputProps(BookingField.InstagramName.id)}
            withAsterisk={false}
          />

          {/* Traveling From */}
          <TextInput
            {...inputSharedProps(
              BookingField.TravelingFrom.id,
              BookingField.TravelingFrom.label,
              BookingField.TravelingFrom.placeholder,
              isSubmitting,
            )}
            {...form.getInputProps(BookingField.TravelingFrom.id)}
          />

          {/* Age */}
          <NumberInput
            {...inputSharedProps(
              BookingField.Age.id,
              BookingField.Age.label,
              BookingField.Age.placeholder,
              isSubmitting,
            )}
            {...form.getInputProps(BookingField.Age.id)}
            hideControls
          />

          {/* Characters */}
          <TextInput
            {...inputSharedProps(
              BookingField.Characters.id,
              BookingField.Characters.label,
              BookingField.Characters.placeholder,
              isSubmitting,
            )}
            {...form.getInputProps(BookingField.Characters.id)}
          />

          {/* Location */}
          <TextInput
            {...inputSharedProps(
              BookingField.Location.id,
              BookingField.Location.label,
              BookingField.Location.placeholder,
              isSubmitting,
            )}
            {...form.getInputProps(BookingField.Location.id)}
          />

          {/* Style */}
          <RadioGroup
            id={BookingField.Style.id}
            values={styleOptions}
            form={form}
            additionalProps={inputSharedProps(
              BookingField.Style.id,
              BookingField.Style.label,
              '',
              isSubmitting,
            )}
          />

          {/* Prior Tattoo */}
          <RadioGroup
            id={BookingField.PriorTattoo.id}
            values={priorTattooOptions}
            form={form}
            additionalProps={inputSharedProps(
              BookingField.PriorTattoo.id,
              BookingField.PriorTattoo.label,
              '',
              isSubmitting,
            )}
            direction="vertical"
          />

          {/* Preferred Days */}
          <CheckboxGroup
            id={BookingField.PreferredDays.id}
            values={getArtistAvailableDays(artist.availableDays)}
            form={form}
            additionalGroupProps={inputSharedProps(
              BookingField.PreferredDays.id,
              BookingField.PreferredDays.label,
              '',
              isSubmitting,
            )}
            additionalCheckboxProps={{
              error: !!form.errors[BookingField.PreferredDays.id],
            }}
          />

          {/* Budget/Session length */}
          {artist.budgetOptions && artist.budgetOptions.length > 0 && (
            <Select
              {...inputSharedProps(
                BookingField.Budget.id,
                BookingField.Budget.label,
                '',
                isSubmitting,
              )}
              {...form.getInputProps(BookingField.Budget.id)}
              data={artist.budgetOptions}
              allowDeselect={false}
            />
          )}

          {/* Description */}
          <Textarea
            {...inputSharedProps(
              BookingField.Description.id,
              BookingField.Description.label,
              BookingField.Description.placeholder,
              isSubmitting,
            )}
            {...form.getInputProps(BookingField.Description.id)}
            autosize
            minRows={3}
            maxRows={8}
          />

          {/* Body Placement Images */}
          <Box className="w-full">
            <Text span>{ImagesBookingField.BodyPlacementImages.label}</Text>
            <Text span c="var(--mantine-color-error)">
              &nbsp;*
            </Text>
            <Text c="dimmed">
              {ImagesBookingField.BodyPlacementImages.description}
            </Text>
            <ImageDropzone
              onImageDrop={(files) =>
                onImageDrop(files, ImagesBookingField.BodyPlacementImages.id, {
                  compressSetter: setIsCompressingBodyPlacementImages,
                  imageFilesSetter: setBodyPlacementImageFiles,
                  imageRejectionSetter: setBodyPlacementImageUploadRejections,
                })
              }
              onImageReject={(rejections) =>
                onImageReject(rejections, setBodyPlacementImageUploadRejections)
              }
              disabled={isSubmitting}
              dropzoneProps={{
                loading: isCompressingBodyPlacementImages,
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
              imageFiles={bodyPlacementImageFiles}
              onImageRemove={(name) =>
                onImageRemove(
                  name,
                  ImagesBookingField.BodyPlacementImages.id,
                  bodyPlacementImageFiles,
                  setBodyPlacementImageFiles,
                )
              }
            />
            <ImageErrors
              imageUploadRejections={bodyPlacementImageUploadRejections}
              formError={form.errors[
                ImagesBookingField.BodyPlacementImages.id
              ]?.toString()}
            />
          </Box>

          {/* Reference Images */}
          <Box className="w-full">
            <Text span>{ImagesBookingField.ReferenceImages.label}</Text>
            <Text span c="var(--mantine-color-error)">
              &nbsp;*
            </Text>
            <Text c="dimmed">
              {ImagesBookingField.ReferenceImages.description}
            </Text>
            <ImageDropzone
              onImageDrop={(files) =>
                onImageDrop(files, ImagesBookingField.ReferenceImages.id, {
                  compressSetter: setIsCompressingReferenceImages,
                  imageFilesSetter: setReferenceImageFiles,
                  imageRejectionSetter: setReferenceImageUploadRejections,
                })
              }
              onImageReject={(rejections) =>
                onImageReject(rejections, setReferenceImageUploadRejections)
              }
              disabled={isSubmitting}
              dropzoneProps={{
                loading: isCompressingReferenceImages,
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
              imageFiles={referenceImageFiles}
              onImageRemove={(name) =>
                onImageRemove(
                  name,
                  ImagesBookingField.ReferenceImages.id,
                  referenceImageFiles,
                  setReferenceImageFiles,
                )
              }
            />
            <ImageErrors
              imageUploadRejections={referenceImageUploadRejections}
              formError={form.errors[
                ImagesBookingField.ReferenceImages.id
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

          {formHasErrors ? <FormErrorAlert title="Oops!" /> : undefined}

          {/* Submit button */}
          <Button
            size="lg"
            variant="filled"
            type="submit"
            disabled={isCompressingImages || !allFormAgreementsAccepted}
            loading={isSubmitting}
          >
            Send Request
          </Button>
        </form>
      </Box>
    </Container>
  )
}

export default TattooForm
