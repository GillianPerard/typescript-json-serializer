import { Employee } from './employee';
import { Panther } from './panther';
export declare class Zoo {
    boss: Employee;
    city: string;
    country: string;
    employees: Array<Employee>;
    id: number;
    name: string;
    panthers: Array<Panther>;
    isOpen: boolean;
    constructor();
}
