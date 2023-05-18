export const cn = (
  ...parts: Array<string | undefined | string[] | Record<string, boolean>>
): string => {
  const finalParts = parts.map((p) => {
    if (!p) {
      return "";
    }

    if (Array.isArray(p)) {
      return p.join(" ");
    }

    if (typeof p === "object") {
      return Object.entries(p)
        .filter(([, active]) => active)
        .map(([classes]) => classes)
        .join(" ");
    }

    return p;
  });

  return finalParts.join(" ");
};
