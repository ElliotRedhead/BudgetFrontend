/**
 * The Authorization header for API requests as the logged-in user.
 * @returns Headers carrying the stored access token
 */
export const authHeaders = () => ({ "Authorization": `JWT ${localStorage.getItem("access_token")}` });
