"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EndShiftDto, ShiftDto, StartShiftDto, endShift, getActiveShift, startShift } from "@/lib/api/shifts";

export const useShift = (branchId?: number, userId?: number) => {
  const queryClient = useQueryClient();

  const activeShiftQuery = useQuery<ShiftDto | null>({
    queryKey: ["shift", "active", branchId, userId],
    queryFn: () => getActiveShift(branchId!, userId!),
    enabled: !!branchId && !!userId,
    staleTime: 60_000,
  });

  const startShiftMutation = useMutation<ShiftDto, Error, StartShiftDto>({
    mutationFn: (payload) => startShift(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["shift", "active", variables.branchId, variables.userId] });
    },
  });

  const endShiftMutation = useMutation<ShiftDto, Error, EndShiftDto>({
    mutationFn: (payload) => endShift(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["shift", "active", data.branchId, data.userId] });
    },
  });

  return { activeShiftQuery, startShiftMutation, endShiftMutation };
};

