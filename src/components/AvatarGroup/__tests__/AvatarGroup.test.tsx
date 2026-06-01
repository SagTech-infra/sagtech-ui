import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import AvatarGroup from "../AvatarGroup";

const people = [
  { name: "Alice Adams" },
  { name: "Bob Brown" },
  { name: "Carol Clark" },
  { name: "Dan Davis" },
  { name: "Eve Evans" },
];

describe("AvatarGroup", () => {
  it("renders every avatar when within max", () => {
    render(<AvatarGroup avatars={people.slice(0, 3)} max={5} />);
    expect(screen.getByText("AA")).toBeInTheDocument();
    expect(screen.getByText("BB")).toBeInTheDocument();
    expect(screen.getByText("CC")).toBeInTheDocument();
    expect(screen.queryByText(/^\+\d/)).toBeNull();
  });

  it("clamps to max and shows an overflow counter", () => {
    render(<AvatarGroup avatars={people} max={3} />);
    expect(screen.getByText("AA")).toBeInTheDocument();
    expect(screen.getByText("CC")).toBeInTheDocument();
    expect(screen.queryByText("DD")).toBeNull();
    expect(screen.getByText("+2")).toBeInTheDocument();
  });

  it("shows no counter when the count equals max", () => {
    render(<AvatarGroup avatars={people.slice(0, 3)} max={3} />);
    expect(screen.queryByText(/^\+\d/)).toBeNull();
  });

  it("exposes a labelled group when a label is provided", () => {
    render(<AvatarGroup avatars={people.slice(0, 2)} label="Team" />);
    expect(screen.getByRole("group", { name: "Team" })).toBeInTheDocument();
  });

  it("renders no images for an empty list", () => {
    const { container } = render(<AvatarGroup avatars={[]} />);
    expect(container.querySelectorAll("img").length).toBe(0);
  });
});
