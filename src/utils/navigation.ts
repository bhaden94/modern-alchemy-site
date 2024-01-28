export enum NavigationPages {
  Home = '/',
  Artists = '/artists',
  BookingInfo = '/booking-info',
  Faqs = '/faq',
  AftercareInfo = '/aftercare-info',
  BookingRequest = '/booking-request',
  EmployeePortal = '/bookings',
  Studio = '/studio',
}

interface NavigationLink {
  link: NavigationPages
  label: string
}

export const NavLinks: NavigationLink[] = [
  { link: NavigationPages.Home, label: 'Home' },
  { link: NavigationPages.Artists, label: 'Artists' },
  // { link: NavigationPages.BookingInfo, label: 'Booking Info' },
  // { link: NavigationPages.Faqs, label: 'FAQs' },
  { link: NavigationPages.AftercareInfo, label: 'Aftercare Info' },
]

export const ExtraNavLinks: NavigationLink[] = [
  { link: NavigationPages.EmployeePortal, label: 'Employee Portal' },
  { link: NavigationPages.Studio, label: 'Studio' },
]
