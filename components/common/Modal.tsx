import { X } from "lucide-react";
import { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

export const Modal = ({ children, onClose }: ModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 h-full w-full backdrop-blur-sm">
      <div className="bg-transparent p-6 w-full max-w-5xl h-4/5 rounded-lg relative rounded-md">
        <button
          className="bg-white rounded-full text-center absolute top-5.5 opacity-80 hover:opacity-100 -right-5 text-xl h-8 w-8 rounded "
          onClick={onClose}
        >
          <X className="relative text-gray-700 -right-1.5" size={20} />
        </button>
        {children}
      </div>
    </div>
  );
};
