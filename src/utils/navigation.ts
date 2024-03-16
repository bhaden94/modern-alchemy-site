export enum NavigationPages {
  Home = '/',
  Artists = '/artists',
  BookingInfo = '/booking-info',
  Faqs = '/faq',
  AftercareInfo = '/aftercare-info',
  BookingRequest = '/booking-request',
  BookingRequestSuccess = '/booking-request/success',
  EmployeePortal = '/employee-portal',
  EmployeePortalSettings = '/settings',
  EmployeePortalBookings = '/bookings',
  Studio = '/studio',
  Unauthorized = '/unauthorized',
  PrivacyPolicy = '/privacy-policy',
}

interface NavigationLink {
  label: string
  link: '/employee-portal' | '/studio'
}

export const ExtraNavLinks: NavigationLink[] = [
  { link: '/employee-portal', label: 'Employee Portal' },
  { link: '/studio', label: 'Studio' },
]
