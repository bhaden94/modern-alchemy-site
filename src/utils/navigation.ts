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
}

interface BaseNavigationLink {
  label: string
}

export interface NavigationLink extends BaseNavigationLink {
  link: NavigationPages
}

export interface NestedNavigationLink extends BaseNavigationLink {
  links: NavigationLink[]
}

type NavigationLinkType = NavigationLink | NestedNavigationLink

export const NavLinks: NavigationLinkType[] = [
  { link: NavigationPages.Home, label: 'Home' },
  { link: NavigationPages.Artists, label: 'Artists' },
  {
    label: 'Information',
    links: [
      { link: NavigationPages.AftercareInfo, label: 'Aftercare Info' },
      // { link: NavigationPages.BookingInfo, label: 'Booking Info' },
      { link: NavigationPages.Faqs, label: 'FAQs' },
    ],
  },
]

export const ExtraNavLinks: NavigationLink[] = [
  { link: NavigationPages.EmployeePortal, label: 'Employee Portal' },
  { link: NavigationPages.Studio, label: 'Studio' },
]
