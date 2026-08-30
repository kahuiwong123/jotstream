"use client";

import CalendarCard from "@/components/dashboard/calendar/calendar-card";
import { addDays, eachDayOfInterval, startOfDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import dayjs from "dayjs";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const BATCH_SIZE = 7;

function getNextBatch(from: Date, count: number) {
  return eachDayOfInterval({ start: from, end: addDays(from, count - 1) });
}

function Page() {
  const [days, setDays] = useState<Date[]>(() =>
    getNextBatch(startOfDay(new Date()), BATCH_SIZE),
  );
  const sentinelRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLLIElement>>(new Map());
  const pendingScrollKey = useRef<string | null>(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const headerSentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(() => {
    setDays((prev) => {
      const lastDay = prev[prev.length - 1] ?? startOfDay(new Date());
      return [...prev, ...getNextBatch(addDays(lastDay, 1), BATCH_SIZE)];
    });
  }, []);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "300px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  // Toggle isScrolled based on whether a tiny sentinel above the list
  // has scrolled out of view — cheaper than a scroll-position listener.
  useEffect(() => {
    const el = headerSentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsScrolled(!entry.isIntersecting),
      { threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!pendingScrollKey.current) return;
    const node = cardRefs.current.get(pendingScrollKey.current);
    if (node) {
      node.scrollIntoView({ behavior: "smooth", block: "start" });
      pendingScrollKey.current = null;
    }
  }, [days]);

  const handleDateSelect = useCallback((date: Date | undefined) => {
    if (!date) return;
    const target = startOfDay(date);
    const key = target.toISOString();

    setDays((prev) => {
      const first = prev[0];
      const last = prev[prev.length - 1];

      if (target >= first && target <= last) return prev;

      if (target < first) {
        const missing = eachDayOfInterval({
          start: target,
          end: addDays(first, -1),
        });
        return [...missing, ...prev];
      }

      const missing = eachDayOfInterval({
        start: addDays(last, 1),
        end: target,
      });
      return [...prev, ...missing];
    });

    const node = cardRefs.current.get(key);
    if (node) {
      node.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      pendingScrollKey.current = key;
    }
  }, []);

  const scrollToTop = useCallback(() => {
    headerSentinelRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);
  return (
    <div>
      {/* 1px sentinel that sits right where the header starts.
          When it scrolls out of view, we know the user has started scrolling. */}
      <div ref={headerSentinelRef} className="h-px" />

      <div
        className={
          isScrolled
            ? "fixed left-1/2 top-4 z-50 -translate-x-1/2 transition-all duration-200"
            : "relative transition-all duration-200"
        }
      >
        <Popover>
          <PopoverTrigger
            className={
              isScrolled
                ? "flex items-center gap-2 rounded-lg bg-white-main px-4 py-1 shadow-md dark:bg-dark-main"
                : "flex items-center gap-2"
            }
          >
            {dayjs(new Date()).format("MMMM YYYY")}
            <ChevronDown className="size-4" />
          </PopoverTrigger>
          <PopoverContent>
            <Card className="mx-auto w-fit rounded-lg">
              <CardContent>
                <Calendar
                  mode="single"
                  onSelect={handleDateSelect}
                  className="p-0"
                />
              </CardContent>

              <CardFooter className="flex flex-wrap gap-2 border-t pt-3">
                {[
                  { label: "Today", value: 0 },

                  { label: "Tomorrow", value: 1 },

                  { label: "In 3 days", value: 3 },

                  { label: "In a week", value: 7 },

                  { label: "In 2 weeks", value: 14 },
                ].map((preset) => (
                  <Button
                    key={preset.value}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      const newDate = addDays(new Date(), preset.value);

                      handleDateSelect(newDate);
                    }}
                  >
                    {preset.label}
                  </Button>
                ))}
              </CardFooter>
            </Card>
          </PopoverContent>
        </Popover>
      </div>

      {/* Reserve space so content doesn't jump when header goes fixed */}
      {isScrolled && <div className="h-12" />}

      <ul className="flex flex-col gap-4 pt-8">
        {days.map((date) => {
          const key = date.toISOString();
          return (
            <li
              key={key}
              ref={(el) => {
                if (el) cardRefs.current.set(key, el);
                else cardRefs.current.delete(key);
              }}
            >
              <CalendarCard date={date} />
            </li>
          );
        })}
      </ul>
      <Button
        variant={"outline"}
        size={"icon"}
        className="fixed bottom-4 right-4 size-12 rounded-full"
        onClick={scrollToTop}
      >
        <ChevronUp />
      </Button>
      <div ref={sentinelRef} className="h-1" />
    </div>
  );
}

export default Page;
