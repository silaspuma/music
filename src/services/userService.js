import { db } from '../firebase.config';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

// Get all users sorted by listening time for leaderboard
export const getLeaderboard = async (limitCount = 100) => {
    try {
        const q = query(
            collection(db, 'users'),
            orderBy('listeningMinutes', 'desc'),
            limit(limitCount)
        );
        const querySnapshot = await getDocs(q);
        
        const users = querySnapshot.docs.map((doc, index) => ({
            id: doc.id,
            rank: index + 1,
            username: doc.data().username || 'Anonymous',
            listeningMinutes: doc.data().listeningMinutes || 0,
            email: doc.data().email
        }));
        
        return users;
    } catch (error) {
        console.error('Error getting leaderboard:', error);
        return [];
    }
};
