import { Flex, Title, Select } from "@mantine/core";
import Preview from "@/components/preview";
import { useEffect, useState } from "react";
import Challenge from "../challenge";
import CodeEditor from "@components/code-editor";

export default function Playground() {
  const [cssType, setCssType] = useState<string>("normal");

  const cssOptions = (cssType: string) => {
    let cdn = "";

    switch (cssType) {
      case "tailwind":
        cdn = `<script src="https://cdn.tailwindcss.com"></script>`;
        break;
      case "bootstrap":
        cdn = `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">`;
        break;
      default:
        break;
    }

    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${cdn}
    <style>
        /* Add your custom styles here */
    </style>
  </head>
  <body>
    <h1>Edit your code here</h1>
    <p>Choose the type of css you want to use from the dropdown above</p>
    <p>Have Fun Practicing 🚀</p>
  </body>
</html>`;
  };

  const [value, setValue] = useState(cssOptions(cssType));

  useEffect(() => {
    setValue(cssOptions(cssType));
  }, [cssType]);

  const handleChangeValue = (newValue: string | undefined) => {
    if (!newValue) return;
    setValue(newValue);
  };

  return (
    <Flex direction="column">
      <Flex
        gap="md"
        direction="row"
        className="w-[90%] self-center items-center"
        mb="md"
        align="end"
      >
        <Select
          label="Choose CSS type"
          value={cssType}
          onChange={(value) => setCssType(value || "normal")}
          data={[
            { value: "normal", label: "Normal CSS" },
            { value: "tailwind", label: "Tailwind CSS" },
            { value: "bootstrap", label: "Bootstrap CSS" },
          ]}
        />
        {/* TODO: add hardcoded challenge here! */}
        <Challenge
          objectives={[
            "Add a linear background from black (bottom left) to gray color (top right)",
            "Create 2 circles of size 250px on top left and bottom right of the screen",
            "Create a square in the middle of the screen",
            "The square should be partially transparent and overlap with the 0 circles as shown in the reference",
            "Add the word 'Style Wars' inside the square",
          ]}
          isActive={true}
          imageUrl={
            "https://files.stamford.dev/stamford-center/stylewars/practice-challenge.png"
          }
        />
      </Flex>

      <Flex justify="center" gap="md" align="center">
        <CodeEditor
          value={value}
          onChange={handleChangeValue}
          remainingTime={80}
          practice={true}
        />
        <Preview value={value} />
      </Flex>
    </Flex>
  );
}
