import { timeStamp } from "console";
import React, { useEffect } from "react";
import { useState } from "react";
import style from "./Timer.module.scss";

const Timer = () => {
  let timezone = "Asia/Kolkata";

  const [time, setTime] = useState<Date>();

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date(Date.now())), 1000);
    return () => clearInterval(interval);
  }, [time]);
  return (
    <span className={style.p} suppressHydrationWarning>
      {new Intl.DateTimeFormat("en", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: timezone,
      }).format(time)}
    </span>
  );
};

export default Timer;
