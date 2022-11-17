import { Component, h } from '@stencil/core';
import {PageProcessService} from "../../services/pageProcess.service";

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.scss',
})
export class AppRoot {

  ionRouteDidChange(_event) {
    PageProcessService.stop()
  }

  ionRouteWillChange(_event) {
    PageProcessService.start()
  }

  render() {
    return (
      <ion-app>
        <page-header-loading/>
        <ion-router useHash={false}
                    onIonRouteDidChange={(event) => this.ionRouteDidChange(event)}
                    onIonRouteWillChange={(event) => this.ionRouteWillChange(event)}>
          <ion-route url="/" component="app-home" />
          <ion-route url="/profile/:name" component="app-profile" />
        </ion-router>
        <ion-nav />
      </ion-app>
    );
  }
}
