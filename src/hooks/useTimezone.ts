import { useMemo } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export function useTimezone() {
  // detect dynamically from browser
  const userTimeZone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);

  // local => UTC
  const toUTC = (date: string | undefined, time: string): string => {
    const local = dayjs.tz(`${date} ${time}`, "YYYY-MM-DD HH:mm", userTimeZone);
    return local.utc().format(); // "2025-09-07T13:00:00Z"
  };

  // UTC => local
  const fromUTC = (utcString: string | undefined): string => {
    return dayjs.utc(utcString).tz(userTimeZone).format("YYYY-MM-DD HH:mm");
  };


  const utcToLocalDate = (utcString: string | undefined): string => {
    return dayjs.utc(utcString).tz(userTimeZone).format("YYYY-MM-DD");
  };

  const utcToLocalTime = (utcString: string | undefined): string => {
    return dayjs.utc(`2025-09-13 ${utcString}`).tz(userTimeZone).format("HH:mm:ss");
  };

  const localToUtcTime = (localString?: string): string => {
    if (!localString) return "";
    const dt = dayjs.tz(`2025-09-13 ${localString}`, userTimeZone);
    console.log("localString", localString)
    // if (!dt.isValid()) return "Invalid";
    return dt.utc().format("HH:mm:ss");
  };

  const formatTimeSlot = (start: string, end?: string): string => {
    const inputFormat = "HH:mm:ss";   // 24h input
    const outputFormat = "hh:mm A";   // 12h AM/PM output

    const startTime = dayjs(start, inputFormat);

    if (!end) {
      return startTime.format(outputFormat);
    }

    let endTime = dayjs(end, inputFormat);
    if (endTime.isBefore(startTime)) {
      endTime = endTime.add(1, "day");
    }

    return `${startTime.format(outputFormat)} - ${endTime.format(outputFormat)}`;
  }


  return { userTimeZone, toUTC, fromUTC, utcToLocalDate, utcToLocalTime, localToUtcTime, formatTimeSlot };
}
