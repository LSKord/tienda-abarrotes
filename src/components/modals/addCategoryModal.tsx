import { Dialog } from "primereact/dialog";
import { useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import type { Nullable } from "primereact/ts-helpers";
import { postCategory } from "../../services/apiService";
import { useToast } from "../../hooks/useToast";
import { useCategories } from "../../hooks/useCategories";
import type { newCategoryModel } from "../../models/categoryModel";

interface AddCategoryModalProps {
  visible: boolean;
  onHide: () => void;
}

const AddCategoryModal = ({ visible, onHide }: AddCategoryModalProps) => {
  const [sending, setSending] = useState(false);
  const [category, setCategory] = useState<newCategoryModel>({
    nombreCategoria: "",
    descripcionCategoria: "",
  });
  const { showToast } = useToast();
  const { refreshCategories } = useCategories();

  const handleChange = (
    field: string,
    value: string | Nullable<number | null> | boolean
  ) => {
    setCategory((prev) => ({ ...prev, [field]: value }));
  };

  const onAdd = async () => {
    setSending(true);
    try {
      await postCategory(category);
      showToast("Categoría creada", "success");
      await refreshCategories();
      onHide();
    } catch (error) {
      showToast("Error al crear categorias", "error");
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  const footer = (
    <div className="flex justify-content-between gap-2 mt-3">
      <Button
        label="Cancelar"
        severity="secondary"
        onClick={() => {
          setCategory({
            nombreCategoria: "",
            descripcionCategoria: "",
          });
          onHide();
        }}
        disabled={sending}
        className="p-button-text text-black-alpha-90"
      />
      <Button
        label={"Guardar categoría"}
        icon={"pi pi-save"}
        onClick={() => onAdd()}
        loading={sending}
        className="bg-black-alpha-90"
      />
    </div>
  );

  return (
    <div>
      <Dialog
        visible={visible}
        onHide={onHide}
        draggable={false}
        closable={!sending}
        footer={footer}
        headerClassName="text-primary-700"
        header={"Agregar nueva categoría"}
        style={{ width: "30rem" }}
      >
        <div className="flex justify-content-between align-items-center mb-3">
          <p className="text-sm text-color-secondary m-0">
            {"Ingrese los detalles de la nueva categoría"}
          </p>
        </div>

        <div className="flex flex-column gap-3">
          <div>
            <label className="block mb-2 font-medium">
              Nombre de la categoría
            </label>
            <InputText
              placeholder="Escriba el nombre de la categoría..."
              className="w-full"
              value={category.nombreCategoria}
              onChange={(e) => handleChange("nombreCategoria", e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Descripción de la categoría
            </label>
            <InputText
              placeholder="Descripción de la categoría..."
              className="w-full"
              value={category.descripcionCategoria}
              onChange={(e) =>
                handleChange("descripcionCategoria", e.target.value)
              }
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default AddCategoryModal;
