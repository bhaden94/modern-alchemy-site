import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { Textarea } from '@nextui-org/react'
import { Select, SelectItem } from '@nextui-org/select'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import {
  ACCEPTED_IMAGE_TYPES,
  bookingSchema,
  TBookingSchema,
} from '~/utils/bookingFormUtils'
import ImageDropzone from './ImageDropzone/ImageDropzone'

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
      <Input
        isRequired
        label="Name"
        labelPlacement="outside"
        placeholder="Enter your name"
        type="text"
        id="name"
        {...register('name')}
      />
      {errors.name && <span>{errors.name.message}</span>}

      {/* Phone Number */}
      <Input
        isRequired
        label="Phone Number"
        labelPlacement="outside"
        placeholder="Enter your phone number"
        type="tel"
        id="phoneNumber"
        {...register('phoneNumber')}
      />
      {errors.phoneNumber && <span>{errors.phoneNumber.message}</span>}

      {/* Email */}
      <Input
        isRequired
        label="Email"
        labelPlacement="outside"
        placeholder="Enter your email"
        type="email"
        id="email"
        {...register('email')}
      />
      {errors.email && <span>{errors.email.message}</span>}

      {/* Characters */}
      <Input
        isRequired
        label="Characters"
        labelPlacement="outside"
        placeholder="Enter the list of characters"
        type="text"
        id="characters"
        {...register('characters')}
      />
      {errors.characters && <span>{errors.characters.message}</span>}

      {/* Description */}
      <Textarea
        label="Description"
        labelPlacement="outside"
        placeholder="Describe your tattoo idea"
        id="description"
        isRequired
        {...register('description')}
      />
      {errors.description && <span>{errors.description.message}</span>}

      {/* Location */}
      <Input
        isRequired
        label="Location"
        labelPlacement="outside"
        placeholder="Enter the location on your body"
        type="text"
        id="location"
        {...register('location')}
      />
      {errors.location && <span>{errors.location.message}</span>}

      {/* Style */}
      <Select
        label="Style"
        labelPlacement="outside"
        isRequired
        id="style"
        defaultSelectedKeys={['color']}
        {...register('style')}
      >
        <SelectItem key="color" value="color">
          Color
        </SelectItem>
        <SelectItem key="black_and_grey" value="black_and_grey">
          Black and Grey
        </SelectItem>
      </Select>
      {errors.style && <span>{errors.style.message}</span>}

      {/* Prior Tattoo */}
      <Select
        label="Prior Tattoo"
        labelPlacement="outside"
        isRequired
        id="priorTattoo"
        defaultSelectedKeys={['new_tattoo']}
        {...register('priorTattoo')}
      >
        <SelectItem key="new_tattoo" value="new_tattoo">
          Yes - I want a new tattoo
        </SelectItem>
        <SelectItem key="ongoing_project" value="ongoing_project">
          Yes - this is an ongoing project
        </SelectItem>
        <SelectItem key="no" value="no">
          No
        </SelectItem>
      </Select>
      {errors.priorTattoo && <span>{errors.priorTattoo.message}</span>}

      {/* Preferred Day */}
      <Select
        label="Preferred Day"
        labelPlacement="outside"
        isRequired
        id="preferredDay"
        defaultSelectedKeys={['monday']}
        {...register('preferredDay')}
      >
        <SelectItem key="monday" value="monday">
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
      </Select>
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
      <Button type="submit" color="primary" isDisabled={isSubmitting}>
        Submit
      </Button>
    </form>
  )
}

export default TattooForm
