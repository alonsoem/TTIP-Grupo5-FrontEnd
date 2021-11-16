/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { rest } from "msw";
import { setupServer } from "msw/node";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import MainCalc from "../components/MainCalc";

global.sessionStorage = {
  getItem: () => undefined,
};

const history = createMemoryHistory();
history.push("/");

const server = setupServer();

const setup = () => {
  return render(
    <MemoryRouter>
      <MainCalc history={history} match={{ params: { id: 1 } }} />
    </MemoryRouter>
  );
};

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("Layout works", () => {
  const { container } = setup();

  expect(container.querySelector('[type="submit"]')).toHaveTextContent(
    "Calculate"
  );
});

test("No input throws error", async () => {
  server.use(
    rest.post("http://localhost:8080/broker/calculate", (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );
  const { container } = setup();

  fireEvent.click(container.querySelector('[type="submit"]'));
  await waitFor(() => screen.getByRole("alert"));

  expect(screen.getByRole("alert")).toHaveTextContent("error");
});

test("Amount input should have a $ in front of the input", () => {
  const { container } = setup();

  expect(container.getElementsByClassName("fa-dollar-sign").length).toBe(1);
});

test("Amount input should not allow letters", () => {
  const { container } = setup();
  const input = container.querySelector('[type="text"]');

  fireEvent.change(input, { target: { value: "Good Day" } });

  expect(input.value).toBe("");
});
