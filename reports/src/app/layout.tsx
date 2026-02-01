import './globals.css';

export const metadata = {
  title: 'Tarea 6',
  description: 'Reportes con PostgreSQL y Next.js',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div className="container">
          {children}
        </div>
      </body>
    </html>
  );
}