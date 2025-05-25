"use client";

import { DatePicker } from "@/components/ui/date-picker";
import { rescheduleTasks } from "@/data/actions";
import { useActionState, useRef } from "react";
import { Controller, useForm } from "react-hook-form";

type formType = {
  dueDate?: Date | null;
};

function RescheduleTaskButton({ taskIds }: { taskIds: string[] }) {
  const form = useForm<formType>();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    rescheduleTasks.bind(null, taskIds),
    {
      message: "",
    },
  );

  return (
    <form action={formAction}>
      <Controller
        name="dueDate"
        control={form.control}
        render={({ field }) => (
          <>
            <DatePicker
              {...field}
              variant="text"
              value={field.value}
              text="Reschedule all"
              mode="reschedule"
              className="!text-[#FF5858] border-none rounded-[0.5rem] dark:bg-[#1E1E1E]"
              onChange={(date) => {
                field.onChange(date);
                if (date) {
                  setTimeout(() => {
                    const formElement = document.querySelector("form");
                    formElement?.requestSubmit();
                  }, 0);
                }
              }}
            />
            <input
              type="hidden"
              name="dueDate"
              value={field.value ? new Date(field.value).toISOString() : ""}
            />
          </>
        )}
      />
    </form>
  );
}

export default RescheduleTaskButton;
