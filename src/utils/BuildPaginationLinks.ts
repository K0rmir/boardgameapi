import { Request } from "express";


// Helper function to build pagination links //
export const buildPaginationLinks = (
    req: Request,
    page: number,
    totalPages: number
): { nextPage: string | null; prevPage: string | null } => {
    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${req.path
        }`;
    const query = new URLSearchParams(req.query as any);

    // Build next page URL
    query.set("page", (page + 1).toString());
    const nextPage = page < totalPages ? `${baseUrl}?${query.toString()}` : null;

    // Build previous page URL
    query.set("page", (page - 1).toString());
    const prevPage = page > 1 ? `${baseUrl}?${query.toString()}` : null;

    return { nextPage, prevPage };
};