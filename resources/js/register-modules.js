import HomeModule from "./modules/home/index";
import DasbhoardModule from "./modules/dashboard/index";
import UserModule from "./modules/user/index";
import AuthModule from "./modules/auth/index";
import RoleModule from "./modules/role/index";
import PermissionModule from "./modules/permissions/index";
const modules = [
    HomeModule.router,
    DasbhoardModule.router,
    AuthModule.router,
    UserModule.router,
    RoleModule.router,
    PermissionModule.router,
];

export default modules;
