import { Trip } from "@/types/database";
import { Lock, LockOpen, Trash2 } from "lucide-react";

interface TripListItemProps {
  trip: Trip;
  onDelete: () => void;
  onSelect: () => void;
  isEditMode: boolean;
}

export default function TripListItem({
  trip,
  onDelete,
  onSelect,
  isEditMode
}: TripListItemProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  }

  return (
    <div className="border rounded-md p-4 flex justify-between items-center group" onClick={onSelect}>
      <div>
        { trip.is_public 
          ? <LockOpen />
          : <Lock />
        }
        <span className="font-semibold text-lg ml-2">{trip.trip_name}</span>
      </div>

      <Trash2 className="group-hover:visible invisible" onClick={(e) => handleDelete(e)} />
    </div>
  )
}

