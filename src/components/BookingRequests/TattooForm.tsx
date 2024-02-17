'use client'

import {
  Box,
  Button,
  Checkbox,
  CheckboxGroupProps,
  Container,
  Group,
  Loader,
  LoadingOverlay,
  NativeSelectProps,
  NumberInput,
  NumberInputProps,
  Radio,
  RadioGroupProps,
  Stack,
  Text,
  TextareaProps,
  TextInputProps,
} from '@mantine/core'
import { TextInput } from '@mantine/core'
import { Textarea } from '@mantine/core'
import { FileRejection, FileWithPath } from '@mantine/dropzone'
import { useForm } from '@mantine/form'
import imageCompression from 'browser-image-compression'
import { zodResolver } from 'mantine-form-zod-resolver'
import { SetStateAction, useState } from 'react'

import { useArtist } from '~/hooks/useArtist'
import { convertBlobToBase64 } from '~/utils'
import {
  BookingField,
  bookingSchema,
  getBookingFormInitialValues,
  ImagesBookingField,
  preferredDayOptions,
  priorTattooOptions,
  styleOptions,
  TBookingSchema,
} from '~/utils/bookingFormUtils'

import ImageDropzone from '../ImageDropzone/ImageDropzone'
import ImageErrors from '../ImageDropzone/ImageErrors'
import ImageThumbnails from '../ImageDropzone/ImageThumbnails'
import FormErrorAlert from './FormErrorAlert'

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
    TextareaProps
> => ({
  className: 'w-full',
  withAsterisk: true,
  size: 'md',
  id: id,
  label: <Text span>{label}</Text>,
  placeholder: placeholder,
  disabled: isDisabled,
})

const CustomLoader = ({ label }: { label: string }) => {
  return (
    <div className="flex flex-col justify-center items-center	gap-4">
      <Loader />
      <Text>{label}</Text>
    </div>
  )
}

interface ITattooForm {
  onSuccess: () => void
  onFailure: (message?: string) => void
}

/*
Places to update for form changes:
  - TattooForm component (this file)
  - bookingFormUtils schema
  - bookingFormUtil BookingField object
  - booking sanity model schema
  - booking sanity model interface
*/

