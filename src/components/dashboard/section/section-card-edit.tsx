import { zodResolver } from "@hookform/resolvers/zod";
import { Section } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem
} from "@/components/ui/form";
import { updateSection } from "@/data/actions";
import { useAuthStore } from "@/data/store/authStore";

type sectionCardEditProps = {
  section: Section;
  setIsEditing: (bool: boolean) => void;
};

export const SectionCardEdit = ({
  section,
  setIsEditing,
}: sectionCardEditProps) => {
  const handleCancel = () => {
    setIsEditing(false);
  };

  const formSchema = z.object({
    name: z.string().min(1),
  });

  type fields = z.infer<typeof formSchema>;

  const form = useForm<fields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: section.name,
    },
  });

  const userId = useAuthStore((state) => state.userId);

  const action: () => void = form.handleSubmit(async (data) => {
    if (!userId) return;
    await updateSection({
      ...data,
      id: section.id,
      userId: userId,
    });
  });

  return (
    <Form {...form}>
      <form action={action}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Name this section"
                  autoFocus
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="mt-2 flex items-center gap-2">
          <Button className="size-fit rounded-md bg-red-flag px-4 py-1 hover:bg-[#d6584f] dark:bg-red-flag dark:text-white dark:hover:bg-[#d6584f]">
            Save
          </Button>
          <Button
            variant="ghost"
            className="size-fit rounded-md px-4 py-1"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};
