import { Employee } from '../models/employee';
import { Gender } from '../models/gender';
import { Human } from '../models/human';
import { Organization } from '../models/organization';
import { Panther } from '../models/panther';
import { Snake } from '../models/snake';
import { Status } from '../models/status';
import { UnknownAnimal } from '../models/unknown-animal';
import { Zoo } from '../models/zoo';

export const data: any = {
    id: '1',
    name: 'Zoos Organization',
    zoos: [
        {
            id: 15,
            name: 'The Greatest Zoo',
            city: 'Bordeaux',
            coordinates: [1, 2, 3],
            country: 'France',
            boss: {
                id: 1,
                name: 'Bob Razowsky',
                birthDate: '1984-04-03T22:00:00.000Z',
                email: 'bob.razowsky@tgzoo.fr',
                gender: 1
            },
            employees: [
                {
                    id: 1,
                    name: 'Bob Razowsky',
                    birthDate: '1984-04-03T22:00:00.000Z',
                    email: 'bob.razowsky@tgzoo.fr',
                    gender: 1
                },
                {
                    id: 2,
                    name: 'Mikasa Ackerman',
                    birthDate: '1984-01-11T22:00:00.000Z',
                    email: 'mikasa.ackerman@tgzoo.fr',
                    gender: 0
                },
                {
                    id: 3,
                    name: 'Red Redington',
                    birthDate: '1970-12-04T22:00:00.000Z',
                    email: 'red.redington@tgzoo.fr',
                    gender: 1
                },
                {
                    id: 4,
                    name: 'Fried Richter',
                    birthDate: '1994-04-01T22:00:00.000Z',
                    email: 'fried.richter@tgzoo.fr',
                    gender: 1
                }
            ],
            Animals: [
                {
                    id: 1,
                    name: 'Bagheera',
                    birthDate: '2010-01-11T22:00:00.000Z',
                    numberOfPaws: 4,
                    gender: 1,
                    childrenIdentifiers: [2, 3],
                    color: 'black',
                    isSpeckled: false,
                    status: 'Sick'
                },
                {
                    id: 2,
                    name: 'Jolene',
                    birthDate: '2017-03-10T22:00:00.000Z',
                    numberOfPaws: 4,
                    gender: 0,
                    color: 'blond',
                    isSpeckled: true,
                    status: 'Alive'
                },
                {
                    id: 3,
                    name: 'Ka',
                    birthDate: '2018-09-09T00:00:00.000Z',
                    numberOfPaws: 0,
                    gender: 1,
                    isPoisonous: true,
                    status: 'Alive'
                },
                {
                    id: 4,
                    name: 'Schrodinger',
                    birthDate: undefined,
                    numberOfPaws: 4,
                    gender: 1,
                    color: 'brown',
                    isSpeckled: false,
                    status: 'Dead and alive'
                }
            ],
            mascot: {
                id: 1,
                name: 'Bagheera',
                birthDate: '2010-01-11T22:00:00.000Z',
                numberOfPaws: 4,
                gender: 1,
                childrenIdentifiers: [2, 3],
                color: 'black',
                isSpeckled: false,
                status: 'Sick'
            },
            unknownAnimals: [
                {
                    name: null
                }
            ],
            bestEmployeeOfTheMonth: undefined
        }
    ],
    mainShareholder: {
        id: 100,
        name: 'Elon Musk',
        birthDate: '1971-06-28T22:00:00.000Z',
        gender: 1
    },
    secondaryShareholder: {
        id: 101,
        name: 'Bill Gates',
        birthDate: '1955-10-28T22:00:00.000Z',
        gender: 1
    }
};

const boss = new Employee(
    data.zoos[0].boss.name,
    data.zoos[0].boss.id,
    Gender.Male,
    new Date(data.zoos[0].boss.birthDate)
);
boss.email = data.zoos[0].boss.email;

const mikasa = new Employee(
    data.zoos[0].employees[1].name,
    data.zoos[0].employees[1].id,
    Gender.Female,
    new Date(data.zoos[0].employees[1].birthDate)
);
mikasa.email = data.zoos[0].employees[1].email;

