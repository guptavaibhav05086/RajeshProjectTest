import { City} from './City';
import { ApiResponse } from './shared/ApiResponse';

export class State{
    public _id: string;
    public name: string;
    public cities: City[];
}

export class StateAPiResponse extends ApiResponse{
    data: State[];
}