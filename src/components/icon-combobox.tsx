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
function IconCombobox({ value, setValue }) {
  type Icon = {
    caption: string;
    explanation: string;
    iconographer: string;
    story: string;
    image: string;
    value: string;
    label: string;
    id: string;
  };
  async function getIcons() {
    let records = await pb.collection("icons").getFullList({
      sort: "-created"
    });
    for (let record of records) {
      record.value = record.caption;
      record.label = (
        <img
          src={`https://agios-calendar.pockethost.io/api/files/nwill40feaquna2/${record.id}/${record.image}`}
          className='h-40'
        />
      );
    }
    return records as unknown as Icon[];
  }
  const [open, setOpen] = React.useState(false);

  const [loading, setLoading] = React.useState(true);
  const [icons, setIcons] = React.useState<Icon[]>([]);
  React.useEffect(() => {
    (async () => {
      const iconsR = await getIcons();
      setIcons(iconsR);
      setLoading(false);
      console.log(icons);
    })();
  }, []);

  if (loading) {
    return (
      <>
        <Skeleton className='inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 justify-between' />
      </>
    );
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
            ? `${value.length} Icons Selected...`
            : "Select Icon..."}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='p-0'>
        <Command>
          <CommandInput placeholder='Search Icons...' />
          <CommandList>
            <CommandEmpty>No Icon found.</CommandEmpty>
            <CommandGroup>
              {icons.map((icon) => (
                <CommandItem
                  key={icon.value}
                  value={icon.value}
                  onSelect={(currentValue: any) => {
                    let temp = value;
                    temp.push(currentValue);
                    setValue(temp);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.find((v) => v === icon.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {icon.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default IconCombobox;
