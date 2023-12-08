import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { Select, SelectItem } from '@nextui-org/select'
import { Textarea } from '@nextui-org/react'
import { bookingSchema, TBookingSchema } from '~/utils/bookingFormUtils'

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
    const images: FileList = data.showcaseImages
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
      <label htmlFor="name">Name:</label>
      <Input type="text" id="name" {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}

      {/* Phone Number */}
      <label htmlFor="phoneNumber">Phone Number:</label>
      <Input type="tel" id="phoneNumber" {...register('phoneNumber')} />
      {errors.phoneNumber && <span>{errors.phoneNumber.message}</span>}

      {/* Email */}
      <label htmlFor="email">Email:</label>
      <Input type="email" id="email" {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}

      {/* Characters */}
      <label htmlFor="characters">Characters:</label>
      <Input type="text" id="characters" {...register('characters')} />
      {errors.characters && <span>{errors.characters.message}</span>}

      {/* Description */}
      <label htmlFor="description">Description:</label>
      <Textarea id="description" {...register('description')} />
      {errors.description && <span>{errors.description.message}</span>}

      {/* Location */}
      <label htmlFor="location">Location:</label>
      <Input type="text" id="location" {...register('location')} />
      {errors.location && <span>{errors.location.message}</span>}

      {/* Style */}
      <label htmlFor="style">Style:</label>
      <Select
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
      <label htmlFor="priorTattoo">Prior Tattoo:</label>
      <Select
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
      <label htmlFor="preferredDay">Preferred Day:</label>
      <Select
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

      {/* Showcase Images */}
      {/* Need to make this a better experience and obvious multiple uploads can be done */}
      {/* https://react-dropzone.js.org/#section-previews */}
      <label htmlFor="showcaseImages">Showcase Images:</label>
      <input
        type="file"
        id="showcaseImages"
        multiple
        {...register('showcaseImages')}
      />
      {errors.showcaseImages && <span>{errors.showcaseImages.message}</span>}

      {/* Submit button */}
      <Button type="submit" disabled={isSubmitting}>
        Submit
      </Button>
    </form>
  )
}

export default TattooForm
