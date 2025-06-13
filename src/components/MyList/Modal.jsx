// components/Modal.jsx
import React from 'react';
import { X } from 'lucide-react';
import './Modal.css'; // You'll need to create this CSS file for styling

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header du modal */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-linear-to-r from-blue-500 to-purple-600 text-white">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contenu du modal */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {children}
        </div>

        {/* Footer du modal (optionnel, mais utile si vous avez des actions globales) */}
        {/* Vous pouvez ajouter un footer ici si nécessaire, ou le laisser gérer par le contenu spécifique */}
      </div>
    </div>
  );
};

export default Modal;