import clsx from "clsx";
import { ChevronsLeft, ChevronsRight, ChevronUp, Ellipsis } from "kui-icons";
import React, { useContext, useState } from "react";
import { ConfigContext } from "../config/config-context";
import type { ShapeType, SizeType, ThemeType } from "../const/types";
import Icon from "../icon";
import InputNumber from "../input-number";
import zhCN from "../locale/zh-CN";
import Select from "../select/select";

export interface PageProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  simple?: boolean;
  disabled?: boolean;
  showSizer?: boolean;
  showTotal?: boolean;
  showElevator?: boolean;
  theme?: ThemeType;
  shape?: ShapeType;
  sizeData?: number[];
  size?: SizeType;
  total?: number;
  pageSize?: number;
  page?: number;
  onChange?: (page: number, pageSize: number) => void;
}

const Page: React.FC<PageProps> = ({
  simple = false,
  disabled = false,
  showSizer = false,
  showTotal = true,
  showElevator = false,
  theme = "fill",
  shape = "round",
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

  const normalizePageSize = (value: number) => (Number.isFinite(value) && value > 0 ? value : 10);
  const calcPageCount = (tot: number, ps: number) =>
    Math.max(1, Math.ceil((Number.isFinite(tot) && tot > 0 ? tot : 0) / normalizePageSize(ps)));
  const normalizePage = (value: number, count: number) =>
    Math.min(count, Math.max(1, Number.isFinite(value) ? Math.floor(value) : 1));

  const initialPageSize = normalizePageSize(pageSizeProp);
  const initialPageCount = calcPageCount(total, initialPageSize);
  const [currentPage, setCurrentPage] = useState(normalizePage(pageProp, initialPageCount));
  const [currentPageSize, setCurrentPageSize] = useState(initialPageSize);
  const [pageCount, setPageCount] = useState(initialPageCount);
  const syncKey = `${total}:${pageProp}:${pageSizeProp}`;
  const [previousSyncKey, setPreviousSyncKey] = useState(syncKey);
  if (previousSyncKey !== syncKey) {
    const nextPageSize = normalizePageSize(pageSizeProp);
    const newCount = calcPageCount(total, nextPageSize);
    setPreviousSyncKey(syncKey);
    setCurrentPageSize(nextPageSize);
    setPageCount(newCount);
    setCurrentPage(normalizePage(pageProp, newCount));
  }
  const [prevHover, setPrevHover] = useState(false);
  const [nextHover, setNextHover] = useState(false);

  const toPage = (p: number) => {
    if (disabled) return;
    const nextP = normalizePage(p, pageCount);
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

  const changeSize = (value: string | number) => {
    const newPageSize = normalizePageSize(Number(value));
    setCurrentPageSize(newPageSize);
    const newCount = calcPageCount(total, newPageSize);
    setPageCount(newCount);
    const nextPage = currentPage > newCount ? newCount : currentPage;
    setCurrentPage(nextPage);
    onChange?.(nextPage, newPageSize);
  };

  const activateByKeyboard = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    action();
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

    const array: number[] = [];
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

    const items: React.ReactNode[] = array.map((p) => (
      <li
        key={p}
        className={clsx("k-pager-item", { "k-pager-item-active": page === p })}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-current={page === p ? "page" : undefined}
        aria-label={`Page ${p}`}
        onClick={() => toPage(p)}
        onKeyDown={(event) => activateByKeyboard(event, () => toPage(p))}
      >
        <span>{p}</span>
      </li>
    ));

    if (showPrevMore) {
      items.unshift(
        <li
          key="prev-more"
          className="k-pager-item k-pager-more"
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label="Previous 5 pages"
          onMouseEnter={() => setPrevHover(true)}
          onMouseLeave={() => setPrevHover(false)}
          onClick={() => toPage(currentPage - 5)}
          onKeyDown={(event) => activateByKeyboard(event, () => toPage(currentPage - 5))}
        >
          <Icon type={prevHover ? ChevronsLeft : Ellipsis} />
        </li>,
      );
    }
    if (showNextMore) {
      items.push(
        <li
          key="next-more"
          className="k-pager-item k-pager-more"
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label="Next 5 pages"
          onMouseEnter={() => setNextHover(true)}
          onMouseLeave={() => setNextHover(false)}
          onClick={() => toPage(currentPage + 5)}
          onKeyDown={(event) => activateByKeyboard(event, () => toPage(currentPage + 5))}
        >
          <Icon type={nextHover ? ChevronsRight : Ellipsis} />
        </li>,
      );
    }

    return items;
  };

  const classes = clsx(
    "k-page",
    {
      "k-page-sm": size === "small",
      "k-page-lg": size === "large",
      "k-page-fill": theme === "fill",
      "k-page-outline": theme === "outline",
      "k-page-disabled": disabled,
      "k-page-simple": simple,
      [`k-page-${shape}`]: shape,
    },
    className,
  );

  const sizeOptions = sizeData.map((s) => ({
    value: s,
    label: `${s}${locale?.k?.page?.pageSize || " / page"}`,
  }));

  return (
    <nav className={classes} aria-label="Pagination" {...rest}>
      {showTotal && !simple ? (
        <div className="k-page-number">
          <span>
            {locale?.k?.page?.total} {total} {locale?.k?.page?.items}
          </span>
        </div>
      ) : null}

      <ul className="k-pager">
        {/* Prev */}
        <li
          className={clsx("k-pager-item k-pager-prev", {
            "k-pager-item-disabled": currentPage === 1,
          })}
          role="button"
          tabIndex={disabled || currentPage === 1 ? -1 : 0}
          aria-disabled={disabled || currentPage === 1}
          aria-label="Previous page"
          onClick={prePage}
          onKeyDown={(event) => activateByKeyboard(event, prePage)}
        >
          <Icon type={ChevronUp} />
        </li>

        {/* First page */}
        {!simple && pageCount > 0 && (
          <li
            className={clsx("k-pager-item", { "k-pager-item-active": currentPage === 1 })}
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-current={currentPage === 1 ? "page" : undefined}
            aria-label="Page 1"
            onClick={() => toPage(1)}
            onKeyDown={(event) => activateByKeyboard(event, () => toPage(1))}
          >
            <span>1</span>
          </li>
        )}

        {/* Middle pages */}
        {!simple && renderPageItems()}

        {/* Last page */}
        {!simple && pageCount > 1 && (
          <li
            className={clsx("k-pager-item", { "k-pager-item-active": currentPage === pageCount })}
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-current={currentPage === pageCount ? "page" : undefined}
            aria-label={`Page ${pageCount}`}
            onClick={() => toPage(pageCount)}
            onKeyDown={(event) => activateByKeyboard(event, () => toPage(pageCount))}
          >
            <span>{pageCount}</span>
          </li>
        )}

        {simple && (
          <li className="k-page-simple-number" aria-current="page">
            {showElevator ? (
              <span className="k-page-simple-input">
                <InputNumber
                  value={currentPage}
                  min={1}
                  max={pageCount}
                  controls={false}
                  disabled={disabled}
                  size={size}
                  theme={theme}
                  onChange={(nextPage) => {
                    if (nextPage !== undefined) toPage(nextPage);
                  }}
                />
              </span>
            ) : (
              <span>{currentPage}</span>
            )}
            <span aria-hidden="true">/</span>
            <span>{pageCount}</span>
          </li>
        )}
        {/* Next */}
        <li
          className={clsx("k-pager-item k-pager-next", {
            "k-pager-item-disabled": currentPage === pageCount,
          })}
          role="button"
          tabIndex={disabled || currentPage === pageCount ? -1 : 0}
          aria-disabled={disabled || currentPage === pageCount}
          aria-label="Next page"
          onClick={goNextPage}
          onKeyDown={(event) => activateByKeyboard(event, goNextPage)}
        >
          <Icon type={ChevronUp} />
        </li>
      </ul>

      {/* Page size sizer */}
      {!simple && showSizer && (
        <div className="k-page-sizer">
          <Select
            value={currentPageSize}
            size={size}
            clearable={false}
            theme={theme}
            disabled={disabled}
            onChange={(value) => {
              if (typeof value === "string" || typeof value === "number") changeSize(value);
            }}
            options={sizeOptions}
          />
          <span className="k-page-sizer-measure" aria-hidden="true">
            {sizeOptions.map((option, index) => (
              <span key={index}>{option.label}</span>
            ))}
          </span>
        </div>
      )}

      {/* Elevator */}
      {!simple && showElevator && (
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
    </nav>
  );
};

export default Page;
