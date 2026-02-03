import { Test, TestingModule } from '@nestjs/testing';

import { NotFoundException } from '@nestjs/common';

import { UserRole } from '@common/enums';

import { CreateUserDto, UpdateUserDto, FilterUsersDto } from './dto';

import { UsersService } from './users.service';

import { UsersRepository } from './repositories/users.repository';
import { UserDocumentType } from './enums/user-document-type.enum';

const mockUser = {
  _id: '1',
  email: 'test@example.com',
  password: 'contra',
  role: 'user',
  roles: [UserRole.ADMIN],
  course: null,
  grade: null,
  institution: null,
  createdBy: {},
  populate: jest.fn().mockImplementation(function (this: typeof mockUser) {
    return this;
  }),
};

const mockUserRepository = {
  create: jest.fn().mockResolvedValue(mockUser),
  findPaginate: jest.fn().mockResolvedValue({ docs: [mockUser] }),
  findOneById: jest.fn().mockResolvedValue(mockUser),
  findOne: jest.fn().mockResolvedValue(mockUser),
  findOneAndUpdate: jest.fn().mockResolvedValue(mockUser),
  findOneAndDelete: jest.fn().mockResolvedValue(mockUser),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a user', async () => {
      const dto: CreateUserDto = {
        email: 'test@example.com',
        password: 'plain',
        roles: [UserRole.ADMIN],
        createdBy: '',
        firstName: '',
        lastName: '',
        phone: '',
        document: '',
        documentType: UserDocumentType.TI,
      };

      const result = await service.create(dto);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all users without filter', async () => {
      const result = await service.findPaginate({ data: {} });
      expect(result.docs).toEqual([mockUser]);
    });

    it('should return filtered users', async () => {
      const filter: FilterUsersDto = {
        role: UserRole.ADMIN,
        data: {},
      };
      const result = await service.findPaginate(filter);
      expect(result.docs).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const result = await service.findOneById('1');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(mockUserRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.findOneById('2')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOneBy', () => {
    it('should return a user by query', async () => {
      const result = await service.findOneBy({ email: 'test@example.com' });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found by query', async () => {
      jest.spyOn(mockUserRepository, 'findOne').mockResolvedValueOnce(null);

      const result = await service.findOneBy({ email: 'nope@example.com' });
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update and return the user', async () => {
      const dto: UpdateUserDto = { email: 'test@email.com' };
      const result = await service.update('1', dto);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found on update', async () => {
      mockUserRepository.findOneAndUpdate.mockResolvedValueOnce(null);

      await expect(
        service.update('2', { email: 'test@email.com' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove and return the user', async () => {
      const result = await service.remove('1');
      expect(result).toEqual(mockUser);
    });
  });
});
