import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formateErrResponseType } from "@/types/utility.type"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formateErrResponse = ({ message = "", data, path }: formateErrResponseType): formateErrResponseType => {
  return {
    message,
    data,
    path
  }
}

export const scrollToHash = (elementId: string) => {
  const element = document.getElementById(elementId);
  element?.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "nearest",
  });
};