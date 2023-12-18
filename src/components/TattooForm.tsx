'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, List, NativeSelect } from '@mantine/core'
import { TextInput } from '@mantine/core'
import { Textarea } from '@mantine/core'
import { FileRejection, FileWithPath } from '@mantine/dropzone'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import {
  bookingSchema,
  preferredDayOptions,
  priorTattooOptions,
  styleOptions,
  TBookingSchema,
} from '~/utils/bookingFormUtils'

import ImageDropzone from './ImageDropzone/ImageDropzone'
import ImageThumbnails from './ImageDropzone/ImageThumbnails'
import ImageErrors from './ImageDropzone/ImageErrors'
import { IconExclamationCircle } from '@tabler/icons-react'

const alertIcon = <IconExclamationCircle />

// TODO: move to mantine form
// TODO: split into components
// TODO: implement reCAPTCHA for form submission
// TODO: implement Nodemailer to send email confirming form submission
const TattooForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFiles, setImageFiles] = useState<FileWithPath[]>([])
  const [imageUploadRejections, setImageUploadRejections] = useState<
    FileRejection[]
  >([])
  const { register, handleSubmit, formState, setValue, reset, clearErrors } =
    useForm<TBookingSchema>({ resolver: zodResolver(bookingSchema) })

  useEffect(() => {
    register('showcaseImages')
  }, [register])

  const onSubmit: SubmitHandler<TBookingSchema> = async (data) => {
    setIsSubmitting(true)
    const formData = new FormData()
    const images: File[] = data.showcaseImages
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

    // TODO: UI shows submitting booking dialog
    /* Create booking */
    const response = await fetch('/api/sanity/booking', {
      method: 'PUT',
      body: JSON.stringify({
        ...data,
        showcaseImages: imageReferences,
      }),
    })
    // TODO: handle errors
    setIsSubmitting(false)
    if (imageUploadResponse.ok && response.ok) {
      reset()
      setImageFiles([])
    }
  }

  const onImageReject = (rejections: FileRejection[]) => {
    setImageUploadRejections(rejections)
  }

  const onImageDrop = (files: FileWithPath[]) => {
    clearErrors('showcaseImages')
    setImageUploadRejections([])

    setImageFiles(files)
    setValue('showcaseImages', files)
  }

  const onImageRemove = (name: string) => {
    const filteredFiles = imageFiles.filter((image) => image.name !== name)
    setImageFiles(filteredFiles)
    setValue('showcaseImages', filteredFiles)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Name */}
      <TextInput
        withAsterisk
        label="Name"
        placeholder="Enter your name"
        id="name"
        error={formState.errors.name?.message}
        {...register('name')}
      />

      {/* Phone Number */}
      <TextInput
        withAsterisk
        label="Phone Number"
        placeholder="Enter your phone number"
        type="tel"
        id="phoneNumber"
        error={formState.errors.phoneNumber?.message}
        {...register('phoneNumber')}
      />

      {/* Email */}
      <TextInput
        withAsterisk
        label="Email"
        placeholder="Enter your email"
        type="email"
        id="email"
        error={formState.errors.email?.message}
        {...register('email')}
      />

      {/* Characters */}
      {/* TODO: make a multi tag input */}
      <TextInput
        withAsterisk
        label="Characters"
        placeholder="Enter the list of characters"
        type="text"
        id="characters"
        error={formState.errors.characters?.message}
        {...register('characters')}
      />

      {/* Description */}
      <Textarea
        withAsterisk
        label="Description"
        placeholder="Describe your tattoo idea"
        id="description"
        error={formState.errors.description?.message}
        {...register('description')}
      />

      {/* Location */}
      <TextInput
        withAsterisk
        label="Location"
        placeholder="Enter the location on your body"
        id="location"
        error={formState.errors.location?.message}
        {...register('location')}
      />

      {/* Style */}
      <NativeSelect
        withAsterisk
        label="Style"
        id="style"
        defaultValue="color"
        data={styleOptions}
        error={formState.errors.style?.message}
        {...register('style')}
      />

      {/* Prior Tattoo */}
      <NativeSelect
        withAsterisk
        label="Prior Tattoo"
        id="priorTattoo"
        defaultValue="new_tattoo"
        data={priorTattooOptions}
        error={formState.errors.priorTattoo?.message}
        {...register('priorTattoo')}
      />

      {/* Preferred Day */}
      <NativeSelect
        withAsterisk
        label="Preferred Day"
        id="preferredDay"
        defaultValue="monday"
        data={preferredDayOptions}
        error={formState.errors.preferredDay?.message}
        {...register('preferredDay')}
      />

      {/* Images */}
      <ImageDropzone
        onImageDrop={(files) => onImageDrop(files)}
        onImageReject={(rejections) => onImageReject(rejections)}
      />
      <ImageThumbnails
        imageFiles={imageFiles}
        onImageRemove={(name) => onImageRemove(name)}
      />
      <ImageErrors
        imageUploadRejections={imageUploadRejections}
        formError={formState.errors.showcaseImages?.message}
      />

      {/* Submit button */}
      <Button variant="filled" type="submit" loading={isSubmitting}>
        Submit
      </Button>
    </form>
  )
}

export default TattooForm
