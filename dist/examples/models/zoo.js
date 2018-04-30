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
var employee_1 = require("./employee");
var panther_1 = require("./panther");
var Zoo = /** @class */ (function () {
    function Zoo() {
        this.isOpen = true;
    }
    __decorate([
        src_1.JsonProperty(),
        __metadata("design:type", employee_1.Employee)
    ], Zoo.prototype, "boss", void 0);
    __decorate([
        src_1.JsonProperty(),
        __metadata("design:type", String)
    ], Zoo.prototype, "city", void 0);
    __decorate([
        src_1.JsonProperty(),
        __metadata("design:type", String)
    ], Zoo.prototype, "country", void 0);
    __decorate([
        src_1.JsonProperty({ type: employee_1.Employee }),
        __metadata("design:type", Array)
    ], Zoo.prototype, "employees", void 0);
    __decorate([
        src_1.JsonProperty(),
        __metadata("design:type", Number)
    ], Zoo.prototype, "id", void 0);
    __decorate([
        src_1.JsonProperty(),
        __metadata("design:type", String)
    ], Zoo.prototype, "name", void 0);
    __decorate([
        src_1.JsonProperty({ name: 'Panthers', type: panther_1.Panther }),
        __metadata("design:type", Array)
    ], Zoo.prototype, "panthers", void 0);
    Zoo = __decorate([
        src_1.Serializable(),
        __metadata("design:paramtypes", [])
    ], Zoo);
    return Zoo;
}());
exports.Zoo = Zoo;
