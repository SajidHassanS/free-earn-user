"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  useTable,
  useSortBy,
  usePagination,
  TableInstance,
  TableState,
  ColumnInstance,
} from "react-table";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp, MoveLeft, MoveRight } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface ExtendedColumnInstance<T extends object> extends ColumnInstance<T> {
  isSorted?: boolean;
  isSortedDesc?: boolean;
  getSortByToggleProps?: () => any;
}

interface DataTableProps<T extends object> {
  columns: Array<{
    Header: string;
    accessor: keyof T;
  }>;
  data: T[];
  paginate?: boolean;
  extendWidth?: boolean;
}

const DataTable = <T extends object>({
  columns,
  data,
  paginate = false,
  extendWidth,
}: DataTableProps<T>) => {
  const memoizedColumns = useMemo(() => columns, [columns]);
  const memoizedData = useMemo(() => data, [data]);

  const [rowsInput, setRowsInput] = useState<string>(
    paginate ? "100" : data.length.toString()
  );
  const [pageSize, setPageSize] = useState<number>(parseInt(rowsInput));

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    setPageSize: setReactTablePageSize,
  } = useTable<T>(
    {
      columns: memoizedColumns,
      data: memoizedData,
      initialState: {
        pageIndex: 0,
        pageSize: pageSize,
      } as Partial<TableState<T>>,
    },
    useSortBy,
    usePagination
  ) as TableInstance<T> & {
    page: any[];
    canPreviousPage: boolean;
    canNextPage: boolean;
    nextPage: () => void;
    previousPage: () => void;
    setPageSize: (size: number) => void;
  };

  useEffect(() => {
    const value = parseInt(rowsInput);
    if (!isNaN(value) && value > 0 && value <= data.length) {
      setPageSize(value);
    }
  }, [rowsInput, data.length]);

  useEffect(() => {
    setReactTablePageSize(pageSize);
  }, [pageSize, setReactTablePageSize]);

  return (
    <>
      <Table
        {...getTableProps()}
        className={cn("w-full", extendWidth && "table-fixed")}
      >
        <TableHeader>
          {headerGroups.map((headerGroup, i) => (
            <TableRow {...headerGroup.getHeaderGroupProps()} key={i}>
              {headerGroup.headers.map((column, j) => {
                const extendedColumn = column as ExtendedColumnInstance<T>;
                return (
                  <TableHead
                    {...extendedColumn.getHeaderProps(
                      extendedColumn.getSortByToggleProps?.() || {}
                    )}
                    key={j}
                    className="bg-primary/10"
                  >
                    {extendedColumn.render("Header")}
                    <span>
                      {extendedColumn.isSorted ? (
                        extendedColumn.isSortedDesc ? (
                          <ChevronDown className="inline ml-2 w-4 h-4" />
                        ) : (
                          <ChevronUp className="inline ml-2 w-4 h-4" />
                        )
                      ) : null}
                    </span>
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <TableRow {...row.getRowProps()} key={i}>
                {row.cells.map((cell: any, j: number) => (
                  <TableCell {...cell.getCellProps()} key={j} className="py-3">
                    {cell.render("Cell")}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="flex justify-start items-center my-4 px-4 text-sm text-muted-foreground">
        <label htmlFor="rowsPerPage" className="mr-2">
          Rows per page:
        </label>
        <input
          id="rowsPerPage"
          type="number"
          min={1}
          max={data.length}
          value={rowsInput}
          onChange={(e) => setRowsInput(e.target.value)}
          className="border rounded-md px-2 py-1 w-20 text-sm"
        />
      </div>

      {paginate && (
        <>
          <div className="pagination flex justify-between gap-10 mt-3 text-farmacieGrey">
            <Button
              variant="outline"
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              className="border-none bg-transparent"
            >
              <MoveLeft className="inline mr-2 mb-1" />
              {"Previous"}
            </Button>
            <Button
              variant="outline"
              onClick={() => nextPage()}
              disabled={!canNextPage}
              className="border-none bg-transparent"
            >
              {"Next "}
              <MoveRight className="inline" />
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default DataTable;
