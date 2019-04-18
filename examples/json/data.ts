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
        'birthdate': '1984-04-03T22:00:00.000Z',
        'email': 'bob.razowsky@tgzoo.fr',
        'gender': 1
    },
    'employees': [
        {
            'id': 1,
            'name': 'Bob Razowsky',
            'birthdate': '1984-04-03T22:00:00.000Z',
            'email': 'bob.razowsky@tgzoo.fr',
            'gender': 1
        },
        {
            'id': 2,
            'name': 'Mikasa Ackerman',
            'birthdate': '1984-01-11T22:00:00.000Z',
            'email': 'mikasa.ackerman@tgzoo.fr',
            'gender': 0
        },
        {
            'id': 3,
            'name': 'Red Redington',
            'birthdate': '1970-12-04T22:00:00.000Z',
            'email': 'red.redington@tgzoo.fr',
            'gender': 1
        },
        {
            'id': 4,
            'name': 'Fried Richter',
            'birthdate': '1994-04-01T22:00:00.000Z',
            'email': 'fried.richter@tgzoo.fr',
            'gender': 1
        }
    ],
    'Panthers': [
        {
            'id': 1,
            'name': 'Bagheera',
            'birthdate': '2010-01-11T22:00:00.000Z',
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
            'birthdate': '2017-03-10T22:00:00.000Z',
            'numberOfPaws': 4,
            'gender': 0,
            'color': 'blond',
            'isSpeckled': true,
            'status': 'Alive'
        },
        {
            'id': 3,
            'name': 'Schrodinger',
            'birthdate': '2015-03-05T22:00:00.000Z',
            'numberOfPaws': 4,
            'gender': 1,
            'color': 'brown',
            'isSpeckled': false,
            'status': 'Dead and alive'
        }
    ],
    'snakes': [
        {
            'id': 1,
            'name': 'Ka',
            'birthdate': '2018-09-09T00:00:00.000Z',
            'numberOfPaws': 0,
            'gender': 1,
            'isPoisonous': true,
            'status': 'Alive'
        }
    ]
};

const boss: Employee = new Employee();
boss.id = data.boss.id;
boss.name = data.boss.name;
boss.birthdate = new Date(data.boss.birthdate);
boss.email = data.boss.email;
boss.gender = Gender.male;

const mikasa: Employee = new Employee();
mikasa.id = data.employees[1].id;
mikasa.name = data.employees[1].name;
mikasa.birthdate = new Date(data.employees[1].birthdate);
mikasa.email = data.employees[1].email;
mikasa.gender = Gender.female;

const red: Employee = new Employee();
red.id = data.employees[2].id;
red.name = data.employees[2].name;
red.birthdate = new Date(data.employees[2].birthdate);
red.email = data.employees[2].email;
red.gender = Gender.male;

const fried: Employee = new Employee();
fried.id = data.employees[3].id;
fried.name = data.employees[3].name;
fried.birthdate = new Date(data.employees[3].birthdate);
fried.email = data.employees[3].email;
fried.gender = Gender.male;

const bagheera: Panther = new Panther();
bagheera.id = data.Panthers[0].id;
bagheera.name = data.Panthers[0].name;
bagheera.birthdate = new Date(data.Panthers[0].birthdate);
bagheera.numberOfPaws = data.Panthers[0].numberOfPaws;
bagheera.childrenIds = data.Panthers[0].childrenIdentifiers;
bagheera.gender = Gender.male;
bagheera.color = data.Panthers[0].color;
bagheera.isSpeckled = data.Panthers[0].isSpeckled;
bagheera.status = Status.sick;

const jolene: Panther = new Panther();
jolene.id = data.Panthers[1].id;
jolene.name = data.Panthers[1].name;
jolene.birthdate = new Date(data.Panthers[1].birthdate);
jolene.numberOfPaws = data.Panthers[1].numberOfPaws;
jolene.gender = Gender.female;
jolene.color = data.Panthers[1].color;
jolene.isSpeckled = data.Panthers[1].isSpeckled;
jolene.status = Status.alive;

const schrodinger: Panther = new Panther();
schrodinger.id = data.Panthers[2].id;
schrodinger.name = data.Panthers[2].name;
schrodinger.birthdate = new Date(data.Panthers[2].birthdate);
schrodinger.numberOfPaws = data.Panthers[2].numberOfPaws;
schrodinger.gender = Gender.male;
schrodinger.color = data.Panthers[2].color;
schrodinger.isSpeckled = data.Panthers[2].isSpeckled;
schrodinger.status = Status.deadAndAlive;

const ka: Snake = new Snake();
ka.id = data.snakes[0].id;
ka.name = data.snakes[0].name;
ka.birthdate = new Date(data.snakes[0].birthdate);
ka.numberOfPaws = data.snakes[0].numberOfPaws;
ka.gender = Gender.male;
ka.isPoisonous = data.snakes[0].isPoisonous;
ka.status = Status.alive;

const zoo: Zoo = new Zoo();
zoo.id = data.id;
zoo.name = data.name;
zoo.country = data.country;
zoo.city = data.city;
zoo.boss = boss;
zoo.employees = [boss, mikasa, red, fried];
zoo.panthers = [bagheera, jolene, schrodinger];
zoo.snakes = [ka];

export const deserializedData: Zoo = zoo;
