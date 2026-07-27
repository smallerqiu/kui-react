import React, { useState, useEffect, useContext } from "react";
import { ChevronsLeft, ChevronsRight, ChevronUp, Ellipsis } from "kui-icons";
import type { SizeType, ThemeType } from "../const/types";
import Icon from "../icon";
import InputNumber from "../input-number";
import zhCN from "../locale/zh-CN";
import { ConfigContext } from "../config";
import Select from "../select/select";

export interface PageProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  disabled?: boolean;
  showSizer?: boolean;
  showTotal?: boolean;
  showElevator?: boolean;
  theme?: ThemeType;
  sizeData?: number[];
  size?: SizeType;
  total?: number;
  pageSize?: number;
  page?: number;
  onChange?: (page: number, pageSize: number) => void;
}

const Page: React.FC<PageProps> = ({
  disabled = false,
  showSizer = false,
  showTotal = true,
  showElevator = false,
  theme = "fill",
  sizeData = [10, 15, 20, 30, 40],
  size,
  total = 0,
  pageSize: pageSizeProp = 10,
  page: pageProp = 1,
  onChange,
  className = "",
  ...rest
}) => {
  const config = useContext(ConfigContext);
  const locale = config?.locale || zhCN;

  const calcPageCount = (tot: number, ps: number) => Math.ceil(tot / ps) || 1;

  const [currentPage, setCurrentPage] = useState(pageProp);
  const [currentPageSize, setCurrentPageSize] = useState(pageSizeProp);
  const [pageCount, setPageCount] = useState(calcPageCount(total, pageSizeProp));
  const [prevHover, setPrevHover] = useState(false);
  const [nextHover, setNextHover] = useState(false);

  useEffect(() => {
    const newCount = calcPageCount(total, currentPageSize);
    setPageCount(newCount);
    if (currentPage > newCount) setCurrentPage(newCount);
  }, [total, currentPageSize]);

  useEffect(() => {
    setCurrentPage(pageProp);
  }, [pageProp]);

  useEffect(() => {
    setCurrentPageSize(pageSizeProp);
  }, [pageSizeProp]);

  const toPage = (p: number) => {
    if (disabled) return;
    let nextP = p;
    if (nextP < 1) nextP = 1;
    if (nextP > pageCount) nextP = pageCount;
    if (nextP === currentPage) return;
    setCurrentPage(nextP);
    onChange?.(nextP, currentPageSize);
  };

  const prePage = () => {
    if (!disabled && currentPage > 1) toPage(currentPage - 1);
  };
  const goNextPage = () => {
    if (!disabled && currentPage < pageCount) toPage(currentPage + 1);
  };

  const changeSize = (value: any) => {
    const newPageSize = Number(value);
    setCurrentPageSize(newPageSize);
    const newCount = calcPageCount(total, newPageSize);
    setPageCount(newCount);
    const nextPage = currentPage > newCount ? newCount : currentPage;
    setCurrentPage(nextPage);
    onChange?.(nextPage, newPageSize);
  };

  // Build middle page numbers
  const renderPageItems = () => {
    const groupCount = 7;
    const page = currentPage;
    const pCount = pageCount;
    let showPrevMore = false;
    let showNextMore = false;

    if (pCount > groupCount) {
      if (page > groupCount - 3) showPrevMore = true;
      if (page < pCount - 3) showNextMore = true;
    }

    let array: number[] = [];
    if (showPrevMore && !showNextMore) {
      const startPage = pCount - (groupCount - 2);
      for (let i = startPage; i < pCount; i++) array.push(i);
    } else if (!showPrevMore && showNextMore) {
      for (let i = 2; i < groupCount; i++) array.push(i);
    } else if (showPrevMore && showNextMore) {
      const offset = Math.floor(groupCount / 2) - 1;
      for (let i = page - offset; i <= page + offset; i++) array.push(i);
    } else {
      for (let i = 2; i < pCount; i++) array.push(i);
    }

    const items: React.ReactNode[] = array.map((p, i) => (
      <li
        key={i}
        className={["k-pager-item", page === p ? "k-pager-item-active" : ""].filter(Boolean).join(" ")}
        onClick={() => toPage(p)}
      >
        <span>{p}</span>
      </li>
    ));

    if (showPrevMore) {
      items.unshift(
        <li
          key="prev-more"
          className="k-pager-item k-pager-more"
          onMouseEnter={() => setPrevHover(true)}
          onMouseLeave={() => setPrevHover(false)}
          onClick={() => toPage(currentPage - 5)}
        >
          <Icon type={prevHover ? ChevronsLeft : Ellipsis} />
        </li>
      );
    }
    if (showNextMore) {
      items.push(
        <li
          key="next-more"
          className="k-pager-item k-pager-more"
          onMouseEnter={() => setNextHover(true)}
          onMouseLeave={() => setNextHover(false)}
          onClick={() => toPage(currentPage + 5)}
        >
          <Icon type={nextHover ? ChevronsRight : Ellipsis} />
        </li>
      );
    }

    return items;
  };

  const classes = [
    "k-page",
    size === "small" ? "k-page-sm" : "",
    theme === "fill" ? "k-page-fill" : "",
    disabled ? "k-page-disabled" : "",
    className,
  ].filter(Boolean).join(" ");

  const sizeOptions = sizeData.map((s) => ({
    value: s,
    label: `${s}${locale?.k?.page?.pageSize || " / page"}`,
  }));

  return (
    <div className={classes} {...rest}>
      {showTotal ? (
        <div className="k-page-number">
          <span>
            {locale?.k?.page?.total} {total} {locale?.k?.page?.items}
          </span>
        </div>
      ) : null}

      <ul className="k-pager">
        {/* Prev */}
        <li
          className={[
            "k-pager-item k-pager-prev",
            currentPage === 1 ? "k-pager-item-disabled" : "",
          ].filter(Boolean).join(" ")}
          onClick={prePage}
        >
          <Icon type={ChevronUp} />
        </li>

        {/* First page */}
        {pageCount > 0 && (
          <li
            className={["k-pager-item", currentPage === 1 ? "k-pager-item-active" : ""].filter(Boolean).join(" ")}
            onClick={() => toPage(1)}
          >
            <span>1</span>
          </li>
        )}

        {/* Middle pages */}
        {renderPageItems()}

        {/* Last page */}
        {pageCount > 1 && (
          <li
            className={["k-pager-item", currentPage === pageCount ? "k-pager-item-active" : ""].filter(Boolean).join(" ")}
            onClick={() => toPage(pageCount)}
          >
            <span>{pageCount}</span>
          </li>
        )}

        {/* Next */}
        <li
          className={[
            "k-pager-item k-pager-next",
            currentPage === pageCount ? "k-pager-item-disabled" : "",
          ].filter(Boolean).join(" ")}
          onClick={goNextPage}
        >
          <Icon type={ChevronUp} />
        </li>
      </ul>

      {/* Page size sizer */}
      {showSizer && (
        <div className="k-page-sizer">
          <Select
            value={currentPageSize}
            size={size}
            clearable={false}
            theme={theme}
            disabled={disabled}
            onChange={changeSize}
            options={sizeOptions}
          />
        </div>
      )}

      {/* Elevator */}
      {showElevator && (
        <div className="k-page-options">
          <span>{locale?.k?.page?.goto}</span>
          <InputNumber
            className="k-page-options-elevator"
            size={size}
            theme={theme}
            disabled={disabled}
            onChange={(p) => {
              if (p === undefined) return;
              const nextP = Math.min(Math.max(p, 1), pageCount);
              if (nextP !== currentPage) {
                setCurrentPage(nextP);
                onChange?.(nextP, currentPageSize);
              }
            }}
          />
          <span>{locale?.k?.page?.page}</span>
        </div>
      )}
    </div>
  );
};

export default Page;
