/**
 * @jest-environment jsdom
 */
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import React from "react";
import MainCalc from "../components/MainCalc";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import { createMemoryHistory } from "history";

global.localStorage = {
  getItem: () => undefined,
};

const history = createMemoryHistory();
history.push("/");

const server = setupServer();
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("Layout works", () => {
  const { container } = render(
    <MemoryRouter>
      <MainCalc history={history} />
    </MemoryRouter>
  );

  expect(container.querySelector('[type="submit"]')).toHaveTextContent(
    "Enviar"
  );
});

test("No input throws error", async () => {
  server.use(
    rest.post("http://localhost:8080/tax/calculate", (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );

  const { container } = render(
    <MemoryRouter>
      <MainCalc history={history} />
    </MemoryRouter>
  );

  fireEvent.click(container.querySelector('[type="submit"]'));

  await waitFor(() => screen.getByRole("alert"));

  expect(screen.getByRole("alert")).toHaveTextContent("error");
});
