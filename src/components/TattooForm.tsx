'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Box,
  Button,
  Loader,
  LoadingOverlay,
  NativeSelect,
  Text,
} from '@mantine/core'
import { TextInput } from '@mantine/core'
import { Textarea } from '@mantine/core'
import { FileRejection, FileWithPath } from '@mantine/dropzone'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import {
  BookingField,
  bookingSchema,
  styleOptions,
  TBookingSchema,
} from '~/utils/bookingFormUtils'

import ImageDropzone from './ImageDropzone/ImageDropzone'
import ImageErrors from './ImageDropzone/ImageErrors'
import ImageThumbnails from './ImageDropzone/ImageThumbnails'

const CustomLoader = ({ label }: { label: string }) => {
  return (
    <div className="flex flex-col justify-center items-center	gap-4">
      <Loader />
      <Text>{label}</Text>
    </div>
  )
}

// TODO: move to mantine form (maybe)
// TODO: split into components
// TODO: implement reCAPTCHA for form submission
// TODO: implement Nodemailer to send email confirming form submission
const TattooForm = ({ artistId }: { artistId: string }) => {
  const [isUploadingImages, setIsUploadingImages] = useState<boolean>(false)
  const [isSubmittingForm, setIsSubmittingForm] = useState<boolean>(false)
  const [imageFiles, setImageFiles] = useState<FileWithPath[]>([])
  const [imageUploadRejections, setImageUploadRejections] = useState<
    FileRejection[]
  >([])
  const { register, handleSubmit, formState, setValue, reset, clearErrors } =
    useForm<TBookingSchema>({ resolver: zodResolver(bookingSchema) })

  const isSubmitting = isUploadingImages || isSubmittingForm

  useEffect(() => {
    register(BookingField.ReferenceImages)
  }, [register])

  const onSubmit: SubmitHandler<TBookingSchema> = async (data) => {
    setIsUploadingImages(true)
    const formData = new FormData()
    const images: File[] = data.referenceImages
    Array.from(images).forEach((file, i) => {
      formData.append(`image-${i}`, file)
    })

    // TODO: UI shows images uploading dialog
    /* Upload images */
    const imageUploadResponse = await fetch('/api/sanity/images', {
      method: 'PUT',
      body: formData,
    })
    // TODO: handle errors
    const { imageReferences } = await imageUploadResponse.json()
    setIsUploadingImages(false)
    setIsSubmittingForm(true)

    // TODO: UI shows submitting booking dialog
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
    }
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
        className="flex flex-col justify-center items-center gap-4 px-4"
      >
        {/* Name */}
        <TextInput
          className="w-full"
          withAsterisk
          label={<Text span>First and Last Name</Text>}
          placeholder="Enter your name"
          id={BookingField.Name}
          error={formState.errors.name?.message}
          disabled={isSubmitting}
          {...register(BookingField.Name)}
        />

        {/* Phone Number */}
        <TextInput
          className="w-full"
          withAsterisk
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
          className="w-full"
          withAsterisk
          label={<Text span>Email</Text>}
          placeholder="Enter your email"
          type="email"
          id={BookingField.Email}
          error={formState.errors.email?.message}
          disabled={isSubmitting}
          {...register(BookingField.Email)}
        />

        {/* Location */}
        <TextInput
          className="w-full"
          withAsterisk
          label={<Text span>Body Location</Text>}
          placeholder="Enter the location on your body"
          id={BookingField.Location}
          error={formState.errors.location?.message}
          disabled={isSubmitting}
          {...register(BookingField.Location)}
        />

        {/* Style */}
        <NativeSelect
          className="w-full"
          withAsterisk
          label={<Text span>Tattoo Style</Text>}
          id={BookingField.Style}
          defaultValue="color"
          data={styleOptions}
          error={formState.errors.style?.message}
          disabled={isSubmitting}
          {...register(BookingField.Style)}
        />

        {/* Description */}
        <Textarea
          className="w-full"
          withAsterisk
          label={<Text span>Tattoo Idea</Text>}
          placeholder="Describe your tattoo idea"
          id={BookingField.Description}
          error={formState.errors.description?.message}
          disabled={isSubmitting}
          {...register(BookingField.Description)}
        />

        {/* Images */}
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

        {/* Submit button */}
        <Button size="lg" variant="filled" type="submit" loading={isSubmitting}>
          Send Request
        </Button>
      </form>
    </Box>
  )
}

export default TattooForm
