import { IconFileCode } from '@tabler/icons-react'
import { defineField, defineType } from 'sanity'

import { ImageReference } from '~/lib/sanity/sanity.image'

import { BaseSanitySchema } from '..'

export interface LayoutMetadataContent
  extends BaseSanitySchema<'layoutMetadataContent'> {
  businessName: string
  location: string
  description?: string
  openGraphImage?: ImageReference
  address?: string
  city?: string
  state?: string
  zipCode?: string
  phoneNumber?: string
  latitude?: number
  longitude?: number
  openingHours?: string
  facebookUrl?: string
  instagramUrl?: string
}

export default defineType({
  name: 'layoutMetadataContent',
  type: 'document',
  title: 'Layout Metadata',
  icon: IconFileCode,
  fields: [
    defineField({
      name: 'businessName',
      type: 'string',
      title: 'Business Name',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      type: 'string',
      title: 'Location',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'string',
      title: 'Description',
    }),
    defineField({
      name: 'openGraphImage',
      type: 'image',
      title: 'Open Graph Image',
    }),
    defineField({
      name: 'address',
      type: 'string',
      title: 'Street Address',
      description: 'Full street address for local SEO',
    }),
    defineField({
      name: 'city',
      type: 'string',
      title: 'City',
      description: 'City name for local SEO',
    }),
    defineField({
      name: 'state',
      type: 'string',
      title: 'State/Province',
      description: 'State or province for local SEO',
    }),
    defineField({
      name: 'zipCode',
      type: 'string',
      title: 'Zip/Postal Code',
      description: 'Zip or postal code for local SEO',
    }),
    defineField({
      name: 'phoneNumber',
      type: 'string',
      title: 'Phone Number',
      description: 'Business phone number in format: +1-xxx-xxx-xxxx',
    }),
    defineField({
      name: 'latitude',
      type: 'number',
      title: 'Latitude',
      description: 'Geographic latitude for map integration',
    }),
    defineField({
      name: 'longitude',
      type: 'number',
      title: 'Longitude',
      description: 'Geographic longitude for map integration',
    }),
    defineField({
      name: 'openingHours',
      type: 'text',
      title: 'Opening Hours',
      description:
        'Business hours in format: Mo-Fr 10:00-18:00, Sa 10:00-16:00',
    }),
    defineField({
      name: 'facebookUrl',
      type: 'url',
      title: 'Facebook Page URL',
      description: 'Full URL to your Facebook business page',
    }),
    defineField({
      name: 'instagramUrl',
      type: 'url',
      title: 'Instagram Profile URL',
      description: 'Full URL to your Instagram business profile',
    }),
  ],
})
