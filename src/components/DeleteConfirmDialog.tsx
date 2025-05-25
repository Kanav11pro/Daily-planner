
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteConfirmDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmDialog = ({ onConfirm, onCancel }: DeleteConfirmDialogProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-scale-in">
        <div className="p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Delete Task
          </h3>
          
          <p className="text-sm text-gray-500 mb-6">
            Are you sure you want to delete this task? This action cannot be undone.
          </p>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1 transition-all duration-200 hover:scale-[1.02]"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1 bg-red-600 hover:bg-red-700 transition-all duration-200 hover:scale-[1.02]"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
