import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Custom hook for fetching Firestore data with loading and error states.
 * Promotes code reuse and better maintainability (Code Quality).
 */
export const useFirestoreCollection = (collectionName, sortField = null) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        let q = collection(db, collectionName);
        if (sortField) {
          q = query(q, orderBy(sortField, 'asc'));
        }
        
        const snapshot = await getDocs(q);
        const fetchedData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        if (isMounted) {
          setData(fetchedData);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, [collectionName, sortField]);

  return { data, loading, error };
};
