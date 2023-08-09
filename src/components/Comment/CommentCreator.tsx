"use client";

import CSS from "@/styles/postDetails.module.css";
import UserAvatar from "../UserAvatar";
import { useState } from "react";
import { Button } from "../Button";
import { useMutation } from "@tanstack/react-query";
import { CommentCreationRequest } from "@/lib/validators/comment";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

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
      if (err instanceof AxiosError) {
        return toast.error(err.response?.data, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }

      return toast.error("An error occured", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    },
    onSuccess: () => {
      router.refresh()
      setInput('')
      return toast.success("Successfully posted comment", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
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
