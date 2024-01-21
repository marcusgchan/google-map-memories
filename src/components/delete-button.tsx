"use client";

import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

export const DeleteButton = ({ memoryId }: { memoryId: number }) => {
  const router = useRouter();
  const mutation = api.memory.delete.useMutation({
    onSuccess() {
      router.refresh();
    },
  });

  const onClickDeleteMemory = () => {
    mutation.mutate({ id: memoryId });
  };

  return (
    <Button className="ml-2" onClick={onClickDeleteMemory}>
      Delete
    </Button>
  );
};
