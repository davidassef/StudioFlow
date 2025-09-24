// Simple test page using Pages API
export default function SimpleTest() {
  return (
    <div style={{ 
      backgroundColor: '#000000', 
      color: '#FFD700',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#FFD700' }}>
        Theme Test - Black + Gold
      </h1>
      <p>If you can see this, the basic theme is working!</p>
      <div style={{ 
        backgroundColor: '#FFD700', 
        color: '#000000',
        padding: '10px',
        margin: '10px 0'
      }}>
        Gold background with black text
      </div>
    </div>
  )
}