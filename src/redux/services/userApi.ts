import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const accesToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwicGFzc3dvcmQiOiIkMmIkMDkkZy4xS3ZyTWpiam11NkNKd2N1Rk5FZW4uSmh1cHpGV25lZUFRejAuWVBpcHNDTDdvVTIuaTIiLCJpc0FkbWluIjp0cnVlfSwiaWF0IjoxNjkwMjI2Mjg5LCJleHAiOjE2OTAyMzM0ODl9.D1pcgzMoVKXIH9cxsDReLE1T-W9X88-OquK9A3_btpk";
type Moto = {
  allUsers: [
    id: any,
    name: string | number,
    email: string | number,
    address: string | number,
    phone: string | number,
    status: string | number
  ];
};

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://fastdeliveryserver.xyz/api/user/",
    prepareHeaders: (headers) => {
      headers.set("Authorization", `Bearer ${accesToken}`);
    }
  }),
  endpoints: (builder) => ({
    getUsers: builder.query<Moto, null>({
      query: () => "deliveries"
    }),
    getUserById: builder.query<unknown, { id: string }>({
      query: ({ id }) => `user/details/${id}`
    })
  })
});

export const { useGetUsersQuery } = userApi;
