import { Input, InputGroup } from "@chakra-ui/react";
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
      style={{ flex: 1 }}
      onSubmit={(event) => {
        event?.preventDefault();
        if (ref.current) {
          setSearchText(ref.current.value);
          navigate("/");
        }
      }}
    >
      <InputGroup width="100%" startElement={<BsSearch />}>
        <Input
          ref={ref}
          borderRadius={10}
          placeholder="Search makeups..."
          variant="subtle"
        />
      </InputGroup>
    </form>
  );
};

export default SearchInput;
