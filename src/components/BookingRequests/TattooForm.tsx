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
  NativeSelect,
  NativeSelectProps,
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
import { useState } from 'react'

import {
  BookingField,
  bookingSchema,
  getBookingFormInitialValues,
  preferredDayOptions,
  priorTattooOptions,
  styleOptions,
  TBookingSchema,
} from '~/utils/bookingFormUtils'

import ImageDropzone from '../ImageDropzone/ImageDropzone'
import ImageErrors from '../ImageDropzone/ImageErrors'
import ImageThumbnails from '../ImageDropzone/ImageThumbnails'
import FormErrorAlert from './FormErrorAlert'

const inputSharedProps: Partial<
  TextInputProps & NativeSelectProps & CheckboxGroupProps & TextareaProps
> = {
  className: 'w-full',
  withAsterisk: true,
  size: 'md',
}

const CustomLoader = ({ label }: { label: string }) => {
  return (
    <div className="flex flex-col justify-center items-center	gap-4">
      <Loader />
      <Text>{label}</Text>
    </div>
  )
}

interface ITattooForm {
  artistId: string
  onSuccess: () => void
  onFailure: (message?: string) => void
}

/*
Places to update for form changes:
  - TattooForm component (this file)
  - bookingFormUtils schema
  - bookingFormUtil BookingField enum
  - booking sanity model schema
  - booking sanity model interface
*/

