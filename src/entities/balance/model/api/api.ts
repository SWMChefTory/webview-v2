import client from "@/src/shared/client/main/client";
import { parseWithErrLog } from "@/src/entities/schema/logger/zodErrorLogger";

import { BalanceSchema } from "@/src/entities/balance/model/api/schema/balanceSchema";

export const fetchBalance = async () => {
  const response = await client.get("/credit/balance");
  return parseWithErrLog(BalanceSchema, response.data);
};
