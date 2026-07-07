import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface GlobalPaginationProps {
  currentPage: number;
  totalPage: number;
  onChangePage: (page: number) => void;
}

const GlobalPagination = ({
  currentPage,
  totalPage,
  onChangePage,
}: GlobalPaginationProps) => {
    const handlePrev = () => {
        if (currentPage>1){
            onChangePage(currentPage-1)
        }
    }
    const handleNext = () => {
        if(currentPage<totalPage){
            onChangePage(currentPage+1)
        }
    }
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={handlePrev} />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink>{currentPage}</PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationNext onClick={handleNext} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default GlobalPagination;
