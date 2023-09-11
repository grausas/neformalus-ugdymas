import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

export default function Search({ handleSearch, value }: any) {
  return (
    <InputGroup>
      <InputLeftElement pointerEvents="none" alignItems="center" h="100%">
        <SearchIcon color="brand.30" />
      </InputLeftElement>
      <Input
        placeholder="Ieškoti veiklos"
        fontSize="sm"
        shadow="md"
        bg="brand.10"
        pl="10"
        rounded="xl"
        h="0"
        py="4"
        onChange={handleSearch}
        value={value}
      />
    </InputGroup>
  );
}
