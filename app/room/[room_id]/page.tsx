import Main from '@/app/room/_components/Main';
import RoomHandeler from '../_components/RoomHandeler';
import { auth } from '@/auth';

export default async function page({ params }: { params: { room_id: string } }) {
  const session = await auth()
  return (
    <div className="flex flex-col  items-center justify-center p-10 h-screen w-screen">
      <RoomHandeler roomId={params.room_id} />
      <Main user={session?.user} />
    </div>
  );
}