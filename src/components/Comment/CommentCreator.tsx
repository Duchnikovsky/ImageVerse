"use client";

import CSS from "@/styles/postDetails.module.css";
import UserAvatar from "../UserAvatar";
import { useState } from "react";
import { Button } from "../Button";
import { useMutation } from "@tanstack/react-query";
import { CommentCreationRequest } from "@/lib/validators/comment";
import axios from "axios";
import { useRouter } from "next/navigation";

interface CommentCreatorProps {
  postId: string;
  name: string;
  image: string;
}

export default function CommentCreator({
  postId,
  name,
  image,
}: CommentCreatorProps) {
  const [input, setInput] = useState<string>("");
  const router = useRouter();

  const {mutate: comment, isLoading} = useMutation({
    mutationFn: async ({ postId, commentValue }: CommentCreationRequest) => {
      const payload: CommentCreationRequest = {
        postId,
        commentValue: commentValue,
      };

      const { data } = await axios.patch(`/api/post/comment`, payload);

      return data;
    },
    onError: (err) => {
      //TOAST
    },
    onSuccess: () => {
      router.refresh()
      setInput('')
    }
  });

  return (
    <div className={CSS.creator}>
      <div className={CSS.creatorUpper}>
        <UserAvatar user={{ name: name, image: image }} style={"small"} />
        <textarea
          className={CSS.textarea}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add your comment"
          spellCheck={false}
          maxLength={100}
        ></textarea>
      </div>
      <div className={CSS.creatorLower}>
        <Button
          width="30%"
          height="1.75rem"
          fontSize="16px"
          isLoading={isLoading}
          isDisabled={!(input.length > 2 && input.length < 101)}
          onClick={() => comment({postId: postId, commentValue: input})}
        >
          Post
        </Button>
      </div>
    </div>
  );
}
