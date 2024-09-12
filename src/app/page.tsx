import FeatureRequestForm from '../components/FeatureRequestForm';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-8">Feature Request App</h1>
      <FeatureRequestForm />
    </main>
  );
}
