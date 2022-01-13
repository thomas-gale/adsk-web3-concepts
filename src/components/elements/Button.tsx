import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

/** Generic styled HTML button alternative */
export const Button = (
  props: DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
): JSX.Element => {
  const { className, ...restprops } = props;
  return (
    <button
      className={`pointer-events-auto p-2 bg-white text-black rounded-xl hover:ring-2 disabled:hover:ring-0 disabled:bg-gray-300 ${className}`}
      {...restprops}
    />
  );
};
