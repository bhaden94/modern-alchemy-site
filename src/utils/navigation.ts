interface NavigationLink {
  link: string
  label: string
}

export const NavLinks: NavigationLink[] = [
  { link: '/', label: 'Home' },
  { link: '/artists', label: 'Artists' },
  { link: '/booking-info', label: 'Booking Info' },
  { link: '/faq', label: 'FAQ' },
  { link: '/aftercare-info', label: 'Aftercare Info' },
]

export const ExtraNavLinks: NavigationLink[] = [
  { link: '/bookings', label: 'Employee Portal' },
  { link: '/studio', label: 'Studio' },
]
