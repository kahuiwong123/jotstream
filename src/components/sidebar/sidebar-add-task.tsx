import { IoAddCircle } from "react-icons/io5";
import { SidebarMenuButton } from "../ui/sidebar";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { DialogContent, DialogTitle } from "../ui/dialog";
import { AddTaskButton } from "../dashboard/task/add-task-button";

function SidebarAddTaskButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <SidebarMenuButton className="rounded-xl border-2 border-[#FF5858] !bg-[#FF5858] text-lg !text-white hover:opacity-90">
          <IoAddCircle size={22} />
          Add Task
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent className="p-0">
        <DialogTitle className="hidden">Add Task</DialogTitle>
        <AddTaskButton dialog />
      </DialogContent>
    </Dialog>
  );
}

export default SidebarAddTaskButton;
