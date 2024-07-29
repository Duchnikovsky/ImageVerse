import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const session = await getAuthSession();

  let followedUsersId: string[] = [];

  if (session) {
    const followedUsers = await db.following.findMany({
      where: {
        followerId: session.user.id,
      },
    });

    followedUsersId = followedUsers.map((follow) => follow.followedId);
  }

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

    let orderBy = {};

    if (session) {
      if (followedUsersId.length === 0) {
        whereClause = {
          NOT: {
            authorId: session?.user.id,
          },
        };
        orderBy = {
          votes: {
            _count: "desc",
          },
        };
      } else {
        whereClause = {
          authorId: {
            in: followedUsersId,
          },
        };
        orderBy = {
          createdAt: "desc",
        };
      }
    } else {
      orderBy = {
        votes: {
          _count: "desc",
        },
      };
    }

    const posts = await db.post.findMany({
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      orderBy: [
        orderBy,
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

    if (postsCount === 0 && followedUsersId.length > 0) {
      const proposedPosts = await db.post.findMany({
        take: parseInt(limit),
        skip: (parseInt(page) - 1) * parseInt(limit),
        orderBy: [
          orderBy,
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
