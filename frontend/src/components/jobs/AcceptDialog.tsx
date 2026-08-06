import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

interface AcceptDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function AcceptDialog({ isOpen, onOpenChange, onConfirm, isLoading }: AcceptDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Terima Pekerjaan Ini?</AlertDialogTitle>
          <AlertDialogDescription>
            Anda akan bertanggung jawab penuh atas pekerjaan ini. Pastikan Anda dapat menyelesaikannya dengan baik.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel disabled={isLoading} className="rounded-xl">Batal</AlertDialogCancel>
          <AlertDialogAction 
            disabled={isLoading} 
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            className="rounded-xl"
          >
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Ya, Terima Pekerjaan"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
