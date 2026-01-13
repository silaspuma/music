import React, { useState, useEffect } from 'react';
import { X, Music, CheckCircle } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import { useAuth } from '../contexts/AuthContext';

const RequestArtistModal = ({ isOpen, onClose }) => {
    const [artistName, setArtistName] = useState('');
    const [progress, setProgress] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { currentUser, userProfile } = useAuth();

    useEffect(() => {
        let interval;
        if (isSubmitting) {
            const startTime = Date.now();
            const duration = 10000; // 10 seconds

            interval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const newProgress = Math.min((elapsed / duration) * 100, 100);
                setProgress(newProgress);

                if (newProgress >= 100) {
                    clearInterval(interval);
                    submitRequest();
                }
            }, 50);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isSubmitting]);

    const submitRequest = async () => {
        try {
            const requestData = {
                artistName: artistName.trim(),
                status: 'pending',
                createdAt: serverTimestamp()
            };

            // Add user info if logged in, otherwise mark as anonymous
            if (currentUser) {
                requestData.requestedBy = currentUser.uid;
                requestData.requestedByEmail = currentUser.email;
                requestData.requestedByUsername = userProfile?.username || currentUser.email?.split('@')[0] || 'Anonymous';
            } else {
                requestData.requestedBy = 'anonymous';
                requestData.requestedByEmail = 'anonymous';
                requestData.requestedByUsername = 'Anonymous';
            }

            await addDoc(collection(db, 'artistRequests'), requestData);
            setSubmitted(true);
            setTimeout(() => {
                handleClose();
            }, 2000);
        } catch (error) {
            console.error('Error submitting request:', error);
            alert('Failed to submit request. Please try again.');
            setIsSubmitting(false);
            setProgress(0);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!artistName.trim()) return;
        setIsSubmitting(true);
    };

    const handleCancel = () => {
        if (isSubmitting) {
            setIsSubmitting(false);
            setProgress(0);
        }
    };

    const handleClose = () => {
        setArtistName('');
        setProgress(0);
        setIsSubmitting(false);
        setSubmitted(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-[#181818] rounded-lg max-w-md w-full p-6 relative">
                <button
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="absolute top-4 right-4 text-[#b3b3b3] hover:text-white transition-colors disabled:opacity-50"
                >
                    <X size={24} />
                </button>

                {submitted ? (
                    <div className="text-center py-8">
                        <CheckCircle size={64} className="text-[#ff6b1a] mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Request Submitted!</h2>
                        <p className="text-[#b3b3b3]">Your artist request has been sent to the admin.</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ff6b1a] to-[#ff8c42] flex items-center justify-center">
                                <Music size={24} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Request Artist</h2>
                                <p className="text-sm text-[#b3b3b3]">Suggest a new artist for Pumafy</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Artist Name</label>
                                <input
                                    type="text"
                                    value={artistName}
                                    onChange={(e) => setArtistName(e.target.value)}
                                    disabled={isSubmitting}
                                    className="w-full bg-[#282828] border border-[#3e3e3e] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff6b1a] transition-colors disabled:opacity-50"
                                    placeholder="Enter artist name"
                                    required
                                />
                            </div>

                            {isSubmitting && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#b3b3b3]">Submitting request...</span>
                                        <span className="text-white font-medium">{Math.round(progress)}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-[#282828] rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-[#ff6b1a] to-[#ff8c42] transition-all duration-100"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3">
                                {isSubmitting ? (
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="flex-1 bg-[#282828] hover:bg-[#3e3e3e] text-white font-bold py-3 rounded-full transition-colors"
                                    >
                                        Cancel
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            onClick={handleClose}
                                            className="flex-1 bg-[#282828] hover:bg-[#3e3e3e] text-white font-bold py-3 rounded-full transition-colors"
                                        >
                                            Close
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={!artistName.trim()}
                                            className="flex-1 bg-[#ff6b1a] hover:bg-[#ff8c42] text-white font-bold py-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Submit Request
                                        </button>
                                    </>
                                )}
                            </div>
                        </form>

                        {!isSubmitting && (
                            <p className="text-xs text-[#b3b3b3] text-center mt-4">
                                We will add all of the artist's songs in 1-3 business days after approval.
                            </p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default RequestArtistModal;
