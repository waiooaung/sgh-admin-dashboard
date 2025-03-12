import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium mr-1">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        variant="outline"
        className="hover:via-foreground mr-1"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ArrowLeft className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        className="hover:via-foreground"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
};
