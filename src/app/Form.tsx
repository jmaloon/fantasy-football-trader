import Form from "next/form";

export default function FormComponent() {
  return (
    <Form action="">
      <fieldset>
        <legend>Format:</legend>

        <div>
          <input type="radio" id="redraft" name="format" value="redraft" />
          <label htmlFor="redraft">Redraft</label>
        </div>

        <div>
          <input type="radio" id="dynasty" name="format" value="dynasty" />
          <label htmlFor="dynasty">Dynasty</label>
        </div>
      </fieldset>

      <fieldset>
        <legend>PPR:</legend>

        <div>
          <input type="radio" id="zero" name="ppr" value="0" />
          <label htmlFor="zero">0</label>
        </div>
        <div>
          <input type="radio" id="half" name="ppr" value="0.5" />
          <label htmlFor="half">0.5</label>
        </div>
        <div>
          <input type="radio" id="full" name="ppr" value="1" />
          <label htmlFor="full">1</label>
        </div>
      </fieldset>

      <button>Submit</button>
    </Form>
  );
}
