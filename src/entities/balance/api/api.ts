import client from "@/src/shared/client/main/client";
import { parseWithErrLog } from "@/src/shared/schema/zodErrorLogger";
import { BalanceSchema } from "../type/balanceScheme";

export const fetchBalance = async () => {
  const response = await client.get("/credit/balance");
  return parseWithErrLog(BalanceSchema, response.data);
};
