import {
  // Description,
  Field,
  // Label,
  Select as HeadlessUiSelect,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { ReactNode } from "react";

interface IProps {
  children: ReactNode;
  className: string;
}

export default function HeadlessUISelect({ children, ...rest }: IProps) {
  return (
    <div {...rest}>
      <Field>
        <div className="relative">
          <HeadlessUiSelect
            className={clsx(
              "block w-full appearance-none rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white",
              "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
              // Make the text of each option black on Windows
              "*:text-black"
            )}
          >
            {children}
          </HeadlessUiSelect>
          <ChevronDownIcon
            className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
            aria-hidden="true"
          />
        </div>
      </Field>
    </div>
  );
}