const TattooForm = ({ onSuccess, onFailure }: ITattooForm) => {
  const { artist } = useArtist()

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
  const [isUploadingImages, setIsUploadingImages] = useState<boolean>(false)
  const [isSubmittingForm, setIsSubmittingForm] = useState<boolean>(false)
  const isSubmitting = isUploadingImages || isSubmittingForm
  const isCompressingImages =
    isCompressingBodyPlacementImages || isCompressingReferenceImages

  // Form variables
  const form = useForm<TBookingSchema>({
    initialValues: getBookingFormInitialValues(),
    validate: zodResolver(bookingSchema),
  })
  const formHasErrors = Object.keys(form.errors).length > 0

  const onSuccessfullBooking = () => {
    form.reset()
    setBodyPlacementImageFiles([])
    setReferenceImageFiles([])
    onSuccess()
  }

  const sendArtistBookingEmail = async (
    images: File[],
    emailTextData: TBookingSchema,
  ) => {
    const base64Images = await Promise.all(
      images.map(async (image) => {
        const base64 = await convertBlobToBase64(image as File)
        console.log(base64)
        return base64
      }),
    )
    fetch('/api/mail', {
      method: 'PUT',
      body: JSON.stringify({
        ...emailTextData,
        artistEmail: artist.email,
        base64Images: base64Images,
      }),
    })
  }

  // Form methods
  const onFormSubmit = async (data: TBookingSchema) => {
    setIsUploadingImages(true)

    const formData = new FormData()
    const images: File[] = [
      ...data.referenceImages,
      ...data.bodyPlacementImages,
    ]
    Array.from(images).forEach((file, i) => {
      formData.append(`image-${i}`, file)
    })

    /* Upload images */
    const imageUploadResponse = await fetch('/api/sanity/images', {
      method: 'PUT',
      body: formData,
    })

    let imageReferences: any = []
    if (imageUploadResponse.ok) {
      const imageJson = await imageUploadResponse.json()
      imageReferences = imageJson.imageReferences
    } else if (imageUploadResponse.status === 413) {
      // If we get to this point and our request body hits the vercel limit of 4.5MB
      // then we should fail and let the user fix the images
      onFailure(
        'Total image size exceeds limit. Please decrease their size by either removing some or compressing.',
      )
      setIsUploadingImages(false)
      return
    } else {
      // Some other error happened
      // and we shouldn't stop the form submission
      onFailure('There was a problem uploading images.')
    }

    setIsUploadingImages(false)
    setIsSubmittingForm(true)

    /* Create booking */
    const response = await fetch('/api/sanity/booking', {
      method: 'PUT',
      body: JSON.stringify({
        ...data,
        artist: { _ref: artist._id, _type: 'reference', _weak: true },
        [BookingField.ReferenceImages.id]: imageReferences,
      }),
    })

    // send booking request email
    // don't hold up the UI for this
    if (artist.shouldEmailBookings) sendArtistBookingEmail(images, data)

    setIsSubmittingForm(false)

    if (response.ok) {
      onSuccessfullBooking()
    } else {
      onFailure()
    }
  }

  const onImageReject = (
    rejections: FileRejection[],
    imageUploadSetter: (value: SetStateAction<FileRejection[]>) => void,
  ) => {
    imageUploadSetter(rejections)
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
    setters.compressSetter(true)
    form.clearFieldError(formId)
    setters.imageRejectionSetter([])
    setters.imageFilesSetter([])

    try {
      const filesPromises = files.map((file) =>
        imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        }),
      )
      const compressedImages = await Promise.all(filesPromises)

      setters.imageFilesSetter(compressedImages)
      form.setValues({ [formId]: compressedImages })
    } catch (error) {
      onFailure(
        'There was a problem compressing the images. Please try again. If the issue persists, please try different images.',
      )
    }

    setters.compressSetter(false)
  }

  const onImageRemove = (
    nameToRemove: string,
    formId: string,
    images: FileWithPath[],
    imagesSetter: (value: SetStateAction<FileWithPath[]>) => void,
  ) => {
    const filteredFiles = images.filter((image) => image.name !== nameToRemove)
    imagesSetter(filteredFiles)
    form.setValues({ [formId]: filteredFiles })
  }

  return (
    <Container size="sm" py="lg" px={0}>
      <Box pos="relative">
        <LoadingOverlay
          visible={isSubmitting}
          zIndex={150}
          loaderProps={{
            children: isUploadingImages ? (
              <CustomLoader label={'Uploading images'} />
            ) : (
              <CustomLoader label={'Submitting booking'} />
            ),
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
          <Radio.Group
            {...inputSharedProps(
              BookingField.Style.id,
              BookingField.Style.label,
              '',
              isSubmitting,
            )}
            {...form.getInputProps(BookingField.Style.id)}
          >
            <Group mt="xs">
              {styleOptions.map(({ value, label }) => (
                <Radio
                  key={value}
                  value={value}
                  label={label}
                  disabled={isSubmitting}
                />
              ))}
            </Group>
          </Radio.Group>

          {/* Prior Tattoo */}
          <Radio.Group
            {...inputSharedProps(
              BookingField.PriorTattoo.id,
              BookingField.PriorTattoo.label,
              '',
              isSubmitting,
            )}
            {...form.getInputProps(BookingField.PriorTattoo.id)}
          >
            <Stack mt="xs" gap="xs">
              {priorTattooOptions.map(({ value, label }) => (
                <Radio
                  key={value}
                  value={value}
                  label={label}
                  disabled={isSubmitting}
                />
              ))}
            </Stack>
          </Radio.Group>

          {/* Preferred Days */}
          <Checkbox.Group
            {...inputSharedProps(
              BookingField.PreferredDays.id,
              BookingField.PreferredDays.label,
              '',
              isSubmitting,
            )}
            {...form.getInputProps(BookingField.PreferredDays.id)}
          >
            <Group my="xs">
              {preferredDayOptions.map((option) => (
                <Checkbox
                  key={option.value}
                  value={option.value}
                  label={option.label}
                  error={!!form.errors[BookingField.PreferredDays.id]}
                />
              ))}
            </Group>
          </Checkbox.Group>

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
                className: 'w-full',
                loading: isCompressingBodyPlacementImages,
                loaderProps: {
                  children: <CustomLoader label={'Compressing images'} />,
                },
              }}
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
                className: 'w-full',
                loading: isCompressingReferenceImages,
                loaderProps: {
                  children: <CustomLoader label={'Compressing images'} />,
                },
              }}
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

          {formHasErrors ? <FormErrorAlert /> : undefined}

          {/* Submit button */}
          <Button
            size="lg"
            variant="filled"
            type="submit"
            disabled={isCompressingImages}
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
