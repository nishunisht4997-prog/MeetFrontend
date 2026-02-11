import { useState, useRef, useEffect } from "react";
import "../styles/videoEffects.css";

function VideoEffects({ stream, onClose, onEffectChange }) {
  const [activeTab, setActiveTab] = useState('background');
  const [activeEffect, setActiveEffect] = useState('none');
  const [backgroundType, setBackgroundType] = useState('none');
  const [backgroundBlur, setBackgroundBlur] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [selectedStyleEffect, setSelectedStyleEffect] = useState(null);
  const videoRef = useRef();
  const canvasRef = useRef();
  const streamRef = useRef();

  // Background options - Google Meet style
  const backgroundOptions = [
    { id: 'none', name: 'No background', icon: '📷', type: 'none', category: 'none' },
    { id: 'blur-slightly', name: 'Slightly blur', icon: '🌫️', type: 'blur', intensity: 5, category: 'blur' },
    { id: 'blur-moderately', name: 'Blur my background', icon: '🌫️', type: 'blur', intensity: 10, category: 'blur' },
    { id: 'blur-max', name: 'Maximally blur', icon: '🌫️', type: 'blur', intensity: 20, category: 'blur' },
    // Virtual backgrounds
    { id: 'modern-office', name: 'Modern office', icon: '🏢', type: 'image', url: 'https://via.placeholder.com/640x480/cccccc/000000?text=Modern+Office', category: 'virtual' },
    { id: 'home-office', name: 'Home office', icon: '🏠', type: 'image', url: 'https://via.placeholder.com/640x480/e0e0e0/000000?text=Home+Office', category: 'virtual' },
    { id: 'conference-room', name: 'Conference room', icon: '🏛️', type: 'image', url: 'https://via.placeholder.com/640x480/f0f0f0/000000?text=Conference+Room', category: 'virtual' },
    { id: 'beach', name: 'Beach', icon: '🏖️', type: 'image', url: 'https://via.placeholder.com/640x480/87ceeb/000000?text=Beach', category: 'virtual' },
    { id: 'mountains', name: 'Mountains', icon: '🏔️', type: 'image', url: 'https://via.placeholder.com/640x480/90ee90/000000?text=Mountains', category: 'virtual' },
    { id: 'space', name: 'Space', icon: '🌌', type: 'image', url: 'https://via.placeholder.com/640x480/000000/ffffff?text=Space', category: 'virtual' },
    { id: 'sunset', name: 'Sunset', icon: '🌅', type: 'image', url: 'https://via.placeholder.com/640x480/ffa500/000000?text=Sunset', category: 'virtual' },
    { id: 'library', name: 'Library', icon: '📚', type: 'image', url: 'https://via.placeholder.com/640x480/d2b48c/000000?text=Library', category: 'virtual' },
  ];

  // Style effects - Google Meet style
  const styleEffects = [
    { id: 'none', name: 'No effect', icon: '📷', type: 'none' },
    { id: 'brightness-up', name: 'Brighten', icon: '☀️', type: 'filter', filter: 'brightness(120%)' },
    { id: 'brightness-down', name: 'Darken', icon: '🌙', type: 'filter', filter: 'brightness(80%)' },
    { id: 'contrast-up', name: 'Increase contrast', icon: '🔆', type: 'filter', filter: 'contrast(120%)' },
    { id: 'grayscale', name: 'Black & white', icon: '⚫', type: 'filter', filter: 'grayscale(100%)' },
    { id: 'sepia', name: 'Sepia', icon: '📜', type: 'filter', filter: 'sepia(100%)' },
    { id: 'blur-soft', name: 'Soft blur', icon: '💧', type: 'filter', filter: 'blur(2px)' },
    { id: 'hue-rotate', name: 'Color shift', icon: '🌈', type: 'filter', filter: 'hue-rotate(90deg)' },
    { id: 'invert', name: 'Invert colors', icon: '🔄', type: 'filter', filter: 'invert(100%)' },
    { id: 'saturate', name: 'High saturation', icon: '🎨', type: 'filter', filter: 'saturate(150%)' },
  ];

  useEffect(() => {
    if (stream) {
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
    }
  }, [stream]);

  const applyBackgroundEffect = (backgroundId) => {
    const background = backgroundOptions.find(bg => bg.id === backgroundId);
    if (!background) return;

    setSelectedBackground(background);
    setBackgroundType(background.type);

    // Notify parent component of effect change
    if (onEffectChange) {
      onEffectChange({
        type: 'background',
        background: background
      });
    }

    // Apply visual effect to preview
    const videoContainer = videoRef.current?.parentElement;
    if (videoContainer) {
      // Remove existing background classes
      videoContainer.className = videoContainer.className.replace(/bg-\w+/g, '').trim();

      switch (background.type) {
        case 'blur':
          const blurIntensity = background.intensity || 10;
          // Apply blur to the video element itself for better visibility
          const videoElement = videoContainer.querySelector('video');
          if (videoElement) {
            videoElement.style.filter = `blur(${blurIntensity}px)`;
          }
          videoContainer.style.backgroundColor = 'rgba(0,0,0,0.1)';
          videoContainer.style.backgroundImage = 'none';
          videoContainer.style.backdropFilter = 'none';
          break;
        case 'image':
          // For virtual backgrounds, set background image
          videoContainer.style.backgroundImage = `url(${background.url})`;
          videoContainer.style.backgroundSize = 'cover';
          videoContainer.style.backgroundPosition = 'center';
          videoContainer.style.backdropFilter = 'none';
          break;
        case 'none':
        default:
          videoContainer.style.backgroundColor = 'transparent';
          videoContainer.style.backgroundImage = 'none';
          videoContainer.style.backdropFilter = 'none';
          break;
      }
    }
  };

  const applyStyleEffect = (effectId) => {
    const effect = styleEffects.find(e => e.id === effectId);
    if (!effect) return;

    setSelectedStyleEffect(effect);
    setActiveEffect(effect.id);

    const video = videoRef.current;
    if (video) {
      if (effect.type === 'filter') {
        video.style.filter = effect.filter;
      } else {
        video.style.filter = 'none';
      }

      // Notify parent component of effect change
      if (onEffectChange) {
        onEffectChange({
          type: 'style',
          effect: effect
        });
      }
    }
  };

  const applyFilter = (filterType) => {
    setActiveEffect(filterType);
    const video = videoRef.current;
    if (video) {
      let filterString = '';

      // Apply video filter
      switch (filterType) {
        case 'sepia':
          filterString = 'sepia(100%)';
          break;
        case 'grayscale':
          filterString = 'grayscale(100%)';
          break;
        case 'brightness':
          filterString = `brightness(${brightness}%)`;
          break;
        case 'contrast':
          filterString = `contrast(${contrast}%)`;
          break;
        case 'none':
        default:
          filterString = 'none';
          break;
      }

      video.style.filter = filterString;

      // Notify parent component of filter change
      if (onEffectChange) {
        onEffectChange({
          type: 'filter',
          filter: filterType,
          settings: { brightness, contrast, saturation }
        });
      }
    }
  };

  const resetEffects = () => {
    setActiveEffect('none');
    setBackgroundBlur(false);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    if (videoRef.current) {
      videoRef.current.style.filter = 'none';
    }
  };

  return (
    <div className="video-effects">
      <div className="effects-header">
        <div className="header-content">
          <h3>Video effects</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
      </div>

      <div className="effects-content">
        {/* Video Preview */}
        <div className="video-preview">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
          />
          {backgroundBlur && (
            <div className="blur-overlay">
              <span>Background blur applied</span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="effects-tabs">
          <button
            className={`tab-btn ${activeTab === 'background' ? 'active' : ''}`}
            onClick={() => setActiveTab('background')}
          >
            Background
          </button>
          <button
            className={`tab-btn ${activeTab === 'style' ? 'active' : ''}`}
            onClick={() => setActiveTab('style')}
          >
            Style
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'background' && (
            <div className="effects-section">
              <div className="effects-grid">
                {backgroundOptions.map((background) => (
                  <button
                    key={background.id}
                    className={`effect-btn ${selectedBackground?.id === background.id ? 'active' : ''}`}
                    onClick={() => applyBackgroundEffect(background.id)}
                  >
                    <div className="effect-icon">{background.icon}</div>
                    <span>{background.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'style' && (
            <div className="effects-section">
              <div className="effects-grid">
                {styleEffects.map((effect) => (
                  <button
                    key={effect.id}
                    className={`effect-btn ${selectedStyleEffect?.id === effect.id ? 'active' : ''}`}
                    onClick={() => applyStyleEffect(effect.id)}
                  >
                    <div className="effect-icon">{effect.icon}</div>
                    <span>{effect.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Adjustments */}
        <div className="effects-section">
          <h4>Adjustments</h4>
          <div className="adjustments">
            <div className="adjustment-item">
              <label>Brightness</label>
              <input
                type="range"
                min="50"
                max="150"
                value={brightness}
                onChange={(e) => {
                  setBrightness(e.target.value);
                  if (activeEffect === 'brightness') {
                    applyFilter('brightness');
                  }
                }}
              />
              <span>{brightness}%</span>
            </div>

            <div className="adjustment-item">
              <label>Contrast</label>
              <input
                type="range"
                min="50"
                max="150"
                value={contrast}
                onChange={(e) => {
                  setContrast(e.target.value);
                  if (activeEffect === 'contrast') {
                    applyFilter('contrast');
                  }
                }}
              />
              <span>{contrast}%</span>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="effects-actions">
          <button className="reset-btn" onClick={resetEffects}>
            Reset all effects
          </button>
        </div>
      </div>
    </div>
  );
}

export default VideoEffects;
