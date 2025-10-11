import client from "@/src/shared/client/main/client";
import { useQuery } from "@tanstack/react-query";
import camelcaseKeys from "camelcase-keys";

//TODO: 제거
// const fetchUser = async () => {
//   const response = await client.get("/users/me");
//   if (!response.data) {
//     throw new Error("응답에 body가 없습니다.");
//   }
//   return camelcaseKeys(response.data, { deep: true });
// };


const fetchUser = async () => {
    const response = await client.get("/users/me");
    if (!response.data) {
      throw new Error("응답에 body가 없습니다.");
    }
    const user = camelcaseKeys(response.data, { deep: true });
    if (!user) {
      throw new Error("User is not found");
    }
    return user;
  };

export const useUser = () => {
    const {data: userData, isLoading, isError} = useQuery({
        queryKey: ["user"],
        queryFn: fetchUser,
    });
    return {user: userData, isLoading, isError};
};