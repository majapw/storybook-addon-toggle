import React, { PropTypes } from 'react';
import addons from '@kadira/storybook-addons';

const propTypes = {
  children: PropTypes.node,
  storyTypes: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string,
    stories: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      stories: PropTypes.arrayOf(PropTypes.string),
    })),
  })).isRequired,
  type: PropTypes.string.isRequired,
};

const defaultProps = {
  children: null,
};

export default class WithToggle extends React.Component {
  constructor(props) {
    super(props);

    const storiesByType = {};
    this.types = [];
    props.storyTypes.forEach(({ type, stories }) => {
      this.types.push(type);
      storiesByType[type] = stories;
    });

    const channel = addons.getChannel();
    channel.emit('toggle/initialize-stories', {
      storiesByType,
      type: this.types[0],
    });

    this.toggleStoryView = this.toggleStoryView.bind(this);
  }

  toggleStoryView() {
    const { type } = this.props;

    const currentIndex = this.types.indexOf(type);
    const nextType = this.types[(currentIndex + 1) % this.types.length];

    const channel = addons.getChannel();
    channel.emit('toggle/toggle-stories', nextType);
  }

  render() {
    const { children } = this.props;
    return (
      <div>
        {children}

        <div
          style={{
            position: 'fixed',
            bottom: 8,
            right: 8,
            zIndex: 9999,
          }}
        >
          <button
            type="button"
            onClick={this.toggleStoryView}
          >
            Toggle View Mode
          </button>
        </div>
      </div>
    );
  }
}

WithToggle.propTypes = propTypes;
WithToggle.defaultProps = defaultProps;
