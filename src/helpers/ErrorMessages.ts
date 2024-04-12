export const getCatchErrorMessage = (error : any) => {
    return error.response?.data?.message || error.message;
};

export const antdFieldValidation = [
    {
      required: true,
      message: "This field is required",
    },
];