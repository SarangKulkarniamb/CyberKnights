import { useState, useEffect } from "react";

export const CountDown = ({ time, onComplete }) => {
  // Calculate remaining time as an object or null if time is up.
  const calculateTimeLeft = () => {
    const difference = new Date(time) - new Date();
    if (difference <= 0) return null;
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      if (!newTimeLeft) {
        clearInterval(timer);
        onComplete && onComplete();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [time, onComplete]);

  if (!timeLeft) {
    return <div>Unlocked!</div>;
  }

  return (
    <div className="text-xl font-bold">
      {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
    </div>
  );
};
