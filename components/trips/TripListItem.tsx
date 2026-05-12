import { Trip } from "@/types/database";
import { Lock, LockOpen, Trash2, GripVertical } from "lucide-react";
import { useSwipeable } from 'react-swipeable';

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

  const swipeHandlers = useSwipeable({
    onSwipedLeft: onDelete
  });

  return (
    <div {...swipeHandlers} className="border rounded-md p-4 flex justify-between items-center group" onClick={onSelect}>
      <div>
        { 
          isEditMode && <GripVertical className="mr-3" />
        }

        { 
          trip.is_public 
            ? <LockOpen />
            : <Lock />
        }
        
        <span className="font-semibold text-lg ml-2">{trip.trip_name}</span>
      </div>

      <Trash2 className="group-hover:visible invisible" onClick={(e) => handleDelete(e)} />
    </div>
  )
}

