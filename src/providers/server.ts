import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

export class ServerService {
  url = 'http://163.172.134.15';
  reqTimeout = 5000;

  extractData(data: Response) {
    return data.json();
  }

  catchError(err: Response | any) {
    err.title = err.title || 'An error occurred';
    err.message = err.message || 'Please try again later';
    return err.json ? Observable.throw(err.json()) : Observable.throw(err);
  }
}