const red = new Employee(
    data.zoos[0].employees[2].name,
    data.zoos[0].employees[2].id,
    Gender.Male,
    new Date(data.zoos[0].employees[2].birthDate)
);
red.email = data.zoos[0].employees[2].email;

const fried = new Employee(
    data.zoos[0].employees[3].name,
    data.zoos[0].employees[3].id,
    Gender.Male,
    new Date(data.zoos[0].employees[3].birthDate)
);
fried.email = data.zoos[0].employees[3].email;

const bagheera = new Panther(data.zoos[0].Animals[0].name, data.zoos[0].Animals[0].isSpeckled);
bagheera.color = data.zoos[0].Animals[0].color;
bagheera.birthDate = new Date(data.zoos[0].Animals[0].birthDate);
bagheera.childrenIds = data.zoos[0].Animals[0].childrenIdentifiers;
bagheera.gender = Gender.Male;
bagheera.id = data.zoos[0].Animals[0].id;
bagheera.numberOfPaws = data.zoos[0].Animals[0].numberOfPaws;
bagheera.status = Status.Sick;

const jolene = new Panther(data.zoos[0].Animals[1].name, data.zoos[0].Animals[1].isSpeckled);
jolene.color = data.zoos[0].Animals[1].color;
jolene.birthDate = new Date(data.zoos[0].Animals[1].birthDate);
jolene.gender = Gender.Female;
jolene.id = data.zoos[0].Animals[1].id;
jolene.numberOfPaws = data.zoos[0].Animals[1].numberOfPaws;
jolene.status = Status.Alive;

const ka = new Snake(data.zoos[0].Animals[2].name);
ka.birthDate = new Date(data.zoos[0].Animals[2].birthDate);
ka.gender = Gender.Male;
ka.id = data.zoos[0].Animals[2].id;
ka.isPoisonous = data.zoos[0].Animals[2].isPoisonous;
ka.numberOfPaws = data.zoos[0].Animals[2].numberOfPaws;
ka.status = Status.Alive;

const schrodinger = new Panther(data.zoos[0].Animals[3].name, data.zoos[0].Animals[3].isSpeckled);
schrodinger.color = data.zoos[0].Animals[3].color;
schrodinger.birthDate = undefined;
schrodinger.gender = Gender.Male;
schrodinger.id = data.zoos[0].Animals[3].id;
schrodinger.numberOfPaws = data.zoos[0].Animals[3].numberOfPaws;
schrodinger.status = Status.DeadAndAlive;

const unknownAnimal = new UnknownAnimal(data.zoos[0].unknownAnimals[0].name);

const zoo = new Zoo();
zoo.animals = [bagheera, jolene, ka, schrodinger];
zoo.boss = boss;
zoo.city = data.zoos[0].city;
zoo.coordinates = {
    x: data.zoos[0].coordinates[0],
    y: data.zoos[0].coordinates[1],
    z: data.zoos[0].coordinates[2]
};
zoo.country = data.zoos[0].country;
zoo.employees = [boss, mikasa, red, fried];
zoo.id = data.zoos[0].id;
zoo.mascot = bagheera;
zoo.name = data.zoos[0].name;
zoo.bestEmployeeOfTheMonth = data.zoos[0].bestEmployeeOfTheMonth;
zoo.unknownAnimals = [unknownAnimal];

const elonMusk = new Human(
    data.mainShareholder.name,
    data.mainShareholder.id,
    data.mainShareholder.gender,
    new Date(data.mainShareholder.birthDate)
);

const billGates = new Human(
    data.secondaryShareholder.name,
    data.secondaryShareholder.id,
    data.secondaryShareholder.gender,
    new Date(data.secondaryShareholder.birthDate)
);

const organization = new Organization();
organization.id = data.id;
organization.name = data.name;
organization.zoos = [zoo];
organization.shareholders = [elonMusk, billGates];

export const deserializedData = organization;
