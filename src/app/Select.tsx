import { Field, Select as HeadlessUiSelect } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { ReactNode } from "react";

interface IProps {
  children: ReactNode;
  onChange: (value: string) => void;
  value: string;
}

export default function HeadlessUISelect({
  children,
  onChange,
  value,
}: IProps) {
  return (
    <Field>
      <div className="relative">
        <HeadlessUiSelect
          className={clsx(
            "block w-full appearance-none rounded-lg border-none py-1.5 px-3 text-sm/6",
            "bg-slate-50",
            "dark:bg-slate-800 dark:text-white",
            "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
            // Make the text of each option black on Windows
            "*:text-black"
          )}
          onChange={(e) => onChange(e.target.value)}
          value={value}
        >
          {children}
        </HeadlessUiSelect>
        <ChevronDownIcon
          className={clsx(
            "group pointer-events-none absolute top-2.5 right-2.5 size-4",
            "fill-slate-700",
            "dark:fill-white/60"
          )}
          aria-hidden="true"
        />
      </div>
    </Field>
  );
}
