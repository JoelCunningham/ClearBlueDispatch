"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import BasicInput from "./basic-input";

interface SearchBarProps {
  placeholder?: string;
}

export function SearchBar({ placeholder }: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const urlSearch = searchParams.get("search") ?? "";
  const [searchTerm, setSearchTerm] = useState(urlSearch);

  const [prevUrlSearch, setPrevUrlSearch] = useState(urlSearch);
  if (urlSearch !== prevUrlSearch) {
    setPrevUrlSearch(urlSearch);
    setSearchTerm(urlSearch);
  }

  function handleSearch(value: string) {
    setSearchTerm(value);

    const params = new URLSearchParams(searchParams);
    if (value.trim()) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="relative">
      <BasicInput
        id="search"
        type="text"
        value={searchTerm}
        onChange={event => handleSearch(event.target.value)}
        placeholder={placeholder}
        suffix={searchTerm ? { icon: <X />, onClick: () => handleSearch("") } : { icon: <Search /> }}
      />
    </div>
  );
}
