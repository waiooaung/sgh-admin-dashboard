import { Skeleton } from "@/components/ui/skeleton";
import { TableBody, TableRow, TableCell } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { MoreHorizontal, View, Pencil, Trash } from "lucide-react";
import { Button } from "../ui/button";

const TransactionSkeletonTable = () => {
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
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <View className="w-4 h-4 mr-2" /> Detail
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Pencil className="w-4 h-4 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Trash className="w-4 h-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default TransactionSkeletonTable;
