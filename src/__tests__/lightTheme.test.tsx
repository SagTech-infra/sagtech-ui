import { render } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import Popover from "@/components/Popover/Popover";
import Tooltip from "@/components/Tooltip/Tooltip";

describe("light theme smoke", () => {
  beforeEach(() => document.documentElement.setAttribute("data-theme", "light"));
  afterEach(() => document.documentElement.removeAttribute("data-theme"));

  it("renders Popover trigger under data-theme=light without crashing", () => {
    const { getByText } = render(
      <Popover trigger={<span>open</span>}>content</Popover>,
    );
    expect(getByText("open")).toBeInTheDocument();
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("renders Tooltip child under data-theme=light without crashing", () => {
    const { getByText } = render(
      <Tooltip content="tip"><span>hover</span></Tooltip>,
    );
    expect(getByText("hover")).toBeInTheDocument();
  });
});
