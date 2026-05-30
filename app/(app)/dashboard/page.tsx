import { createClient as createServerClient } from '@/lib/supabase/server';
import { getByUser } from '@/lib/services/tripService';
import { redirect } from 'next/navigation'
import Link from 'next/link';
import AppHeader from '@/components/ui/AppHeader';
import TripList from '@/components/trips/TripList';
import { Trip } from '@/types/database';

export default async function DashboardPage() {
  const supabase = await createServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  
  if (authError || !user) {
    redirect('/login')
  }

  let tripList: Array<Trip> = []
  try {
    tripList = await getByUser(supabase, user.id)
  } catch {
    return <p>An error occurred. Please try again later.</p>
  }

  return (
    <div>
        <AppHeader />

        {tripList.length === 0 ? (
          <div className='flex flex-col justify-center items-center'>
            <h2 className='font-bold text-lg mb-2'>Create a new journey</h2>

            {/* TODO: refactor with Button component */}
            <Link href='/trips/new' className='px-6 py-2 rounded-md border border-black transition-opacity cursor-pointer text-booking bg-inactive hover:bg-modal-bg'>Add a trip</Link>

            
          </div>
        ) : (
          <TripList trips={tripList} />
        )}
    </div>
  )

}