import { Test, TestingModule } from '@nestjs/testing';
import { REQUEST } from '@nestjs/core';

import { UserRole, Status } from '@common/enums';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { CreateUserDto, UpdateUserDto, FilterUsersDto } from './dto';
import { UserDocumentType } from './enums/user-document-type.enum';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUser = {
    _id: '1',
    email: 'email@email.com',
  };

  const mockUsersService = {
    create: jest.fn().mockResolvedValue(mockUser),
    findPaginate: jest.fn().mockResolvedValue({ docs: [mockUser] }),
    findOneById: jest.fn().mockResolvedValue(mockUser),
    update: jest.fn().mockResolvedValue(mockUser),
    findOneBy: jest.fn().mockResolvedValue(mockUser),
  };

  const mockRequest = {
    user: {
      _id: 'userId',
      roles: [UserRole.ADMIN],
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: REQUEST,
          useValue: mockRequest,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call usersService.create with correct DTO', async () => {
      const dto: CreateUserDto = {
        email: 'user@email.com',
        password: 'password123',
        roles: [UserRole.ADMIN],
        createdBy: '',
        firstName: '',
        lastName: '',
        phone: '',
        document: '',
        documentType: UserDocumentType.TI,
      };

      const result = { _id: 'user1', ...dto };
      mockUsersService.create.mockResolvedValue(result);

      expect(await controller.create(dto)).toEqual(result);
      expect(mockUsersService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findPaginate', () => {
    it('should return all users', async () => {
      const filter: FilterUsersDto = {
        data: {},
      };
      const result = [
        { _id: 'user1', email: 'testuser1@email.com', roles: [UserRole.ADMIN] },
        {
          _id: 'user2',
          email: 'testuser2@gmail.com',
          roles: [UserRole.ADMIN],
        },
      ];
      mockUsersService.findPaginate.mockResolvedValue(result);

      expect(await controller.findAll(filter)).toEqual(result);
      expect(mockUsersService.findPaginate).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const userId = '1';
      const result = {
        _id: userId,
        email: 'user@email.com',
        roles: [UserRole.ADMIN],
      };

      mockUsersService.findOneById.mockResolvedValue(result);

      expect(await controller.findOne(userId)).toEqual(result);
      expect(mockUsersService.findOneById).toHaveBeenCalledWith(userId);
    });
  });

  describe('update', () => {
    it('should update a user by id', async () => {
      const userId = '1';
      const dto: UpdateUserDto = {
        password: 'newpassword123',
        roles: [UserRole.ADMIN],
      };
      const result = { _id: userId, ...dto };
      mockUsersService.update.mockResolvedValue(result);

      expect(await controller.update(userId, dto)).toEqual(result);
      expect(mockUsersService.update).toHaveBeenCalledWith(userId, dto);
    });
  });

  describe('remove', () => {
    it('should remove a user by id', async () => {
      const userId = '1';
      const result = { _id: userId, email: 'deleteduser@email.com' };
      mockUsersService.update.mockResolvedValue(result);

      expect(await controller.remove(userId)).toEqual(result);
      expect(mockUsersService.update).toHaveBeenCalledWith(userId, {
        status: Status.DELETED,
      });
    });
  });
});
