import '@/styles/globals.css'

export default function TestPage() {
  return (
    <html>
      <head>
        <title>Test Theme</title>
      </head>
      <body>
        <div style={{ 
          backgroundColor: 'hsl(var(--background))', 
          color: 'hsl(var(--foreground))',
          minHeight: '100vh',
          padding: '2rem'
        }}>
          <h1 style={{ color: 'hsl(var(--primary))' }}>
            Test Theme Page
          </h1>
          <div className="gold-text">
            This should be gold text
          </div>
          <div className="gold-bg p-4 my-4">
            This should have gold background
          </div>
          <button className="btn-gold p-2">
            Gold Button
          </button>
        </div>
      </body>
    </html>
  )
}