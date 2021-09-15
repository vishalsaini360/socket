import {Injectable} from "@angular/core";
import {Current} from "./currentData";


@Injectable()
export class AppProvider {
    current: Current;

    constructor( ) {
 
        this.current = new Current();
    }

}
