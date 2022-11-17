import {Component, ComponentInterface, h, State} from '@stencil/core';
import {PageProcessService} from '../../services/pageProcess.service';
import {Subscription} from 'rxjs';

@Component({
  tag: 'page-header-loading',
  styleUrl: 'page-header-loading.scss'
})
export class PageHeaderLoading implements ComponentInterface {

  @State() headerProgress = false;
  private subscriptions: Subscription[] = [];

  componentWillLoad() {
    this.subscriptions.push(PageProcessService.process.subscribe((headerProgress) => {
      this.headerProgress = headerProgress;
    }));
  }

  disconnectedCallback() {
    this.subscriptions.forEach((subscription: Subscription, index) => {
      subscription.unsubscribe();
      this.subscriptions.splice(index, 1);
    });
  }

  render() {
    return (
      <div>
        {(this.headerProgress === true) &&
          <ion-progress-bar class="top" type="indeterminate" color="secondary">
          </ion-progress-bar>
        }
      </div>
    );
  }

}
