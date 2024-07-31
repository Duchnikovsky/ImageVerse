"use client";
import CSS from "@/styles/creator.module.scss";
import { FormEvent, useRef, useState } from "react";
import Image from "next/image";
import { uploadFiles } from "@/lib/uploadthing";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "./UI/Button";
import { toast } from "react-toastify";
import { LuUpload } from "react-icons/lu";

const PostValidator = z.object({
  image: z.string(),
  description: z
    .string()
    .min(3, { message: "Description must be longer than 3 characters" })
    .max(300, { message: "Description can't be longer than 300 characters" }),
});

type PostCreationRequest = z.infer<typeof PostValidator>;

export default function PostCreator({ modal }: { modal: boolean }) {
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<File>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const inputRef = useRef<any>();
  function handleImageClick() {
    inputRef.current.click();
  }

  function handleImageChange(e: React.FormEvent) {
    const input = e.target as HTMLInputElement;
    const file = input.files![0];
    setImage(file);
  }

  const { mutate: createPost } = useMutation({
    mutationFn: async ({ image, description }: PostCreationRequest) => {
      const payload: PostCreationRequest = {
        image,
        description,
      };
      const { data } = await axios.post("/api/post/create", payload);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        return toast.error(err.response?.data);
      }
      return toast.error("An error occured");
    },
    onSuccess: () => {
      if (modal) {
        router.back();
      } else {
        router.push("/");
      }
    },
  });

  async function submitHandler(event: FormEvent) {
    setLoading(true);
    event.preventDefault();
    const uploadedImage = await uploadFiles({
      files: [image!],
      endpoint: "imageUploader",
    });
    const payload: PostCreationRequest = {
      image: uploadedImage[0].fileUrl,
      description: description,
    };
    try {
      const validate = PostValidator.parse(payload);
      createPost(payload);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form id="newpost-form" onSubmit={submitHandler} className={CSS.creator}>
      <div className={CSS.input} onClick={handleImageClick}>
        {image ? (
          <Image
            alt="image"
            src={URL.createObjectURL(image)}
            fill
            className={CSS.image}
          ></Image>
        ) : (
          <div className={CSS.upload}>
            <LuUpload size={64} />
            Upload image from your device
            <span>
              The image will automatically be stretched to the size of the
              window with an aspect ratio of 9:10<br></br>
              <br></br>
              <i>
                Acceptable file types are <b>PNG</b>, <b>JPG</b> and <b>JPEG</b>
              </i>
            </span>
          </div>
        )}
        <input
          type="file"
          ref={inputRef}
          onChange={handleImageChange}
          style={{ display: "none" }}
          accept=".png, .jpg, .jpeg"
        />
      </div>
      <div className={CSS.textarea}>
        <textarea
          className={CSS.description}
          placeholder="Description"
          maxLength={300}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          spellCheck="false"
        ></textarea>
        <div className={CSS.limit}>
          {description.length}/<span className={CSS.gray}>300</span>
        </div>
      </div>
      <Button
        width="16rem"
        height="2.5rem"
        isDisabled={!(image && description.length > 3)}
        isLoading={isLoading}
        fontSize="20px"
        margin={"auto"}
      >
        Post
      </Button>
    </form>
  );
}
