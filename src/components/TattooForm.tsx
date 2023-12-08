import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

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
      <input type="text" id="name" {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}

      {/* Phone Number */}
      <label htmlFor="phoneNumber">Phone Number:</label>
      <input type="tel" id="phoneNumber" {...register('phoneNumber')} />
      {errors.phoneNumber && <span>{errors.phoneNumber.message}</span>}

      {/* Email */}
      <label htmlFor="email">Email:</label>
      <input type="email" id="email" {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}

      {/* Characters */}
      <label htmlFor="characters">Characters:</label>
      <input type="text" id="characters" {...register('characters')} />
      {errors.characters && <span>{errors.characters.message}</span>}

      {/* Description */}
      <label htmlFor="description">Description:</label>
      <textarea id="description" {...register('description')} />
      {errors.description && <span>{errors.description.message}</span>}

      {/* Location */}
      <label htmlFor="location">Location:</label>
      <input type="text" id="location" {...register('location')} />
      {errors.location && <span>{errors.location.message}</span>}

      {/* Style */}
      <label htmlFor="style">Style:</label>
      <select id="style" {...register('style')}>
        <option value="color">Color</option>
        <option value="black_and_grey">Black and Grey</option>
      </select>
      {errors.style && <span>{errors.style.message}</span>}

      {/* Prior Tattoo */}
      <label htmlFor="priorTattoo">Prior Tattoo:</label>
      <select id="priorTattoo" {...register('priorTattoo')}>
        <option value="new_tattoo">Yes - I want a new tattoo</option>
        <option value="ongoing_project">
          Yes - this is an ongoing project
        </option>
        <option value="no">No</option>
      </select>
      {errors.priorTattoo && <span>{errors.priorTattoo.message}</span>}

      {/* Preferred Day */}
      <label htmlFor="preferredDay">Preferred Day:</label>
      <select id="preferredDay" {...register('preferredDay')}>
        <option value="monday">Monday</option>
        <option value="tuesday">Tuesday</option>
        <option value="wednesday">Wednesday</option>
        <option value="thursday">Thursday</option>
        <option value="friday">Friday</option>
      </select>
      {errors.preferredDay && <span>{errors.preferredDay.message}</span>}

      {/* Showcase Images */}
      {/* Need to make this a better experience and obvious multiple uploads can be done */}
      <label htmlFor="showcaseImages">Showcase Images:</label>
      <input
        type="file"
        id="showcaseImages"
        multiple
        {...register('showcaseImages')}
      />
      {errors.showcaseImages && <span>{errors.showcaseImages.message}</span>}

      {/* Submit button */}
      <button type="submit" disabled={isSubmitting}>
        Submit
      </button>
    </form>
  )
}

export default TattooForm
