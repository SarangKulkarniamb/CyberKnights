import React, { useState, useEffect } from "react";

export const CountDown = ({ time }) => {
  const calculateTimeLeft = () => {
    const difference = new Date(time) - new Date();
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return null;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [time]);

  return (
    <div className="text-center text-xl font-bold">
      <p className="text-gray-600 mb-2">Countdown to the big reveal:</p>
      {timeLeft ? (
        <p>
          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </p>
      ) : (
        <p>Time has arrived!</p>
      )}
    </div>
  );
};
