import React, { VFC } from "react";
import {
  Tooltip as TooltipImpl,
  TooltipProps,
  TooltipReference,
  TooltipReferenceProps,
  useTooltipState,
} from "reakit";

export { TooltipReference, useTooltipState };
export type { TooltipProps, TooltipReferenceProps };

export const Tooltip: VFC<TooltipProps> = ({ className, ...props }) => (
  // ts-ignore
  <TooltipImpl
    // @ts-ignore
    {...props}
    // @ts-ignore
    className={`${className} px-2 py-1  text-white bg-gray-700 rounded-sm text-sm pointer-events-none shadow-md`}
  />
);
