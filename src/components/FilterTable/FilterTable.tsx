import React, { useState } from "react";
import {
  ChevronDown,
  Plus,
  Search,
  MoreHorizontal,
  Trash2,
  Grid2X2,
  GripVertical,
  MoveDown,
  MoveUp,
  X,
} from "lucide-react";

interface TableData {
  ticker: string;
  industry: string;
  sector: string;
  bookValuePerShare: number;
  marketCap: string;
  debt: string;
}

interface Sort {
  field: keyof TableData;
  direction: "asc" | "desc";
}

interface Filter {
  field: keyof TableData;
  operator: "equals" | "contains" | "greater" | "less" | "startsWith";
  value: string | number;
}

const initialData: TableData[] = [
  {
    ticker: "AAPL",
    industry: "Packaged Software",
    sector: "Manufacturing",
    bookValuePerShare: 200,
    marketCap: "10%",
    debt: "90%",
  },
  {
    ticker: "ROKU",
    industry: "Packaged Software",
    sector: "Technology",
    bookValuePerShare: 200,
    marketCap: "10%",
    debt: "75%",
  },
  {
    ticker: "U",
    industry: "Packaged Software",
    sector: "Finance",
    bookValuePerShare: 200,
    marketCap: "10%",
    debt: "85%",
  },
  {
    ticker: "AAPL",
    industry: "Packaged Software",
    sector: "Manufacturing",
    bookValuePerShare: 200,
    marketCap: "10%",
    debt: "70%",
  },
  {
    ticker: "SHOP",
    industry: "Services",
    sector: "Finance",
    bookValuePerShare: 200,
    marketCap: "10%",
    debt: "80%",
  },
  {
    ticker: "ROKU",
    industry: "Services",
    sector: "Finance",
    bookValuePerShare: 200,
    marketCap: "10%",
    debt: "90%",
  },
  {
    ticker: "AAPL",
    industry: "Services",
    sector: "Manufacturing",
    bookValuePerShare: 200,
    marketCap: "10%",
    debt: "80%",
  },
  {
    ticker: "INMD",
    industry: "Services",
    sector: "Technology",
    bookValuePerShare: 200,
    marketCap: "10%",
    debt: "90%",
  },
];

