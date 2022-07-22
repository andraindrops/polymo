import { composeStories } from "@storybook/testing-react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import * as stories from "@/components/example.stories";

describe("components/Example", () => {
  const { Default } = composeStories(stories);

  test("Show text", () => {
    const { getByTestId } = render(<Default text="This is a test text." />);
    const text = getByTestId("text");
    expect(text).toHaveTextContent("This is a test text.");
  });
});
