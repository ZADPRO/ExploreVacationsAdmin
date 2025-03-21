import { ChangeEvent, FormEvent, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

type AddFormProps = {
  submitCallback: (values: string[]) => void
};

function AddForm({ submitCallback }: AddFormProps) {
  const [values, setValues] = useState<string[]>([]);
  const [isFormSubmitting, setIsformSubmitting] = useState(false);

  function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsformSubmitting(true)
    submitCallback(values.filter(value => !!value))
    setIsformSubmitting(false)
  }

  function addInputField() {
    setValues(prev => {
      if (prev[prev.length - 1] === "") {
        return prev
      } else {
        return ([...prev, ""])
      }
    })
  }

  function removeInput(idx: number) {
    setValues((prev) => prev.filter((_, i) => i !== idx));

  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>, idx: number) {
    setValues(prev => [...prev.slice(0, idx), e.target.value, ...prev.slice(idx + 1)])
  }

  return (
    <div>
      <Button
        icon="pi pi-plus"
        label="Add"
        className="p-button-success p-button-sm"
        onClick={addInputField}
        tooltip="Add another benefit"
      />
      <form onSubmit={handleFormSubmit}>
        {values.map((value, i) =>
          <div className="mt-3 flex items-center gap-2" key={i}>
            <InputText value={value} onChange={(e) => handleInputChange(e, i)} name={`val${i}`} />
            <Button
              type="button"
              icon="pi pi-times"
              className="p-button-danger p-button-sm"
              onClick={() => removeInput(i)}
              tooltip="Remove this location"
            />
          </div>
        )}
        {values.length > 0 ?
          <div className="mt-3">
            <Button type="submit" label="Submit" loading={isFormSubmitting} />
          </div>
          : null}
      </form>
    </div>
  );
}

export default AddForm;
