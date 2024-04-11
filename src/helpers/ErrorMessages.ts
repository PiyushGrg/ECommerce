export const getCatchErrorMessage = (error : any) => {
    return error.response?.data?.message || error.message;
};