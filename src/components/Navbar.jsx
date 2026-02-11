import { useState } from 'react';
import logo from '../assets/react.svg';

function Navbar() {
  const [selectedColor, setSelectedColor] = useState('#E91282');

  const colors = [
    { name: 'rosa-intenso', hex: '#E91282' },
    { name: 'azul-electrico', hex: '#00BFFF' },
    { name: 'verde-lima', hex: '#32CD32' },
    { name: 'amarillo-neon', hex: '#FFFF00' },
    { name: 'naranja-vibrante', hex: '#FF4500' },
    { name: 'morado-profundo', hex: '#8A2BE2' },
    { name: 'rosa-pastel', hex: '#FFB6C1' },
    { name: 'azul-cielo', hex: '#87CEEB' },
    { name: 'verde-menta', hex: '#00FA9A' },
  ];

  const handleColorChange = (hex) => {
    setSelectedColor(hex);
    document.documentElement.style.setProperty('--primary-color', hex);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src={logo} alt='logo' width="36" height="36" className='w-9 h-9 object-contain' />
          <span className="navbar-title">Meet</span>
        </div>
        <div className="color-palette">
          {colors.map((color) => (
            <button
              key={color.name}
              className={`color-option ${selectedColor === color.hex ? 'selected' : ''}`}
              style={{ backgroundColor: color.hex }}
              onClick={() => handleColorChange(color.hex)}
              title={color.name.replace('-', ' ')}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
