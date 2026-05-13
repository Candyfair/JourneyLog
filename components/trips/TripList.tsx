import { Trip } from '@/types/database';
import { useState } from 'react';
import TripListItem from './TripListItem';
import Button from '../ui/Button';

interface TripListProps {
  trips: Trip[];
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TripList({ trips, onDelete, onSelect }: TripListProps) {
  const [currentList, setCurrentList] = useState(trips);
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <div className='flex justify-end items-center flex-col'>
      <Button
        variant='primary'
        onClick={() => setIsEditMode(!isEditMode)}
        className='mb-4'
      >
        {isEditMode ? 'Done' : 'Edit'}
      </Button>

      <div>
        {currentList?.map((trip) => (
          <TripListItem
            key={trip.id}
            trip={trip}
            onDelete={() => onDelete(trip.id)}
            onSelect={() => onSelect(trip.id)}
            isEditMode={isEditMode}
          />
        ))}
      </div>
    </div>
  );
}
