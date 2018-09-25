import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { Problem } from "../models/problem.model";

const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};

@Injectable({
  providedIn: 'root'
})

export class DataService {
  private _problemSource = new BehaviorSubject<Problem[]>([]);
  constructor(private httpClient: HttpClient) { }

  // getProblems(): Problem[] {
  // 	return this.problems;
  // }
  // getProblem(id: number): Problem {
  // 	return this.problems.find( (problem) => problem.id === id );
  // }
  // addProblem(problem: Problem) {
  // 	problem.id = this.problems.length + 1;
  // 	this.problems.push(problem);
  // }
  getProblems(): Observable<Problem[]> {
    this.httpClient.get('api/v1/problems')
      .toPromise()
      .then((res: any) => {
        this._problemSource.next(res);
      })
      .catch(this.handleError);

      return this._problemSource.asObservable();
  }

  getProblem(id: number): Promise<Problem> {
    return this.httpClient.get(`api/v1/problems/${id}`)
      .toPromise()
      .then((res: any) => res)
      .catch(this.handleError);
  }

  addProblem(problem: Problem) {
    return this.httpClient.post('api/v1/problems', problem, options)
      .toPromise()
      .then((res: any) => {
        this.getProblems();

        return res;
      })
      .catch(this.handleError);
  }

  modifyProblem(problem: Problem) {
    return this.httpClient.put(`/api/v1/problems/${problem.id}`, problem, options)
      .toPromise()
      .then((res: any) => {
        this.getProblems();
        return res;
      })
      .catch(this.handleError);
  }

  buildAndRun(data): Promise<any> {
    // define the Content-Type in http request header
    // Content-Type declears the body type when you issue a POST request
    const options = { headers: new HttpHeaders({'Content-Type': "application/json"})};

    return this.httpClient.post('api/v1/build_and_run', data, options)
      .toPromise() // convert observable to promise
      .then(res => {
        console.log(res);
        return res;
      })
      .catch(this.handleError);
  }


  private handleError(error: any): Promise<any> {
    return Promise.reject(error.body || error);
  }
}