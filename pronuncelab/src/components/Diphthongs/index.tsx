'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './DiphthongsGrid.module.css';

interface Diphthong {
  id: number;
  symbol: string;
  name: string;
  examples: string[];
}

interface DiphthongsGridProps {
  diphthongs: Diphthong[];
}


const DiphthongsGrid: React.FC<DiphthongsGridProps> = ({ diphthongs }) => {
  const router = useRouter();

  const handleDiphthongClick = (id: number) => {
    router.push(`/diphthongs/${id}`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>English Diphthongs</h1>
      <div className={styles.grid}>
        {diphthongs.map((diphthong) => (
          <button
            key={diphthong.id}
            className={styles.gridItem}
            onClick={() => handleDiphthongClick(diphthong.id)}
            aria-label={`Learn about ${diphthong.name} diphthong ${diphthong.symbol}`}
          >
            <div className={styles.symbol}>{diphthong.symbol}</div>
            <div className={styles.name}>{diphthong.name}</div>
            <div className={styles.examples}>
              {diphthong.examples.slice(0, 2).join(', ')}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DiphthongsGrid;

// 'use client';

// import React from 'react';
// import Link from 'next/link';
// import styles from './DiphthongsGrid.module.css';

// interface Diphthong {
//   id: number;
//   symbol: string;
//   name: string;
//   examples: string[];
// }

// interface DiphthongsGridProps {
//   diphthongs: Diphthong[];
// }

// const DiphthongsGrid: React.FC<DiphthongsGridProps> = ({ diphthongs }) => {
//   return (
//     <div className={styles.container}>
//       <h1 className={styles.title}>English Diphthongs</h1>
//       <div className={styles.grid}>
//         {diphthongs.map((diphthong) => (
//           <Link
//             key={diphthong.id}
//             href={`/diphthongs/${diphthong.id}`}
//             className={styles.gridItem}
//             aria-label={`Learn about ${diphthong.name} diphthong ${diphthong.symbol}`}
//           >
//             <div className={styles.symbol}>{diphthong.symbol}</div>
//             <div className={styles.name}>{diphthong.name}</div>
//             <div className={styles.examples}>
//               {diphthong.examples.slice(0, 2).join(', ')}
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

//  export default DiphthongsGrid;

// 'use client';

// import React from 'react';
// import { useRouter } from 'next/navigation';
// import styles from './DiphthongsGrid.module.css';

// interface Diphthong {
//   id: number;
//   symbol: string;
//   name: string;
//   examples: string[];
// }

// interface DiphthongsGridProps {
//   diphthongs: Diphthong[];
// }

// const DiphthongsGrid: React.FC<DiphthongsGridProps> = ({ diphthongs }) => {
//   const router = useRouter();

//   const handleDiphthongClick = (diphthong: Diphthong) => {
//     // Navigate to specific diphthong page with query params
//     router.push(`/diphthongs/${diphthong.id}?symbol=${encodeURIComponent(diphthong.symbol)}`);
//   };

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.title}>English Diphthongs</h1>
//       <div className={styles.grid}>
//         {diphthongs.map((diphthong) => (
//           <button
//             key={diphthong.id}
//             className={styles.gridItem}
//             onClick={() => handleDiphthongClick(diphthong)}
//             aria-label={`Learn about ${diphthong.name} diphthong ${diphthong.symbol}`}
//           >
//             <div className={styles.symbol}>{diphthong.symbol}</div>
//             <div className={styles.name}>{diphthong.name}</div>
//             <div className={styles.examples}>
//               {diphthong.examples.slice(0, 2).join(', ')}
//             </div>
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default DiphthongsGrid;
