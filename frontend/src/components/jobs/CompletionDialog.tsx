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

interface CompletionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function CompletionDialog({ isOpen, onOpenChange, onConfirm, isLoading }: CompletionDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Pekerjaan Selesai?</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin mitra telah menyelesaikan pekerjaan ini dengan baik? Anda akan diarahkan ke halaman pembayaran jika ada tagihan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel disabled={isLoading} className="rounded-xl">Belum Selesai</AlertDialogCancel>
          <AlertDialogAction 
            disabled={isLoading} 
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            className="rounded-xl"
          >
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Ya, Selesai"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