const FilterTable: React.FC = () => {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [showPropertyList, setShowPropertyList] = useState(false);
  const [selectedSortField, setSelectedSortField] = useState<
    keyof TableData | null
  >(null);
  const [activeSort, setActiveSort] = useState<Sort | null>(null);
  const [showAscDescMenu, setShowAscDescMenu] = useState(false);

  // Filter state
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [selectedFilterField, setSelectedFilterField] = useState<
    keyof TableData | null
  >(null);
  const [filterSearchTerm, setFilterSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<Filter[]>([]);
  const [filterOperator, setFilterOperator] =
    useState<Filter["operator"]>("equals");
  const [filterValue, setFilterValue] = useState<string>("");
  const [showOperatorMenu, setShowOperatorMenu] = useState(false);
  const [showFilterPropertyList, setShowFilterPropertyList] = useState(false);

  const [data, setData] = useState(initialData);
  const [sortSearchTerm, setSortSearchTerm] = useState("");

  // Function to format field names
  const formatOption = (option: string): string => {
    if (option === "bookValuePerShare") {
      return "Book Value Per Share";
    }
    return option
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  const handleSortSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSortSearchTerm(event.target.value);
  };

  const handleFilterSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterSearchTerm(event.target.value);
  };

  // Filter options based on search term
  const filteredSortOptions = Object.keys(initialData[0]).filter((field) =>
    field.toLowerCase().includes(sortSearchTerm.toLowerCase())
  );

  const filteredFilterOptions = Object.keys(initialData[0]).filter((field) =>
    field.toLowerCase().includes(filterSearchTerm.toLowerCase())
  );

  const handleSort = (field: keyof TableData, direction: "asc" | "desc") => {
    const sortedData = [...data].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });

    setData(sortedData);
    setActiveSort({ field, direction });
  };

  const handleSortFieldSelect = (field: keyof TableData) => {
    setSelectedSortField(field);
    setShowSortOptions(true);
    setShowSortDropdown(false);
    setShowPropertyList(false);
  };

  const handleFilterFieldSelect = (field: keyof TableData) => {
    setSelectedFilterField(field);
    setShowFilterOptions(true);
    setShowFilterDropdown(false);
    setShowFilterPropertyList(false);
  };

  const removeSortFilter = () => {
    setActiveSort(null);
    applyAllFilters(activeFilters); // Re-apply just the filters without sort
    setSelectedSortField(null);
    setShowSortOptions(false);
  };

  const handleOperatorSelect = (operator: Filter["operator"]) => {
    setFilterOperator(operator);
    setShowOperatorMenu(false);
  };

  const applyFilter = () => {
    if (!selectedFilterField || filterValue === "") return;

    const newFilter: Filter = {
      field: selectedFilterField,
      operator: filterOperator,
      value: filterValue,
    };

    const updatedFilters = [...activeFilters, newFilter];
    setActiveFilters(updatedFilters);
    applyAllFilters(updatedFilters);

    // Reset filter UI
    setShowFilterOptions(false);
    setFilterValue("");
  };

  const removeFilter = (index: number) => {
    const updatedFilters = activeFilters.filter((_, i) => i !== index);
    setActiveFilters(updatedFilters);

    if (updatedFilters.length === 0 && !activeSort) {
      setData(initialData); // Reset to initial data if no filters or sorts remain
    } else {
      applyAllFilters(updatedFilters);
    }
  };

  const applyAllFilters = (filters: Filter[]) => {
    let filteredData = [...initialData];

    // Apply all filters
    filters.forEach((filter) => {
      filteredData = filteredData.filter((item) => {
        const itemValue = item[filter.field];
        const filterVal = filter.value;

        // String comparisons
        if (typeof itemValue === "string") {
          const itemValueStr = itemValue.toLowerCase();
          const filterValStr = String(filterVal).toLowerCase();

          switch (filter.operator) {
            case "equals":
              return itemValueStr === filterValStr;
            case "contains":
              return itemValueStr.includes(filterValStr);
            case "startsWith":
              return itemValueStr.startsWith(filterValStr);
            default:
              return true;
          }
        }
        // Number comparisons
        if (typeof itemValue === "number") {
          const filterValNum = Number(filterVal);

          switch (filter.operator) {
            case "equals":
              return itemValue === filterValNum;
            case "greater":
              return itemValue > filterValNum;
            case "less":
              return itemValue < filterValNum;
            default:
              return true;
          }
        }
        return true;
      });
    });

    // Apply sort if active
    if (activeSort) {
      filteredData.sort((a, b) => {
        const aValue = a[activeSort.field];
        const bValue = b[activeSort.field];

        if (typeof aValue === "string" && typeof bValue === "string") {
          return activeSort.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
          return activeSort.direction === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }
        return 0;
      });
    }

    setData(filteredData);
  };

  const getOperatorLabel = (operator: Filter["operator"]): string => {
    switch (operator) {
      case "equals":
        return "Equals";
      case "contains":
        return "Contains";
      case "greater":
        return "Greater than";
      case "less":
        return "Less than";
      case "startsWith":
        return "Starts with";
      default:
        return "Equals";
    }
  };

  const getFilterOperators = (field: keyof TableData): Filter["operator"][] => {
    // Get available operators based on field type
    const sampleValue = initialData[0][field];

    if (typeof sampleValue === "number") {
      return ["equals", "greater", "less"];
    }

    return ["equals", "contains", "startsWith"];
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900">Filter</h1>
            </div>
            <p className="text-gray-500 text-xl font-medium">Nov 1, 2023</p>
          </div>

          <div className="flex items-center gap-2 mt-4 flex-wrap">
            {/* Active filters display */}
            {activeFilters.map((filter, index) => (
              <div
                key={`filter-${index}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-500 hover:bg-gray-50 rounded-full font-medium"
              >
                {formatOption(filter.field)} {getOperatorLabel(filter.operator)}{" "}
                "{filter.value}"
                <button
                  onClick={() => removeFilter(index)}
                  className="ml-1 text-gray-400 hover:text-gray-500"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}

            {/* If no sort is selected, show "Add Sort" button. Otherwise show the selected field button. */}
            {!selectedSortField ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setShowSortDropdown(!showSortDropdown);
                    setShowSortOptions(false);
                    setShowFilterDropdown(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 rounded-md border-r border-gray-200 hover:text-blue-500"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Sort
                </button>
                {showSortDropdown && (
                  <div className="absolute left-0 mt-16 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    {/* Search Input */}
                    <div className="relative p-2">
                      <Search className="absolute left-4 top-4 h-4 w-4 text-gray-400 drop-shadow-md" />
                      <input
                        type="text"
                        placeholder="Search"
                        value={sortSearchTerm}
                        onChange={handleSortSearch}
                        className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Sort Options */}
                    {filteredSortOptions.length > 0 ? (
                      filteredSortOptions.map((field) => (
                        <button
                          key={field}
                          onClick={() =>
                            handleSortFieldSelect(field as keyof TableData)
                          }
                          className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          {formatOption(field)}
                        </button>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm px-3 py-2">
                        No results found
                      </p>
                    )}
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <button className="w-full text-left px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-50 rounded flex items-center">
                        <Plus className="h-3.5 w-3.5 mr-2" /> Add advanced
                        filter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Button that shows the selected field. Clicking re-opens the same property list.
              <div className="relative">
                <button
                  onClick={() => {
                    setShowSortOptions((prev) => !prev);
                    setShowFilterDropdown(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-500 hover:bg-gray-50 rounded-full font-medium"
                >
                  {activeSort?.direction === "asc" ? (
                    <MoveUp className="h-3.5 w-3.5 text-gray-400" />
                  ) : (
                    <MoveDown className="h-3.5 w-3.5 text-gray-400" />
                  )}

                  {formatOption(selectedSortField)}
                </button>
              </div>
            )}

            <div className="relative">
              <button
                onClick={() => {
                  setShowFilterDropdown(!showFilterDropdown);
                  setShowSortDropdown(false);
                  setShowSortOptions(false);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                <Plus className="h-3.5 w-3.5" /> Add Filter
              </button>

              {/* Add Filter Dropdown */}
              {showFilterDropdown && (
                <div className="absolute left-0 mt-16 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  {/* Search Input */}
                  <div className="relative p-2">
                    <Search className="absolute left-4 top-4 h-4 w-4 text-gray-400 drop-shadow-md" />
                    <input
                      type="text"
                      placeholder="Search"
                      value={filterSearchTerm}
                      onChange={handleFilterSearch}
                      className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Filter Field Options */}
                  {filteredFilterOptions.length > 0 ? (
                    filteredFilterOptions.map((field) => (
                      <button
                        key={field}
                        onClick={() =>
                          handleFilterFieldSelect(field as keyof TableData)
                        }
                        className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        {formatOption(field)}
                      </button>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm px-3 py-2">
                      No results found
                    </p>
                  )}
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <button className="w-full text-left px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-50 rounded flex items-center">
                      <Plus className="h-3.5 w-3.5 mr-2" /> Add advanced filter
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sort Options Popup */}
        {showSortOptions && selectedSortField && (
          <div className="absolute left-38 top-44 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-50">
            {/* Top row: Grip, property dropdown, asc/desc dropdown, and "..." button */}
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-200">
              <div className="flex items-center gap-2">
                {/* "Grip" icon (just for UI) */}
                <GripVertical className="h-3.5 w-3.5 text-gray-400" />

                {/* Property Dropdown (shows all fields when toggled) */}
                <div className="relative">
                  <button
                    onClick={() => setShowPropertyList((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 px-2 py-1 text-sm text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50"
                  >
                    {formatOption(selectedSortField)}
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform ${
                        showPropertyList ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Property List (toggle) */}
                  {showPropertyList && (
                    <div className="absolute left-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      {Object.keys(initialData[0]).map((field) => (
                        <button
                          key={field}
                          onClick={() => {
                            setSelectedSortField(field as keyof TableData);
                            setShowPropertyList(false);
                          }}
                          className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          {formatOption(field)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Asc/Desc Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowAscDescMenu((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 px-2 py-1 text-sm text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50"
                  >
                    {activeSort?.direction === "desc"
                      ? "Descending"
                      : "Ascending"}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>

                  {/* Asc/Desc Menu (only shows when toggled) */}
                  {showAscDescMenu && (
                    <div className="absolute left-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <button
                        onClick={() => {
                          handleSort(selectedSortField, "asc");
                          setShowAscDescMenu((prev) => !prev);
                        }}
                        className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 font-medium"
                      >
                        Ascending
                      </button>
                      <button
                        onClick={() => {
                          handleSort(selectedSortField, "desc");
                          setShowAscDescMenu((prev) => !prev);
                        }}
                        className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 font-medium"
                      >
                        Descending
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* "..." button (closes the sort popup) */}
              <button
                onClick={() => setShowSortOptions(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>

            {/* + Add Sort button, separated by a border */}
            <div className="mb-2 pb-2 border-b border-gray-200">
              <button className="inline-flex items-center gap-1.5 text-sm text-gray-700 hover:bg-gray-50 px-2 py-1 rounded-md">
                <Plus className="h-3.5 w-3.5" />
                Add Sort
              </button>
            </div>

            {/* Delete filter button at the bottom */}
            <div className="pt-2">
              <button
                onClick={removeSortFilter}
                className="w-full text-left px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded flex items-center font-medium"
              >
                <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete filter
              </button>
            </div>
          </div>
        )}

        {/* Filter Options Popup */}
        {showFilterOptions && selectedFilterField && (
          <div className="absolute left-38 top-44 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-50">
            {/* Top row: Grip, property dropdown, operator dropdown */}
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-200">
              <div className="flex items-center gap-2">
                {/* "Grip" icon (just for UI) */}
                <GripVertical className="h-3.5 w-3.5 text-gray-400" />

                {/* Property Dropdown (shows all fields when toggled) */}
                <div className="relative">
                  <button
                    onClick={() => setShowFilterPropertyList((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 px-2 py-1 text-sm text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50"
                  >
                    {formatOption(selectedFilterField)}
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform ${
                        showFilterPropertyList ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Property List (toggle) */}
                  {showFilterPropertyList && (
                    <div className="absolute left-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      {Object.keys(initialData[0]).map((field) => (
                        <button
                          key={field}
                          onClick={() => {
                            setSelectedFilterField(field as keyof TableData);
                            setShowFilterPropertyList(false);
                          }}
                          className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          {formatOption(field)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Operator Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowOperatorMenu((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 px-2 py-1 text-sm text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50"
                  >
                    {getOperatorLabel(filterOperator)}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>

                  {/* Operator Menu */}
                  {showOperatorMenu && (
                    <div className="absolute left-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      {getFilterOperators(selectedFilterField).map((op) => (
                        <button
                          key={op}
                          onClick={() => handleOperatorSelect(op)}
                          className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 font-medium"
                        >
                          {getOperatorLabel(op)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* "..." button (closes the filter popup) */}
              <button
                onClick={() => setShowFilterOptions(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>

            {/* Filter value input */}
            <div className="mb-2 pb-2 border-b border-gray-200">
              <input
                type="text"
                placeholder="Filter value..."
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Apply filter button */}
            <div className="mb-2 pb-2 border-b border-gray-200">
              <button
                onClick={applyFilter}
                disabled={!filterValue}
                className={`w-full text-center px-2 py-1.5 text-sm rounded-md ${
                  filterValue
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                Apply Filter
              </button>
            </div>

            {/* Cancel button at the bottom */}
            <div className="pt-2">
              <button
                onClick={() => setShowFilterOptions(false)}
                className="w-full text-left px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded flex items-center font-medium"
              >
                <X className="h-3.5 w-3.5 mr-2" /> Cancel
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                  Ticker
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                  Industry
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                  Sector
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                  Book Value Per Share
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Market Cap
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Debt
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-50 font-medium"
                >
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {row.ticker}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {row.industry}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {row.sector}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {row.bookValuePerShare}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {row.marketCap}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {row.debt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FilterTable;
