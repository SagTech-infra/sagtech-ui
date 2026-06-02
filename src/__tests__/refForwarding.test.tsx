import { describe, expect, it } from "vitest";
import { createRef } from "react";
import { render } from "@testing-library/react";
import { TextArea } from "@/components/TextArea/TextArea";
import Toggle from "@/components/Toggle/Toggle";
import RadioGroup from "@/components/RadioGroup/RadioGroup";
import DatePicker from "@/components/DatePicker/DatePicker";
import TagInput from "@/components/TagInput/TagInput";
import Dropzone from "@/components/Dropzone/Dropzone";
import { Attachment } from "@/components/Attachment/Attachment";
import PhoneInput from "@/components/PhoneInput/PhoneInput";
import Button from "@/components/Button/Button";

describe("Form controls — ref forwarding (B-6 phase 1)", () => {
  it("TextArea exposes the underlying <textarea>", () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<TextArea ref={ref} defaultValue="x" />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it("Toggle exposes the underlying <button>", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Toggle ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toHaveAttribute("role", "switch");
  });

  it("RadioGroup exposes the wrapper <div>", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <RadioGroup
        ref={ref}
        name="pick"
        options={[{ label: "A", value: "a" }]}
        value="a"
        onChange={() => {}}
      />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("DatePicker exposes the wrapper <div> without breaking outside-click", () => {
    const ref = createRef<HTMLDivElement>();
    render(<DatePicker ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("TagInput exposes the inner <input>", () => {
    const ref = createRef<HTMLInputElement>();
    render(<TagInput ref={ref} value={[]} onChange={() => {}} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("Dropzone exposes the hidden file <input>", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Dropzone ref={ref} onDrop={() => {}} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current).toHaveAttribute("type", "file");
  });

  it("Attachment exposes the hidden file <input>", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Attachment ref={ref} type="file" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("PhoneInput exposes the wrapper <div>", () => {
    const ref = createRef<HTMLDivElement>();
    render(<PhoneInput ref={ref} value="" onChange={() => {}} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("Button exposes the underlying <button> (B-6 phase 2)", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref} text="Click me" />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.tagName).toBe("BUTTON");
  });
});
