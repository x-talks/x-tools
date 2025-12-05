
import { useState, useRef, useEffect } from 'react';
import { Mic, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';

// Type definition for the Web Speech API
interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
}

interface SpeechRecognitionResultList {
    length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
    isFinal: boolean;
    length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    abort(): void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: any) => void;
    onend: () => void;
}

declare global {
    interface Window {
        SpeechRecognition: new () => SpeechRecognition;
        webkitSpeechRecognition: new () => SpeechRecognition;
    }
}

interface VoiceInputProps {
    onTranscript: (text: string) => void;
    className?: string;
    variant?: 'ghost' | 'outline' | 'secondary';
}

export function VoiceInput({ onTranscript, className, variant = 'ghost' }: VoiceInputProps) {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    // Initialize recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true; // Keep listening
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onresult = (event: SpeechRecognitionEvent) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }

                if (finalTranscript) {
                    // Send final result
                    onTranscript(finalTranscript + ' ');
                }
            };

            recognition.onerror = (event: any) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
        };
    }, []);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert('Your browser does not support speech recognition. Try Chrome or Edge.');
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            // Need to pass a function to update previous value? No, onTranscript is simple callback.
            // For continuous dictation, we relying on user clicking stop.
            // Actually, we usually want to APPEND text. Parent should handle append logic.
            // Here we just emit the NEW transcript chunks.
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
        return null;
    }

    return (
        <Button
            variant={variant}
            size="sm"
            onClick={toggleListening}
            className={`${isListening ? 'bg-red-100 text-red-600 border-red-200 animate-pulse' : 'text-slate-500'} ${className} `}
            title="Dictate with voice"
        >
            {isListening ? (
                <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Listening...
                </>
            ) : (
                <Mic className="h-4 w-4" />
            )}
        </Button>
    );
}
