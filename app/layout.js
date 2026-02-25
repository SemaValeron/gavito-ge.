import './globals.css'

export const metadata = {
  title: 'Gavito - ყიდვა გაყიდვა საქართველოში',
  description: 'инновационный маркетплейс Грузии',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ka">
      <body>{children}</body>
    </html>
  )
}