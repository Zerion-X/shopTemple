import { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Input,
  Field,
  Card,
  Separator,
  Spinner,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { create } from "../services/categoriesService";
import useCategories from "../hooks/useCategories";

const CategoryManagementPage = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const { data: categories, isFetching, isError } = useCategories();

  const { mutate, isPending } = useMutation({
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setName("");
      setError("");
    },
    onError: () => {
      setError("Failed to create category. Please try again.");
    },
  });

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }
    mutate({ name: name.trim() });
  };

  return (
    <Box maxWidth="700px" margin="auto" padding={6}>
      <VStack align="stretch" gap={4}>
        <Heading size="lg">Categories Management</Heading>

        <Separator marginY={2} />

        <Card.Root padding={5}>
          <Card.Body>
            <VStack align="stretch" gap={4}>
              <Field.Root invalid={!!error}>
                <Field.Label>Category name</Field.Label>
                <Input
                  placeholder="e.g. Skincare"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmit();
                  }}
                />
                {error && <Field.ErrorText>{error}</Field.ErrorText>}
              </Field.Root>

              <Button
                alignSelf="flex-start"
                onClick={handleSubmit}
                loading={isPending}
              >
                Add Category
              </Button>
            </VStack>
          </Card.Body>
        </Card.Root>

        <Separator marginY={2} />

        <Heading size="md">All Categories</Heading>

        {isFetching && (
          <HStack justify="center" paddingY={8}>
            <Spinner />
          </HStack>
        )}

        {isError && <Text color="red.500">Failed to load categories.</Text>}

        {!isFetching && !isError && categories?.length === 0 && (
          <Text color="gray.500">No categories yet.</Text>
        )}

        <VStack align="stretch" gap={3}>
          {categories?.map((category) => (
            <Box
              key={category.category_id}
              borderWidth="1px"
              borderRadius="lg"
              padding={4}
            >
              <Text fontWeight="medium">{category.name}</Text>
            </Box>
          ))}
        </VStack>
      </VStack>
    </Box>
  );
};

export default CategoryManagementPage;
