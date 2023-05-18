export const Table = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col">
      <div className="-m-1.5 overflow-x-auto">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="border rounded-lg overflow-hidden =">
            <table className="min-w-full divide-y divide-gray-200">
              {children}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

Table.Body = ({ children }: { children: React.ReactNode }) => {
  return <tbody className="divide-y divide-gray-200 ">{children}</tbody>;
};
Table.Head = ({ children }: { children: React.ReactNode }) => {
  return <thead className="bg-gray-50 ">{children}</thead>;
};

Table.Row = ({ children }: { children: React.ReactNode }) => {
  return <tr>{children}</tr>;
};

Table.Cell = ({ children }: { children: React.ReactNode }) => {
  return (
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 ">
      {children}
    </td>
  );
};

Table.CellHeading = ({ children }: { children: React.ReactNode }) => {
  return (
    <th
      scope="col"
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase "
    >
      {children}
    </th>
  );
};
