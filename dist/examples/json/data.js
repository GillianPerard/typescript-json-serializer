"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var zoo_1 = require("../models/zoo");
var employee_1 = require("../models/employee");
var gender_1 = require("../models/gender");
var panther_1 = require("../models/panther");
exports.data = {
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
            'isSpeckled': false
        },
        {
            'id': 2,
            'name': 'Jolene',
            'birthdate': '2017-03-10T22:00:00.000Z',
            'numberOfPaws': 4,
            'gender': 0,
            'color': 'blond',
            'isSpeckled': true
        },
        {
            'id': 3,
            'name': 'Chatchat',
            'birthdate': '2015-03-05T22:00:00.000Z',
            'numberOfPaws': 4,
            'gender': 0,
            'color': 'brown',
            'isSpeckled': false
        }
    ]
};
var boss = new employee_1.Employee();
boss.id = exports.data.boss.id;
boss.name = exports.data.boss.name;
boss.birthdate = new Date(exports.data.boss.birthdate);
boss.email = exports.data.boss.email;
boss.gender = gender_1.Gender.male;
var mikasa = new employee_1.Employee();
mikasa.id = exports.data.employees[1].id;
mikasa.name = exports.data.employees[1].name;
mikasa.birthdate = new Date(exports.data.employees[1].birthdate);
mikasa.email = exports.data.employees[1].email;
mikasa.gender = gender_1.Gender.female;
var red = new employee_1.Employee();
red.id = exports.data.employees[2].id;
red.name = exports.data.employees[2].name;
red.birthdate = new Date(exports.data.employees[2].birthdate);
red.email = exports.data.employees[2].email;
red.gender = gender_1.Gender.male;
var fried = new employee_1.Employee();
fried.id = exports.data.employees[3].id;
fried.name = exports.data.employees[3].name;
fried.birthdate = new Date(exports.data.employees[3].birthdate);
fried.email = exports.data.employees[3].email;
fried.gender = gender_1.Gender.male;
var bagheera = new panther_1.Panther();
bagheera.id = exports.data.Panthers[0].id;
bagheera.name = exports.data.Panthers[0].name;
bagheera.birthdate = new Date(exports.data.Panthers[0].birthdate);
bagheera.numberOfPaws = exports.data.Panthers[0].numberOfPaws;
bagheera.childrenIds = exports.data.Panthers[0].childrenIdentifiers;
bagheera.gender = gender_1.Gender.male;
bagheera.color = exports.data.Panthers[0].color;
bagheera.isSpeckled = exports.data.Panthers[0].isSpeckled;
var jolene = new panther_1.Panther();
jolene.id = exports.data.Panthers[1].id;
jolene.name = exports.data.Panthers[1].name;
jolene.birthdate = new Date(exports.data.Panthers[1].birthdate);
jolene.numberOfPaws = exports.data.Panthers[1].numberOfPaws;
jolene.gender = gender_1.Gender.female;
jolene.color = exports.data.Panthers[1].color;
jolene.isSpeckled = exports.data.Panthers[1].isSpeckled;
var chatchat = new panther_1.Panther();
chatchat.id = exports.data.Panthers[2].id;
chatchat.name = exports.data.Panthers[2].name;
chatchat.birthdate = new Date(exports.data.Panthers[2].birthdate);
chatchat.numberOfPaws = exports.data.Panthers[2].numberOfPaws;
chatchat.gender = gender_1.Gender.female;
chatchat.color = exports.data.Panthers[2].color;
chatchat.isSpeckled = exports.data.Panthers[2].isSpeckled;
var zoo = new zoo_1.Zoo();
zoo.id = exports.data.id;
zoo.name = exports.data.name;
zoo.country = exports.data.country;
zoo.city = exports.data.city;
zoo.boss = boss;
zoo.employees = [boss, mikasa, red, fried];
zoo.panthers = [bagheera, jolene, chatchat];
exports.deserializedData = zoo;
