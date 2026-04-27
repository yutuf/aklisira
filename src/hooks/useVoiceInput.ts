import { useState, useEffect, useCallback, useRef } from 'react';

export const useVoiceInput = () => {
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSupported, setIsSupported] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        if (typeof window !== 'undefined' && navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
            setIsSupported(true);
        }
    }, []);

    const startListening = useCallback(async () => {
        if (!isSupported) {
            alert('Mikrofon erişimi bu tarayıcıda desteklenmiyor.');
            return;
        }

        setError(null);
        audioChunksRef.current = [];

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                setIsListening(false);
                setIsProcessing(true);

                try {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    
                    // Convert blob to base64 Data URI
                    const reader = new FileReader();
                    reader.readAsDataURL(audioBlob);
                    
                    reader.onloadend = async () => {
                        const base64Audio = reader.result as string;

                        // Send to our backend proxy
                        const response = await fetch('/api/transcribe', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ audioData: base64Audio })
                        });

                        const data = await response.json();

                        if (!response.ok) {
                            console.error('Backend returned error:', data);
                            const detailedMessage = data.details ? JSON.stringify(data.details) : '';
                            throw new Error(data.error + ' ' + detailedMessage);
                        }

                        setTranscript(data.text);
                    };

                    reader.onerror = () => {
                        throw new Error('Ses dosyası dönüştürülemedi.');
                    };

                } catch (err: any) {
                    console.error('Transcription error:', err);
                    setError(err.message || 'Bir hata oluştu.');
                    alert(`Ses tanıma hatası: ${err.message || 'Bilinmeyen hata'}`);
                } finally {
                    setIsProcessing(false);
                    // Stop all microphone tracks
                    stream.getTracks().forEach(track => track.stop());
                }
            };

            mediaRecorder.start();
            setIsListening(true);
        } catch (err) {
            console.error('Mic access error:', err);
            alert('Mikrofon erişimi reddedildi veya bulunamadı. Lütfen tarayıcı ayarlarını kontrol edin.');
            setIsListening(false);
        }
    }, [isSupported]);

    const stopListening = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
    }, []);

    return { 
        isListening, 
        isProcessing, 
        transcript, 
        startListening, 
        stopListening, 
        error, 
        isSupported, 
        setTranscript 
    };
};
