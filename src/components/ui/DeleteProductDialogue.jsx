import React from "react";

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Delete",
  message = "Are you sure you want to delete this product?",
  subMessage = "The product will be permanently deleted if you choose yes.",
  isLoading = false,
  confirmButtonText = "Yes, Delete",
  cancelButtonText = "Cancel",
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content confirm-dialog">
        <h3>{title}</h3>
        <p>{message}</p>
        {subMessage && <p>{subMessage}</p>}
        <div className="modal-actions">
          <button
            className="delete-button"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : confirmButtonText}
          </button>
          <button
            className="close-button"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
