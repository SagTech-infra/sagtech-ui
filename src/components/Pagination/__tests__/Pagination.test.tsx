import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Pagination from "../Pagination";

describe("Pagination — offset mode (default)", () => {
  it("renders page number buttons", () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />,
    );
    expect(screen.getByLabelText("Page 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Page 5")).toBeInTheDocument();
  });

  it('marks the current page with aria-current="page"', () => {
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={() => {}} />,
    );
    expect(screen.getByLabelText("Page 3")).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("fires onPageChange with the clicked page number", () => {
    const spy = vi.fn();
    render(<Pagination currentPage={1} totalPages={5} onPageChange={spy} />);
    fireEvent.click(screen.getByLabelText("Page 3"));
    expect(spy).toHaveBeenCalledWith(3);
  });

  it("fires onPageChange with currentPage - 1 when prev is clicked", () => {
    const spy = vi.fn();
    render(<Pagination currentPage={3} totalPages={5} onPageChange={spy} />);
    fireEvent.click(screen.getByLabelText("Previous page"));
    expect(spy).toHaveBeenCalledWith(2);
  });

  it("fires onPageChange with currentPage + 1 when next is clicked", () => {
    const spy = vi.fn();
    render(<Pagination currentPage={3} totalPages={5} onPageChange={spy} />);
    fireEvent.click(screen.getByLabelText("Next page"));
    expect(spy).toHaveBeenCalledWith(4);
  });

  it("disables the previous button on page 1", () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />,
    );
    expect(screen.getByLabelText("Previous page")).toBeDisabled();
  });

  it("disables the next button on the last page", () => {
    render(
      <Pagination currentPage={5} totalPages={5} onPageChange={() => {}} />,
    );
    expect(screen.getByLabelText("Next page")).toBeDisabled();
  });

  it("renders label below the page numbers", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={() => {}}
        label="Showing 1–10 of 50"
      />,
    );
    expect(screen.getByText("Showing 1–10 of 50")).toBeInTheDocument();
  });

  it("disables both nav buttons when loading=true", () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={() => {}}
        loading
      />,
    );
    expect(screen.getByLabelText("Previous page")).toBeDisabled();
    expect(screen.getByLabelText("Next page")).toBeDisabled();
  });

  it("disables both nav buttons when disabled=true", () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={() => {}}
        disabled
      />,
    );
    expect(screen.getByLabelText("Previous page")).toBeDisabled();
    expect(screen.getByLabelText("Next page")).toBeDisabled();
  });

  it('applies compact padding class when size="compact"', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={() => {}}
        size="compact"
      />,
    );
    // The prev/next buttons should include py-4px
    const prevBtn = screen.getByLabelText("Previous page");
    expect(prevBtn.className).toMatch(/py-4px/);
  });
});

describe("Pagination — cursor mode", () => {
  it("renders only Previous and Next buttons (no page numbers)", () => {
    render(
      <Pagination
        mode="cursor"
        hasPrevious
        hasNext
        onPreviousPage={() => {}}
        onNextPage={() => {}}
      />,
    );
    expect(screen.getByLabelText("Previous page")).toBeInTheDocument();
    expect(screen.getByLabelText("Next page")).toBeInTheDocument();
    // No page number buttons
    expect(screen.queryByLabelText("Page 1")).not.toBeInTheDocument();
  });

  it("calls onPreviousPage when Previous is clicked", () => {
    const spy = vi.fn();
    render(
      <Pagination
        mode="cursor"
        hasPrevious
        hasNext
        onPreviousPage={spy}
        onNextPage={() => {}}
      />,
    );
    fireEvent.click(screen.getByLabelText("Previous page"));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("calls onNextPage when Next is clicked", () => {
    const spy = vi.fn();
    render(
      <Pagination
        mode="cursor"
        hasPrevious
        hasNext
        onPreviousPage={() => {}}
        onNextPage={spy}
      />,
    );
    fireEvent.click(screen.getByLabelText("Next page"));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("disables prev button when hasPrevious=false", () => {
    render(
      <Pagination
        mode="cursor"
        hasPrevious={false}
        hasNext
        onPreviousPage={() => {}}
        onNextPage={() => {}}
      />,
    );
    expect(screen.getByLabelText("Previous page")).toBeDisabled();
  });

  it("does not disable next button when hasPrevious=false", () => {
    render(
      <Pagination
        mode="cursor"
        hasPrevious={false}
        hasNext
        onPreviousPage={() => {}}
        onNextPage={() => {}}
      />,
    );
    expect(screen.getByLabelText("Next page")).not.toBeDisabled();
  });

  it("disables next button when hasNext=false", () => {
    render(
      <Pagination
        mode="cursor"
        hasPrevious
        hasNext={false}
        onPreviousPage={() => {}}
        onNextPage={() => {}}
      />,
    );
    expect(screen.getByLabelText("Next page")).toBeDisabled();
  });

  it("disables both buttons when loading=true", () => {
    render(
      <Pagination
        mode="cursor"
        hasPrevious
        hasNext
        loading
        onPreviousPage={() => {}}
        onNextPage={() => {}}
      />,
    );
    expect(screen.getByLabelText("Previous page")).toBeDisabled();
    expect(screen.getByLabelText("Next page")).toBeDisabled();
  });

  it("disables both buttons when disabled=true", () => {
    render(
      <Pagination
        mode="cursor"
        hasPrevious
        hasNext
        disabled
        onPreviousPage={() => {}}
        onNextPage={() => {}}
      />,
    );
    expect(screen.getByLabelText("Previous page")).toBeDisabled();
    expect(screen.getByLabelText("Next page")).toBeDisabled();
  });

  it("renders label between prev and next", () => {
    render(
      <Pagination
        mode="cursor"
        hasPrevious
        hasNext
        label="Showing 1–20 of 156"
        onPreviousPage={() => {}}
        onNextPage={() => {}}
      />,
    );
    expect(screen.getByText("Showing 1–20 of 156")).toBeInTheDocument();
  });

  it('applies compact padding class when size="compact"', () => {
    render(
      <Pagination
        mode="cursor"
        hasPrevious
        hasNext
        size="compact"
        onPreviousPage={() => {}}
        onNextPage={() => {}}
      />,
    );
    const prevBtn = screen.getByLabelText("Previous page");
    expect(prevBtn.className).toMatch(/py-4px/);
  });
});
