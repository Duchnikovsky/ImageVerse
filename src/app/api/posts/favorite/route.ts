import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

export async function GET(req: Request) {
  const session = await getAuthSession();

  const url = new URL(req.url);

  try {
    if (!session) {
      return new Response("unauthorized", { status: 401 });
    }

    const { limit, page } = z
      .object({
        limit: z.string(),
        page: z.string(),
      })
      .parse({
        limit: url.searchParams.get("limit"),
        page: url.searchParams.get("page"),
      });

    let favorizedPostsId: string[] = [];

    const favorizedPosts = await db.favorite.findMany({
      where: {
        userId: session.user.id,
      },
    });

    favorizedPostsId = favorizedPosts.map((favorite) => favorite.postId);

    const posts = await db.post.findMany({
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: true,
        votes: true,
      },
      where: {
        id: {
          in: favorizedPostsId,
        },
      },
    });

    return new Response(JSON.stringify(posts));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid data", { status: 422 });
    }

    return new Response("Could not fetch posts, try again later", {
      status: 500,
    });
  }
}
