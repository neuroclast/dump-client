import { Injectable } from "@angular/core";
import {HttpHeaders} from "@angular/common/http";


@Injectable()
export class Globals {
  public httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  public dumpTypeMap  = {
    "None": "none",
    "C / C++": "clike",
    "TypeScript": "typescript",
    "JavaScript": "javascript",
    "Java": "java",
    "HTML": "html"
  };

  get invertedDumpTypeMap() {
    let ret = {};
    for(let key in this.dumpTypeMap){
      ret[this.dumpTypeMap[key]] = key;
    }
    return ret;
  }
}
