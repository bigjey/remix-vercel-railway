import { cn } from "~/utils/cn";

type ButtonProps = {
  size?: "small" | "medium" | "large";
  variant?: "primary" | "secondary";
};

export const Button = (
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & ButtonProps
) => {
  const {
    size = "medium",
    variant = "primary",
    className = "",
    ...buttonProps
  } = props;

  return (
    <button
      {...buttonProps}
      className={cn(
        "inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold focus:outline-none focus:ring-2  focus:ring-offset-2 transition-all  ",
        { "py-2 px-3 text-sm": size === "small" },
        { "py-3 px-4 text-lg": size === "medium" },
        { "py-3 px-4 text-xl sm:p-5": size === "large" },
        { "opacity-50": !!buttonProps.disabled },
        {
          "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500":
            variant === "primary",
        },
        {
          "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-200 ":
            variant === "secondary",
        }
      )}
    />
  );
};
