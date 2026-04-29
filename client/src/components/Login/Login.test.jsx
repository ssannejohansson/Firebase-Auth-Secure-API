import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

const FakeLogin = ({ user }) => {
  if (user) {
    return (
      <div>
        <p>{user.displayName}</p>
        <p>{user.email}</p>
        <button>Sign out</button>
        <button>Fetch secure data</button>
      </div>
    );
  }
  return (
    <div>
      <button>Google login</button>
      <button>GitHub login</button>
    </div>
  );
};

describe("Login UI", () => {
  it("shows login buttons when no user is logged in", () => {
    render(<FakeLogin user={null} />);
    expect(screen.getByText("Google login")).toBeInTheDocument();
    expect(screen.getByText("GitHub login")).toBeInTheDocument();
  });

  it("hides login buttons when a user is logged in", () => {
    const fakeUser = { displayName: "Ada", email: "ada@test.com" };
    render(<FakeLogin user={fakeUser} />);
    expect(screen.queryByText("Google login")).not.toBeInTheDocument();
    expect(screen.queryByText("GitHub login")).not.toBeInTheDocument();
  });

  it("shows the user display name when logged in", () => {
    const fakeUser = { displayName: "Ada", email: "ada@test.com" };
    render(<FakeLogin user={fakeUser} />);
    expect(screen.getByText("Ada")).toBeInTheDocument();
  });

  it("shows a sign-out button when logged in", () => {
    const fakeUser = { displayName: "Ada", email: "ada@test.com" };
    render(<FakeLogin user={fakeUser} />);
    expect(screen.getByText("Sign out")).toBeInTheDocument();
  });

  it("shows the fetch secure data button when logged in", () => {
    const fakeUser = { displayName: "Ada", email: "ada@test.com" };
    render(<FakeLogin user={fakeUser} />);
    expect(screen.getByText("Fetch secure data")).toBeInTheDocument();
  });
});
