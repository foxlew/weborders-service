import * as bcrypt from 'bcrypt';
import { Service } from 'typedi';
import jwt from 'jsonwebtoken';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { User } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';
import { env } from '../../env';

@Service()
export class AuthService {
  constructor(@OrmRepository() private userRepository: UserRepository) {}

  async login(username: string, password: string): Promise<{ user: User; token: string } | undefined> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      return undefined;
    }

    if (await AuthService.comparePassword(password, user.password)) {
      return new Promise((resolve, reject) => {
        jwt.sign({ username: user.username }, env.auth.secret, {}, (err, token) => {
          if (err) {
            return reject(err);
          }
          resolve({ user, token });
        });
      });
    } else {
      return undefined;
    }
  }

  static comparePassword(attempt: string, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      void bcrypt.compare(attempt, password, (err, res) => {
        if (err) {
          return reject(err);
        }
        resolve(res === true);
      });
    });
  }
}
