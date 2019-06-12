import { Zoo } from '../models/zoo';
import { Employee } from '../models/employee';
import { Panther } from '../models/panther';

import { Gender } from '../models/gender';
import { Status } from '../models/status';
import { Snake } from '../models/snake';

export const data: any = {
    'id': 15,
    'name': 'The Greatest Zoo',
    'city': 'Bordeaux',
    'country': 'France',
    'boss': {
        'id': 1,
        'name': 'Bob Razowsky',
        'birthDate': '1984-04-03T22:00:00.000Z',
        'email': 'bob.razowsky@tgzoo.fr',
        'gender': 1
    },
    'employees': [
        {
            'id': 1,
            'name': 'Bob Razowsky',
            'birthDate': '1984-04-03T22:00:00.000Z',
            'email': 'bob.razowsky@tgzoo.fr',
            'gender': 1
        },
        {
            'id': 2,
            'name': 'Mikasa Ackerman',
            'birthDate': '1984-01-11T22:00:00.000Z',
            'email': 'mikasa.ackerman@tgzoo.fr',
            'gender': 0
        },
        {
            'id': 3,
            'name': 'Red Redington',
            'birthDate': '1970-12-04T22:00:00.000Z',
            'email': 'red.redington@tgzoo.fr',
            'gender': 1
        },
        {
            'id': 4,
            'name': 'Fried Richter',
            'birthDate': '1994-04-01T22:00:00.000Z',
            'email': 'fried.richter@tgzoo.fr',
            'gender': 1
        }
    ],
    'Animals': [
        {
            'id': 1,
            'name': 'Bagheera',
            'birthDate': '2010-01-11T22:00:00.000Z',
            'numberOfPaws': 4,
            'gender': 1,
            'childrenIdentifiers': [
                2,
                3
            ],
            'color': 'black',
            'isSpeckled': false,
            'status': 'Sick'
        },
        {
            'id': 2,
            'name': 'Jolene',
            'birthDate': '2017-03-10T22:00:00.000Z',
            'numberOfPaws': 4,
            'gender': 0,
            'color': 'blond',
            'isSpeckled': true,
            'status': 'Alive'
        },
        {
            'id': 3,
            'name': 'Ka',
            'birthDate': '2018-09-09T00:00:00.000Z',
            'numberOfPaws': 0,
            'gender': 1,
            'isPoisonous': true,
            'status': 'Alive'
        },
        {
            'id': 4,
            'name': 'Schrodinger',
            'birthDate': '2015-03-05T22:00:00.000Z',
            'numberOfPaws': 4,
            'gender': 1,
            'color': 'brown',
            'isSpeckled': false,
            'status': 'Dead and alive'
        }
    ],
    'mascot': {
        'id': 1,
        'name': 'Bagheera',
        'birthDate': '2010-01-11T22:00:00.000Z',
        'numberOfPaws': 4,
        'gender': 1,
        'childrenIdentifiers': [
            2,
            3
        ],
        'color': 'black',
        'isSpeckled': false,
        'status': 'Sick'
    }
};

const boss: Employee = new Employee();
boss.birthDate = new Date(data.boss.birthDate);
boss.email = data.boss.email;
boss.gender = Gender.Male;
boss.id = data.boss.id;
boss.name = data.boss.name;

const mikasa: Employee = new Employee();
mikasa.birthDate = new Date(data.employees[1].birthDate);
mikasa.email = data.employees[1].email;
mikasa.gender = Gender.Female;
mikasa.id = data.employees[1].id;
mikasa.name = data.employees[1].name;

const red: Employee = new Employee();
red.birthDate = new Date(data.employees[2].birthDate);
red.email = data.employees[2].email;
red.gender = Gender.Male;
red.id = data.employees[2].id;
red.name = data.employees[2].name;

const fried: Employee = new Employee();
fried.birthDate = new Date(data.employees[3].birthDate);
fried.email = data.employees[3].email;
fried.gender = Gender.Male;
fried.id = data.employees[3].id;
fried.name = data.employees[3].name;

const bagheera: Panther = new Panther(data.Animals[0].isSpeckled, data.Animals[0].name);
bagheera.color = data.Animals[0].color;
bagheera.birthDate = new Date(data.Animals[0].birthDate);
bagheera.childrenIds = data.Animals[0].childrenIdentifiers;
bagheera.gender = Gender.Male;
bagheera.id = data.Animals[0].id;
bagheera.numberOfPaws = data.Animals[0].numberOfPaws;
bagheera.status = Status.Sick;

const jolene: Panther = new Panther(data.Animals[1].isSpeckled, data.Animals[1].name);
jolene.color = data.Animals[1].color;
jolene.birthDate = new Date(data.Animals[1].birthDate);
jolene.gender = Gender.Female;
jolene.id = data.Animals[1].id;
jolene.numberOfPaws = data.Animals[1].numberOfPaws;
jolene.status = Status.Alive;

const ka: Snake = new Snake(data.Animals[2].name);
ka.birthDate = new Date(data.Animals[2].birthDate);
ka.gender = Gender.Male;
ka.id = data.Animals[2].id;
ka.isPoisonous = data.Animals[2].isPoisonous;
ka.numberOfPaws = data.Animals[2].numberOfPaws;
ka.status = Status.Alive;

const schrodinger: Panther = new Panther(data.Animals[3].isSpeckled, data.Animals[3].name);
schrodinger.color = data.Animals[3].color;
schrodinger.birthDate = new Date(data.Animals[3].birthDate);
schrodinger.gender = Gender.Male;
schrodinger.id = data.Animals[3].id;
schrodinger.numberOfPaws = data.Animals[3].numberOfPaws;
schrodinger.status = Status.DeadAndAlive;

const zoo: Zoo = new Zoo();
zoo.animals = [bagheera, jolene, ka, schrodinger];
zoo.boss = boss;
zoo.city = data.city;
zoo.country = data.country;
zoo.employees = [boss, mikasa, red, fried];
zoo.id = data.id;
zoo.mascot = bagheera;
zoo.name = data.name;

export const deserializedData: Zoo = zoo;
