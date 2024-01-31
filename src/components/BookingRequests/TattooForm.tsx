'use client'

import { zodResolver } from '@hookform/resolvers/zod'
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
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import {
  BookingField,
  bookingSchema,
  preferredDayOptions,
  priorTattooOptions,
  styleOptions,
  TBookingSchema,
} from '~/utils/bookingFormUtils'

import ImageDropzone from '../ImageDropzone/ImageDropzone'
import ImageErrors from '../ImageDropzone/ImageErrors'
import ImageThumbnails from '../ImageDropzone/ImageThumbnails'

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
  const [isUploadingImages, setIsUploadingImages] = useState<boolean>(false)
  const [isSubmittingForm, setIsSubmittingForm] = useState<boolean>(false)

  const [preferredDays, setPreferredDays] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<FileWithPath[]>([])
  const [imageUploadRejections, setImageUploadRejections] = useState<
    FileRejection[]
  >([])
  const { register, handleSubmit, formState, setValue, reset, clearErrors } =
    useForm<TBookingSchema>({ resolver: zodResolver(bookingSchema) })

  const isSubmitting = isUploadingImages || isSubmittingForm

  useEffect(() => {
    register(BookingField.ReferenceImages.id)
    register(BookingField.PreferredDays.id)
  }, [register])

  const onSubmit: SubmitHandler<TBookingSchema> = async (data) => {
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
      reset()
      setImageFiles([])
      setPreferredDays([])
      onSuccess()
    } else {
      onFailure()
    }
  }

  const onPreferredDaysChange = (days: string[]) => {
    clearErrors(BookingField.PreferredDays.id)
    setPreferredDays(days)
    setValue(BookingField.PreferredDays.id, days)
  }

  const onImageReject = (rejections: FileRejection[]) => {
    setImageUploadRejections(rejections)
  }

  const onImageDrop = (files: FileWithPath[]) => {
    clearErrors(BookingField.ReferenceImages.id)
    setImageUploadRejections([])

    setImageFiles(files)
    setValue(BookingField.ReferenceImages.id, files)
  }

  const onImageRemove = (name: string) => {
    const filteredFiles = imageFiles.filter((image) => image.name !== name)
    setImageFiles(filteredFiles)
    setValue(BookingField.ReferenceImages.id, filteredFiles)
  }

  return (
    <Container size="sm" py="lg" px={0}>
      <Box pos="relative">
        <LoadingOverlay
          visible={isSubmitting}
          zIndex={150}
          overlayProps={{ radius: 'sm', blur: 3, color: '#1F1F1F' }}
          loaderProps={{
            children: isUploadingImages ? (
              <CustomLoader label={'Uploading images'} />
            ) : (
              <CustomLoader label={'Submitting booking'} />
            ),
          }}
        />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-center items-center gap-4"
        >
          {/* Name */}
          <TextInput
            {...inputSharedProps}
            {...register(BookingField.Name.id)}
            id={BookingField.Name.id}
            label={<Text span>{BookingField.Name.label}</Text>}
            placeholder={BookingField.Name.placeholder}
            error={formState.errors.name?.message}
            disabled={isSubmitting}
          />

          {/* Phone Number */}
          <TextInput
            {...inputSharedProps}
            {...register(BookingField.PhoneNumber.id)}
            id={BookingField.PhoneNumber.id}
            label={<Text span>{BookingField.PhoneNumber.label}</Text>}
            placeholder={BookingField.Name.placeholder}
            error={formState.errors.phoneNumber?.message}
            disabled={isSubmitting}
            type="tel"
          />

          {/* Email */}
          <TextInput
            {...inputSharedProps}
            {...register(BookingField.Email.id)}
            id={BookingField.Email.id}
            label={<Text span>{BookingField.Email.label}</Text>}
            placeholder={BookingField.Email.placeholder}
            error={formState.errors.email?.message}
            disabled={isSubmitting}
            type="email"
          />

          {/* Instagram Name */}
          <TextInput
            {...inputSharedProps}
            {...register(BookingField.InstagramName.id)}
            id={BookingField.InstagramName.id}
            label={<Text span>{BookingField.InstagramName.label}</Text>}
            placeholder={BookingField.InstagramName.placeholder}
            error={formState.errors.instagramName?.message}
            disabled={isSubmitting}
            withAsterisk={false}
          />

          {/* Traveling From */}
          <TextInput
            {...inputSharedProps}
            {...register(BookingField.TravelingFrom.id)}
            id={BookingField.TravelingFrom.id}
            label={<Text span>{BookingField.TravelingFrom.label}</Text>}
            placeholder={BookingField.TravelingFrom.placeholder}
            error={formState.errors.travelingFrom?.message}
            disabled={isSubmitting}
          />

          {/* Age */}
          <TextInput
            {...inputSharedProps}
            {...register(BookingField.Age.id)}
            id={BookingField.Age.id}
            label={<Text span>{BookingField.Age.label}</Text>}
            placeholder={BookingField.Age.placeholder}
            error={formState.errors.age?.message}
            disabled={isSubmitting}
            type="number"
          />

          {/* Characters */}
          <TextInput
            {...inputSharedProps}
            {...register(BookingField.Characters.id)}
            id={BookingField.Characters.id}
            label={<Text span>{BookingField.Characters.label}</Text>}
            placeholder={BookingField.Characters.placeholder}
            error={formState.errors.characters?.message}
            disabled={isSubmitting}
          />

          {/* Location */}
          <TextInput
            {...inputSharedProps}
            {...register(BookingField.Location.id)}
            id={BookingField.Location.id}
            label={<Text span>{BookingField.Location.label}</Text>}
            placeholder={BookingField.Location.placeholder}
            error={formState.errors.location?.message}
            disabled={isSubmitting}
          />

          {/* Style */}
          <NativeSelect
            {...inputSharedProps}
            {...register(BookingField.Style.id)}
            id={BookingField.Style.id}
            label={<Text span>{BookingField.Style.label}</Text>}
            error={formState.errors.style?.message}
            disabled={isSubmitting}
            data={styleOptions}
            defaultValue={styleOptions[0].value}
          />

          {/* Prior Tattoo */}
          <NativeSelect
            {...inputSharedProps}
            {...register(BookingField.PriorTattoo.id)}
            id={BookingField.PriorTattoo.id}
            label={<Text span>{BookingField.PriorTattoo.label}</Text>}
            error={formState.errors.priorTattoo?.message}
            disabled={isSubmitting}
            data={priorTattooOptions}
            defaultValue={priorTattooOptions[0].value}
          />

          {/* Preferred Days */}
          <Checkbox.Group
            {...inputSharedProps}
            value={preferredDays}
            onChange={onPreferredDaysChange}
            label={<Text span>{BookingField.PreferredDays.label}</Text>}
            error={formState.errors.preferredDays?.message}
          >
            <Group my="xs">
              {preferredDayOptions.map((option) => (
                <Checkbox
                  key={option.value}
                  value={option.value}
                  label={option.label}
                  error={!!formState.errors.preferredDays?.message}
                />
              ))}
            </Group>
          </Checkbox.Group>

          {/* Description */}
          <Textarea
            {...inputSharedProps}
            {...register(BookingField.Description.id)}
            id={BookingField.Description.id}
            label={<Text span>{BookingField.Description.label}</Text>}
            placeholder={BookingField.Description.placeholder}
            error={formState.errors.description?.message}
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
              dropzoneProps={{ className: 'w-full' }}
            />
            <ImageThumbnails
              imageFiles={imageFiles}
              onImageRemove={(name) => onImageRemove(name)}
            />
            <ImageErrors
              imageUploadRejections={imageUploadRejections}
              formError={formState.errors.referenceImages?.message}
            />
          </Box>

          {/* Submit button */}
          <Button
            size="lg"
            variant="filled"
            type="submit"
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
