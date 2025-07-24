'use client';

import { Layout } from '@/components/layout/Layout';
import { ReservationManager } from '@/components/reservations/ReservationManager';

// Mock user data
const mockUser = {
  id: '1',
  name: 'João Silva',
  email: 'joao@email.com',
  role: 'admin' as const,
  avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20business%20man%20avatar%20portrait&image_size=square',
};

export default function ReservationsPage() {
  return (
    <Layout user={mockUser}>
      <ReservationManager />
    </Layout>
  );
}