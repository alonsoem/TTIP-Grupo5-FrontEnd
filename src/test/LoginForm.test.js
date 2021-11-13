/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import LoginForm from "../components/LoginForm";
import { createMemoryHistory } from "history";
import { rest } from "msw";
import { setupServer } from "msw/node";
import React from "react";
import { MemoryRouter } from "react-router-dom";

global.sessionStorage = {
  getItem: () => undefined,
};

const history = createMemoryHistory();
history.push("/");

const server = setupServer();

const setup = () => {
  return render(
    <MemoryRouter>
      <LoginForm history={history} />
    </MemoryRouter>
  );
};

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("Layout works", () => {
  const { container } = setup();

  expect(container.querySelector('[type="submit"]')).toHaveTextContent(
    "Submit"
  );
});

test("No username or password shows error messages", async () => {
  server.use(
    rest.post("http://localhost:8080/authenticate", (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );
  const { container } = setup();

  fireEvent.click(container.querySelector('[type="submit"]'));

  await waitFor(() => screen.getByRole("alert"));

  expect(screen.getByRole("alert")).toHaveTextContent("error");
});

test("Log in header is visible", async () => {
  setup();

  expect(await screen.findByText("Log in")).toBeVisible();
});

test("ALEC image is present", async () => {
  setup();

  expect(screen.getByRole("img")).toBeVisible();
});
