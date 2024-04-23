import { Button, Modal, Input, Textarea, ModalContent, ModalBody, ModalHeader, ModalFooter } from "@nextui-org/react";
import toast from "react-hot-toast";
import React, { useEffect } from "react";
import axios from "axios";
import { getCatchErrorMessage } from "@/helpers/ErrorMessages";
import ModalTitle from "@/components/ModalTitle";
import { useDispatch } from "react-redux";
import { SetLoading } from "@/redux/LoadersSlice";


interface CategoryFormProps {
    showCategoryForm: boolean;
    setShowCategoryForm: any;
    selectedCategory: any;
    setSelectedCategory: any;
    reloadCategories: any;
}

function CategoryForm({
  showCategoryForm,
  setShowCategoryForm,
  selectedCategory,
  setSelectedCategory,
  reloadCategories,
}: CategoryFormProps) {
  
    const [category,setCategory] = React.useState<any>({
      name: '',
      description: ''
    });

    const dispatch = useDispatch();

  const onFinish = async () => {
    try {
      dispatch(SetLoading(true));
      let response;
      if (selectedCategory) {
        response = await axios.put(
          `/api/admin/categories/${selectedCategory._id}`,
          category
        );
      } else {
        response = await axios.post("/api/admin/categories", category);
      }
      toast.success("Category Added Successfully");
      setShowCategoryForm(false);
      reloadCategories();
      setSelectedCategory(null);
    } catch (error : any) {
        toast.error(getCatchErrorMessage(error));
    } finally {
        dispatch(SetLoading(false));
    }
  };

  useEffect(()=>{
    if(selectedCategory){
        setCategory({name:selectedCategory.name,description:selectedCategory.description});
    }
  },[selectedCategory]);

  const modalTitle = selectedCategory ? "Edit Category" : "Add Category";

  return (
    <Modal
      isOpen={showCategoryForm}
      onOpenChange={() => {
        setShowCategoryForm(false);
        setSelectedCategory(null);
      }}
      placement="top-center"
    >
      <ModalContent>
            <>
              <ModalHeader className="flex flex-col gap-1">{<ModalTitle title={modalTitle} />}</ModalHeader>
              <ModalBody>
                <Input
                    label="Name"
                    labelPlacement="outside"
                    placeholder="Enter category name"
                    value={category.name}
                    onChange={(e)=>setCategory({...category,name:e.target.value})} 
                  />
                <Textarea
                  label="Description"
                  labelPlacement="outside"
                  placeholder="Enter description"
                  value={category.description}
                  onChange={(e)=>setCategory({...category,description:e.target.value})} 
                />
              </ModalBody>
              <ModalFooter>
                <div className="flex justify-end gap-5">
                  <Button onClick={() => setShowCategoryForm(false)}>Cancel</Button>
                  <Button color="primary" onClick={onFinish}>
                    Submit
                  </Button>
                </div>
              </ModalFooter>
            </>
      </ModalContent>
    </Modal>
  );
}

export default CategoryForm;