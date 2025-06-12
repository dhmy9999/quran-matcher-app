import { useState, useRef } from 'react';

export default function Home() {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [freeMinutes, setFreeMinutes] = useState(5);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = event => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      const formData = new FormData();
      formData.append('audio', blob, 'recording.webm');

      const res = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      setTranscript(data.transcript || 'فشل التحويل');
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const watchAd = () => {
    setFreeMinutes(prev => prev + 2);
  };

  return (
    <div className="p-4 max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">تطبيق مطابقة القرآن</h1>
      <p>الدقائق المتاحة: {freeMinutes}</p>
      {!recording ? (
        <button onClick={startRecording} className="bg-blue-600 text-white px-4 py-2 rounded mt-4">🎤 بدء التسجيل</button>
      ) : (
        <button onClick={stopRecording} className="bg-red-600 text-white px-4 py-2 rounded mt-4">⏹️ إيقاف التسجيل</button>
      )}
      <button onClick={watchAd} className="bg-green-600 text-white px-4 py-2 rounded mt-4 ml-2">🎁 شاهد إعلان +2 دقائق</button>

      {audioUrl && (
        <div className="mt-4">
          <audio controls src={audioUrl} className="w-full mt-2"></audio>
        </div>
      )}

      <div className="mt-4">
        <h2 className="text-lg font-semibold">النص الناتج:</h2>
        <p className="bg-gray-100 p-2 rounded mt-2 text-right">{transcript}</p>
      </div>
    </div>
  );
}

import Head from 'next/head';

<Head>
 <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9223643249318579"
     crossorigin="anonymous"></script>
</Head>
