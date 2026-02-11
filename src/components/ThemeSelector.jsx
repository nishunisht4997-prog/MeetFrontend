import { useState, useEffect } from 'react';

function ThemeSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(() => {
    return localStorage.getItem('selectedThemeColor') || '#E91282';
  });

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
    { name: 'rojo-pasion', hex: '#DC143C' },
    { name: 'turquesa', hex: '#40E0D0' },
    { name: 'lavanda', hex: '#E6E6FA' },
    { name: 'oro', hex: '#FFD700' },
    { name: 'esmeralda', hex: '#50C878' },
    { name: 'violeta', hex: '#8B00FF' },
  ];

  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', selectedColor);
    localStorage.setItem('selectedThemeColor', selectedColor);
  }, [selectedColor]);

  const handleColorChange = (hex) => {
    setSelectedColor(hex);
    setIsOpen(false);
  };

  return (
    <div className="theme-selector">
      <button
        className="theme-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Change Theme"
      >
        🎨
      </button>
      {isOpen && (
        <div className="color-palette-modal">
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
      )}
    </div>
  );
}

export default ThemeSelector;
