import { Button } from "@/components/ui/button";
import { Job } from "@/types";
import { Loader2, Navigation, MapPin, Wrench, ShieldCheck } from "lucide-react";

interface StatusButtonGroupProps {
  status: Job["status"];
  onUpdate: (newStatus: Job["status"]) => void;
  isLoading: boolean;
}

export function StatusButtonGroup({ status, onUpdate, isLoading }: StatusButtonGroupProps) {
  if (status === "ACCEPTED") {
    return (
      <Button 
        className="w-full rounded-xl shadow-md" 
        size="lg" 
        onClick={() => onUpdate("ON_THE_WAY")}
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Navigation className="w-4 h-4 mr-2" />}
        Mulai Perjalanan
      </Button>
    );
  }

  if (status === "ON_THE_WAY") {
    return (
      <Button 
        className="w-full rounded-xl shadow-md bg-amber-500 hover:bg-amber-600 text-white" 
        size="lg" 
        onClick={() => onUpdate("WORKING")}
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wrench className="w-4 h-4 mr-2" />}
        Mulai Bekerja
      </Button>
    );
  }

  if (status === "WORKING") {
    return (
      <Button 
        className="w-full rounded-xl shadow-md bg-green-600 hover:bg-green-700 text-white" 
        size="lg" 
        onClick={() => onUpdate("WAITING_CONFIRMATION")}
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
        Selesaikan Pekerjaan
      </Button>
    );
  }

  if (status === "WAITING_CONFIRMATION") {
    return (
      <div className="p-4 bg-muted text-muted-foreground rounded-xl text-center text-sm font-medium border border-dashed">
        Menunggu Konfirmasi dari Konsumen...
      </div>
    );
  }

  return null;
}

