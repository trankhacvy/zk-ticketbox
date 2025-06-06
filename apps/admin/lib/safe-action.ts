import { createSafeActionClient } from "next-safe-action";

export const actionClient = createSafeActionClient({
  handleServerError(e, _) {
    console.error("[action][actionClient] Server action error:", e.message);

    return {
      success: false,
      data: null,
      error: "Internal server error",
    };
  },
});

export interface ActionResponse<T> {
  data?: T;
  success: boolean;
  error?: string;
}

export type ActionEmptyResponse = ActionResponse<null>;
