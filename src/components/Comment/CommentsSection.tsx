import CSS from "@/styles/PostfeedStyles/comment.module.scss";
import { ExtendedPost } from "@/types/db";
import Link from "next/link";
import FeedComment from "./FeedComment";
import ReactTextareaAutosize from "react-textarea-autosize";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { CommentCreationRequest } from "@/lib/validators/comment";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

async function postComment(postId: string, commentValue: string) {
  const payload: CommentCreationRequest = {
    postId,
    commentValue: commentValue,
  };

  const { data } = await axios.post(`/api/post/comment`, payload);

  return data;
}

export default function CommentsSection({ post }: { post: ExtendedPost }) {
  const [value, setValue] = useState<string>("");
  const router = useRouter();

  const {
    mutate: comment,
    isSuccess,
    isPending,
  } = useMutation({
    mutationFn: ({ postId, commentValue }: CommentCreationRequest) =>
      postComment(postId, commentValue),
    onError: (err) => {
      if (err instanceof AxiosError) {
        return toast.error(err.response?.data);
      }
      return toast.error("An error occured");
    },
    onSuccess: () => {
      router.refresh();
      setValue("");
      return toast.success("Successfully posted comment");
    },
  });

  return (
    <div className={CSS.main}>
      <div className={CSS.author}>
        <Link href={`/profile/${post.author.id}`}>
          <span>{post.author.name}</span>
        </Link>
        : {post.description}
      </div>
      <div className={CSS.comments}>
        <FeedComment comments={post.comments} />
      </div>
      {isSuccess ? (
        <div className={CSS.success}>
          <CheckCircle size={20} /> Successfully posted comment
        </div>
      ) : (
        <div className={CSS.newComment}>
          <ReactTextareaAutosize
            placeholder="Post your comment"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={CSS.textArea}
            spellCheck="false"
            maxLength={200}
          />
          {value.length > 2 && (
            <div
              className={CSS.postComment}
              onClick={() => {
                if (isPending) return;
                comment({ postId: post.id, commentValue: value });
              }}
            >
              Post
            </div>
          )}
        </div>
      )}
    </div>
  );
}
