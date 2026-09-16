import { useRef } from "react";
import { BsSearch } from "react-icons/bs";
import useUserQueryStore from "../store";
import { useNavigate } from "react-router-dom";

const SearchInput = () => {
  const ref = useRef<HTMLInputElement>(null);
  const setSearchText = useUserQueryStore((s) => s.setSearchText);
  const navigate = useNavigate();

  return (
    <form
      className="flex-1"
      onSubmit={(event) => {
        event.preventDefault();

        if (ref.current) {
          setSearchText(ref.current.value);
          navigate("/");
        }
      }}
    >
      <div className="relative w-full">
        <BsSearch
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C93663]"
          size={15}
        />

        <input
          ref={ref}
          type="text"
          placeholder="Search makeups..."
          className="w-full rounded-full border border-[#DA70D6] bg-[#DA70D6]/10 py-2 pl-10 pr-4 text-sm text-[#79163F] placeholder:text-[#A85A9F] outline-none transition-all duration-300 focus:border-[#E96886] focus:bg-[#FFF4F5] focus:ring-2 focus:ring-[#F5BFC9]"
        />
      </div>
    </form>
  );
};

export default SearchInput;
