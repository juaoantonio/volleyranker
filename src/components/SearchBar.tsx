import { useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "../utils.ts";

interface SmartSearchBarProps<T> {
    data: T[];
    searchKey: keyof T;
    placeholder?: string;
    onSelect: (item: T) => void;
}

export const SearchBar = <T extends Record<string, any>>({
    data,
    searchKey,
    placeholder = "Pesquisar...",
    onSelect,
}: SmartSearchBarProps<T>) => {
    const [query, setQuery] = useState("");
    const [filteredResults, setFilteredResults] = useState<T[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const normalizeText = (text: string) =>
        text
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();

    const handleSearch = (value: string) => {
        setQuery(value);
        if (!value.trim()) {
            setFilteredResults([]);
            setShowSuggestions(false);
            return;
        }

        const normalizedQuery = normalizeText(value);

        const results = data.filter((item) =>
            normalizeText(String(item[searchKey])).includes(normalizedQuery),
        );

        setFilteredResults(results);
        setShowSuggestions(true);
    };

    const handleSelect = (item: T) => {
        setQuery(String(item[searchKey]));
        setShowSuggestions(false);
        onSelect(item);
    };

    return (
        <div className="relative w-full max-w-md">
            <div className="flex items-center border border-gray-300 rounded-md p-2 bg-white">
                <Search className="text-gray-500 mr-2" size={20} />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder={placeholder}
                    className="w-full focus:outline-none text-gray-800"
                />
                {query && (
                    <button
                        onClick={() => {
                            setQuery("");
                            setFilteredResults([]);
                            setShowSuggestions(false);
                        }}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            {showSuggestions && filteredResults.length > 0 && (
                <ul className="absolute left-0 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 z-50">
                    {filteredResults.map((item, index) => (
                        <li
                            key={index}
                            onClick={() => handleSelect(item)}
                            className={cn(
                                "p-2 cursor-pointer hover:bg-gray-100 transition",
                                index === filteredResults.length - 1
                                    ? "rounded-b-md"
                                    : "",
                            )}
                        >
                            {String(item[searchKey])}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
