import React, { useRef, useEffect, useState } from 'react';

interface WatermarkWrapperProps {
  children: React.ReactNode;
}

/**
 * NOTE: This is a CLIENT-SIDE watermark simulation for VISUAL PURPOSES ONLY.
 * As per the project requirements, a real production implementation MUST handle
 * watermarking on the SERVER-SIDE to prevent users from accessing the original,
 * unwatermarked images. This component demonstrates the specified visual layout.
 */
const WatermarkWrapper: React.FC<WatermarkWrapperProps> = ({ children }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (wrapperRef.current) {
        setWidth(wrapperRef.current.offsetWidth);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Also check on image load
    const imgElement = wrapperRef.current?.querySelector('img');
    if (imgElement) {
        imgElement.addEventListener('load', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            imgElement.removeEventListener('load', handleResize);
        }
    }

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const centerFontSize = width * 0.10; // Scaled down for better aesthetics
  const cornerFontSize = width * 0.07; // Scaled down for better aesthetics

  return (
    <div ref={wrapperRef} className="relative w-full h-full overflow-hidden">
      {children}
      <div className="absolute inset-0">
        <div className="watermark watermark-center" style={{ fontSize: `${centerFontSize}px` }}>
          FANN.AE - Preview
        </div>
        <div className="watermark watermark-corner watermark-tl" style={{ fontSize: `${cornerFontSize}px` }}>
          FANN.AE
        </div>
        <div className="watermark watermark-corner watermark-tr" style={{ fontSize: `${cornerFontSize}px` }}>
          FANN.AE
        </div>
        <div className="watermark watermark-corner watermark-bl" style={{ fontSize: `${cornerFontSize}px` }}>
          FANN.AE
        </div>
        <div className="watermark watermark-corner watermark-br" style={{ fontSize: `${cornerFontSize}px` }}>
          FANN.AE
        </div>
      </div>
    </div>
  );
};

export default WatermarkWrapper;
