import { useState, useEffect, useCallback } from 'react';

export const useVoiceInput = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            setIsSupported(true);
        }
    }, []);

    const startListening = useCallback(() => {
        if (!isSupported) {
            alert('Sesli giriş bu tarayıcıda desteklenmiyor. Lütfen Google Chrome kullanın.');
            return;
        }

        // Request mic permission explicitly
        navigator.mediaDevices.getUserMedia({ audio: true }).then(() => {
            const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
            const recognition = new SpeechRecognition();

            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'tr-TR';

            recognition.onstart = () => {
                setIsListening(true);
                setError(null);
            };

            recognition.onresult = (event: any) => {
                const current = event.resultIndex;
                const text = event.results[current][0].transcript;
                setTranscript(text);
            };

            recognition.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error);
                setError(event.error);
                setIsListening(false);

                if (event.error === 'not-allowed') {
                    alert('Mikrofon erişimi reddedildi. Lütfen tarayıcı ayarlarından mikrofon iznini verin.');
                } else if (event.error === 'no-speech') {
                    alert('Ses algılanamadı. Lütfen mikrofona yakın konuşun ve tekrar deneyin.');
                } else if (event.error === 'network') {
                    alert('Ses tanıma servisi bağlantı hatası. İnternet bağlantınızı kontrol edin.');
                }
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognition.start();
        }).catch((err) => {
            console.error('Mic access error:', err);
            alert('Mikrofon erişimi reddedildi. Tarayıcı ayarlarından mikrofon iznini kontrol edin.\n\nAdres çubuğundaki 🔒 simgesine tıklayarak mikrofon iznini "İzin Ver" olarak ayarlayabilirsiniz.');
        });
    }, [isSupported]);

    return { isListening, transcript, startListening, error, isSupported, setTranscript };
};
