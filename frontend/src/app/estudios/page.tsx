import dynamic from 'next/dynamic';

const EstudiosPage = dynamic(() => import('@/components/pages/EstudiosPage'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function Page() {
  return <EstudiosPage />;
}