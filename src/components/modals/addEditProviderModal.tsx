import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import type { Nullable } from "primereact/ts-helpers";
import { postProvider, putProvider } from "../../services/apiService";
import { useToast } from "../../hooks/useToast";
import { Checkbox } from "primereact/checkbox";
import type { ProviderModel } from "../../models/providerModel";
import { useProviders } from "../../hooks/useProviders";

interface AddEditProviderModalProps {
  visible: boolean;
  onHide: () => void;
  providerToEdit?: ProviderModel;
}

const AddEditProviderModal = ({
  visible,
  onHide,
  providerToEdit,
}: AddEditProviderModalProps) => {
  const [sending, setSending] = useState(false);
  const [provider, setProvider] = useState({
    nombreProveedor: "",
    telefonoProveedor: "",
    direccionProveedor: "",
    correoProveedor: "",
    activoProveedor: true,
  });
  const { showToast } = useToast();
  const { refreshProviders } = useProviders();
  const editable = providerToEdit;

  useEffect(() => {
    if (providerToEdit) {
      setProvider({
        nombreProveedor: providerToEdit.nombreProveedor,
        telefonoProveedor: providerToEdit.telefonoProveedor,
        direccionProveedor: providerToEdit.direccionProveedor,
        correoProveedor: providerToEdit.correoProveedor,
        activoProveedor: providerToEdit.activoProveedor,
      });
    } else {
      setProvider({
        nombreProveedor: "",
        telefonoProveedor: "",
        direccionProveedor: "",
        correoProveedor: "",
        activoProveedor: true,
      });
    }
  }, [providerToEdit, visible]);

  const handleChange = (
    field: string,
    value: string | Nullable<number | null> | boolean
  ) => {
    setProvider((prev) => ({ ...prev, [field]: value }));
  };

  const onAddEdit = async () => {
    setSending(true);
    try {
      if (editable) {
        await putProvider(provider, providerToEdit.id);
        showToast("Proveedor Editado", "success");
        await refreshProviders();
        onHide();
      } else {
        await postProvider(provider);
        showToast("Proveedor creado", "success");
        await refreshProviders();
        onHide();
      }
    } catch (error) {
      showToast("Error al guardar proveedor", "error");
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
        onClick={onHide}
        disabled={sending}
        className="p-button-text text-black-alpha-90"
      />
      <Button
        label={editable ? "Guardar cambios" : "Agregar proveedor"}
        icon={editable ? "pi pi-save" : "pi pi-check"}
        onClick={() => onAddEdit()}
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
        header={editable ? "Editar proveedor" : "Agregar nuevo proveedor"}
        style={{ width: "30rem" }}
      >
        <div className="flex justify-content-between align-items-center mb-3">
          <p className="text-sm text-color-secondary m-0">
            {editable
              ? "Modifique los campos del proveedor"
              : "Ingrese los detalles del nuevo proveedor"}
          </p>

          {editable && (
            <div className="flex align-items-center gap-2">
              <Checkbox
                inputId="activo"
                checked={provider.activoProveedor}
                onChange={(e) => handleChange("activoProveedor", e.checked)}
              />
              <label htmlFor="activo" className="font-medium">
                Habilitado
              </label>
            </div>
          )}
        </div>

        <div className="flex flex-column gap-3">
          <div>
            <label className="block mb-2 font-medium">
              Nombre del proveedor
            </label>
            <InputText
              placeholder="Escriba el nombre del proveedor..."
              className="w-full"
              value={provider.nombreProveedor}
              onChange={(e) => handleChange("nombreProveedor", e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Dirección del proveedor
            </label>
            <InputText
              placeholder="Dirección del proveedor..."
              className="w-full"
              value={provider.direccionProveedor}
              onChange={(e) =>
                handleChange("direccionProveedor", e.target.value)
              }
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Telefono</label>
            <InputText
              placeholder="0123456789"
              maxLength={10}
              value={provider.telefonoProveedor}
              inputMode="numeric"
              onChange={(e) =>
                handleChange("telefonoProveedor", e.target.value)
              }
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Correo electronico</label>
            <InputText
              placeholder="correo@ejemplo.com"
              value={provider.correoProveedor}
              inputMode="email"
              onChange={(e) => handleChange("correoProveedor", e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default AddEditProviderModal;
