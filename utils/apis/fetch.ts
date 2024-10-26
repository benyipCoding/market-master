export const BASE_URL = process.env.BASE_URL;

export const post = (path: string, formData: FormData) => {
  return fetch(path, {
    method: "POST",
    body: formData,
  });
};
