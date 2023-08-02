import { Comment, User } from "@prisma/client";
import Link from "next/link";
import CSS from '@/styles/post.module.css'

interface ExtendedComment extends Comment {
  author: User;
}

interface FeedCommentProps {
  comments: ExtendedComment[];
}

export default function FeedComment({ comments }: FeedCommentProps) {
  return (
    <div>
      {comments && comments.map((comment, index: number) => {
        return (
          <div key={index} className={CSS.userComment}>
            <Link href={`/profile/${comment.author.id}`} className={CSS.userCommentName}>
              {comment.author.name}
            </Link>: {comment.text}
          </div>
        );
      })}
    </div>
  );
}
