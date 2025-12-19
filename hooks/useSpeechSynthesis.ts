
import { useState, useEffect, useCallback, useRef } from 'react';

const languageMap: { [key: string]: { lang: string; text: string } } = {
  'Assamese': { lang: 'hi-IN', text: 'নমস্কাৰ, মই আপোনাক কেনেকৈ সহায় কৰিব পাৰোঁ?' }, 
  'Bengali': { lang: 'bn-IN', text: 'নমস্কার, আমি আপনাকে কিভাবে সাহায্য করতে পারি?' },
  'Gujarati': { lang: 'gu-IN', text: 'નમસ્તે, હું તમારી કેવી રીતે મદદ કરી શકું?' },
  'Hindi': { lang: 'hi-IN', text: 'नमस्ते, मैं आपकी क्या सहायता कर सकता हूँ?' },
  'Kannada': { lang: 'kn-IN', text: 'ನಮಸ್ಕಾರ, ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?' },
  'Malayalam': { lang: 'ml-IN', text: 'നമസ്കാരം, ഞാൻ നിങ്ങളെ എങ്ങനെ സഹായിക്കും?' },
  'Marathi': { lang: 'mr-IN', text: 'नमस्कार, मी तुम्हाला कशी मदत करू शकतो?' },
  'Tamil': { lang: 'ta-IN', text: 'வணக்கம், நான் உங்களுக்கு எப்படி உதவ முடியும்?' },
  'Telugu': { lang: 'te-IN', text: 'నమస్కారం, నేను మీకు ఎలా సహాయం చేయగలను?' },
  'Urdu': { lang: 'ur-PK', text: 'ہیلو، میں آپ کی کس طرح مدد کر سکتا ہوں؟' },
  'English': { lang: 'en-US', text: 'Hello, how can I assist you today?' },
  'Mandarin-Chinese': { lang: 'zh-CN', text: '你好，我今天能为您做些什么？' },
  'Spanish': { lang: 'es-ES', text: 'Hola, ¿en qué puedo ayudarte hoy?' },
  'Arabic': { lang: 'ar-SA', text: 'مرحبا، كيف يمكنني مساعدتك اليوم؟' },
  'French': { lang: 'fr-FR', text: 'Bonjour, comment puis-je vous aider aujourd\'hui ?' },
  'Russian': { lang: 'ru-RU', text: 'Здравствуйте, чем я могу вам помочь сегодня?' },
  'Portuguese': { lang: 'pt-BR', text: 'Olá, como posso ajudá-lo hoje?' },
  'German': { lang: 'de-DE', text: 'Hallo, wie kann ich Ihnen heute helfen?' },
  'Japanese': { lang: 'ja-JP', text: 'こんにちは、今日はどのようにお手伝いできますか？' },
  'Korean': { lang: 'ko-KR', text: '안녕하세요, 오늘 무엇을 도와드릴까요?' },
};

export const useSpeechSynthesis = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synth = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setIsSupported(true);
      synth.current = window.speechSynthesis;
    }
  }, []);

  const speak = useCallback((text: string, lang: string) => {
    if (!synth.current) return;
    
    // Stop any existing speech
    synth.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synth.current.speak(utterance);
  }, []);

  const cancel = useCallback(() => {
    if (synth.current) {
      synth.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const getLanguageData = (agentName: string) => {
    const langKey = Object.keys(languageMap).find(key => agentName.toLowerCase().includes(key.toLowerCase()));
    return langKey ? languageMap[langKey] : null;
  };

  return { speak, cancel, isSpeaking, getLanguageData, isSupported };
};
