/**
 * 레시피 도메인 모듈
 * 레시피 정보 조회 훅 제공
 * 유저 소유 여부에 따라 반환하는 레시피 달라짐
 */
export { RECIPE_QUERY_KEY, useFetchRecipe } from "./model/useRecipe";
export type { Recipe } from "./model/api/api";
export type { ViewStatus } from "./model/api/api";