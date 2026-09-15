import { Button, Spinner, Text } from "@chakra-ui/react";
import useCategories from "../hooks/useCategories";

const CategoriesBar = () => {
  const { data: categories, isFetching, error } = useCategories();

  if (error) return <Text>{error.message}</Text>;

  if (isFetching) {
    return <Spinner margin="auto" display="block" marginTop={10} />;
  }

  return (
    <>
      {categories?.map((c) => (
        <Button
          key={c.category_id}
          variant="outline"
          borderRadius={25}
          flexShrink={0}
          borderWidth="2px"
        >
          {c.name}
        </Button>
      ))}
    </>
  );
};

export default CategoriesBar;
