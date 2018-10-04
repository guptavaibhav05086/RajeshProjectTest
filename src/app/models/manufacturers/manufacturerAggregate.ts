import { ManufacturerModel } from "./manufacturerModel";
import { State } from "../States";

export class ManufacturerAggregate {
    public manufacturers : ManufacturerModel[];
    public states: State[];
}