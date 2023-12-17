import { zodResolver } from '@hookform/resolvers/zod'
import { Button, NativeSelect } from '@mantine/core'
import { TextInput } from '@mantine/core'
import { Textarea } from '@mantine/core'
import { Select } from '@mantine/core'
import { FileWithPath } from '@mantine/dropzone'
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

// TODO: move to mantine form
// TODO: split into components
// TODO: implement reCAPTCHA for form submission
// TODO: implement Nodemailer to send email confirming form submission
const TattooForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFiles, setImageFiles] = useState<FileWithPath[]>([])
  const { register, handleSubmit, formState, setValue, reset } =
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

  const onImageDrop = (files: FileWithPath[]) => {
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
      {/* TODO: Error showing that is can't get name when changing select options, but booking still goes through */}
      <TextInput
        withAsterisk
        label="Name"
        placeholder="Enter your name"
        id="name"
        {...register('name')}
      />
      {formState.errors.name && <span>{formState.errors.name.message}</span>}

      {/* Phone Number */}
      <TextInput
        withAsterisk
        label="Phone Number"
        placeholder="Enter your phone number"
        type="tel"
        id="phoneNumber"
        {...register('phoneNumber')}
      />
      {formState.errors.phoneNumber && (
        <span>{formState.errors.phoneNumber.message}</span>
      )}

      {/* Email */}
      <TextInput
        withAsterisk
        label="Email"
        placeholder="Enter your email"
        type="email"
        id="email"
        {...register('email')}
      />
      {formState.errors.email && <span>{formState.errors.email.message}</span>}

      {/* Characters */}
      <TextInput
        withAsterisk
        label="Characters"
        placeholder="Enter the list of characters"
        type="text"
        id="characters"
        {...register('characters')}
      />
      {formState.errors.characters && (
        <span>{formState.errors.characters.message}</span>
      )}

      {/* Description */}
      <Textarea
        withAsterisk
        label="Description"
        placeholder="Describe your tattoo idea"
        id="description"
        {...register('description')}
      />
      {formState.errors.description && (
        <span>{formState.errors.description.message}</span>
      )}

      {/* Location */}
      <TextInput
        withAsterisk
        label="Location"
        placeholder="Enter the location on your body"
        id="location"
        {...register('location')}
      />
      {formState.errors.location && (
        <span>{formState.errors.location.message}</span>
      )}

      {/* Style */}
      <NativeSelect
        withAsterisk
        label="Style"
        id="style"
        defaultValue="color"
        data={styleOptions}
        {...register('style')}
      />
      {formState.errors.style && <span>{formState.errors.style.message}</span>}

      {/* Prior Tattoo */}
      <NativeSelect
        withAsterisk
        label="Prior Tattoo"
        id="priorTattoo"
        defaultValue="new_tattoo"
        data={priorTattooOptions}
        {...register('priorTattoo')}
      />
      {formState.errors.priorTattoo && (
        <span>{formState.errors.priorTattoo.message}</span>
      )}

      {/* Preferred Day */}
      <NativeSelect
        withAsterisk
        label="Preferred Day"
        id="preferredDay"
        defaultValue="monday"
        data={preferredDayOptions}
        {...register('preferredDay')}
      />
      {formState.errors.preferredDay && (
        <span>{formState.errors.preferredDay.message}</span>
      )}

      {/* Images */}
      <ImageDropzone onImageDrop={(files) => onImageDrop(files)} />
      <ImageThumbnails
        imageFiles={imageFiles}
        onImageRemove={(name) => onImageRemove(name)}
      />
      {formState.errors.showcaseImages && (
        <span>{formState.errors.showcaseImages.message}</span>
      )}

      {/* Submit button */}
      <Button type="submit" loading={isSubmitting}>
        Submit
      </Button>
    </form>
  )
}

export default TattooForm
