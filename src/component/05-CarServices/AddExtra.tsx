import { ChangeEvent, FormEvent, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

type AddFormProps = {
  submitCallback: (values: { refFormDetails: string; refPrice: string }[]) => void;
};

type InputPair = {
  refFormDetails: string;
  refPrice: string;
};

function AddExtra({ submitCallback }: AddFormProps) {
  const [values, setValues] = useState<InputPair[]>([]);
  const [isFormSubmitting, setIsformSubmitting] = useState(false);

  function addInputField() {
    const last = values[values.length - 1];
    if (last && (last.refFormDetails === "" || last.refPrice === "")) {
      return; // Prevent adding if last pair is incomplete
    }
    setValues((prev) => [...prev, { refFormDetails: "", refPrice: "" }]);
  }

  function removeInput(idx: number) {
    setValues((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleInputChange(
    e: ChangeEvent<HTMLInputElement>,
    idx: number,
    field: keyof InputPair
  ) {
    const updated = [...values];
    updated[idx][field] = e.target.value;
    setValues(updated);
  }

  function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsformSubmitting(true);

    const filtered = values.filter((v) => v.refFormDetails && v.refPrice);
    if (filtered.length > 0) {
      submitCallback(filtered);

      setTimeout(() => {
        setValues([]);
        setIsformSubmitting(false);
      }, 500);
    } else {
      setIsformSubmitting(false);
    }
  }

  return (
    <div>
      <Button
        icon="pi pi-plus"
        label="Add"
        className="p-button-success p-button-sm"
        onClick={addInputField}
        tooltip="Add another input pair"
      />
      <form onSubmit={handleFormSubmit}>
        {values.map((val, i) => (
          <div key={i} className="mt-3 flex items-center gap-2">
            <InputText
              value={val.refFormDetails}
              onChange={(e) => handleInputChange(e, i, "refFormDetails")}
              placeholder="Extra Charge (e.g., Child seat)"
            />
            <InputText
              value={val.refPrice}
              onChange={(e) => handleInputChange(e, i, "refPrice")}
              placeholder="Price (e.g., 250)"
            />
            <Button
              type="button"
              icon="pi pi-times"
              className="p-button-danger p-button-sm"
              onClick={() => removeInput(i)}
              tooltip="Remove this entry"
            />
          </div>
        ))}
        {values.length > 0 && (
          <div className="mt-3">
            <Button type="submit" label="Submit" loading={isFormSubmitting} />
          </div>
        )}
      </form>
    </div>
  );
}

export default AddExtra;
