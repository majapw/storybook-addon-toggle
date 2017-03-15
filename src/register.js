import addons from '@kadira/storybook-addons';

class Toggle {
  constructor(api, channel) {
    this.api = api;
    this.channel = channel;
    this.storiesByType = {};

    this.toggleComponentsView = this.toggleComponentsView.bind(this);
  }

  toggleComponentsView(type) {
    this.api.setStories(this.storiesByType[type]);
    this.api.setQueryParams({
      viewMode: type,
    });
  }

  registerChannelListeners() {
    this.hasSetInitialComponentView = false;

    this.channel.on('toggle/initialize-stories', ({ storiesByType, type }) => {
      this.storiesByType = storiesByType;

      const viewMode = this.api.getQueryParam('viewMode');
      if (viewMode !== type && storiesByType[viewMode]) {
        this.api.setStories(storiesByType[viewMode]);
        this.api.setQueryParams({ viewMode });
      } else {
        this.api.setStories(storiesByType[type]);
        this.api.setQueryParams({
          viewMode: type,
        });
      }
    });

    this.channel.on('toggle/toggle-stories', this.toggleComponentsView);
  }
}

addons.register('toggle-stories', (api) => {
  const toggle = new Toggle(api, addons.getChannel());
  toggle.registerChannelListeners();
});
