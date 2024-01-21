"use client";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

export const DeleteButton = ({ memoryId }: { memoryId: number }) => {
  const mutation = api.memory.delete.useMutation({});

  const onClickDeleteMemory = () => {
    mutation.mutate({ id: memoryId });
  };

  return <Button onClick={onClickDeleteMemory}>Delete</Button>;
};
