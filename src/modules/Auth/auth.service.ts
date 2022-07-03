import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Users from "src/Entities/User";
import { IRes, Reqs } from "src/interfaces/global";
import { Repository } from "typeorm";
import { createUserDto, loginDto, tokenDto, updateUserDto } from "./auth.dto";
import * as bcrypt from 'bcrypt'
import { Response } from "express";
import { JwtService } from "@nestjs/jwt";


@Injectable()
class AuthService {
    constructor (
        @InjectRepository(Users) private UsersRepo: Repository<Users>,
        private readonly JwtService: JwtService
    ) {}

    BCRYPT_SALT = 10;

    async createUser (data: createUserDto): Promise<IRes<Users>> {
        try {
            const { name, email, password: raw, role } = data;

            const exist: Users = await this.UsersRepo.findOne({ where: { email }});

            if (exist) return { status: false, message: 'Email already in use' };

            const password: string = bcrypt.hashSync(raw, this.BCRYPT_SALT);

            const user: Users = await this.UsersRepo.save({ name, email, password, role })

            return { data: user, status: true , message: 'User created successfully'}        
        } catch (error) {
            throw new Error(error)
        }
    }

    async editUser (user: Users, data: updateUserDto) : Promise<IRes<null>> {
        try {
            const { name, role } = data;

            const updated = {
                ...user,
                ...(name && { name }),
                ...(role && { role })
            }

            await this.UsersRepo.save(updated)

            return { status: true, message: 'User details updated successfully'  }
        } catch (error) {
            throw new Error(error);
        }
    }

    async userLogin (data: loginDto): Promise<IRes<{token: string}>> {
        try {
            const { email, password } = data;
            const user = await this.UsersRepo.findOne({ where: { email }, select: ['id', 'password', 'email']})

            if (!user || !bcrypt.compareSync(password, user.password)) return { message: 'Invalid credentials', status: false }

            const token = this.JwtService.sign({ sub: user.id, email });

            return { message: 'Login successful', data: { token }, status: true }
        } catch (error) {
            throw new Error(error)
        }
    }

    async userAuth (req: Reqs, res: Response) {
        const authorization = req.headers['authorization'];
    
        if (!authorization || !authorization.startsWith('Bearer ')) {
          throw new UnauthorizedException(
            'Unauthorized request',
            'This is an unauthorized request'
          );
        }
    
        const token = authorization.split(' ')[1]
    
        try {
          let { id, email }: tokenDto = this.JwtService.verify(token);
    
          const user: Users = await this.UsersRepo.findOne({
            where: { id, email },
          });
        
    
          if (!user) throw new UnauthorizedException(
            'Unauthorized request',
            'This is an unauthorized request'
          );
        
          req.user = user;
           
        } catch (err) {
          throw new Error(err);
        }
      }  

      async allowEditor (req: Reqs, res: Response) {
        const user: Users = req.user as Users;
        if (user.role !== 'editor') throw new UnauthorizedException('you are not allowed to visit this route');
      }

}

export default AuthService;
