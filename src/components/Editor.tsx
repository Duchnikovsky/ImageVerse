"use client";
import CSS from "@/styles/editor.module.css";
import { FormEvent, useRef, useState } from "react";
import Image from "next/image";
import { uploadFiles } from "@/lib/uploadthing";
import { LucideUpload } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "./Button";
import { toast } from "react-toastify";

const PostValidator = z.object({
  image: z.string(),
  description: z
    .string()
    .min(3, { message: "Description must be longer than 3 characters" })
    .max(300, { message: "Description can't be longer than 300 characters" }),
});

type PostCreationRequest = z.infer<typeof PostValidator>;

interface EditorProps {
  modal: boolean;
}

export default function Editor({ modal }: EditorProps) {
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
    <form id="newpost-form" onSubmit={submitHandler} className={CSS.form}>
      <div className={CSS.fileInput} onClick={handleImageClick}>
        {image ? (
          <Image
            alt="image"
            src={URL.createObjectURL(image)}
            fill
            className={CSS.image}
          ></Image>
        ) : (
          <div className={CSS.uploadLayout}>
            {<LucideUpload size={64} />}
            <div style={{ textAlign: "center" }}>
              Upload image from your device
            </div>
            <div className={CSS.imageInfo}>
              The image will automatically be stretched to the size of the
              window with an aspect ratio of 9:10<br></br>
              <br></br>
              <i>
                Acceptable file types are <b>PNG</b>, <b>JPG</b> and <b>JPEG</b>
              </i>
            </div>
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
        <div className={CSS.characterLimit}>
          {description.length}/<span className={CSS.gray}>300</span>
        </div>
      </div>
      <Button
        width="40%"
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

{
  /* <form
        id="newpost-form"
        onSubmit={submitHandler}
        style={{ width: "100%" }}
      >
        <div className={CSS.fileInput} onClick={handleImageClick}>
          {image ? (
            <Image
              alt="image"
              src={URL.createObjectURL(image)}
              fill
              className={CSS.image}
            ></Image>
          ) : (
            <div className={CSS.uploadLayout}>
              {<LucideUpload size={64} />}
              <div style={{ textAlign: "center" }}>
                Upload image from your device
              </div>
              <div className={CSS.imageInfo}>
                The image will automatically be stretched to the size of the
                window with an aspect ratio of 9:10<br></br>
                <br></br>
                <i>
                  Acceptable file types are <b>PNG</b>, <b>JPG</b> and{" "}
                  <b>JPEG</b>
                </i>
              </div>
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
          <div className={CSS.characterLimit}>
            {description.length}/<span className={CSS.gray}>300</span>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: "15px" }}>
          <Button
            width="40%"
            height="2.5rem"
            isDisabled={!(image && description.length > 3)}
            isLoading={isLoading}
            fontSize="20px"
            margin={'auto'}
          >
            Post
          </Button>
        </div>
      </form> */
}
