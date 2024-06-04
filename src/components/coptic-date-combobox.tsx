"use client";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import PocketBase from "pocketbase";
import Loading from "./loading";
import { Skeleton } from "./ui/skeleton";

const pb = new PocketBase("https://agios-calendar.pockethost.io");
pb.autoCancellation(false);
function CopticDateCombobox({value, setValue}: {value: string, setValue: React.Dispatch<React.SetStateAction<string>>}) {
  type CopticDate = {
    label: string;
    value: string;
    month: string;
    day: string;
    id: string;
    gregorianDate: string;
  };
  async function getCopticDates() {
    let records = await pb.collection("copticDate").getFullList({
      sort: "-created"
    });
    for (let record of records) {
      record.value = `${record.month} ${record.day}`;
      record.label = `${record.month} ${record.day}`;
    }
    return records as unknown as CopticDate[];
  }
  const [open, setOpen] = React.useState(false);

  const [loading, setLoading] = React.useState(true);
  const [copticDates, setCopticDates] = React.useState<CopticDate[]>([]);
  React.useEffect(() => {
    (async () => {
      const copticDates = await getCopticDates();
      // TODO: Default to today
      setCopticDates(copticDates);
      setLoading(false);
      console.log(copticDates);
    })();
  }, []);

  if (loading) {
    return (
      <>
        <Skeleton className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 justify-between"/>
      </>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='justify-between'
        >
          {value
            ? copticDates.find((copticDate) => copticDate.value === value)
                ?.label
            : "Select Coptic Date..."}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='p-0'>
        <Command>
          <CommandInput  placeholder='Search Coptic Dates...' />
          <CommandList>
            <CommandEmpty>No Coptic Date found.</CommandEmpty>
            <CommandGroup>
              {copticDates.map((copticDate) => (
                <CommandItem
                  key={copticDate.value}
                  value={copticDate.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === copticDate.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {copticDate.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default CopticDateCombobox;
