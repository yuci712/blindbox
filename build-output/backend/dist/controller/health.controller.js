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
exports.HealthController = void 0;
const core_1 = require("@midwayjs/core");
let HealthController = class HealthController {
    async health() {
        return {
            success: true,
            status: 'ok',
            timestamp: new Date().toISOString(),
            message: '服务正常运行'
        };
    }
};
__decorate([
    (0, core_1.Get)('/health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "health", null);
HealthController = __decorate([
    (0, core_1.Controller)('/api')
], HealthController);
exports.HealthController = HealthController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhbHRoLmNvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29udHJvbGxlci9oZWFsdGguY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSx5Q0FBaUQ7QUFHMUMsSUFBTSxnQkFBZ0IsR0FBdEIsTUFBTSxnQkFBZ0I7SUFFckIsQUFBTixLQUFLLENBQUMsTUFBTTtRQUNWLE9BQU87WUFDTCxPQUFPLEVBQUUsSUFBSTtZQUNiLE1BQU0sRUFBRSxJQUFJO1lBQ1osU0FBUyxFQUFFLElBQUksSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFO1lBQ25DLE9BQU8sRUFBRSxRQUFRO1NBQ2xCLENBQUM7SUFDSixDQUFDO0NBQ0YsQ0FBQTtBQVJPO0lBREwsSUFBQSxVQUFHLEVBQUMsU0FBUyxDQUFDOzs7OzhDQVFkO0FBVFUsZ0JBQWdCO0lBRDVCLElBQUEsaUJBQVUsRUFBQyxNQUFNLENBQUM7R0FDTixnQkFBZ0IsQ0FVNUI7QUFWWSw0Q0FBZ0IifQ==