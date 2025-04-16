import { Skeleton } from "@/components/ui/skeleton";
import { TableBody, TableRow, TableCell } from "@/components/ui/table";

const TransactedRateSkeleton = () => {
  return (
    <TableBody>
      {Array.from({ length: 10 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell className="w-15">
            <Skeleton className="w-full h-5" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default TransactedRateSkeleton;
