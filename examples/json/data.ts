import { Employee } from '../models/employee';
import { Gender } from '../models/gender';
import { Human } from '../models/human';
import { Organization } from '../models/organization';
import { Panther } from '../models/panther';
import { Snake } from '../models/snake';
import { Status } from '../models/status';
import { UnknownAnimal } from '../models/unknown-animal';
import { Zoo } from '../models/zoo';
import { PhoneNumber } from '../models/phone-number';

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
                gender: 1,
                phoneNumber: '111-111-1111'
            },
            employees: [
                {
                    id: 1,
                    name: 'Bob Razowsky',
                    birthDate: '1984-04-03T22:00:00.000Z',
                    email: 'bob.razowsky@tgzoo.fr',
                    gender: 1,
                    phoneNumber: '111-111-1111'
                },
                {
                    id: 2,
                    name: 'Mikasa Ackerman',
                    birthDate: '1984-01-11T22:00:00.000Z',
                    email: 'mikasa.ackerman@tgzoo.fr',
                    gender: 0,
                    phoneNumber: '222-222-2222'
                },
                {
                    id: 3,
                    name: 'Red Redington',
                    birthDate: '1970-12-04T22:00:00.000Z',
                    email: 'red.redington@tgzoo.fr',
                    gender: 1,
                    phoneNumber: '333-333-3333'
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
                    isPoisonous: true
                },
                {
                    id: 4,
                    name: 'Schrodinger',
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
            phoneBook: {
                '1': {
                    value: '111-111-1111'
                },
                '2': {
                    value: '222-222-2222'
                },
                '3': {
                    value: '333-333-3333'
                }
            }
        },
        {
            id: 16,
            name: 'Zoo Zoo',
            city: 'Paris',
            coordinates: [4, 2, 3],
            country: 'France',
            boss: {
                id: 2,
                name: 'Sully',
                birthDate: '1984-08-03T22:00:00.000Z',
                email: 'sully.razowsky@tgzoo.fr',
                gender: 1,
                phoneNumber: {
                    countryCode: '33',
                    value: '0111111111'
                }
            },
            employees: [],
            Animals: [],
            mascot: null,
            unknownAnimals: []
        }
    ],
    mainShareholder: {
        id: 100,
        name: 'Elon Musk',
        birthDate: '1971-06-28T22:00:00.000Z',
        gender: 1
    },
    secondaryShareholder: null
};

const bob = new Employee(
    data.zoos[0].boss.name,
    data.zoos[0].boss.id,
    Gender.Male,
    new Date(data.zoos[0].boss.birthDate)
);
bob.email = data.zoos[0].boss.email;
bob.phoneNumber = data.zoos[0].boss.phoneNumber;

const sully = new Employee(
    data.zoos[1].boss.name,
    data.zoos[1].boss.id,
    Gender.Male,
    new Date(data.zoos[1].boss.birthDate)
);
sully.email = data.zoos[1].boss.email;
const phoneNumber = new PhoneNumber();
phoneNumber.countryCode = data.zoos[1].boss.phoneNumber.countryCode;
phoneNumber.value = data.zoos[1].boss.phoneNumber.value;
sully.phoneNumber = phoneNumber;

const mikasa = new Employee(
    data.zoos[0].employees[1].name,
    data.zoos[0].employees[1].id,
    Gender.Female,
    new Date(data.zoos[0].employees[1].birthDate)
);
mikasa.email = data.zoos[0].employees[1].email;
mikasa.phoneNumber = data.zoos[0].employees[1].phoneNumber;

const red = new Employee(
    data.zoos[0].employees[2].name,
    data.zoos[0].employees[2].id,
    Gender.Male,
    new Date(data.zoos[0].employees[2].birthDate)
);
red.email = data.zoos[0].employees[2].email;
red.phoneNumber = data.zoos[0].employees[2].phoneNumber;

const fried = new Employee(
    data.zoos[0].employees[3].name,
    data.zoos[0].employees[3].id,
    Gender.Male,
    new Date(data.zoos[0].employees[3].birthDate)
);
fried.email = data.zoos[0].employees[3].email;
fried.phoneNumber = data.zoos[0].employees[3].phoneNumber;

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
ka.status = undefined;

const schrodinger = new Panther(data.zoos[0].Animals[3].name, data.zoos[0].Animals[3].isSpeckled);
schrodinger.color = data.zoos[0].Animals[3].color;
schrodinger.birthDate = data.zoos[0].Animals[3].birthDate;
schrodinger.gender = Gender.Male;
schrodinger.id = data.zoos[0].Animals[3].id;
schrodinger.numberOfPaws = data.zoos[0].Animals[3].numberOfPaws;
schrodinger.status = Status.DeadAndAlive;

const unknownAnimal = new UnknownAnimal(data.zoos[0].unknownAnimals[0].name);

const greatZoo = new Zoo();
greatZoo.animals = [bagheera, jolene, ka, schrodinger];
greatZoo.boss = bob;
greatZoo.city = data.zoos[0].city;
greatZoo.coordinates = {
    x: data.zoos[0].coordinates[0],
    y: data.zoos[0].coordinates[1],
    z: data.zoos[0].coordinates[2]
};
greatZoo.country = data.zoos[0].country;
greatZoo.employees = [bob, mikasa, red, fried];
greatZoo.id = data.zoos[0].id;
greatZoo.mascot = bagheera;
greatZoo.name = data.zoos[0].name;
greatZoo.bestEmployeeOfTheMonth = data.zoos[0].bestEmployeeOfTheMonth;
greatZoo.unknownAnimals = [unknownAnimal];
greatZoo.phoneBook = {
    '1': new PhoneNumber(data.zoos[0].phoneBook['1'].value),
    '2': new PhoneNumber(data.zoos[0].phoneBook['2'].value),
    '3': new PhoneNumber(data.zoos[0].phoneBook['3'].value)
};

const zooZoo = new Zoo();
zooZoo.animals = [];
zooZoo.boss = sully;
zooZoo.city = data.zoos[1].city;
zooZoo.coordinates = {
    x: data.zoos[1].coordinates[0],
    y: data.zoos[1].coordinates[1],
    z: data.zoos[1].coordinates[2]
};
zooZoo.country = data.zoos[1].country;
zooZoo.employees = [];
zooZoo.id = data.zoos[1].id;
zooZoo.mascot = data.zoos[1].mascot;
zooZoo.name = data.zoos[1].name;
zooZoo.bestEmployeeOfTheMonth = data.zoos[1].bestEmployeeOfTheMonth;
zooZoo.unknownAnimals = [];

const elonMusk = new Human(
    data.mainShareholder.name,
    data.mainShareholder.id,
    data.mainShareholder.gender,
    new Date(data.mainShareholder.birthDate)
);

const organization = new Organization();
organization.id = data.id;
organization.name = data.name;
organization.zoos = [greatZoo, zooZoo];
organization.shareholders = [elonMusk, null, undefined];

export const deserializedData = organization;
