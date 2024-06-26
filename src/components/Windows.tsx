import { useState, useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { useWindowLifecycle } from '../hooks/useWindowLifecycle';
import WindowControls from './WindowControls';

type WindowsProps = {
  header: string;
  children?: React.ReactNode;
  id?: string;
  contentId?: string;
  onClose: () => void;
  onDragStop: (e: any, d: any) => void;
  onResizeStop: (e: any,direction: any,ref: any,delta: any,position: any) => void;
  onMinimize: () => void;
  bringToFront: () => void;
  initialSize: { width: number; height: number };
  initialPosition: { x: number; y: number };
  zIndex: number;
};

const Windows: React.FC<WindowsProps> = ({
  header,
  children,
  id,
  contentId,
  onClose,
  onDragStop,
  onResizeStop,
  onMinimize,
  bringToFront,
  initialSize,
  initialPosition,
  zIndex,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [size, setSize] = useState({ width: initialSize.width, height: initialSize.height });
  const [position, setPosition] = useState(initialPosition);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);

  const { isHidden, isClosing, isMinimizing, handleClose, handleMinimize } = 
    useWindowLifecycle(onClose, onMinimize);

  const windowRef = useRef<HTMLDivElement>(null);

  const handleToggleFullscreen = () => {
    setIsFullscreen((prev) => {
      const newFullscreen = !prev;
      if (newFullscreen) {
        setSize({ width: window.innerWidth, height: window.innerHeight - 90 });
        setPosition({ x: 0, y: 0 });
      } else {
        const newSize = { width: window.innerWidth * 0.6, height: window.innerHeight * 0.6 };
        setSize(newSize);
        setPosition({
          x: (window.innerWidth - newSize.width) / 2,
          y: (window.innerHeight - newSize.height) / 2,
        });
      }
      return newFullscreen;
    });
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 500);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Rnd
      size={{ width: size.width, height: size.height }}
      position={{ x: position.x, y: position.y }}
      minWidth={300}
      minHeight={200}
      dragHandleClassName="window-header"
      onDragStart={() => bringToFront()}
      onDragStop={(e, d) => {
        if (!isMobile) {
          setPosition({ x: d.x, y: d.y });
          onDragStop(e, d);
        }
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        if (!isMobile) {
          const newSize = {
            width: parseInt(ref.style.width, 10),
            height: parseInt(ref.style.height, 10),
          };
          setSize(newSize);
          setPosition(position);
          onResizeStop(e, direction, ref, delta, position);
        }
      }}
      style={{ zIndex: zIndex }}
      enableResizing={isMobile ? false : {
        bottom: true,
        bottomRight: true,
        bottomLeft: true,
        top: true,
        topRight: true,
        topLeft: true,
        left: true,
        right: true,
      }}
      disableDragging={isMobile}
    >
      <div
        ref={windowRef}
        className={`window ${isClosing ? 'window-closing' : ''} ${
          isMinimizing ? 'window-minimizing' : ''
        } ${isHidden ? 'window-hidden' : ''}`}
        id={id}
        onMouseDown={() => bringToFront()}
      >
        <div className="window-header">
          <h3>{header}</h3>
          <WindowControls
            isFullscreen={isFullscreen}
            toggleFullscreen={handleToggleFullscreen}
            handleMinimize={handleMinimize}
            handleClose={handleClose}
          />
        </div>
        <div className="window-content" id={contentId}>
          {children}
        </div>
      </div>
    </Rnd>
  );
};

export default Windows;
