import { Injectable, NotFoundException } from '@nestjs/common';

import { hash } from 'bcrypt';

import { PopulateOptions } from 'mongoose';

import { ICrudService } from '@common/interfaces';

import { Status } from '@common/enums';

import { CreateUserDto, UpdateUserDto, FilterUsersDto } from './dto';

import { UsersRepository } from './repositories/users.repository';

import { UserDocument } from './schemas/user.schema';

import { UsersErrors } from './errors/users.errors';

@Injectable()
export class UsersService implements ICrudService<UserDocument> {
  private readonly pathsPopulate: PopulateOptions[] = [
    { path: 'institution', select: 'name novelty' },
    { path: 'parent', select: 'firstName lastName email phone' },
    { path: 'createdBy', select: 'firstName lastName email phone' },
    { path: 'course', select: 'name' },
    { path: 'grade', select: 'name' },
  ];

  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const hashedPassword = await hash(createUserDto.password, 10);

    const newUser = await this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      createdBy: createUserDto.createdBy as UserDocument['createdBy'],
    });

    return this.populateUser(newUser);
  }

  async findPaginate(filter: FilterUsersDto) {
    return await this.usersRepository.findPaginate(filter, {
      populate: this.pathsPopulate,
      sort: { createdAt: -1 },
    });
  }

  async findByQuery(filter: FilterUsersDto['data']) {
    return await this.usersRepository.find(
      filter,
      {},
      { populate: this.pathsPopulate },
    );
  }

  async findOneById(id: string): Promise<UserDocument> {
    const user = await this.usersRepository.findOne({
      _id: id,
      status: Status.ACTIVE,
    });

    if (!user) throw new NotFoundException(UsersErrors.USER_NOT_FOUND);

    return this.populateUser(user);
  }

  async findOneBy(query: FilterUsersDto['data']): Promise<UserDocument | null> {
    return await this.usersRepository.findOne(query);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    if (updateUserDto.password) {
      updateUserDto.password = await hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.usersRepository.findOneAndUpdate(
      { _id: id, status: Status.ACTIVE },
      updateUserDto,
    );

    if (!updatedUser) throw new NotFoundException(UsersErrors.USER_NOT_FOUND);

    return this.populateUser(updatedUser);
  }

  async remove(id: string): Promise<UserDocument> {
    const deletedUser = await this.usersRepository.findOneAndDelete({
      _id: id,
      status: Status.ACTIVE,
    });

    if (!deletedUser) throw new NotFoundException(UsersErrors.USER_NOT_FOUND);

    return deletedUser;
  }

  async count(query: FilterUsersDto['data']): Promise<number> {
    return this.usersRepository.count(query);
  }

  private async populateUser(doc: UserDocument): Promise<UserDocument> {
    return doc.populate(this.pathsPopulate);
  }
}
