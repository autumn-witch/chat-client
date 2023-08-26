import { randomUUID } from 'crypto';
import Link from 'next/link';

function setRoomRoute(uuid: string): string {
  return `room?roomId=${uuid}`;
}

export default function Home() {
  const uuid = randomUUID();
  return (
    <main>
      <Link href={ setRoomRoute(uuid) }>Créer une room</Link>
		</main>
  )
}
