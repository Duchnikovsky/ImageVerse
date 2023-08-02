import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const session = await getAuthSession();

    const { postId } = z
      .object({
        postId: z.string(),
      })
      .parse({
        postId: body.postId,
      });

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const existingFavorite = await db.favorite.findFirst({
      where: {
        userId: session.user.id,
        postId: postId,
      },
    });

    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: true,
        votes: true,
      },
    });

    if (!post) {
      return new Response("Post not found", { status: 404 });
    }

    if (existingFavorite) {
      await db.favorite.delete({
        where: {
          userId_postId: {
            postId,
            userId: session.user.id,
          },
        },
      });
      return new Response("OK");
    }

    await db.favorite.create({
      data: {
        userId: session.user.id,
        postId,
      },
    });
    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid data", { status: 422 });
    }

    return new Response("Could not vote, try again later", { status: 500 });
  }
}
