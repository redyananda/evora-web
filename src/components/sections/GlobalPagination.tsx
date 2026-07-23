import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface GlobalPaginationProps {
  currentPage: number;
  totalPage: number;
  onChangePage: (page: number) => void;
}

// Soft purple hover to match the app theme instead of the default grey block.
const navClass =
  "cursor-pointer text-[#52525b] hover:bg-[#f3edff] hover:text-[#6d28d9]";
const disabledClass = "pointer-events-none opacity-40";

const GlobalPagination = ({
  currentPage,
  totalPage,
  onChangePage,
}: GlobalPaginationProps) => {
  const handlePrev = () => {
    if (currentPage > 1) {
      onChangePage(currentPage - 1);
    }
  };
  const handleNext = () => {
    if (currentPage < totalPage) {
      onChangePage(currentPage + 1);
    }
  };

  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPage;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={handlePrev}
            aria-disabled={isFirst}
            className={cn(navClass, isFirst && disabledClass)}
          />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink
            isActive
            className="cursor-default border-[#e4d9ff] bg-[#f3edff] font-semibold text-[#6d28d9] hover:bg-[#f3edff] hover:text-[#6d28d9]"
          >
            {currentPage}
          </PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            onClick={handleNext}
            aria-disabled={isLast}
            className={cn(navClass, isLast && disabledClass)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default GlobalPagination;
