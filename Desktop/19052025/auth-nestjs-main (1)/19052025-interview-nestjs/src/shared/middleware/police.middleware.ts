import {
    HttpException,
    HttpStatus,
    Injectable,
    mixin,
    NestMiddleware,
    Type,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { NextFunction } from 'express';
import { Op } from 'sequelize';
import { TypePermission } from '../enums/role-enum';
import { MessageError } from '../utils/response/sys-res.system';
import { User } from 'src/entities/auth/User.entity';

//Check Role
function authorizedMiddleware(options: any): Type<NestMiddleware> {
    @Injectable()
    class AuthMiddleware implements NestMiddleware {
        constructor() { }

        use(req: Request, res: Response, next: NextFunction) {
            try {
                const { user } = req.body as any;
                const { type } = user;
                const { typeRole } = options;
                let isPermission = true;

                switch (typeRole) {
                    case TypePermission.MASTER:
                    case TypePermission.BRANCH_MANAGER:
                    case TypePermission.DEPARTMENT_MANAGER:
                    case TypePermission.ADMIN_GROUP_USER:
                        if (type !== typeRole) {
                            isPermission = false;
                        }
                        break;
                    case TypePermission.USER:
                        if (type !== typeRole) {
                            isPermission = false;
                        }
                        break;
                    default:
                        break;
                }

                if (!isPermission) {
                    throw new HttpException(
                        {
                            success: false,
                            message: MessageError.PERMISSION_DENIED,
                        },
                        HttpStatus.FORBIDDEN,
                    );
                }

                next();
            } catch (error) {
                console.log(error);
                throw new HttpException(
                    {
                        success: false,
                        message: MessageError.AUTHORIZATION_MIDDLEWARE,
                    },
                    HttpStatus.UNAUTHORIZED,
                );
            }
            next();
        }
    }
    return mixin(AuthMiddleware);
}

// Check user active
function isExistUserMiddleware(): Type<NestMiddleware> {
    @Injectable()
    class AuthMiddleware implements NestMiddleware {
        constructor(
            @InjectModel(User)
            private userModel: typeof User,
        ) { }

        async use(req: Request, res: any, next: NextFunction) {
            try {
                const { username, email, phone } = req.body as any;
                const key_search = email || username || phone;

                const user = await this.userModel.findOne({
                    where: {
                        [Op.or]: [
                            { email: key_search },
                            { username: key_search },
                            { phone: key_search },
                        ],
                    },
                });

                if (!user) {
                    return res.status(404).json({
                        success: false,
                        message: MessageError.NOT_FOUND,
                    });
                }

                next();
            } catch (error) {
                console.log(error);
                throw new HttpException(
                    {
                        success: false,
                        message: MessageError.USER_EXISTED_MIDDLEWARE,
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
            next();
        }
    }
    return mixin(AuthMiddleware);
}

export { authorizedMiddleware, isExistUserMiddleware };
