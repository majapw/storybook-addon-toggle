import React from 'react';
import { storiesOf, configure } from '@kadira/storybook';
import WithToggle from '../src/index';

import getAllExamples from '../examples/getAllExamples';

const allExamples = getAllExamples();
const types =
  Array.from(new Set(Object.values(allExamples).map(examplesFunc => examplesFunc().viewMode)));
const storyTypes = types.map(type => (
  {
    type,
    stories: Object.entries(allExamples)
      .filter(([, examplesFunc]) => examplesFunc().viewMode === type)
      .map(([kind, examplesFunc]) => (
        {
          kind,
          stories: examplesFunc().examples.map(example => example.description),
        }
      )),
  }
));

function loadStories() {
  Object.entries(allExamples).forEach(([name, examplesFunc]) => {
    const story = storiesOf(name, module);
    const { examples, viewMode } = examplesFunc();

    examples.forEach(
      ({ example, description }) => {
        const exampleComponent = typeof example === 'function' ? example() : example;

        const args = [
          description,
        ];

        args.push(
          () => (
            <WithToggle
              storyTypes={storyTypes}
              type={viewMode}
            >
              {exampleComponent}
            </WithToggle>
          ),
        );

        return story.add(...args);
      },
    );
  });
}

configure(loadStories, module);
