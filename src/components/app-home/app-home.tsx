import { Component, h } from '@stencil/core';
import Helmet from '@stencil/helmet';
import {UploadWorker} from "../../upload.worker";

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.scss',
})
export class AppHome {

  async call(){
    await UploadWorker('','','');
  }

  render() {
    return [ <Helmet>
      <title>test</title>
      <meta name="description" content="test"/>
    </Helmet>,
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Home</ion-title>
        </ion-toolbar>
      </ion-header>,

      <ion-content class="ion-padding">

        <p>
          Welcome to the PWA Toolkit. You can use this starter to build entire apps with web components using Stencil and ionic/core! Check out the README for everything that comes
          in this starter out of the box and check out our docs on <a href="https://stenciljs.com">stenciljs.com</a> to get started.
        </p>

        <ion-button href="/profile/ionic" expand="block">
          Profile page
        </ion-button>
        <ion-button href="/profile/oliver" expand="block">
          Profile page 2
        </ion-button>
        <ion-button href="/profile/scan" expand="block">
          Profile page 3
        </ion-button>
        <ion-button href="/profile/scan" expand="block">
          Profile page 3
        </ion-button>
      </ion-content>,
    ];
  }
}
