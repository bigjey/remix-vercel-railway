import { LinkProps, Link as RemixLink } from "@remix-run/react";
import { cn } from "~/utils/cn";

export function Link({ ...linkProps }: LinkProps & {}) {
  return <RemixLink {...linkProps} className={cn("text-blue-500 underline")} />;
}
