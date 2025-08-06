'use client';

import React, { useState, useRef } from 'react';
import BackButton from '../../components/BackButton';

interface DiphthongClientProps {
  diphthong: {
    id: number;
    symbol: string;
    name: string;
    description: string;
    examples: string[];
  };
}

declare global {
  interface Window {
    webkitSpeechRecognition: typeof SpeechRecognition;
    SpeechRecognition: typeof SpeechRecognition;
  }
}

const DiphthongClient: React.FC<DiphthongClientProps> = ({ diphthong }) => {
  const [recordings, setRecordings] = useState<{ [key: string]: string }>({});
  const [isRecording, setIsRecording] = useState<{ [key: string]: boolean }>({});
  const [transcriptions, setTranscriptions] = useState<{ [key: string]: string }>({});
  const [isListening, setIsListening] = useState<{ [key: string]: boolean }>({});
  const [isSpeaking, setIsSpeaking] = useState<{ [key: string]: boolean }>({});
  
  const mediaRecorderRef = useRef<{ [key: string]: MediaRecorder }>({});
  const recognitionRef = useRef<{ [key: string]: SpeechRecognition }>({});

  // All your existing functions (speakWord, startRecording, etc.) go here
    const speakWord = (word: string) => {
    if (!('speechSynthesis' in window)) {
        alert('Text-to-speech is not supported in your browser');
        return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    setIsSpeaking(prev => ({ ...prev, [word]: true }));

    const speak = () => {
        const utterance = new SpeechSynthesisUtterance(word);
        
        // Basic utterance settings
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 1;
        utterance.lang = 'en-US';

        // Improved voice selection
        const voices = window.speechSynthesis.getVoices();
        console.log('Available voices:', voices.length);
        
        if (voices.length > 0) {
        // Try to find a good English voice, fallback to first available
        const englishVoice = voices.find(voice => 
            voice.lang.startsWith('en') && !voice.name.includes('Google')
        ) || voices.find(voice => 
            voice.lang.startsWith('en')
        ) || voices; // Always have a fallback
        
        if (englishVoice) {
            utterance.voice = englishVoice;
            console.log('Selected voice:', englishVoice.name, englishVoice.lang);
        }
        }

        // Event handlers
        utterance.onstart = () => {
        console.log('Speech started for:', word);
        };

        utterance.onend = () => {
        console.log('Speech ended for:', word);
        setIsSpeaking(prev => ({ ...prev, [word]: false }));
        };

        utterance.onerror = (event) => {
        console.error('Speech error:', event.error, 'for word:', word);
        setIsSpeaking(prev => ({ ...prev, [word]: false }));
        
        // Try again with default voice if it was a voice-related error
        if (event.error === 'synthesis-failed' && utterance.voice) {
            console.log('Retrying with default voice...');
            const retryUtterance = new SpeechSynthesisUtterance(word);
            retryUtterance.rate = 0.8;
            retryUtterance.pitch = 1;
            retryUtterance.volume = 1;
            retryUtterance.lang = 'en-US';
            // Don't set a specific voice, let browser choose default
            
            retryUtterance.onend = () => {
            setIsSpeaking(prev => ({ ...prev, [word]: false }));
            };
            
            retryUtterance.onerror = () => {
            setIsSpeaking(prev => ({ ...prev, [word]: false }));
            alert('Text-to-speech failed. Please try again.');
            };
            
            setTimeout(() => {
            window.speechSynthesis.speak(retryUtterance);
            }, 100);
        }
        };

        // Start speaking
        try {
        window.speechSynthesis.speak(utterance);
        } catch (error) {
        console.error('Failed to start speech synthesis:', error);
        setIsSpeaking(prev => ({ ...prev, [word]: false }));
        alert('Failed to start text-to-speech. Please try again.');
        }
    };

    // Handle voice loading
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
        console.log('Waiting for voices to load...');
        
        let voicesLoadedHandler: (() => void) | null = null;
        let timeoutId: NodeJS.Timeout | null = null;
        
        const cleanup = () => {
        if (voicesLoadedHandler) {
            window.speechSynthesis.removeEventListener('voiceschanged', voicesLoadedHandler);
        }
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        };
        
        voicesLoadedHandler = () => {
        console.log('Voices loaded:', window.speechSynthesis.getVoices().length);
        cleanup();
        speak();
        };
        
        window.speechSynthesis.addEventListener('voiceschanged', voicesLoadedHandler);
        
        // Fallback timeout
        timeoutId = setTimeout(() => {
        console.log('Timeout waiting for voices, trying anyway...');
        cleanup();
        speak();
        }, 2000);
    } else {
        speak();
    }
    };


  const startRecording = async (word: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordings(prev => ({ ...prev, [word]: audioUrl }));
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current[word] = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(prev => ({ ...prev, [word]: true }));

    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = (word: string) => {
    const mediaRecorder = mediaRecorderRef.current[word];
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(prev => ({ ...prev, [word]: false }));
    }
  };

  const playRecording = (word: string) => {
    const audioUrl = recordings[word];
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const startSpeechToText = (word: string) => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(prev => ({ ...prev, [word]: true }));
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
    //   const transcript = event.results.transcript;
      const transcript = event.results[0][0].transcript;

      setTranscriptions(prev => ({ ...prev, [word]: transcript }));
      setIsListening(prev => ({ ...prev, [word]: false }));
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(prev => ({ ...prev, [word]: false }));
    };

    recognition.onend = () => {
      setIsListening(prev => ({ ...prev, [word]: false }));
    };

    recognitionRef.current[word] = recognition;
    recognition.start();
  };

  return (
    <main className="p-8 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Diphthong: <span className="text-blue-600">{diphthong.symbol}</span>
        </h1>
        <h2 className="text-2xl text-gray-600 mb-4">{diphthong.name}</h2>
        <p className="text-gray-700 mb-6">{diphthong.description}</p>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Examples:</h3>
          <div className="grid gap-4">
            {diphthong.examples.map((example, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-medium text-gray-800">{example}</span>
                  
                  <button
                    onClick={() => speakWord(example)}
                    disabled={isSpeaking[example]}
                    className={`px-3 py-2 rounded-md transition-colors duration-200 flex items-center gap-2 ${
                      isSpeaking[example]
                        ? 'bg-blue-400 text-white cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.812L4.617 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.617l3.766-3.812a1 1 0 01.617-.312zM12 6.5a1 1 0 011.414 0L15 8.086l1.586-1.586A1 1 0 0118 7.914L16.414 9.5 18 11.086a1 1 0 01-1.414 1.414L15 10.914l-1.586 1.586A1 1 0 0112 11.086L13.586 9.5 12 7.914A1 1 0 0112 6.5z" clipRule="evenodd" />
                    </svg>
                    {isSpeaking[example] ? 'Speaking...' : 'Play'}
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-3 items-center">
                  <div className="flex items-center gap-2">
                    {!isRecording[example] ? (
                      <button
                        onClick={() => startRecording(example)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
                      >
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                        Record
                      </button>
                    ) : (
                      <button
                        onClick={() => stopRecording(example)}
                        className="bg-red-700 text-white px-3 py-2 rounded-md flex items-center gap-2 animate-pulse"
                      >
                        <div className="w-3 h-3 bg-white rounded-sm"></div>
                        Stop
                      </button>
                    )}
                    
                    {recordings[example] && (
                      <button
                        onClick={() => playRecording(example)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md transition-colors duration-200"
                      >
                        Play Recording
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => startSpeechToText(example)}
                    disabled={isListening[example]}
                    className={`px-3 py-2 rounded-md transition-colors duration-200 flex items-center gap-2 ${
                      isListening[example]
                        ? 'bg-yellow-500 text-white cursor-not-allowed'
                        : 'bg-purple-500 hover:bg-purple-600 text-white'
                    }`}
                  >
                    {isListening[example] ? (
                      <>
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                        Listening...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                        </svg>
                        Speak to Text
                      </>
                    )}
                  </button>
                </div>

                {transcriptions[example] && (
                  <div className="mt-3 p-3 bg-white border border-gray-300 rounded-md">
                    <span className="text-sm text-gray-600">You said: </span>
                    <span className="font-medium text-gray-800">{transcriptions[example]}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <BackButton />
    </main>
  );
};

export default DiphthongClient;
