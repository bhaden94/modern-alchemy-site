# Nav

Simple menu: https://ui.mantine.dev/category/headers/

- Booking Info
- Artists
- FAQs
- Aftercare Info
- Footer only links
  - Employee portal
    - Make the bookings route dynamic to work with all artists pages.
    - Each artist should only be allowed to access their page.
  - Studio

## Splash page

https://ui.mantine.dev/category/hero/

## Artists

- Each artist has a headshot, their name, their styles, and a link to their portfolio.
  - Fallback image here of a general person icon.

### Artist page

- Headshot and styles shown again.
- Image gallery of their work.
- Booking status and form to book with them if open.
- Link to socials.

## Booking info

- General guide to booking at the shop.
- Books status for each artist at the shop.

### Booking Page

- Each artist will use a general booking page.
  - Use nextjs routes to get the artist name and attach the booking to them.
- The page will have the artists name at the top.

# Admin Views

There will be two types of roles: Owner and employee.

## Employee

Powers

- See their requested bookings.
  - List of bookings that shows all the information a user input.
- Open and close their books.
  - Simple switcher.
- Set estimated dates on when their books will be open next.
  - Date picker that allows specific dates or just months. If empty, show TBD.
- Add/modify social links.
  - Allow Instagram only for now. More if requested.
- Add/modify portfolio images and headshot.
  - Use dropzone for uploads and multi-delete with confirmation.

## Owner

Powers

- All the powers of the employee
- Add employees
  - Add name and email. Employee will be responsible for the rest.
  - If the employee does not have a gmail, then they will not have access to their emplyee page.
- Remove employees.
  - Delete from list with confirmation.

## Developer

Will have direct access to the dataset.

# Mailing list

TBD

# Schemas

## Artist

TBD

## Books Open Flag

TBD

## FAQs

## Aftercare Info

## Booking Info

# Notes

- Storing artists in a provider could be useful since we are quering for them often.
