import React, { useEffect, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const schema = z.object({
  title: z
    .string()
    .nonempty("Title is required")
    .min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().nonempty("Description is required"),
  content: z.string().nonempty("Title is required"),
});

const App = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    trigger,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const editorRef = useCallback(
    (node) => {
      if (node !== null) {
        const editor = new Quill(node, {
          theme: "snow",
          placeholder: "Write something...",
        });

        editor.on("text-change", () => {
          const content = editor.root.innerHTML;
          setValue("content", content); // Update the form value
          trigger("content");
        });
      }
    },
    [setValue, trigger]
  );

  const formRef = useRef(null);

  useEffect(() => {
    // Call the editorRef callback after the component is mounted
    editorRef(formRef.current.querySelector(".editor"));
  }, [editorRef]);

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="form">
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input type="text" {...register("title")} />
        {errors.title && <span className="error">{errors.title.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <input type="text" {...register("description")} />
        {errors.description && (
          <span className="error">{errors.description.message}</span>
        )}
      </div>

      <div className="form-group quill">
        <label htmlFor="content">Content</label>
        <div className="editor"></div>
        {errors.content && (
          <span className="error">{errors.content.message}</span>
        )}
      </div>

      <button className="submit_btn" type="submit">
        Submit
      </button>
    </form>
  );
};

export default App;
