export default function StoreClosedBanner() {
  return (
    <div style={{
      position: 'fixed', top: '72px', left: 0, right: 0, zIndex: 999,
      background: 'linear-gradient(135deg, rgba(212, 96, 122, 0.9), rgba(122, 79, 58, 0.85))',
      backdropFilter: 'blur(10px)',
      padding: '14px',
      textAlign: 'center',
      color: 'white',
      fontFamily: 'var(--font-body)',
      fontWeight: 500,
      fontSize: '15px',
      letterSpacing: '0.2px',
      borderBottom: '1px solid rgba(255,255,255,0.2)',
      animation: 'pulse 3s ease-in-out infinite',
    }}>
      🚫 We're currently closed — you can browse our menu but{' '}
      <strong>orders won't be accepted</strong> right now. We'll be back soon! 🍰
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.85} }`}</style>
    </div>
  )
}