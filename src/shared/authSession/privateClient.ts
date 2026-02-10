import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

/**
 * 인증 전용 bare axios 인스턴스.
 * interceptor 없음 (순환 의존 방지).
 * 인증 API 호출 시에만 사용 (login, token reissue 등).
 */
const privateClient = axios.create({
  baseURL: BASE_URL,
});

export default privateClient;
