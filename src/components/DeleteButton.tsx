import React from "react";

interface DeleteButtonProps {
    title: string;
    onClick: any;
}

function DeleteButton({ title, onClick }: DeleteButtonProps) {
  return (
    <span
      onClick={onClick}
      className="bg-red-900 cursor-pointer text-white px-3 py-1  hover:bg-red-900"
    >
      {title}
    </span>
  );
}

export default DeleteButton;

