import { HTMLAttributes, useId } from "react";
import { cn } from "~/utils/cn";

type InputTextProps = {
  label?: string | React.ReactNode;
  error?: string | React.ReactNode;
  helper?: string | React.ReactNode;
};
export const InputText = (
  props: React.InputHTMLAttributes<HTMLInputElement> & InputTextProps
) => {
  const id = useId();
  const {
    label,
    error,
    helper,
    className,
    type = "text",
    ...inputProps
  } = props;

  const hasError = error !== undefined && error !== false;
  const helperContent = hasError ? error : helper !== undefined ? helper : null;

  return (
    <div>
      {label ? (
        <label
          htmlFor={id}
          className="block text-sm font-medium mb-2 dark:text-white"
        >
          {label}
        </label>
      ) : null}
      <div className="relative">
        <input
          {...inputProps}
          type={type}
          id={id}
          className={cn(
            className,
            "py-3 px-4 block w-full rounded-md text-sm border",
            {
              "border-red-500  focus:border-red-500 focus:ring-red-500":
                hasError,
              "border-gray-300 focus:border-blue-500 focus:ring-blue-500":
                !hasError,
            }
          )}
        />
        {hasError && (
          <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none pr-3">
            <svg
              className="h-5 w-5 text-red-500"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
            </svg>
          </div>
        )}
      </div>
      {helperContent ? (
        <p
          className={cn("text-sm mt-2", {
            "text-red-600": hasError,
            "text-gray-500": !hasError,
          })}
        >
          {helperContent}
        </p>
      ) : null}
    </div>
  );
};
