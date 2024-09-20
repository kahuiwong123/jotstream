import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";
import isTomorrow from "dayjs/plugin/isTomorrow";
import { CiCalendar } from "react-icons/ci";

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isTomorrow);
type DateStrirngProps = {
  date: Date;
};

export const DateString = ({ date }: DateStrirngProps): React.JSX.Element => {
  const day = dayjs(date);
  let span: React.JSX.Element;
  if (day.isToday()) {
    span = (
      <>
        <CiCalendar className="text-[#108A31]" />
        <span className="text-[#108A31]">Today</span>
      </>
    );
  } else if (day.isTomorrow()) {
    span = (
      <>
        <CiCalendar className="text-[#C69350]" />
        <span className="text-[#C69350]">Tomorrow</span>
      </>
    );
  } else if (day.isBefore(dayjs())) {
    span = (
      <>
        <CiCalendar className="text-red-400" />
        <span className="text-red-400">Past due</span>
      </>
    );
  } else if (day.isBefore(dayjs().add(7, "day"))) {
    span = (
      <>
        <CiCalendar className="text-[#692EC2]" />
        <span className="text-[#692EC2]">{dayjs(date).format("dddd")}</span>
      </>
    );
  } else {
    span = (
      <>
        <CiCalendar className="text-text-grey" />
        <span className="text-text-grey">{dayjs(date).format("MMM D")}</span>
      </>
    );
  }

  return <p className="flex h-fit items-center gap-1 p-0 text-sm">{span}</p>;
};
