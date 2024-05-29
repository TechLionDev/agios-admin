"use client";
import PocketBase from "pocketbase";

const pb = new PocketBase("https://agios-calendar.pockethost.io");
pb.autoCancellation(false);

import { format } from "date-fns";

import { useState } from "react";
import CopticDateCombobox from "@/components/coptic-date-combobox";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import IconCombobox from "./icon-combobox";

function OccasionForm() {
  const [date, setDate] = useState<Date>();
  const [copticDate, setCopticDate] = useState();
  const [icons, setIcons] = useState([]);
  const [creating, setCreating] = useState(false);
  async function createOccasion(e: any) {
    e.preventDefault();
    setCreating(true);
    const form = e.target;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    if (!name) {
      setCreating(false);
      alert("Please enter a name for the occasion");
      return;
    }
    if (date === undefined) {
      setCreating(false);
      alert("Please select a date for the occasion");
      return;
    }
    if (copticDate === undefined) {
      setCreating(false);
      alert("Please select a Coptic date for the occasion");
      return;
    }
    if (copticDate === "") {
      setCreating(false);
      alert("Please select a Coptic date for the occasion");
      return;
    }
    if (icons.length === 0) {
      setCreating(false);
      alert("Please select an icon for the occasion");
      return;
    }
    console.log({
      name,
      date,
      copticDate,
      icons
    });
  }
  return (
    <form onSubmit={createOccasion} className='w-full'>
      <div className='flex flex-col flex-wrap gap-8 w-fit'>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='name'>Occasion Name</Label>
          <Input
            id='name'
            name='name'
            type='text'
            placeholder='Occasion Name'
          />
        </div>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='date'>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0'>
              <Calendar
                mode='single'
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='copticDate'>Coptic Date</Label>
          <CopticDateCombobox value={copticDate} setValue={setCopticDate} />
        </div>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='icon'>Icon</Label>
          <IconCombobox value={icons} setValue={setIcons} />
        </div>
      </div>
      <div className='flex justify-end'>
        <Button type='submit' className='flex gap-2' disabled={creating}>
          {creating && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          <p>{creating ? "Creating..." : "Create Occasion"}</p>
        </Button>
      </div>
    </form>
  );
}

export default OccasionForm;