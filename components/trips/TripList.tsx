'use client'

import { Trip } from '@/types/database';
import { useState } from 'react';
import TripListItem from './TripListItem';
import Button from '../ui/Button';
import { useRouter } from 'next/navigation';

interface TripListProps {
  trips: Trip[];
}

export default function TripList({ trips }: TripListProps) {
  const router = useRouter();

  const [currentList, setCurrentList] = useState(trips);
  const [isEditMode, setIsEditMode] = useState(false);

  const onSelect = (id: number) => {
    router.push(`/trips/${id}`)
  }

  const onDelete = async (id: number) => {
    await fetch(`/api/trips/${id}`, { method: 'DELETE' })
    setCurrentList(currentList.filter(trip => trip.id !== id))
  }

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
