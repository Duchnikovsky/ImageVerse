import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const { userId } = z
      .object({
        userId: z.string(),
      })
      .parse({
        userId: body.userId,
      });

    if (userId === session.user.id) {
      return new Response("You can't follow yourself", { status: 411 });
    }

    const isFollowed = await db.following.findFirst({
      where: {
        followedId: userId,
        followerId: session.user.id,
      },
    });

    if (isFollowed) {
      return new Response("You are already following this user", {
        status: 400,
      });
    }

    await db.following.create({
      data: {
        followedId: userId,
        followerId: session.user.id,
      },
    });

    return new Response(userId);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid data", { status: 422 });
    }

    return new Response("Could not follow, try again later", { status: 500 });
  }
}
