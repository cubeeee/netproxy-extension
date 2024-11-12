import React from 'react'

const Header = () => {
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="px-4 py-3 flex flex-col items-center gap-2">
        <div className="w-auto h-10">
          <img alt="Netproxy" className="w-full h-full object-contain" src={'/logo.svg'} />
        </div>
        <div 
          style={{
            fontSize: '13px',
            fontWeight: 400,
            letterSpacing: '0.01em',
            color: '#374151',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          High-Performance P2P Residential
        </div>
      </div>
    </div>
  );
};

export default Header;