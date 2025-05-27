"use client";
import { AppleLogo } from "@/components/svg/AppleLogo";
import { ThemeSwitcher } from "@/components/switchers/ThemeSwitcher";
import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navLinks } from "@/lib/constant";
import { scrollToHash } from "@/lib/utils";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export const MobileNav = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden py-2 px-2 w-full flex items-center justify-between">
      <Sheet onOpenChange={setOpen} open={open}>
        <SheetTrigger asChild>
          <Button variant={"ghost"} size={"icon"}>
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent
          side={"left"}
          className="h-full flex flex-col justify-between"
        >
          <SheetHeader>
            <SheetTitle asChild>
              <Button
                className="w-fit bg-transparent text-secondary-foreground hover:bg-transparent flex items-center gap-2 hover:scale-105 transition-transform duration-200"
                onClick={() => {
                  setOpen(false);
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
              >
                <AppleLogo className="w-10 h-10" />
                <p className="text-2xl font-semibold">
                  Super<span className="text-primary">Productive</span>
                </p>
              </Button>
            </SheetTitle>
          </SheetHeader>

          <ScrollArea className="my-4 flex-grow">
            <div className="h-full flex flex-col gap-2">
              {navLinks.map((link) => (
                <Button
                key={link.title}
                  variant={"link"}
                  size={"sm"}
                  onClick={() => {
                    setOpen(false);
                    scrollToHash(link.href);
                  }}
                  className="w-fit text-base text-secondary-foreground font-semibold"
                >
                  {link.title}
                </Button>
              ))}
            </div>
          </ScrollArea>
          <div className="w-full flex flex-col gap-2">
            <Link
              onClick={() => {
                setOpen(false);
              }}
              href={"/"}
              className={`${buttonVariants({ variant: "default" })}`}
            >
              Sign up
            </Link>
            <Link
              href={"/"}
              onClick={() => {
                setOpen(false);
              }}
              className={`${buttonVariants({ variant: "outline" })}`}
            >
              Log in
            </Link>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex items-center gap-2">
        <ThemeSwitcher
          alignHover="end"
          alignDropdown="end"
          size={"icon"}
          variant={"outline"}
        />
      </div>
    </div>
  );
};