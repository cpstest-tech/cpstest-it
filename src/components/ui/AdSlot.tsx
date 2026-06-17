export default function AdSlot({ width = '100%', height = '90px', type = 'horizontal' }: { width?: string, height?: string, type?: 'horizontal' | 'vertical' }) {
  const text = type === 'vertical' ? 'AD' : '[ SPAZIO PUBBLICITARIO ]';
  return (
    <div className={type === 'vertical' ? 'ad-vertical' : ''} style={{
      width,
      height,
      background: 'rgba(255,255,255,0.02)',
      border: '1px dashed rgba(255,255,255,0.1)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: type === 'vertical' ? '0' : '20px auto',
      color: 'var(--color-text-muted)',
      fontSize: type === 'vertical' ? '1.5rem' : '0.8rem',
      letterSpacing: '1px',
      writingMode: type === 'vertical' ? 'vertical-rl' : 'horizontal-tb',
      textOrientation: type === 'vertical' ? 'upright' : 'mixed'
    }}>
      {text}
    </div>
  );
}
