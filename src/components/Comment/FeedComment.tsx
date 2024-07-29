import { Comment, User } from "@prisma/client";
import Link from "next/link";
import CSS from "@/styles/PostfeedStyles/comment.module.scss";

interface ExtendedComment extends Comment {
  author: User;
}

interface FeedCommentProps {
  comments: ExtendedComment[];
}

export default function FeedComment({ comments }: FeedCommentProps) {
  return (
    <div>
      {comments &&
        comments.map((comment, index: number) => {
          return (
            <div key={index} className={CSS.comment}>
              <Link
                href={`/profile/${comment.author.id}`}
                className={CSS.userCommentName}
              >
                <span>{comment.author.name}</span>
              </Link>
              : {comment.text}
            </div>
          );
        })}
    </div>
  );
}
