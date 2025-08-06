import React from 'react';
import { notFound } from 'next/navigation';
import diphthongsData from '../../../data/diphthongs.json';
import BackButton from '../../../components/BackButton';

interface DiphthongDetailPageProps {
  params: {
    id: string;
  };
}

const DiphthongDetailPage: React.FC<DiphthongDetailPageProps> = ({
  params,
}) => {
  const diphthong = diphthongsData.diphthongs.find(
    (d) => d.id === parseInt(params.id)
  );

  if (!diphthong) {
    notFound();
  }

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Diphthong: {diphthong.symbol}</h1>
      <h2>{diphthong.name}</h2>
      <div>
        <h3>Examples:</h3>
        <ul>
          {diphthong.examples.map((example, index) => (
            <li key={index}>{example}</li>
          ))}
        </ul>
      </div>
      <BackButton />
    </main>
  );
};

export default DiphthongDetailPage;
