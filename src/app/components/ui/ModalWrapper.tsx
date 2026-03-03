interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  canClose?: boolean;
  modalType?: "profile" | "auth";
}

// Modal wrapper komponent
export function ModalWrapper({ isOpen, onClose, children, canClose = true, modalType = "auth" }: ModalWrapperProps) {
  // Ak nie je otvoreny, nevykresluj nic
  if (!isOpen) {
    return null;
  }
  
  // Urcenie background farby
  let bgClass = 'bg-[#1c1c1e]';
  if (modalType === 'profile') {
    bgClass = 'bg-black/40';
  }
  
  // Handler pre kliknutie na backdrop
  const handleBackdropClick = () => {
    if (canClose) {
      onClose();
    }
  };
  
  // Handler pre zastavenie propagacie na children
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  return (
    <div 
      className={'fixed inset-0 backdrop-blur-md z-[100] flex items-center justify-center p-4 ' + bgClass}
      onClick={handleBackdropClick}
    >
      <div onClick={handleContentClick}>
        {children}
      </div>
    </div>
  );
}
