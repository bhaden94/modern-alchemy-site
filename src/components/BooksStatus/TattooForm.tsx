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
import SuccessfullBooking from './SuccessfullBooking'

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
}

// TODO: split into components
// TODO: implement reCAPTCHA for form submission
// TODO: implement Nodemailer to send email confirming form submission
const TattooForm = ({ artistId }: ITattooForm) => {
  const [isUploadingImages, setIsUploadingImages] = useState<boolean>(false)
  const [isSubmittingForm, setIsSubmittingForm] = useState<boolean>(false)
  const [formSubmittedSuccessfully, setFormSubmittedSuccessfully] =
    useState<boolean>(false)

  const [preferredDays, setPreferredDays] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<FileWithPath[]>([])
  const [imageUploadRejections, setImageUploadRejections] = useState<
    FileRejection[]
  >([])
  const { register, handleSubmit, formState, setValue, reset, clearErrors } =
    useForm<TBookingSchema>({ resolver: zodResolver(bookingSchema) })

  const isSubmitting = isUploadingImages || isSubmittingForm

  useEffect(() => {
    register(BookingField.ReferenceImages)
    register(BookingField.PreferredDays)
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
    // TODO: handle errors
    const { imageReferences } = await imageUploadResponse.json()
    setIsUploadingImages(false)
    setIsSubmittingForm(true)

    /* Create booking */
    const response = await fetch('/api/sanity/booking', {
      method: 'PUT',
      body: JSON.stringify({
        ...data,
        artist: { _ref: artistId, _type: 'reference', _weak: true },
        [BookingField.ReferenceImages]: imageReferences,
      }),
    })
    // TODO: handle errors

    setIsSubmittingForm(false)

    if (imageUploadResponse.ok && response.ok) {
      reset()
      setImageFiles([])
      setPreferredDays([])
      setFormSubmittedSuccessfully(true)
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      })
    }
  }

  const onPreferredDaysChange = (days: string[]) => {
    clearErrors(BookingField.PreferredDays)
    setPreferredDays(days)
    setValue(BookingField.PreferredDays, days)
  }

  const onImageReject = (rejections: FileRejection[]) => {
    setImageUploadRejections(rejections)
  }

  const onImageDrop = (files: FileWithPath[]) => {
    clearErrors(BookingField.ReferenceImages)
    setImageUploadRejections([])

    setImageFiles(files)
    setValue(BookingField.ReferenceImages, files)
  }

  const onImageRemove = (name: string) => {
    const filteredFiles = imageFiles.filter((image) => image.name !== name)
    setImageFiles(filteredFiles)
    setValue(BookingField.ReferenceImages, filteredFiles)
  }

  return (
    <>
      {formSubmittedSuccessfully ? (
        <SuccessfullBooking />
      ) : (
        <Container size="sm" py="lg" px={0}>
          <Box pos="relative">
            <LoadingOverlay
              visible={isSubmitting}
              zIndex={1000}
              overlayProps={{ radius: 'sm', blur: 2 }}
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
                label={<Text span>First and Last Name</Text>}
                placeholder="Enter your name"
                id={BookingField.Name}
                error={formState.errors.name?.message}
                disabled={isSubmitting}
                {...register(BookingField.Name)}
              />

              {/* Phone Number */}
              <TextInput
                {...inputSharedProps}
                label={<Text span>Phone Number</Text>}
                placeholder="Enter your phone number"
                type="tel"
                id={BookingField.PhoneNumber}
                error={formState.errors.phoneNumber?.message}
                disabled={isSubmitting}
                {...register(BookingField.PhoneNumber)}
              />

              {/* Email */}
              <TextInput
                {...inputSharedProps}
                label={<Text span>Email</Text>}
                placeholder="Enter your email"
                type="email"
                id={BookingField.Email}
                error={formState.errors.email?.message}
                disabled={isSubmitting}
                {...register(BookingField.Email)}
              />

              {/* Characters */}
              <TextInput
                {...inputSharedProps}
                label={<Text span>Characters</Text>}
                placeholder="Enter the list of characters you want"
                id={BookingField.Characters}
                error={formState.errors.characters?.message}
                disabled={isSubmitting}
                {...register(BookingField.Characters)}
              />

              {/* Location */}
              <TextInput
                {...inputSharedProps}
                label={<Text span>Body Location</Text>}
                placeholder="Enter the location on your body"
                id={BookingField.Location}
                error={formState.errors.location?.message}
                disabled={isSubmitting}
                {...register(BookingField.Location)}
              />

              {/* Style */}
              <NativeSelect
                {...inputSharedProps}
                label={<Text span>Tattoo Style</Text>}
                id={BookingField.Style}
                defaultValue="color"
                data={styleOptions}
                error={formState.errors.style?.message}
                disabled={isSubmitting}
                {...register(BookingField.Style)}
              />

              {/* Prior Tattoo */}
              <NativeSelect
                {...inputSharedProps}
                label={
                  <Text span>Have you been tattooed by Larry before?</Text>
                }
                id={BookingField.PriorTattoo}
                defaultValue="no"
                data={priorTattooOptions}
                error={formState.errors.priorTattoo?.message}
                disabled={isSubmitting}
                {...register(BookingField.PriorTattoo)}
              />

              {/* Preferred Days */}
              <Checkbox.Group
                {...inputSharedProps}
                value={preferredDays}
                onChange={onPreferredDaysChange}
                label={<Text span>Preferred days of appointment</Text>}
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
                label={<Text span>Tattoo Idea</Text>}
                placeholder="Describe your tattoo idea"
                id={BookingField.Description}
                error={formState.errors.description?.message}
                disabled={isSubmitting}
                {...register(BookingField.Description)}
              />

              {/* Images */}
              <Box className="w-full">
                <Text span>Reference Images</Text>
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
      )}
    </>
  )
}

export default TattooForm
