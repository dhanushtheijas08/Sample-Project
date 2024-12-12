"use client";
import { useState } from "react";
import { Input } from "../ui/input";

const AutocompleteInput = () => {
  //   const [];
  const [value, setValue] = useState<string>("");
  return <Input onChange={(val) => setValue(val.target.value)} value={value} />;
};

export default AutocompleteInput;
