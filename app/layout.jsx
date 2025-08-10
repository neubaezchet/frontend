export const metadata = {
  title: 'Sistema de Validación de Incapacidades',
  description: 'Plataforma para validar requisitos de incapacidades médicas',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, fontFamily: 'sans-serif', background: '#f9f9f9' }}>
        {children}
      </body>
    </html>
  )
}
