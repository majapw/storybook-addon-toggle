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

function renderToggleButton(onClick, type) {
  const showHarryPotterButton = type === 'sw';

  let buttonAltText;
  let buttonText;
  let style;
  if (showHarryPotterButton) {
    buttonAltText = 'This button is slytherin themed.';
    buttonText = '⚡ Go to Harry Potter Mode ⚡';
    style = {
      background: '#006600',
      color: '#fff',
      border: '3px solid #006600',
    };
  } else {
    buttonAltText = 'This button is alliance themed.';
    buttonText = '★ Go to Star Wars Mode ★';
    style = {
      background: '#fff',
      color: '#B20000',
      border: '3px solid #B20000',
    };
  }

  return (
    <button
      type="button"
      onClick={onClick}
      title={buttonAltText}
      style={{
        ...style,
        padding: 8,
        fontSize: 16,
        fontWeight: 'bold',
        borderRadius: 3,
        lineHeight: '24px',
      }}
    >
      {buttonText}
    </button>
  );
}

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
              renderCustomButton={onClick => renderToggleButton(onClick, viewMode)}
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
