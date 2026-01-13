import React, { useEffect, useState } from 'react';
import { isArtistVerified } from '../services/artistService';
import { ShieldCheck } from 'lucide-react';

const VerifiedBadge = ({ artistName, size = 16, className = "" }) => {
    const [isVerified, setIsVerified] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkVerification = async () => {
            if (!artistName) {
                setLoading(false);
                return;
            }
            const verified = await isArtistVerified(artistName);
            setIsVerified(verified);
            setLoading(false);
        };
        checkVerification();
    }, [artistName]);

    if (loading || !isVerified) return null;

    return (
        <ShieldCheck 
            size={size} 
            className={`text-[#3d91f4] flex-shrink-0 ${className}`}
            title="Verified Artist"
        />
    );
};

export default VerifiedBadge;
