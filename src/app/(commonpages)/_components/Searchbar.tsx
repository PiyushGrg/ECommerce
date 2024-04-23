"use client";
import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@nextui-org/react";
import { SearchIcon } from "./icons/SearchIcon";

function Searchbar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [value, setValue] = React.useState(searchParams.get("search") || "");

  useEffect(() => {
    // use debounce to prevent too many requests
    const debounce = setTimeout(() => {
      const params = new URLSearchParams();
      if (value) {
        params.append("search", value);
      }
      router.push(`?${params.toString()}`);
    }, 200);
    return () => clearTimeout(debounce);
  }, [value, router]);

  return (
    <div>
      <Input
        placeholder="Search"
        size="md"
        value={value}
        label="Search Products"
        labelPlacement="outside-left"
        onChange={(e) => {
          setValue(e.target.value);
        }}
        startContent={
          <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
        }
        isClearable
        radius="lg"
        onClear={() => {setValue("")}}
      />
    </div>
  );
}

export default Searchbar;
