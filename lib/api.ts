import axios from "axios";
import { API_BASE_URL, IS_DEBUG, KEY_USER_PROFILE } from "@/lib/config";
import { AxiosRequestConfig } from "axios";
import { AxiosResponse } from "axios";
import RequireLoginError from "./error/RequireLoginError";

const instance = axios.create({
  baseURL: API_BASE_URL, // Update the baseURL to include 'api/'
  // maxRedirects: 0,
  // withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem(KEY_USER_PROFILE) || "null");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// instance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response) {
//       switch (error.response.data.message) {
//         case "TOKEN_EXPIRED":
//           // Token has expired, log out the user
//           localStorage.removeItem("token");
//           // window.location.href = "/login";
//           return Promise.reject(new RequireLoginError(`TOKEN_EXPIRED`));
//           break;
//         case "TOKEN_INVALID":
//           // Invalid token, but don't log out
//           console.error("Invalid token");
//           // You might want to handle this case (e.g., redirect to login or refresh token)
//           return Promise.reject(new RequireLoginError(`TOKEN_INVALID`));
//           break;
//         default:
//           console.error("An error occurred:", error.response.data);
//       }
//     }
//     return Promise.reject(error);
//   },
// );

instance.interceptors.response.use(
  (response) => {
    console.log(response);
    return response;
  },
  (error) => {
    console.error(error);
    if (error.response && error.response.status === 401) {
      // Handle 401 Unauthorized error
      console.error("Unauthorized access:", error.response.data);
      localStorage.removeItem(KEY_USER_PROFILE);
      location.href = '/login';
      return Promise.reject(new RequireLoginError('Unauthorized'));
    }
    return Promise.reject(error);
  },
);

const buildUrlWithParams = (
  baseUrl: string,
  req: Record<string, string | number>,
) => {
  const newReq = Object.keys(req).reduce((acc: Record<string, string>, key) => {
    acc[key] = String(req[key]);
    return acc;
  }, {});
  const params = new URLSearchParams(newReq).toString();
  return params !== "" ? `${baseUrl}?${params}` : baseUrl;
};

const build =
  <Req, Res>(
    method: "POST" | "GET",
    path: string,
    config: AxiosRequestConfig = {},
  ) => async (req: Req): Promise<Res> => {
    const newConfig = {
      ...config
    };
    
    try {
      let ret = await (method === "POST"
        ? instance.post<Res>(path, req, newConfig)
        : instance.get<Res>(
          buildUrlWithParams(path, req as Record<string, string | number>),
          newConfig
        ));
      return ret.data;
    } catch (error) {
      if (error instanceof RequireLoginError) {
        throw error;
      }
      console.error("API request failed:", error);
      throw new Error('API request failed');
    }
  };

interface RequestLogin extends Empty {
  email: string;
  password: string;
}

interface RequestRegister extends RequestLogin {
  username: string;
  studentId: string;
}

export const apiAuthLogin = build<RequestLogin, { access_token: string }>(
  "POST",
  "/api/auth/login",
);
export const apiAllUser = build<Empty, string>("GET", "/api/user");
export const apiCreateUser = build<RequestRegister, unknown>(
  "POST",
  "/api/user",
);
export const apiMyUser = build<Empty, UserStatus>("GET", "/api/user/me");

type RequestCreateCourse = Pick<
  Course,
  "courseId" | "name" | "term" | "description" | "link"
>;

export const apiAllCourse = build<Empty, Course[]>("GET", "/api/course");
export const apiCreateCourse = build<RequestCreateCourse, unknown>(
  "POST",
  "/api/course",
);
export const apiMyCourse = build<Empty, Course[]>(
  "GET",
  "/api/course/me",
);
// export const apiCourse = build<Empty, unknown>('GET', '/api/course/???');
export const apiEnrollCourse = build<
  Pick<Course, "courseId"> & { userIds: Array<number> },
  unknown
>("POST", "/api/course/enroll");

// export const apiNewSubmission = build <
// >('POST')

export const apiMySubmission = build<
  Empty, Submission[]
  >('GET', '/api/submission/me')
// export const apiMyCourse = build<Empty,>('GET', '/api/user/me');
