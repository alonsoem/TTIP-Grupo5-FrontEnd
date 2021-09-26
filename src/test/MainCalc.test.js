/**
 * @jest-environment jsdom
 */
import { render, fireEvent, screen } from "@testing-library/react";
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
