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
function StoryCombobox({ value, setValue }: { value: any, setValue: any }) {
  type Story = {
    id: string;
    title: string;
    story: string;
    icons: string[];
    highlights: string[];
    value: string;
    label: string;
  };
  async function getStories() {
    let records = await pb.collection("stories").getFullList({
      sort: "-created"
    });
    for (let record of records) {
      record.value = record.title;
      record.label = record.title;
    }
    return records as unknown as Story[];
  }
  const [open, setOpen] = React.useState(false);

  const [loading, setLoading] = React.useState(true);
  const [stories, setStories] = React.useState<Story[]>([]);
  React.useEffect(() => {
    (async () => {
      const stories = await getStories();
      setStories(stories);
      setLoading(false);
      console.log(stories);
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
            ? `${value.length} Stories Selected...`
            : "Select Story..."}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='p-0'>
        <Command>
          <CommandInput placeholder='Search Stories...' />
          <CommandList>
            <CommandEmpty>No Story found.</CommandEmpty>
            <CommandGroup>
              {stories.map((story) => (
                <CommandItem
                  key={story.value}
                  value={story.value}
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
                      value.find((v: string) => v === story.value)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {story.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default StoryCombobox;
