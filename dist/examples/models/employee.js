"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("./../../src");
var gender_1 = require("./gender");
var Employee = /** @class */ (function () {
    function Employee() {
    }
    __decorate([
        src_1.JsonProperty(),
        __metadata("design:type", Number)
    ], Employee.prototype, "id", void 0);
    __decorate([
        src_1.JsonProperty(),
        __metadata("design:type", String)
    ], Employee.prototype, "name", void 0);
    __decorate([
        src_1.JsonProperty(),
        __metadata("design:type", Date)
    ], Employee.prototype, "birthdate", void 0);
    __decorate([
        src_1.JsonProperty(),
        __metadata("design:type", String)
    ], Employee.prototype, "email", void 0);
    __decorate([
        src_1.JsonProperty(),
        __metadata("design:type", Number)
    ], Employee.prototype, "gender", void 0);
    Employee = __decorate([
        src_1.Serializable(),
        __metadata("design:paramtypes", [])
    ], Employee);
    return Employee;
}());
exports.Employee = Employee;
