import { useState } from 'react'
import { useForm } from 'react-hook-form'

// TODO: split into components
// TODO: implement reCAPTCHA for form submission
// TODO: implement Nodemailer to send email confirming form submission
const TattooForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    const formData = new FormData()
    const images: FileList = data.showcaseImages
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
      <input type="text" id="name" {...register('name', { required: true })} />
      {errors.name && <span>This field is required</span>}

      {/* Phone Number */}
      <label htmlFor="phone_number">Phone Number:</label>
      <input
        type="tel"
        id="phone_number"
        {...register('phone_number', { required: true, pattern: /^\d{10}$/ })}
      />
      {errors.phone_number && <span>Please enter a valid phone number</span>}

      {/* Email */}
      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
      />
      {errors.email && <span>Please enter a valid email address</span>}

      {/* Characters */}
      <label htmlFor="characters">Characters:</label>
      <input
        type="text"
        id="characters"
        {...register('characters', { required: true })}
      />
      {errors.characters && <span>This field is required</span>}

      {/* Description */}
      <label htmlFor="description">Description:</label>
      <textarea
        id="description"
        {...register('description', { required: true })}
      />
      {errors.description && <span>This field is required</span>}

      {/* Location */}
      <label htmlFor="location">Location:</label>
      <input
        type="text"
        id="location"
        {...register('location', { required: true })}
      />
      {errors.location && <span>This field is required</span>}

      {/* Style */}
      <label htmlFor="style">Style:</label>
      <select id="style" {...register('style', { required: true })}>
        <option value="color">Color</option>
        <option value="black_and_grey">Black and Grey</option>
      </select>
      {errors.style && <span>This field is required</span>}

      {/* Prior Tattoo */}
      <label htmlFor="prior_tattoo">Prior Tattoo:</label>
      <select
        id="prior_tattoo"
        {...register('prior_tattoo', { required: true })}
      >
        <option value="new_tattoo">Yes - I want a new tattoo</option>
        <option value="ongoing_project">
          Yes - this is an ongoing project
        </option>
        <option value="no">No</option>
      </select>
      {errors.prior_tattoo && <span>This field is required</span>}

      {/* Preferred Day */}
      <label htmlFor="preferred_day">Preferred Day:</label>
      <select
        id="preferred_day"
        {...register('preferred_day', { required: true })}
      >
        <option value="monday">Monday</option>
        <option value="tuesday">Tuesday</option>
        <option value="wednesday">Wednesday</option>
        <option value="thursday">Thursday</option>
        <option value="friday">Friday</option>
      </select>
      {errors.preferred_day && <span>This field is required</span>}

      {/* Showcase Images */}
      {/* Need to make this a better experience and obvious multiple uploads can be done */}
      <label htmlFor="showcaseImages">Showcase Images:</label>
      <input
        type="file"
        id="showcaseImages"
        multiple
        {...register('showcaseImages', { required: true })}
      />
      {errors.showcaseImages && <span>This field is required</span>}

      {/* Submit button */}
      <button type="submit" disabled={isSubmitting}>
        Submit
      </button>
    </form>
  )
}

export default TattooForm
