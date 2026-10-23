import React from 'react'

export const LeadsSkeleton: React.FC<{ rows?: number }> = ({ rows = 6 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <tr key={index} className="skeleton-row">
          <td style={{ padding: '0.85rem 1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div 
                style={{ 
                  width: '30px', 
                  height: '30px', 
                  borderRadius: '50%', 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)' 
                }} 
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ width: '110px', height: '12px', backgroundColor: 'rgba(255, 255, 255, 0.07)', borderRadius: '4px' }} />
                <div style={{ width: '80px', height: '10px', backgroundColor: 'rgba(255, 255, 255, 0.04)', borderRadius: '4px' }} />
              </div>
            </div>
          </td>
          <td style={{ padding: '0.85rem 1rem' }}>
            <div style={{ width: '130px', height: '12px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px' }} />
          </td>
          <td style={{ padding: '0.85rem 1rem' }}>
            <div style={{ width: '60px', height: '16px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px' }} />
          </td>
          <td style={{ padding: '0.85rem 1rem' }}>
            <div style={{ width: '75px', height: '18px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '9999px' }} />
          </td>
          <td style={{ padding: '0.85rem 1rem' }}>
            <div style={{ width: '90px', height: '12px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px' }} />
          </td>
          <td style={{ padding: '0.85rem 1rem' }}>
            <div style={{ width: '85px', height: '12px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px' }} />
          </td>
          <td style={{ padding: '0.85rem 1rem', width: '40px' }} />
        </tr>
      ))}
    </>
  )
}
