/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";

global.localStorage = {
  getItem: () => undefined,
};

const history = createMemoryHistory();
history.push("/");

const setup = () => {
  return render(
    <MemoryRouter>
      <RegisterForm history={history} />
    </MemoryRouter>
  );
};

test("Layout works", () => {
  const { container } = setup();

  expect(container.querySelector('[type="submit"]')).toHaveTextContent(
    "Submit"
  );
});

test("No username or password shows error messages", async () => {
  const { container } = setup();

  fireEvent.click(container.querySelector('[type="submit"]'));

  expect(await screen.findByText("Email is invalid or missing")).toBeVisible();
  expect(
    await screen.findByText("Password must be at least 4 characters")
  ).toBeVisible();
});

test("Registration message is visible", async () => {
  setup();

  expect(
    await screen.findByText(
      "Welcome to ALEC, please sign up to use our services."
    )
  ).toBeVisible();
});

test("Image is present", async () => {
  setup();

  expect(screen.getByRole("img")).toBeVisible();
});
