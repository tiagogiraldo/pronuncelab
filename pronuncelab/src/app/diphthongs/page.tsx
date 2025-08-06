// In your app/diphthongs/page.tsx
import React from 'react';
import DiphthongsGrid from '../../components/Diphthongs';
import diphthongsData from '../../data/diphthongs.json';

const DiphthongsPage: React.FC = () => {
  // Sanitize the data to prevent serialization issues
  const sanitizedData = JSON.parse(JSON.stringify(diphthongsData));
  
  return (
    <main>
      <DiphthongsGrid diphthongs={sanitizedData.diphthongs} />
    </main>
  );
};

export default DiphthongsPage;




