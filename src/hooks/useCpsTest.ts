import { useState, useEffect, useRef, useCallback } from 'react';

export type TestStatus = 'idle' | 'running' | 'finished';

export function useCpsTest(durationSeconds: number) {
  const [status, setStatus] = useState<TestStatus>('idle');
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [cps, setCps] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const lastClickTimeRef = useRef<number>(0);

  const resetTest = useCallback(() => {
    setStatus('idle');
    setClicks(0);
    setTimeLeft(durationSeconds === 0 ? 0 : durationSeconds);
    setCps(0);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [durationSeconds]);

  // Handle duration change
  useEffect(() => {
    resetTest();
  }, [durationSeconds, resetTest]);

  const handleClick = useCallback(() => {
    if (status === 'finished') return;

    const now = Date.now();
    lastClickTimeRef.current = now;

    if (status === 'idle') {
      setStatus('running');
      startTimeRef.current = now;
      
      timerRef.current = setInterval(() => {
        const currentTime = Date.now();
        const elapsed = (currentTime - startTimeRef.current) / 1000;
        
        if (durationSeconds === 0) {
          // Modalità Infinita
          setTimeLeft(elapsed);
          
          // Se non clicca per 1 secondo intero
          if (currentTime - lastClickTimeRef.current >= 1000) {
             if (timerRef.current) clearInterval(timerRef.current);
             
             // Ricalcola il tempo effettivo togliendo il secondo di inattività
             // in modo che il calcolo dei CPS sia preciso basandosi sull'ultimo click reale
             const actualElapsed = Math.max(0.1, (lastClickTimeRef.current - startTimeRef.current) / 1000);
             setTimeLeft(actualElapsed);
             
             setStatus('finished');
          }
        } else {
          // Modalità Normale
          const newTimeLeft = Math.max(0, durationSeconds - elapsed);
          setTimeLeft(newTimeLeft);
          if (newTimeLeft <= 0) {
            if (timerRef.current) clearInterval(timerRef.current);
            setStatus('finished');
          }
        }
      }, 50); // Update frequently for smooth timer
    }

    setClicks((prev) => prev + 1);
  }, [status, durationSeconds]);

  // Update CPS live
  useEffect(() => {
    if (status === 'running') {
      const elapsed = durationSeconds === 0 ? timeLeft : (durationSeconds - timeLeft);
      if (elapsed > 0) {
        setCps(Number((clicks / elapsed).toFixed(2)));
      }
    } else if (status === 'finished') {
      const totalTime = durationSeconds === 0 ? timeLeft : durationSeconds;
      setCps(Number((clicks / (totalTime > 0 ? totalTime : 1)).toFixed(2)));
    }
  }, [clicks, timeLeft, status, durationSeconds]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return {
    status,
    clicks,
    timeLeft,
    cps,
    handleClick,
    resetTest,
  };
}
