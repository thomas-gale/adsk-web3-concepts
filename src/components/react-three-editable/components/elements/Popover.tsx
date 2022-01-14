import React, { VFC } from "react";

import {
  usePopoverState,
  Popover as PopoverImpl,
  PopoverProps,
  PopoverDisclosure,
} from "reakit";

export { PopoverDisclosure, usePopoverState };
export type { PopoverProps };

export const Popover: VFC<PopoverProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <>
      <PopoverImpl
        // @ts-ignore
        {...props}
        className="flex p-4 w-80 rounded overflow-hidden shadow-2xl focus:outline-none bg-white"
      >
        {/* it seems that rendering Canvas in a display: none element permanently breaks its sizing, so we don't */}
        {props.visible && children}
      </PopoverImpl>
    </>
  );
};
