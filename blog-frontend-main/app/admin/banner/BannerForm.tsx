"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { IBanner } from "./page";

const bannerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  imageUrl: z.string().min(1, "Image URL is required"),
  link: z.string().optional(),
  isActive: z.boolean().default(true),
});

type BannerFormData = z.infer<typeof bannerSchema>;

interface BannerFormProps {
  initialData?: IBanner;
  onSubmit: (data: FormData) => Promise<void>;
}

const BannerForm: React.FC<BannerFormProps> = ({ initialData, onSubmit }) => {
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    initialData?.imageUrl ? initialData.imageUrl : null
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BannerFormData>({
    resolver: zodResolver(bannerSchema),
    defaultValues: initialData || {},
  });

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setValue("imageUrl", URL.createObjectURL(file));
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    multiple: false,
  });

  const handleFormSubmit = async (data: BannerFormData) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("imageUrl", data.imageUrl);
    if (data.link) {
      formData.append("link", data.link);
    }
    formData.append("isActive", data.isActive.toString());
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <Input id="title" {...register("title")} className="mt-1" />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="imageUrl"
          className="block text-sm font-medium text-gray-700"
        >
          Image URL
        </label>
        <Input id="imageUrl" {...register("imageUrl")} className="mt-1" />
        {errors.imageUrl && (
          <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="link"
          className="block text-sm font-medium text-gray-700"
        >
          Link
        </label>
        <Input id="link" {...register("link")} className="mt-1" />
        {errors.link && (
          <p className="mt-1 text-sm text-red-600">{errors.link.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Thumbnail
        </label>
        <div
          {...getRootProps()}
          className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
        >
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
              >
                <span>Upload a file</span>
                <input {...getInputProps()} />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
        {thumbnailPreview && (
          <div className="mt-2">
            <Image
              src={thumbnailPreview}
              alt="Thumbnail preview"
              width={100}
              height={100}
              className="h-32 w-32 object-cover"
            />
          </div>
        )}
      </div>

      <div className="flex items-center">
        <label
          htmlFor="isActive"
          className="block text-sm font-medium text-gray-700 mr-2"
        >
          Active
        </label>
        <Controller
          name="isActive"
          control={control}
          render={({ field }) => (
            <input
              type="checkbox"
              className="form-checkbox"
              checked={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      <Button type="submit">
        {initialData ? "Update Banner" : "Create Banner"}
      </Button>
    </form>
  );
};

export default BannerForm;
