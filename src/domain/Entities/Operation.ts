import { Time } from "../valueObjects/Time/Time";
import { WeekDay } from "../valueObjects/WeekDay/WeekDay"



export class Operation {

    constructor(
        public readonly day: WeekDay,
        public readonly openTime: Time,
        public readonly closeTime: Time
    ) { }
}