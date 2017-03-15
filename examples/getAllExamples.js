import path from 'path';

const examples = {};

function requireExample(exampleFile, requireFn) {
  // Extract the component name from the file name:
  const componentName = path.basename(exampleFile, '_example.jsx');
  return { [componentName]: requireFn(exampleFile).default };
}

function requireExamples(requireContext) {
  requireContext.keys().forEach((exampleFile) => {
    Object.assign(examples, requireExample(exampleFile, requireContext));
  });
}

export default function getAllExamples() {
  // Require all examples:
  requireExamples(require.context('.', true, /_example\.jsx$/));

  return examples;
}
