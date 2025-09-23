import dynamic from 'next/dynamic';

const DashboardPage = dynamic(() => import('@/components/pages/DashboardPage'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function Page() {
  return <DashboardPage />;
}