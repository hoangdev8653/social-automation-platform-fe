import React from "react";
import { AlertTriangle, X } from "lucide-react";

const ConfirmationModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onClose,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  confirmButtonClass = "bg-red-600 hover:bg-red-700",
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div className="mt-0 text-left flex-1">
            <h3 className="text-lg leading-6 font-bold text-gray-900">
              {title}
            </h3>
            <p className="mt-2 text-sm text-gray-600">{message}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-lg cursor-pointer ${confirmButtonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
