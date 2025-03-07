import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TableProps {
  data: Array<{ id: string; name: string; age: number; country: string }>;
}

export function ResponsiveTable({ data }: TableProps) {
  return (
    <div className="overflow-x-auto">
      {/* Table for larger screens */}
      <Table className="hidden md:table">
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Country</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.age}</TableCell>
              <TableCell>{row.country}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Responsive layout for small screens */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {data.map((row) => (
          <div key={row.id} className="border p-4 rounded-md">
            <div className="flex justify-between">
              <span className="font-bold">ID:</span>
              <span>{row.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Name:</span>
              <span>{row.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Age:</span>
              <span>{row.age}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Country:</span>
              <span>{row.country}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
