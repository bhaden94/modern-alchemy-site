export enum NavigationPages {
  Home = '/',
  Artists = '/artists',
  BookingInfo = '/booking-info',
  Faqs = '/faq',
  AftercareInfo = '/aftercare-info',
  BookingRequest = '/booking-request',
  BookingRequestSuccess = '/booking-request/success',
  EmployeePortal = '/employee-portal',
  EmployeePortalFormSettings = '/form-settings',
  EmployeePortalPortfolioSettings = '/portfolio-settings',
  EmployeePortalBookings = '/bookings',
  EmployeePortalSiteContent = '/site-content',
  Studio = '/studio',
  Unauthorized = '/unauthorized',
  PrivacyPolicy = '/privacy-policy',
  Disclaimer = '/disclaimer',
  Announcement = '/announcement',
}

interface NavigationLink {
  label: string
  link: '/employee-portal' | '/studio'
}

export const ExtraNavLinks: NavigationLink[] = [
  { link: '/employee-portal', label: 'Employee Portal' },
  { link: '/studio', label: 'Studio' },
]
