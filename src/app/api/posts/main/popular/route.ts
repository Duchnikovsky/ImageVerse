import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const session = await getAuthSession();

  try {
    const { limit, page } = z
      .object({
        limit: z.string(),
        page: z.string(),
      })
      .parse({
        limit: url.searchParams.get("limit"),
        page: url.searchParams.get("page"),
      });

    let whereClause = {};

    const posts = await db.post.findMany({
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      orderBy: [
        {
          votes: {
            _count: "desc",
          },
        },
        {
          createdAt: "desc",
        },
      ],
      include: {
        author: true,
        comments: {
          take: 3,
          orderBy: {
            createdAt: "desc",
          },
          include: {
            author: true,
          },
        },
        votes: true,
        favorite: true,
      },
      where: whereClause,
    });

    const postsCount = await db.post.count({
      where: whereClause,
    });

    if (postsCount === 0) {
      const proposedPosts = await db.post.findMany({
        take: parseInt(limit),
        skip: (parseInt(page) - 1) * parseInt(limit),
        orderBy: [
          {
            votes: {
              _count: "desc",
            },
          },
          {
            createdAt: "desc",
          },
        ],
        include: {
          author: true,
          comments: {
            take: 3,
            orderBy: {
              createdAt: "desc",
            },
            include: {
              author: true,
            },
          },
          votes: true,
          favorite: true,
        },
        where: {
          NOT: {
            authorId: session?.user.id,
          },
        },
      });
      return new Response(
        JSON.stringify({ posts: proposedPosts, status: "noPosts" })
      );
    }

    return new Response(JSON.stringify({ posts: posts, status: "ok" }));
  } catch (error) {
    return new Response("Could not fetch posts", { status: 500 });
  }
}