// TODO: split into components
// TODO: implement reCAPTCHA for form submission
// TODO: implement Nodemailer to send email confirming form submission
const TattooForm = ({ artistId, onSuccess, onFailure }: ITattooForm) => {
  const [isCompressingImages, setIsCompressingImages] = useState<boolean>(false)
  const [isUploadingImages, setIsUploadingImages] = useState<boolean>(false)
  const [isSubmittingForm, setIsSubmittingForm] = useState<boolean>(false)

  const [preferredDays, setPreferredDays] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<FileWithPath[]>([])
  const [imageUploadRejections, setImageUploadRejections] = useState<
    FileRejection[]
  >([])

  const form = useForm<TBookingSchema>({
    initialValues: getBookingFormInitialValues(),
    validate: zodResolver(bookingSchema),
  })

  const formHasErrors = Object.keys(form.errors).length > 0
  const isSubmitting = isUploadingImages || isSubmittingForm

  const onFormSubmit = async (data: TBookingSchema) => {
    setIsUploadingImages(true)
    const formData = new FormData()
    const images: File[] = data.referenceImages
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
      onFailure('There was a problem uploading images.')
    }

    setIsUploadingImages(false)
    setIsSubmittingForm(true)

    /* Create booking */
    const response = await fetch('/api/sanity/booking', {
      method: 'PUT',
      body: JSON.stringify({
        ...data,
        artist: { _ref: artistId, _type: 'reference', _weak: true },
        [BookingField.ReferenceImages.id]: imageReferences,
      }),
    })

    setIsSubmittingForm(false)

    if (response.ok) {
      form.reset()
      setImageFiles([])
      setPreferredDays([])
      onSuccess()
    } else {
      onFailure()
    }
  }

  const onPreferredDaysChange = (days: string[]) => {
    form.clearFieldError(BookingField.PreferredDays.id)
    setPreferredDays(days)
    form.setValues({ [BookingField.PreferredDays.id]: days })
  }

  const onImageReject = (rejections: FileRejection[]) => {
    setImageUploadRejections(rejections)
  }

  const onImageDrop = async (files: FileWithPath[]) => {
    setIsCompressingImages(true)
    form.clearFieldError(BookingField.ReferenceImages.id)
    setImageUploadRejections([])
    setImageFiles([])

    try {
      const filesPromises = files.map((file) =>
        imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        }),
      )
      const compressedImages = await Promise.all(filesPromises)

      setImageFiles(compressedImages)
      form.setValues({ [BookingField.ReferenceImages.id]: compressedImages })
    } catch (error) {
      onFailure(
        'There was a problem compressing the images. Please try again. If the issue persists, please try different images.',
      )
    }

    setIsCompressingImages(false)
  }

  const onImageRemove = (name: string) => {
    const filteredFiles = imageFiles.filter((image) => image.name !== name)
    setImageFiles(filteredFiles)
    form.setValues({ [BookingField.ReferenceImages.id]: filteredFiles })
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
            {...inputSharedProps}
            {...form.getInputProps(BookingField.Name.id)}
            id={BookingField.Name.id}
            label={<Text span>{BookingField.Name.label}</Text>}
            placeholder={BookingField.Name.placeholder}
            error={form.errors[BookingField.Name.id]}
            disabled={isSubmitting}
          />

          {/* Phone Number */}
          <TextInput
            {...inputSharedProps}
            {...form.getInputProps(BookingField.PhoneNumber.id)}
            id={BookingField.PhoneNumber.id}
            label={<Text span>{BookingField.PhoneNumber.label}</Text>}
            placeholder={BookingField.Name.placeholder}
            error={form.errors[BookingField.PhoneNumber.id]}
            disabled={isSubmitting}
            type="tel"
          />

          {/* Email */}
          <TextInput
            {...inputSharedProps}
            {...form.getInputProps(BookingField.Email.id)}
            id={BookingField.Email.id}
            label={<Text span>{BookingField.Email.label}</Text>}
            placeholder={BookingField.Email.placeholder}
            error={form.errors[BookingField.Email.id]}
            disabled={isSubmitting}
            type="email"
          />

          {/* Instagram Name */}
          <TextInput
            {...inputSharedProps}
            {...form.getInputProps(BookingField.InstagramName.id)}
            id={BookingField.InstagramName.id}
            label={<Text span>{BookingField.InstagramName.label}</Text>}
            placeholder={BookingField.InstagramName.placeholder}
            error={form.errors[BookingField.InstagramName.id]}
            disabled={isSubmitting}
            withAsterisk={false}
          />

          {/* Traveling From */}
          <TextInput
            {...inputSharedProps}
            {...form.getInputProps(BookingField.TravelingFrom.id)}
            id={BookingField.TravelingFrom.id}
            label={<Text span>{BookingField.TravelingFrom.label}</Text>}
            placeholder={BookingField.TravelingFrom.placeholder}
            error={form.errors[BookingField.TravelingFrom.id]}
            disabled={isSubmitting}
          />

          {/* Age */}
          <TextInput
            {...inputSharedProps}
            {...form.getInputProps(BookingField.Age.id)}
            id={BookingField.Age.id}
            label={<Text span>{BookingField.Age.label}</Text>}
            placeholder={BookingField.Age.placeholder}
            error={form.errors[BookingField.Age.id]}
            disabled={isSubmitting}
            type="number"
          />

          {/* Characters */}
          <TextInput
            {...inputSharedProps}
            {...form.getInputProps(BookingField.Characters.id)}
            id={BookingField.Characters.id}
            label={<Text span>{BookingField.Characters.label}</Text>}
            placeholder={BookingField.Characters.placeholder}
            error={form.errors[BookingField.Characters.id]}
            disabled={isSubmitting}
          />

          {/* Location */}
          <TextInput
            {...inputSharedProps}
            {...form.getInputProps(BookingField.Location.id)}
            id={BookingField.Location.id}
            label={<Text span>{BookingField.Location.label}</Text>}
            placeholder={BookingField.Location.placeholder}
            error={form.errors[BookingField.Location.id]}
            disabled={isSubmitting}
          />

          {/* Style */}
          <NativeSelect
            {...inputSharedProps}
            {...form.getInputProps(BookingField.Style.id)}
            id={BookingField.Style.id}
            label={<Text span>{BookingField.Style.label}</Text>}
            error={form.errors[BookingField.Style.id]}
            disabled={isSubmitting}
            data={styleOptions}
          />

          {/* Prior Tattoo */}
          <NativeSelect
            {...inputSharedProps}
            {...form.getInputProps(BookingField.PriorTattoo.id)}
            id={BookingField.PriorTattoo.id}
            label={<Text span>{BookingField.PriorTattoo.label}</Text>}
            error={form.errors[BookingField.PriorTattoo.id]}
            disabled={isSubmitting}
            data={priorTattooOptions}
          />

          {/* Preferred Days */}
          <Checkbox.Group
            {...inputSharedProps}
            value={preferredDays}
            onChange={onPreferredDaysChange}
            label={<Text span>{BookingField.PreferredDays.label}</Text>}
            error={form.errors[BookingField.PreferredDays.id]}
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
            {...inputSharedProps}
            {...form.getInputProps(BookingField.Description.id)}
            id={BookingField.Description.id}
            label={<Text span>{BookingField.Description.label}</Text>}
            placeholder={BookingField.Description.placeholder}
            error={form.errors[BookingField.Description.id]}
            disabled={isSubmitting}
            autosize
            minRows={3}
            maxRows={8}
          />

          {/* Images */}
          <Box className="w-full">
            <Text span>{BookingField.ReferenceImages.label}</Text>
            <Text span c="var(--mantine-color-error)">
              &nbsp;*
            </Text>
            <ImageDropzone
              onImageDrop={(files) => onImageDrop(files)}
              onImageReject={(rejections) => onImageReject(rejections)}
              disabled={isSubmitting}
              dropzoneProps={{
                className: 'w-full',
                loading: isCompressingImages,
                loaderProps: {
                  children: <CustomLoader label={'Compressing images'} />,
                },
              }}
            />
            <ImageThumbnails
              imageFiles={imageFiles}
              onImageRemove={(name) => onImageRemove(name)}
            />
            <ImageErrors
              imageUploadRejections={imageUploadRejections}
              formError={form.errors[
                BookingField.ReferenceImages.id
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
