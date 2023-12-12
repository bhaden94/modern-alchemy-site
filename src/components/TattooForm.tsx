import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@mantine/core'
import { TextInput } from '@mantine/core'
import { Textarea } from '@mantine/core'
import { Select } from '@mantine/core'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import {
  ACCEPTED_IMAGE_TYPES,
  bookingSchema,
  preferredDayOptions,
  priorTattooOptions,
  styleOptions,
  TBookingSchema,
} from '~/utils/bookingFormUtils'

import ImageDropzone from './ImageDropzone/ImageDropzone'

// TODO: move to mantine form
// TODO: split into components
// TODO: implement reCAPTCHA for form submission
// TODO: implement Nodemailer to send email confirming form submission
const TattooForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TBookingSchema>({ resolver: zodResolver(bookingSchema) })

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
      {errors.name && <span>{errors.name.message}</span>}

      {/* Phone Number */}
      <TextInput
        withAsterisk
        label="Phone Number"
        placeholder="Enter your phone number"
        type="tel"
        id="phoneNumber"
        {...register('phoneNumber')}
      />
      {errors.phoneNumber && <span>{errors.phoneNumber.message}</span>}

      {/* Email */}
      <TextInput
        withAsterisk
        label="Email"
        placeholder="Enter your email"
        type="email"
        id="email"
        {...register('email')}
      />
      {errors.email && <span>{errors.email.message}</span>}

      {/* Characters */}
      <TextInput
        withAsterisk
        label="Characters"
        placeholder="Enter the list of characters"
        type="text"
        id="characters"
        {...register('characters')}
      />
      {errors.characters && <span>{errors.characters.message}</span>}

      {/* Description */}
      <Textarea
        withAsterisk
        label="Description"
        placeholder="Describe your tattoo idea"
        id="description"
        {...register('description')}
      />
      {errors.description && <span>{errors.description.message}</span>}

      {/* Location */}
      <TextInput
        withAsterisk
        label="Location"
        placeholder="Enter the location on your body"
        id="location"
        {...register('location')}
      />
      {errors.location && <span>{errors.location.message}</span>}

      {/* Style */}
      <Select
        withAsterisk
        label="Style"
        id="style"
        defaultValue={'color'}
        data={styleOptions}
        {...register('style')}
      />
      {/* <SelectItem key="color" value="color">
          Color
        </SelectItem>
        <SelectItem key="black_and_grey" value="black_and_grey">
          Black and Grey
        </SelectItem> */}
      {/* </Select> */}
      {errors.style && <span>{errors.style.message}</span>}

      {/* Prior Tattoo */}
      <Select
        withAsterisk
        label="Prior Tattoo"
        id="priorTattoo"
        defaultValue={'new_tattoo'}
        data={priorTattooOptions}
        {...register('priorTattoo')}
      />
      {/* <SelectItem key="new_tattoo" value="new_tattoo">
          Yes - I want a new tattoo
        </SelectItem>
        <SelectItem key="ongoing_project" value="ongoing_project">
          Yes - this is an ongoing project
        </SelectItem>
        <SelectItem key="no" value="no">
          No
        </SelectItem>
      </Select> */}
      {errors.priorTattoo && <span>{errors.priorTattoo.message}</span>}

      {/* Preferred Day */}
      <Select
        withAsterisk
        label="Preferred Day"
        id="preferredDay"
        defaultValue={'monday'}
        data={preferredDayOptions}
        {...register('preferredDay')}
      />
      {/* <SelectItem key="monday" value="monday">
          Monday
        </SelectItem>
        <SelectItem key="tuesday" value="tuesday">
          Tuesday
        </SelectItem>
        <SelectItem key="wednesday" value="wednesday">
          Wednesday
        </SelectItem>
        <SelectItem key="thursday" value="thursday">
          Thursday
        </SelectItem>
        <SelectItem key="friday" value="friday">
          Friday
        </SelectItem>
      </Select> */}
      {errors.preferredDay && <span>{errors.preferredDay.message}</span>}

      {/* Images */}
      <ImageDropzone
        label="Showcase images"
        type="file"
        id="showcaseImages"
        multiple
        accept={ACCEPTED_IMAGE_TYPES.join(',')}
        {...register('showcaseImages')}
      />
      {errors.showcaseImages && <span>{errors.showcaseImages.message}</span>}

      {/* Submit button */}
      <Button type="submit" loading={isSubmitting}>
        Submit
      </Button>
    </form>
  )
}

export default TattooForm
