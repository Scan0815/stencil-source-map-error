import {BehaviorSubject} from 'rxjs';


class PageProcessServiceController {

  private process$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public process = this.process$.asObservable();

  start() {
    this.process$.next(true);
  }

  stop() {
    this.process$.next(false);
  }
}

export const PageProcessService = new PageProcessServiceController();
