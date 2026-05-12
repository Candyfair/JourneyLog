import Button from "./Button";

interface ModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function Modal({
  isOpen,
  message,
  onConfirm,
  onCancel
}: ModalProps) {
  return (
    <>
    { isOpen && <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-modal-bg z-10" onClick={onCancel}>
        <div className="bg-white rounded-md overflow-hidden max-w-md w-full mx-4 p-3 border z-20 flex justify-between items-center flex-col" onClick={(e) => e.stopPropagation()}>
          <span>{message}</span>

          <div className="flex justify-between items-center flex-row">
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>

            <Button variant="primary" onClick={onConfirm}>
              Confirm
            </Button>
          </div>

        </div>
      </div> }
    </>
  )
}