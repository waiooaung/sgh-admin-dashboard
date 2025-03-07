// import React, { useState } from "react";
// import { format } from "date-fns";
// import { Calendar } from "@/components/ui/calendar"; // Replace with your date picker
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectTrigger,
//   SelectContent,
//   SelectItem,
//   SelectValue,
//   SelectGroup,
// } from "@/components/ui/select";
// import {
//   Popover,
//   PopoverTrigger,
//   PopoverContent,
// } from "@/components/ui/popover";
// import { DateRange } from "react-day-picker";

// type FilterField =
//   | { type: "text"; name: string; placeholder?: string; value?: string }
//   | {
//       type: "select";
//       name: string;
//       options: { label: string; value: string }[];
//       placeholder?: string;
//       value?: string;
//     }
//   | { type: "dateRange"; name: string; value?: DateRange };

// type FilterBarProps = {
//   fields: FilterField[];
//   onFilterChange: (filters: Record<string, any>) => void;
// };

// const FilterBar: React.FC<FilterBarProps> = ({ fields, onFilterChange }) => {
//   const [filters, setFilters] = useState<Record<string, any>>({});

//   const handleInputChange = (name: string, value: any) => {
//     setFilters((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSearch = () => {
//     onFilterChange(filters);
//   };

//   return (
//     <div className="p-4 border rounded-xl">
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//         {fields.map((field) => {
//           if (field.type === "text") {
//             return (
//               <Input
//                 key={field.name}
//                 type="text"
//                 placeholder={field.placeholder || "Enter text..."}
//                 value={filters[field.name] || field.value}
//                 onChange={(e) => handleInputChange(field.name, e.target.value)}
//                 className="w-full"
//               />
//             );
//           }

//           if (field.type === "select") {
//             return (
//               <Select
//                 key={field.name}
//                 value={filters[field.name] || ""}
//                 onValueChange={(value) => handleInputChange(field.name, value)}
//               >
//                 <SelectTrigger className="w-full">
//                   <SelectValue placeholder={field.placeholder ?? "Select..."} />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectGroup>
//                     {field.options.map((opt) => (
//                       <SelectItem key={opt.value} value={opt.value}>
//                         {opt.label}
//                       </SelectItem>
//                     ))}
//                   </SelectGroup>
//                 </SelectContent>
//               </Select>
//             );
//           }

//           if (field.type === "dateRange") {
//             return (
//               <Popover key={field.name}>
//                 <PopoverTrigger asChild>
//                   <Button variant="outline" className="w-full">
//                     {filters[field.name]?.from && filters[field.name]?.to
//                       ? `${format(filters[field.name].from, "MM/dd/yyyy")} - ${format(filters[field.name].to, "MM/dd/yyyy")}`
//                       : "Select Date Range"}
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent>
//                   <Calendar
//                     mode="range"
//                     selected={filters[field.name]}
//                     onSelect={(range) => handleInputChange(field.name, range)}
//                   />
//                 </PopoverContent>
//               </Popover>
//             );
//           }

//           return null;
//         })}
//         <div className="flex justify-end">
//           <Button
//             onClick={handleSearch}
//             className="w-full sm:w-auto bg-blue-600 text-white"
//           >
//             Search
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FilterBar;
import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar"; // Replace with your date picker
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { DateRange } from "react-day-picker";

type FilterField =
  | { type: "text"; name: string; placeholder?: string; value?: string }
  | {
      type: "select";
      name: string;
      options: { label: string; value: string }[];
      placeholder?: string;
      value?: string;
    }
  | { type: "dateRange"; name: string; value?: DateRange };

type FilterBarProps = {
  fields: FilterField[];
  onFilterChange: (filters: Record<string, any>) => void;
};

const FilterBar: React.FC<FilterBarProps> = ({ fields, onFilterChange }) => {
  const [filters, setFilters] = useState<Record<string, any>>({});

  const handleInputChange = (name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    onFilterChange(filters);
  };

  return (
    <div className="p-4 border rounded-xl">
      <div
        className={`grid gap-4 ${
          fields.length === 1
            ? "grid-cols-1"
            : fields.length === 2
            ? "grid-cols-1 sm:grid-cols-2"
            : fields.length === 3
            ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
            : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        }`}
      >
        {fields.map((field) => {
          if (field.type === "text") {
            return (
              <Input
                key={field.name}
                type="text"
                placeholder={field.placeholder || "Enter text..."}
                value={filters[field.name] || field.value}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                className="w-full"
              />
            );
          }

          if (field.type === "select") {
            return (
              <Select
                key={field.name}
                value={filters[field.name] || ""}
                onValueChange={(value) => handleInputChange(field.name, value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={field.placeholder ?? "Select..."} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {field.options.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            );
          }

          if (field.type === "dateRange") {
            return (
              <Popover key={field.name}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full">
                    {filters[field.name]?.from && filters[field.name]?.to
                      ? `${format(filters[field.name].from, "MM/dd/yyyy")} - ${format(filters[field.name].to, "MM/dd/yyyy")}`
                      : "Select Date Range"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="range"
                    selected={filters[field.name]}
                    onSelect={(range) => handleInputChange(field.name, range)}
                  />
                </PopoverContent>
              </Popover>
            );
          }

          return null;
        })}
      </div>

      <div className="flex justify-end mt-4">
        <Button onClick={handleSearch} className="w-full sm:w-auto bg-blue-600 text-white"
        >
          Search
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;

