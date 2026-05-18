import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PageHeader from "../PageHeader";

describe("PageHeader", () => {
  it("renders the title", () => {
    render(<PageHeader title="Members" />);
    expect(screen.getByText("Members")).toBeInTheDocument();
  });

  it("renders eyebrow when provided", () => {
    render(<PageHeader title="Members" eyebrow="Settings" />);
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("does not render eyebrow when omitted", () => {
    render(<PageHeader title="Members" />);
    expect(screen.queryByText("Settings")).not.toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    render(<PageHeader title="Members" subtitle="Manage access." />);
    expect(screen.getByText("Manage access.")).toBeInTheDocument();
  });

  it("renders the actions slot", () => {
    render(<PageHeader title="Members" actions={<button>Invite</button>} />);
    expect(screen.getByRole("button", { name: "Invite" })).toBeInTheDocument();
  });

  it("does not render actions container when actions is omitted", () => {
    const { container } = render(<PageHeader title="Members" />);
    expect(container.querySelector(".shrink-0")).toBeNull();
  });

  it("merges extra className onto the header element", () => {
    const { container } = render(
      <PageHeader title="Members" className="custom-cls" />,
    );
    expect(container.firstChild).toHaveClass("custom-cls");
  });
});
