import { Entity, Schema } from 'redis-om'

class UserEntity extends Entity {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  isVerify: boolean;
  isActive: boolean;
  password: string;
  socketIds: string[];

  constructor(_, __, data) {
    if (data) {
      data._id = data.id?.toString();
    }
    super(_, __, data);
  }

  public toJSON() {
    const res = super.toJSON();

    delete res.entityId;
    delete res.inserted;
    delete res.updated;
    delete res.deleted;
    delete res.password;
    return res;
  }
}

/* create a Schema for Person */
const userSchemaRedis = new Schema(UserEntity, {
  _id: { type: 'string', indexed: true },
  firstName: { type: 'string' },
  lastName: { type: 'string' },
  email: { type: 'string' },
  phone: { type: 'string' },
  username: { type: 'string' },
  isVerify: { type: 'boolean' },
  isActive: { type: 'boolean' },
  password: { type: 'string' },
  socketIds: { type: 'string[]' },
});

export {
  userSchemaRedis,
  UserEntity
}
